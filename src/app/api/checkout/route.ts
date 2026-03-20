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

    // Extrai o charge da resposta
    const charge = (psResponse as {
      charges?: {
        id: string;
        status: string;
        qr_codes?: { text?: string; links?: { rel: string; href: string }[] }[];
        payment_method?: {
          boleto?: {
            barcode?: string;
            formatted_barcode?: string;
          };
        };
        links?: { rel: string; href: string }[];
      }[];
    }).charges?.[0];

    const chargeId = charge?.id ?? '';
    const chargeStatus = charge?.status ?? 'WAITING';

    // Atualiza registro com dados do PagSeguro
    await supabase
      .from('registrations')
      .update({
        mp_payment_id: chargeId, // Reutilizando coluna existente para o charge ID
        mp_payment_method: data.payment_method.toLowerCase(),
        mp_status: chargeStatus,
      })
      .eq('id', registration.id);

    // Monta resposta por método de pagamento
    const responseData: Record<string, unknown> = {
      success: true,
      registrationId: registration.id,
      paymentId: chargeId,
      status: chargeStatus,
    };

    if (data.payment_method === 'PIX') {
      const qrCode = charge?.qr_codes?.[0];
      responseData.pixQrCode = qrCode?.text;
      const pngLink = qrCode?.links?.find((l) => l.rel === 'QRCODE.PNG');
      if (pngLink) responseData.pixQrCodeImageUrl = pngLink.href;
    } else if (data.payment_method === 'BOLETO') {
      const boletoLinks = charge?.links ?? [];
      const pdfLink = boletoLinks.find((l) => l.rel === 'BOLETO.PDF');
      responseData.boletoUrl = pdfLink?.href;
      responseData.barcode = charge?.payment_method?.boleto?.barcode;
    } else if (data.payment_method === 'CREDIT_CARD') {
      if (chargeStatus === 'PAID' || chargeStatus === 'AUTHORIZED') {
        responseData.redirectTo = '/obrigado';
      } else {
        return NextResponse.json(
          { error: 'Pagamento não aprovado. Verifique os dados do cartão.' },
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
