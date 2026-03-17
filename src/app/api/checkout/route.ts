import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase/server';
import { getMPPayment } from '@/lib/mercadopago/client';
import { calculateTotalCents, getPriceInReais, TICKET_TIERS } from '@/lib/utils/pricing';
import { TicketType } from '@/types/registration';

const checkoutSchema = z.object({
  // Registration fields
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  ticket_type: z.enum(['individual', 'casal', 'familia']),
  participant_names: z.array(z.string().min(1)).min(1).max(20), // até 20 adultos
  children_count: z.number().int().min(0).max(30).default(0),

  // MP Payment Brick fields
  payment_method_id: z.string(),
  transaction_amount: z.number().positive(),
  token: z.string().optional(),
  installments: z.number().optional(),
  issuer_id: z.string().optional(),
  payer: z.object({
    email: z.string().email(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    identification: z
      .object({ type: z.string(), number: z.string() })
      .optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const ticketType = data.ticket_type as TicketType;

    // Calcula adultos extras (acima de 4 para familia)
    const baseMax = TICKET_TIERS[ticketType].maxParticipants;
    const extraAdults = ticketType === 'familia'
      ? Math.max(0, data.participant_names.length - baseMax)
      : 0;

    const amountCents = calculateTotalCents(ticketType, extraAdults);
    const amountReais = getPriceInReais(ticketType, extraAdults);

    const supabase = createServerSupabase();

    // Insert pending registration
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
    const mpPayment = getMPPayment();

    // Create payment in Mercado Pago
    const paymentBody: Record<string, unknown> = {
      transaction_amount: amountReais,
      payment_method_id: data.payment_method_id,
      description: 'Retiro ADESSÊNCIA — 05/04/2026',
      external_reference: registration.id,
      // notification_url só é enviado em produção (MP rejeita URLs localhost)
      ...(isPublicUrl && { notification_url: `${appUrl}/api/webhooks/mercadopago` }),
      statement_descriptor: 'ADESSENCIA',
      binary_mode: false,
      payer: {
        email: data.payer.email,
        first_name: data.payer.first_name,
        last_name: data.payer.last_name,
        identification: data.payer.identification,
      },
    };

    if (data.token) {
      paymentBody.token = data.token;
      paymentBody.installments = data.installments ?? 1;
      if (data.issuer_id) paymentBody.issuer_id = data.issuer_id;
    }

    // Boleto: vence 2 dias antes do evento
    if (data.payment_method_id === 'bolbradesco' || data.payment_method_id === 'pec') {
      paymentBody.date_of_expiration = '2026-04-03T23:59:59.000-03:00';
    }

    const mpResponse = await mpPayment.create({ body: paymentBody });

    // Update registration with MP data
    await supabase
      .from('registrations')
      .update({
        mp_payment_id: String(mpResponse.id),
        mp_payment_method: data.payment_method_id === 'pix'
          ? 'pix'
          : data.token
          ? 'credit_card'
          : 'boleto',
        mp_status: mpResponse.status,
        mp_status_detail: mpResponse.status_detail,
      })
      .eq('id', registration.id);

    // Build response
    const responseData: Record<string, unknown> = {
      success: true,
      paymentId: String(mpResponse.id),
      status: mpResponse.status,
      statusDetail: mpResponse.status_detail,
    };

    if (data.payment_method_id === 'pix') {
      const txData = (mpResponse as unknown as {
        point_of_interaction?: { transaction_data?: { qr_code?: string; qr_code_base64?: string } };
      }).point_of_interaction?.transaction_data;
      responseData.pixQrCode = txData?.qr_code;
      responseData.pixQrCodeBase64 = txData?.qr_code_base64;
    } else if (data.payment_method_id === 'bolbradesco' || data.payment_method_id === 'pec') {
      const mpRaw = mpResponse as unknown as {
        transaction_details?: { external_resource_url?: string; barcode?: { content?: string } };
      };
      responseData.boletoUrl = mpRaw.transaction_details?.external_resource_url;
      responseData.barcode = mpRaw.transaction_details?.barcode?.content;
    } else if (mpResponse.status === 'approved') {
      responseData.redirectTo = '/obrigado';
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
    // Repassa mensagem do Mercado Pago quando disponível
    const mpErr = err as { message?: string; error?: string; status?: number };
    if (mpErr?.status && mpErr.status >= 400 && mpErr.status < 500) {
      return NextResponse.json(
        { error: mpErr.message ?? 'Erro no processamento do pagamento.' },
        { status: mpErr.status }
      );
    }
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
