import crypto from 'crypto';

/** Valida a assinatura enviada pelo PagSeguro no header X-Pagseguro-Signature */
export function validateWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.PAGSEGURO_WEBHOOK_SECRET;

  // No sandbox ou sem secret configurado, aceita sem validação
  // (PagBank sandbox não envia assinatura HMAC real)
  if (!secret || process.env.PAGSEGURO_SANDBOX === 'true') {
    console.warn('[PagSeguro Webhook] Validação de assinatura ignorada (sandbox ou sem secret).');
    return true;
  }

  if (!signatureHeader) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  // Assinatura pode vir como "sha256=<hash>" ou só o hash
  const received = signatureHeader.startsWith('sha256=')
    ? signatureHeader.slice(7)
    : signatureHeader;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(received, 'hex')
    );
  } catch {
    return false;
  }
}

/** Mapeia o status do PagSeguro para o status interno da plataforma */
export function mapPagSeguroStatus(
  psStatus: string
): 'confirmed' | 'cancelled' | 'rejected' | 'pending' {
  switch (psStatus.toUpperCase()) {
    case 'PAID':
    case 'AUTHORIZED':
      return 'confirmed';
    case 'CANCELED':
    case 'REFUNDED':
    case 'CHARGEBACK':
      return 'cancelled';
    case 'DECLINED':
    case 'IN_ANALYSIS':
      return 'rejected';
    default:
      return 'pending';
  }
}
