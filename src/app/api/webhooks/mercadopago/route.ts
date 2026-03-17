import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { getMPPayment } from '@/lib/mercadopago/client';
import { validateWebhookSignature } from '@/lib/mercadopago/webhook';
import { sendConfirmationEmail } from '@/lib/resend/emails';
import { Registration } from '@/types/registration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Only handle payment notifications
    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ ok: true });
    }

    const paymentId = String(body.data.id);

    // Validate HMAC signature in production
    const webhookSecret = process.env.MP_WEBHOOK_SECRET;
    if (webhookSecret) {
      const xSignature = request.headers.get('x-signature') ?? '';
      const xRequestId = request.headers.get('x-request-id') ?? '';

      if (!validateWebhookSignature(xSignature, xRequestId, paymentId, webhookSecret)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Fetch full payment details from MP
    const mpPayment = getMPPayment();
    const payment = await mpPayment.get({ id: paymentId });

    if (!payment?.external_reference) {
      return NextResponse.json({ ok: true });
    }

    const registrationId = payment.external_reference;
    const supabase = createServerSupabase();

    if (payment.status === 'approved') {
      // Idempotent update: only if still pending
      const { data: updated } = await supabase
        .from('registrations')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          mp_status: payment.status,
          mp_status_detail: payment.status_detail,
        })
        .eq('id', registrationId)
        .eq('status', 'pending')
        .select()
        .single();

      // Send confirmation email only if we actually updated a row
      if (updated) {
        try {
          await sendConfirmationEmail(updated as Registration);
        } catch (emailErr) {
          console.error('Failed to send confirmation email:', emailErr);
          // Don't fail the webhook — email is not critical for payment flow
        }
      }
    } else if (['cancelled', 'rejected', 'refunded'].includes(payment.status ?? '')) {
      await supabase
        .from('registrations')
        .update({
          status: 'failed',
          mp_status: payment.status,
          mp_status_detail: payment.status_detail,
        })
        .eq('id', registrationId)
        .eq('status', 'pending');
    }

    // Always return 200 to prevent MP retries
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    // Return 200 even on errors to prevent MP infinite retries
    return NextResponse.json({ ok: true });
  }
}
