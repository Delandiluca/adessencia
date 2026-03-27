import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSessionToken } from '@/lib/utils/session';

const loginSchema = z.object({ password: z.string() });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = loginSchema.parse(body);

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
    }

    // Comparação de senha — usamos Web Crypto para garantir tempo de resposta constante
    // independente do conteúdo, prevenindo timing attacks
    const enc     = new TextEncoder();
    const keyA    = await crypto.subtle.importKey('raw', enc.encode(password),       { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const keyB    = await crypto.subtle.importKey('raw', enc.encode(adminPassword),  { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sigA    = new Uint8Array(await crypto.subtle.sign('HMAC', keyA, enc.encode('cmp')));
    const sigB    = new Uint8Array(await crypto.subtle.sign('HMAC', keyB, enc.encode('cmp')));
    const valid   = password.length === adminPassword.length &&
                    sigA.every((b, i) => b === sigB[i]);

    if (!valid) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    const sessionToken = await createSessionToken(adminPassword);

    const response = NextResponse.json({ ok: true });
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('admin_session');
  return response;
}
