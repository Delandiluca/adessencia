import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Validates the Mercado Pago webhook signature.
 * Header format: x-signature: "ts=1704908010,v1=618c85..."
 * Template: "id:{data.id};request-id:{x-request-id};ts:{ts};"
 */
export function validateWebhookSignature(
  xSignature: string,
  xRequestId: string,
  paymentId: string,
  secret: string
): boolean {
  try {
    const parts = xSignature.split(',');
    const ts = parts.find((p) => p.startsWith('ts='))?.split('=')[1];
    const v1 = parts.find((p) => p.startsWith('v1='))?.split('=')[1];

    if (!ts || !v1) return false;

    const template = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
    const hmac = createHmac('sha256', secret).update(template).digest('hex');

    return timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(v1, 'hex'));
  } catch {
    return false;
  }
}
