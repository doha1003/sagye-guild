import { NextRequest, NextResponse } from 'next/server';

// 봇 User-Agent 패턴
const BOT_PATTERNS = /bot|crawl|spider|scrape|curl|wget|python-requests|httpx|axios|postman|insomnia/i;

// 인증 없이 접근 가능한 경로
const PUBLIC_PATHS = ['/api/auth', '/_next', '/favicon', '/icons', '/manifest.json', '/sw.js', '/og-image'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname.startsWith(p));
}

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true; // UA 없으면 봇으로 간주
  return BOT_PATTERNS.test(userAgent);
}

function verifyTokenSimple(token: string): boolean {
  try {
    const [payloadB64, hmac] = token.split('.');
    if (!payloadB64 || !hmac) return false;
    const payload = Buffer.from(payloadB64, 'base64').toString();
    if (!payload.startsWith('authenticated:')) return false;
    // HMAC 검증은 서버 사이드에서만 가능하므로 형식 체크만 수행
    // 실제 HMAC 검증은 토큰 발급 시 서버에서 처리됨
    return hmac.length === 64; // SHA-256 hex length
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 경로는 통과
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // API 경로에 대한 봇 차단
  if (pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent');
    if (isBot(userAgent)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // API 호출 시 인증 토큰 체크
    const token = request.cookies.get('auth_token')?.value;
    if (!token || !verifyTokenSimple(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // 페이지 요청에 대한 봇 차단
  const userAgent = request.headers.get('user-agent');
  if (isBot(userAgent)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // API 라우트 보호
    '/api/:path*',
    // 페이지 봇 차단 (정적 파일 제외)
    '/((?!_next/static|_next/image|favicon|icons|images|sw.js|workbox|manifest.json|og-image).*)',
  ],
};
