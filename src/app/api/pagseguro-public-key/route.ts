import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.PAGSEGURO_SANDBOX === 'true'
  ? 'https://sandbox.api.pagseguro.com'
  : 'https://api.pagseguro.com';

async function fetchWithAuth(path: string, method = 'GET', body?: object) {
  const token = process.env.PAGSEGURO_TOKEN!;
  return fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
}

export async function GET() {
  try {
    // 1. Tenta buscar chave existente
    let res = await fetchWithAuth('/public-keys');
    let data = await res.json() as { public_key?: string; keys?: { public_key: string }[] };

    // Extrai a chave do formato de resposta (pode variar)
    let publicKey = data.public_key ?? data.keys?.[0]?.public_key;

    // 2. Se não existe, cria uma nova
    if (!publicKey) {
      res = await fetchWithAuth('/public-keys', 'POST', { type: 'card' });
      data = await res.json() as { public_key?: string };
      publicKey = data.public_key;
    }

    if (!publicKey) {
      console.error('[PagBank] public-key: resposta inesperada', data);
      return NextResponse.json({ error: 'Erro ao obter chave pública' }, { status: 502 });
    }

    return NextResponse.json({ public_key: publicKey });
  } catch (err) {
    console.error('[PagBank] public-key error:', err);
    return NextResponse.json({ error: 'Erro de conexão' }, { status: 502 });
  }
}
