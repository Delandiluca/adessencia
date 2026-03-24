import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { validateWebhookSignature, mapPagSeguroStatus } from '@/lib/pagseguro/webhook';
import { sendConfirmationEmail } from '@/lib/resend/emails';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-pagseguro-signature');

    const isValid = validateWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('[PagSeguro Webhook] Assinatura inválida.');
      return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      id: string;
      type?: string;
      data?: {
        id?: string;
        status?: string;
        reference_id?: string;
      };
      charges?: { id: string; status: string; reference_id?: string }[];
      reference_id?: string;
      status?: string;
    };

    // Extrai charge (pode vir direto ou dentro de 'data')
    const chargeId =
      event.data?.id ??
      event.charges?.[0]?.id ??
      event.id;

    const chargeStatus =
      event.data?.status ??
      event.charges?.[0]?.status ??
      event.status ??
      '';

    // reference_id é o ID do pedido (que corresponde ao registration.id)
    const rawRef =
      event.data?.reference_id ??
      event.charges?.[0]?.reference_id ??
      event.reference_id ??
      '';

    // Remove prefixo "charge-" caso presente
    const registrationId = rawRef.startsWith('charge-')
      ? rawRef.slice(7)
      : rawRef;

    if (!registrationId || !chargeStatus) {
      console.warn('[PagSeguro Webhook] Evento sem reference_id ou status:', event);
      return NextResponse.json({ received: true });
    }

    const internalStatus = mapPagSeguroStatus(chargeStatus);
    const supabase = createServerSupabase();

    // Busca o registro
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single();

    if (fetchError || !registration) {
      console.warn('[PagSeguro Webhook] Registro não encontrado:', registrationId);
      return NextResponse.json({ received: true });
    }

    // Atualiza status
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        status: internalStatus,
        gateway_payment_id: chargeId,
        gateway_status: chargeStatus,
      })
      .eq('id', registrationId);

    if (updateError) {
      console.error('[PagSeguro Webhook] Erro ao atualizar registro:', updateError);
    }

    // Envia e-mail de confirmação quando aprovado
    if (internalStatus === 'confirmed' && registration.status !== 'confirmed') {
      try {
        await sendConfirmationEmail(registration);
      } catch (emailErr) {
        console.error('[PagSeguro Webhook] Erro ao enviar e-mail:', emailErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[PagSeguro Webhook] Erro inesperado:', err);
    // Retorna 200 para evitar reenvios desnecessários
    return NextResponse.json({ received: true });
  }
}
