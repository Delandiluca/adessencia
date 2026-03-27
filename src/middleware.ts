import { NextRequest, NextResponse } from 'next/server';
import { isValidSessionToken } from '@/lib/utils/session';

// ---------------------------------------------------------------------------
// Rate limiting simples em memória (Edge Runtime — persiste por instância)
// ---------------------------------------------------------------------------
interface RateEntry { count: number; windowStart: number }
const rateLimitMap = new Map<string, RateEntry>();

interface RateRule { maxRequests: number; windowMs: number }

const RATE_RULES: Record<string, RateRule> = {
  '/api/admin/login':     { maxRequests: 5,  windowMs: 15 * 60 * 1000 }, // 5 / 15min
  '/api/checkout':        { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 / hora
  '/api/checkout/status': { maxRequests: 60, windowMs: 15 * 60 * 1000 }, // 60 / 15min
};

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string, pathname: string): boolean {
  const rule = RATE_RULES[pathname];
  if (!rule) return true;
  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now - entry.windowStart > rule.windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= rule.maxRequests) return false;
  entry.count++;
  return true;
}

// ---------------------------------------------------------------------------
// Middleware principal
// ---------------------------------------------------------------------------
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // ── Rate limiting ──────────────────────────────────────────────────────
  if (!checkRateLimit(ip, pathname)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde alguns minutos.' },
      { status: 429 }
    );
  }

  const session   = request.cookies.get('admin_session')?.value;
  const adminPass = process.env.ADMIN_PASSWORD;
  const isLoggedIn = !!session && !!adminPass && await isValidSessionToken(session, adminPass);

  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi  = pathname.startsWith('/api/admin/');
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi  = pathname === '/api/admin/login';

  // ── Protege /admin e /api/admin/* ─────────────────────────────────────
  if ((isAdminPage || isAdminApi) && !isLoginPage && !isLoginApi) {
    if (!isLoggedIn) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // ── Se já logado e acessa /admin/login → redireciona para painel ──────
  if (isLoginPage && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/checkout',
    '/api/checkout/status',
  ],
};
