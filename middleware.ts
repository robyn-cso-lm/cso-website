import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow the login page through unconditionally
  if (request.nextUrl.pathname === '/portal/login') return NextResponse.next();

  // next-auth v5 session cookie (name differs by env/protocol)
  const hasSession =
    request.cookies.has('authjs.session-token') ||
    request.cookies.has('__Secure-authjs.session-token');

  if (!hasSession) {
    return NextResponse.redirect(new URL('/portal/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};
