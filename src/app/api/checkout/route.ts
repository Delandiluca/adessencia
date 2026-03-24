import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase/server';
import { createOrder } from '@/lib/pagseguro/client';
import { calculateTotalCents, TICKET_TIERS } from '@/lib/utils/pricing';
import { TicketType } from '@/types/registration';
import { sendConfirmationEmail } from '@/lib/resend/emails';

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
  payment_method: z.enum(['PIX', 'CREDIT_CARD']),
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

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? '').trim();
    const isPublicUrl = appUrl.startsWith('https://');

    // Cria a ordem no PagBank.
    // Se o gateway retornar HTTP 4xx (ex: cartão recusado) ele lança erro —
    // capturamos aqui para garantir que o registro seja marcado como 'rejected' no banco.
    let psResponse: Awaited<ReturnType<typeof createOrder>>;
    try {
      psResponse = await createOrder({
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
    } catch (psErr) {
      const errMsg = psErr instanceof Error ? psErr.message : 'Erro no gateway de pagamento.';
      // Atualiza o registro para rejected com o motivo do PagBank
      await supabase.from('registrations').update({
        status: 'rejected',
        gateway_method: data.payment_method.toLowerCase(),
        gateway_status: 'DECLINED',
        gateway_status_detail: errMsg,
      }).eq('id', registration.id);
      return NextResponse.json({ error: errMsg }, { status: 402 });
    }

    // PIX usa qr_codes no nível do pedido; CARTÃO usa charges
    const qrCode = psResponse.qr_codes?.[0];
    const charge = psResponse.charges?.[0] as ({
      id: string;
      status: string;
      payment_response?: { code?: string; message?: string };
      links?: { rel: string; href: string; media?: string }[];
    } | undefined);

    // Para PIX: guardamos o ORDER ID (ORDE_...) para poder consultar com GET /orders/{id}.
    // Para cartão: guardamos o CHARGE ID (CHAR_...) que é o que o PagBank usa em GET /charges/{id}.
    const paymentId = qrCode
      ? (psResponse.id ?? qrCode.id ?? '')   // ORDE_...
      : (charge?.id ?? '');                  // CHAR_...
    const psRawStatus = charge?.status ?? (qrCode ? 'WAITING' : 'WAITING');

    // Código e mensagem de recusa do emissor (se houver)
    const declineCode = charge?.payment_response?.code ?? null;
    const declineMessage = charge?.payment_response?.message ?? null;

    // Determina status interno com base na resposta síncrona do PagBank:
    // - DECLINED                             → rejected (recusa definitiva do emissor)
    // - PAID + cartão (capture:true)         → confirmed (captura já realizada no mesmo request)
    // - PAID + PIX / qualquer outro caso     → pending (webhook/polling irá confirmar)
    const isCreditCardPaid = psRawStatus === 'PAID' && data.payment_method === 'CREDIT_CARD';
    const internalStatus = psRawStatus === 'DECLINED'
      ? 'rejected'
      : isCreditCardPaid
        ? 'confirmed'
        : 'pending';

    const confirmedAt = isCreditCardPaid ? new Date().toISOString() : null;

    console.log(`[Checkout] psRawStatus=${psRawStatus} internalStatus=${internalStatus} registrationId=${registration.id}`);

    // Espelha exatamente o que o PagBank retornou — fonte de verdade
    const { error: updateErr } = await supabase
      .from('registrations')
      .update({
        gateway_payment_id: paymentId,
        gateway_method: data.payment_method.toLowerCase(),
        gateway_status: psRawStatus,
        gateway_status_detail: declineCode
          ? `${declineCode}${declineMessage ? ` — ${declineMessage}` : ''}`
          : null,
        status: internalStatus,
        ...(confirmedAt ? { confirmed_at: confirmedAt } : {}),
      })
      .eq('id', registration.id);

    if (updateErr) {
      console.error('[Checkout] Falha ao atualizar status no banco:', updateErr);
    }

    // Envia e-mail de confirmação imediatamente se cartão foi aprovado
    if (isCreditCardPaid) {
      try {
        await sendConfirmationEmail({ ...registration, status: 'confirmed' });
      } catch (emailErr) {
        console.error('[Checkout] Erro ao enviar e-mail de confirmação:', emailErr);
      }
    }

    // Monta resposta por método de pagamento
    const responseData: Record<string, unknown> = {
      success: true,
      registrationId: registration.id,
      paymentId,
      status: psRawStatus,
    };

    if (data.payment_method === 'PIX') {
      responseData.pixQrCode = qrCode?.text;
      // Busca o PNG do QR code diretamente no PagBank com autenticação Bearer
      const pngLink = qrCode?.links?.find((l) => l.rel === 'QRCODE.PNG');
      if (pngLink) {
        try {
          const token = process.env.PAGSEGURO_TOKEN ?? '';
          const imgRes = await fetch(pngLink.href, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            responseData.pixQrCodeBase64 = Buffer.from(buffer).toString('base64');
          }
        } catch { /* fallback: frontend usa react-qr-code com o texto */ }
      }
    } else if (data.payment_method === 'CREDIT_CARD') {
      if (psRawStatus === 'PAID' || psRawStatus === 'AUTHORIZED') {
        // PagBank aprovou — redireciona para /obrigado.
        // O webhook confirma o status no banco quando o dinheiro for liquidado.
        responseData.redirectTo = '/obrigado';
      } else {
        // Cartão recusado: PagBank já nos deu a resposta definitiva.
        // O registro fica no banco com status 'rejected' para rastreio completo.
        const declineMsg =
          declineCode === '10002'
            ? 'Pagamento não autorizado pelo banco emissor. Verifique o limite ou use outro cartão.'
            : declineCode === '10001'
            ? 'Cartão inválido ou dados incorretos. Verifique e tente novamente.'
            : psRawStatus === 'DECLINED'
            ? 'Pagamento recusado. Verifique os dados do cartão ou tente outro cartão.'
            : 'Pagamento não aprovado. Tente novamente em instantes.';

        return NextResponse.json({ error: declineMsg }, { status: 402 });
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
