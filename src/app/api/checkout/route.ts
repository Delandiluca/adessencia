import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase/server';
import { createOrder } from '@/lib/pagseguro/client';
import { calculateTotalCents, TICKET_TIERS } from '@/lib/utils/pricing';
import { TicketType } from '@/types/registration';

const checkoutSchema = z.object({
  // Dados do inscrito
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  cpf: z.string().min(11).max(14),
  ticket_type: z.enum(['individual', 'casal', 'familia']),
  participant_names: z.array(z.string().min(1)).min(1).max(20),
  children_count: z.number().int().min(0).max(30).default(0),

  // Dados do pagamento
  payment_method: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD']),
  // Somente para cartão de crédito
  encrypted_card: z.string().optional(),
  card_holder: z.string().optional(),
  card_security_code: z.string().optional(),
  installments: z.number().int().min(1).max(12).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const ticketType = data.ticket_type as TicketType;

    const baseMax = TICKET_TIERS[ticketType].maxParticipants;
    const extraAdults =
      ticketType === 'familia'
        ? Math.max(0, data.participant_names.length - baseMax)
        : 0;

    const amountCents = calculateTotalCents(ticketType, extraAdults);

    // Valida cartão de crédito
    if (data.payment_method === 'CREDIT_CARD') {
      if (!data.encrypted_card || !data.card_holder || !data.card_security_code) {
        return NextResponse.json(
          { error: 'Dados do cartão incompletos.' },
          { status: 400 }
        );
      }
    }

    const supabase = createServerSupabase();

    // Registra como pendente no banco
    const { data: registration, error: dbError } = await supabase
      .from('registrations')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        ticket_type: ticketType,
        amount_cents: amountCents,
        participant_names: data.participant_names,
        children_count: data.children_count,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError || !registration) {
      console.error('DB insert error:', dbError);
      return NextResponse.json({ error: 'Erro ao criar inscrição.' }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const isPublicUrl = appUrl.startsWith('https://');

    // Cria a ordem no PagSeguro
    const psResponse = await createOrder({
      referenceId: registration.id,
      customer: {
        name: data.name,
        email: data.email,
        tax_id: data.cpf,
        phone: data.phone,
      },
      amountCents,
      paymentMethod: data.payment_method,
      encryptedCard: data.encrypted_card,
      cardHolder: data.card_holder,
      cardSecurityCode: data.card_security_code,
      installments: data.installments,
      notificationUrl: isPublicUrl
        ? `${appUrl}/api/webhooks/pagseguro`
        : undefined,
    });

    // PIX usa qr_codes no nível do pedido; BOLETO/CARTÃO usam charges
    const qrCode = psResponse.qr_codes?.[0];
    const charge = psResponse.charges?.[0] as ({
      id: string;
      status: string;
      payment_method?: { boleto?: { barcode?: string; formatted_barcode?: string } };
      links?: { rel: string; href: string; media?: string }[];
    } | undefined);

    const paymentId = qrCode?.id ?? charge?.id ?? '';
    const chargeStatus = charge?.status ?? (qrCode ? 'WAITING' : 'WAITING');

    // Atualiza registro com dados do PagSeguro
    await supabase
      .from('registrations')
      .update({
        mp_payment_id: paymentId,
        mp_payment_method: data.payment_method.toLowerCase(),
        mp_status: chargeStatus,
      })
      .eq('id', registration.id);

    // Monta resposta por método de pagamento
    const responseData: Record<string, unknown> = {
      success: true,
      registrationId: registration.id,
      paymentId,
      status: chargeStatus,
    };

    if (data.payment_method === 'PIX') {
      responseData.pixQrCode = qrCode?.text;
      // Busca o PNG do QR code diretamente no PagBank com autenticação Bearer
      // O PNG vem do servidor do PagBank — não é gerado no frontend
      const pngLink = qrCode?.links?.find((l) => l.rel === 'QRCODE.PNG');
      if (pngLink) {
        try {
          const token = process.env.PAGSEGURO_TOKEN ?? '';
          const imgRes = await fetch(pngLink.href, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            responseData.pixQrCodeBase64 = base64;
          }
        } catch {
          // fallback: frontend usa react-qr-code com o texto
        }
      }
    } else if (data.payment_method === 'BOLETO') {
      const boletoLinks = charge?.links ?? [];
      // PagBank retorna rel:"SELF" com media:"application/pdf" para o boleto
      const pdfLink = boletoLinks.find(
        (l) => l.media === 'application/pdf' || l.rel === 'BOLETO.PDF'
      );
      responseData.boletoUrl = pdfLink?.href;
      responseData.barcode =
        charge?.payment_method?.boleto?.formatted_barcode ??
        charge?.payment_method?.boleto?.barcode;
    } else if (data.payment_method === 'CREDIT_CARD') {
      if (chargeStatus === 'PAID' || chargeStatus === 'AUTHORIZED') {
        responseData.redirectTo = '/obrigado';
      } else {
        return NextResponse.json(
          { error: 'Pagamento não aprovado. Verifique os dados do cartão e tente novamente.' },
          { status: 402 }
        );
      }
    }

    return NextResponse.json(responseData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: err.flatten() },
        { status: 400 }
      );
    }

    console.error('Checkout error:', err);

    const psErr = err as { message?: string; status?: number };
    if (psErr?.status && psErr.status >= 400 && psErr.status < 500) {
      return NextResponse.json(
        { error: psErr.message ?? 'Erro no processamento do pagamento.' },
        { status: psErr.status }
      );
    }

    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
