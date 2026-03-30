const BASE_URL =
  process.env.PAGSEGURO_SANDBOX === 'true'
    ? 'https://sandbox.api.pagseguro.com'
    : 'https://api.pagseguro.com';

// Traduz mensagens técnicas do PagBank para português amigável
function friendlyError(rawMsg: string, code?: string): string {
  const m = rawMsg.toLowerCase();

  if (m.includes('buyer email must not be equals to merchant'))
    return 'O e-mail informado não pode ser o mesmo da conta do estabelecimento. Utilize outro e-mail.';
  if (m.includes('invalid credential') || m.includes('unauthorized'))
    return 'Erro de autenticação com o sistema de pagamento. Tente novamente.';
  if (m.includes('whitelist'))
    return 'Serviço de pagamento temporariamente indisponível. Tente novamente em instantes.';
  if (m.includes('invalid card') || m.includes('card number'))
    return 'Número do cartão inválido. Verifique e tente novamente.';
  if (m.includes('card expired') || m.includes('expiry'))
    return 'Cartão vencido. Utilize outro cartão.';
  if (m.includes('insufficient funds') || m.includes('declined'))
    return 'Pagamento recusado. Verifique o limite ou utilize outro cartão.';
  if (m.includes('invalid cvv') || m.includes('security_code'))
    return 'CVV inválido. Verifique o código de segurança do cartão.';
  if (m.includes('tax_id') || m.includes('cpf'))
    return 'CPF inválido. Verifique e tente novamente.';
  if (m.includes('unknown or unexpected'))
    return 'Erro interno ao gerar cobrança. Tente novamente.';
  if (m.includes('card') || m.includes('encrypted'))
    return 'Pagamento recusado. Verifique os dados do cartão ou use outro cartão.';

  if (code === '40001') return 'Dados de pagamento incompletos. Tente novamente.';
  if (code === '40002') return 'Pagamento recusado. Verifique os dados do cartão ou use outro cartão.';
  if (code === '40003') return 'Parâmetro desconhecido. Tente novamente.';

  return rawMsg || 'Erro ao processar pagamento. Tente novamente.';
}

async function psRequest(path: string, body: unknown, method: 'POST' | 'GET' = 'POST') {
  const token = process.env.PAGSEGURO_TOKEN;
  if (!token) throw new Error('PAGSEGURO_TOKEN não configurado.');

  // Log completo para homologação PagBank — sem abreviações
  console.log('[PagBank] → REQUEST', method, BASE_URL + path, JSON.stringify(body ?? null));

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
  });

  const json = await res.json().catch(() => ({}));
  console.log('[PagBank] ← RESPONSE', res.status, JSON.stringify(json));

  if (!res.ok) {
    const errBody = json as { error_messages?: { description?: string; code?: string }[] };
    const first = errBody?.error_messages?.[0];
    const msg = friendlyError(first?.description ?? '', first?.code);
    throw Object.assign(new Error(msg), { status: res.status, body: json });
  }

  return json;
}

export interface PagSeguroCustomer {
  name: string;
  email: string;
  tax_id: string;
  phone: string;
}

export interface CreateOrderParams {
  referenceId: string;
  customer: PagSeguroCustomer;
  amountCents: number;
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  encryptedCard?: string;
  cardHolder?: string;
  // cardSecurityCode removido: CVV embutido no encryptedCard (PCI DSS)
  installments?: number;
  notificationUrl?: string;
}

export interface PagSeguroOrderResponse {
  id: string;
  reference_id: string;
  // PIX: QR codes no nível do pedido
  qr_codes?: {
    id: string;
    text: string;
    expiration_date: string;
    amount: { value: number };
    links: { rel: string; href: string; media: string; type: string }[];
  }[];
  // BOLETO/CARTÃO: cobranças
  charges?: {
    id: string;
    status: string;
    reference_id?: string;
    payment_method?: {
      boleto?: { barcode?: string; formatted_barcode?: string };
    };
    links?: { rel: string; href: string }[];
  }[];
  links?: { rel: string; href: string }[];
}

function parsePhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  return { country: '55', area: digits.slice(0, 2), number: digits.slice(2), type: 'MOBILE' as const };
}

// Expiração do PIX: 05/04/2026 às 23:59 (dia do evento)
function pixExpirationDate(): string {
  return '2026-04-05T23:59:59-03:00';
}

/**
 * Consulta o status de um pedido PagBank pelo order ID (ORDE_...).
 * Usado pelo polling de PIX — GET /orders/{orderId} retorna status PAID quando pago.
 */
export async function getOrderStatus(orderId: string): Promise<string> {
  try {
    const res = await psRequest(`/orders/${encodeURIComponent(orderId)}`, null, 'GET') as {
      status?: string;
      charges?: { status?: string }[];
    };
    // Pedidos PagBank para PIX não têm status no nível raiz —
    // o status real fica em charges[0].status (ex: "PAID").
    const status = res.charges?.[0]?.status ?? res.status ?? 'WAITING';
    console.log('[PagBank] getOrderStatus', orderId, '→', status);
    return status;
  } catch (err) {
    console.error('[PagBank] getOrderStatus error:', err);
    return 'WAITING';
  }
}

export async function createOrder(params: CreateOrderParams): Promise<PagSeguroOrderResponse> {
  const cpf = params.customer.tax_id.replace(/\D/g, '');
  const notificationUrls = params.notificationUrl ? [params.notificationUrl] : [];

  const customer = {
    name: params.customer.name,
    email: params.customer.email,
    tax_id: cpf,
    phones: [parsePhone(params.customer.phone)],
  };

  const items = [{
    reference_id: 'ticket-001',
    name: 'Ingresso Domingo Essencial — ADESSÊNCIA',
    quantity: 1,
    unit_amount: params.amountCents,
  }];

  // ── PIX: usa qr_codes no nível do pedido ──────────────────────────────────
  if (params.paymentMethod === 'PIX') {
    return psRequest('/orders', {
      reference_id: params.referenceId,
      customer,
      items,
      qr_codes: [{
        amount: { value: params.amountCents },
        expiration_date: pixExpirationDate(),
      }],
      notification_urls: notificationUrls,
    }) as Promise<PagSeguroOrderResponse>;
  }

  // ── CARTÃO: usa charges ───────────────────────────────────────────────────
  return psRequest('/orders', {
    reference_id: params.referenceId,
    customer,
    items,
    charges: [{
      reference_id: `charge-${params.referenceId}`,
      description: 'Domingo Essencial ADESSÊNCIA — 05/04/2026',
      amount: { value: params.amountCents, currency: 'BRL' },
      payment_method: {
        type: 'CREDIT_CARD',
        installments: params.installments ?? 1,
        capture: true,
        soft_descriptor: 'ADESSENCIA',
        card: {
          encrypted: params.encryptedCard,
          // security_code omitido: o CVV já está embutido no encrypted token (PCI DSS)
          holder: { name: params.cardHolder },
          store: false,
        },
      },
      notification_urls: notificationUrls,
    }],
  }) as Promise<PagSeguroOrderResponse>;
}
