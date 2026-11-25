import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROOT_DOMAINS = new Set([
  'localhost:3001',
  'localhost:3000',
  process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? '',
]);

function extractSubdomain(host: string): string | null {
  const cleanHost = host.toLowerCase().trim();

  if (ROOT_DOMAINS.has(cleanHost)) {
    return null;
  }

  if (cleanHost.includes('.localhost')) {
    const sub = cleanHost.split('.localhost')[0];
    return sub && sub !== 'www' ? sub : null;
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  if (rootDomain && cleanHost.endsWith(`.${rootDomain}`)) {
    const sub = cleanHost.replace(`.${rootDomain}`, '');
    return sub && sub !== 'www' ? sub : null;
  }

  return null;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const subdomain = extractSubdomain(host);
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const requestHeaders = new Headers(request.headers);

  if (subdomain) {
    requestHeaders.set('x-parish-slug', subdomain);
  } else {
    requestHeaders.delete('x-parish-slug');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login',
    '/((?!_next/static|_next/image|favicon.ico|api).*)'
  ],
}