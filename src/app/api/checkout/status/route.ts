import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getOrderStatus } from '@/lib/pagseguro/client';
import { mapPagSeguroStatus } from '@/lib/pagseguro/webhook';
import { sendConfirmationEmail } from '@/lib/resend/emails';

export async function GET(request: NextRequest) {
  const registrationId = request.nextUrl.searchParams.get('id');
  if (!registrationId) {
    return NextResponse.json({ error: 'id obrigatório.' }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', registrationId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Registro não encontrado.' }, { status: 404 });
  }

  // Se já está num estado definitivo, não consulta o PagBank
  if (data.status === 'confirmed' || data.status === 'rejected' || data.status === 'cancelled') {
    return NextResponse.json({ id: data.id, status: data.status, gateway_status: data.gateway_status });
  }

  // sync=true → consulta o PagBank diretamente (botão "Já paguei" + polling periódico)
  const shouldSync = request.nextUrl.searchParams.get('sync') === 'true';
  if (shouldSync) {
    // Para PIX: gateway_payment_id = ORDE_... → GET /orders/{id}
    // Para cartão: gateway_payment_id = CHAR_... → não implementado aqui (webhook confirma)
    const gatewayId = data.gateway_payment_id ?? '';
    const psStatus = await getOrderStatus(gatewayId);
    const internalStatus = mapPagSeguroStatus(psStatus);

    console.log(`[Status Sync] id=${registrationId} PagBank=${psStatus} interno=${internalStatus}`);

    if (internalStatus !== data.status) {
      const updateFields: Record<string, unknown> = {
        gateway_status: psStatus,
        status: internalStatus,
      };
      if (internalStatus === 'confirmed') {
        updateFields.confirmed_at = new Date().toISOString();
      }

      await supabase
        .from('registrations')
        .update(updateFields)
        .eq('id', registrationId);

      if (internalStatus === 'confirmed') {
        try {
          await sendConfirmationEmail({ ...data, status: 'confirmed' });
        } catch (emailErr) {
          console.error('[Status Sync] Erro ao enviar e-mail:', emailErr);
        }
      }

      return NextResponse.json({ id: data.id, status: internalStatus, gateway_status: psStatus });
    }

    return NextResponse.json({ id: data.id, status: data.status, gateway_status: psStatus });
  }

  return NextResponse.json({ id: data.id, status: data.status, gateway_status: data.gateway_status });
}
