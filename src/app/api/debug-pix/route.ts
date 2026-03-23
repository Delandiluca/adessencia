import { NextRequest, NextResponse } from 'next/server';

// Endpoint temporário de diagnóstico — remove após resolver o problema
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, cpf } = body;

  const digits = (phone as string).replace(/\D/g, '');
  const area = digits.slice(0, 2);
  const number = digits.slice(2);
  const cpfClean = (cpf as string).replace(/\D/g, '');

  const payload = {
    reference_id: `debug-${Date.now()}`,
    customer: {
      name,
      email,
      tax_id: cpfClean,
      phones: [{ country: '55', area, number, type: 'MOBILE' }],
    },
    items: [{ reference_id: 'item-001', name: 'Ingresso Teste', quantity: 1, unit_amount: 100 }],
    qr_codes: [{ amount: { value: 100 }, expiration_date: '2026-04-05T23:59:59-03:00' }],
    notification_urls: [],
  };

  const token = process.env.PAGSEGURO_TOKEN;
  const BASE_URL = process.env.PAGSEGURO_SANDBOX === 'true'
    ? 'https://sandbox.api.pagseguro.com'
    : 'https://api.pagseguro.com';

  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  return NextResponse.json({
    sentPayload: payload,
    httpStatus: res.status,
    pagBankResponse: json,
  });
}
