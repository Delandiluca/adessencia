/**
 * Utilitários de sessão admin usando Web Crypto API (compatível com Edge Runtime e Node.js).
 */

async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmacVerify(secret: string, data: string, hexSig: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify'],
    );
    const sigBytes = Uint8Array.from(hexSig.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    return crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
  } catch {
    return false;
  }
}

function randomHex(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Gera token de sessão assinado: `<random>.<timestamp>.<hmac>` */
export async function createSessionToken(adminPassword: string): Promise<string> {
  const random    = randomHex(16);
  const timestamp = Date.now().toString();
  const payload   = `${random}.${timestamp}`;
  const signature = await hmacSign(adminPassword, payload);
  return `${payload}.${signature}`;
}

/** Valida token de sessão — retorna false se expirado ou HMAC inválido */
export async function isValidSessionToken(token: string, adminPassword: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [random, timestamp, receivedSig] = parts;

  const age = Date.now() - parseInt(timestamp, 10);
  if (isNaN(age) || age > 8 * 60 * 60 * 1000) return false;

  const payload = `${random}.${timestamp}`;
  return hmacVerify(adminPassword, payload, receivedSig);
}
