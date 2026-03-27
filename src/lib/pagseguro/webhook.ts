import crypto from 'crypto';

/** Valida a assinatura enviada pelo PagSeguro no header X-Pagseguro-Signature */
export function validateWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.PAGSEGURO_WEBHOOK_SECRET;

  // Em produção, secret é obrigatório — rejeita se não configurado
  if (!secret) {
    // Aceita sem validação apenas quando explicitamente em sandbox E sem secret (ambiente de dev local)
    if (process.env.PAGSEGURO_SANDBOX === 'true') {
      console.warn('[PagSeguro Webhook] Sandbox sem secret — validação ignorada (apenas dev).');
      return true;
    }
    console.error('[PagSeguro Webhook] PAGSEGURO_WEBHOOK_SECRET não configurado em produção!');
    return false;
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
