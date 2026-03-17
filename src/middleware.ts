import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session    = request.cookies.get('admin_session')?.value;
  const adminPass  = process.env.ADMIN_PASSWORD;
  const isLoggedIn = !!adminPass && session === adminPass;

  // ── Protege /admin e qualquer sub-rota, exceto /admin/login ──────────
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginPage  = pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    // Redireciona para login mantendo a URL de destino no query param
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // ── Se já está logado e acessa /admin/login → manda pro painel ───────
  if (isLoginPage && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Captura /admin (sem trailing slash) E /admin/* (sub-rotas)
  matcher: ['/admin', '/admin/:path*'],
};
