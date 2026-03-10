import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = [
  '/members',
  '/schedule',
  '/craft',
  '/admin',
  '/notice',
  '/tips',
  '/updates',
  '/season2',
];

const PUBLIC_API_PATHS = ['/api/auth', '/api/visitors'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPage = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  const isProtectedApi =
    pathname.startsWith('/api/') &&
    !PUBLIC_API_PATHS.some(p => pathname.startsWith(p));

  if (!isProtectedPage && !isProtectedApi) return NextResponse.next();

  const token = request.cookies.get('auth_token')?.value;
  if (token) return NextResponse.next();

  if (isProtectedApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
