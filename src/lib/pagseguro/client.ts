const BASE_URL =
  process.env.PAGSEGURO_SANDBOX === 'true'
    ? 'https://sandbox.api.pagseguro.com'
    : 'https://api.pagseguro.com';

async function psRequest(path: string, body: unknown) {
  const token = process.env.PAGSEGURO_TOKEN;
  if (!token) throw new Error('PAGSEGURO_TOKEN não configurado.');

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (json as { error_messages?: { description?: string }[] })
        ?.error_messages?.[0]?.description ?? 'Erro no PagSeguro.';
    throw Object.assign(new Error(msg), { status: res.status, body: json });
  }

  return json;
}

export interface PagSeguroCustomer {
  name: string;
  email: string;
  tax_id: string; // CPF — somente dígitos
  phone: string;  // formato BR: (11) 99999-9999
}

export interface CreateOrderParams {
  referenceId: string;
  customer: PagSeguroCustomer;
  amountCents: number;
  paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  // Credit card only
  encryptedCard?: string;
  cardHolder?: string;
  cardSecurityCode?: string;
  installments?: number;
  // Webhook
  notificationUrl?: string;
}

function parsePhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  const area = digits.slice(0, 2);
  const number = digits.slice(2);
  return { country: '55', area, number, type: 'MOBILE' as const };
}

export async function createOrder(params: CreateOrderParams) {
  const cpf = params.customer.tax_id.replace(/\D/g, '');

  const chargeNotification = params.notificationUrl
    ? { notification_urls: [params.notificationUrl] }
    : {};

  let paymentMethodBody: Record<string, unknown>;

  if (params.paymentMethod === 'PIX') {
    paymentMethodBody = { type: 'PIX', pix: { expires_in: 3600 } };
  } else if (params.paymentMethod === 'BOLETO') {
    paymentMethodBody = {
      type: 'BOLETO',
      boleto: {
        due_date: '2026-04-03',
        instruction_lines: {
          line_1: 'Ingresso Domingo Essencial — ADESSÊNCIA',
          line_2: 'Vencimento: 03/04/2026',
        },
        holder: {
          name: params.customer.name,
          tax_id: cpf,
          email: params.customer.email,
          address: {
            street: 'Rua Samuel Levi',
            number: '145',
            locality: 'Centro',
            city: 'Cachoeiro de Itapemirim',
            region_code: 'ES',
            country: 'Brasil',
            postal_code: '29300000',
          },
        },
      },
    };
  } else {
    paymentMethodBody = {
      type: 'CREDIT_CARD',
      installments: params.installments ?? 1,
      capture: true,
      soft_descriptor: 'ADESSENCIA',
      card: {
        encrypted: params.encryptedCard,
        security_code: params.cardSecurityCode,
        holder: { name: params.cardHolder },
        store: false,
      },
    };
  }

  return psRequest('/orders', {
    reference_id: params.referenceId,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      tax_id: cpf,
      phones: [parsePhone(params.customer.phone)],
    },
    items: [
      {
        reference_id: 'ticket-001',
        name: 'Ingresso Domingo Essencial — ADESSÊNCIA',
        quantity: 1,
        unit_amount: params.amountCents,
      },
    ],
    charges: [
      {
        reference_id: `charge-${params.referenceId}`,
        description: 'Domingo Essencial ADESSÊNCIA — 05/04/2026',
        amount: { value: params.amountCents, currency: 'BRL' },
        payment_method: paymentMethodBody,
        ...chargeNotification,
      },
    ],
  });
}
