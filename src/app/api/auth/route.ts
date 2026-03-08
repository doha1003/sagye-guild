import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SITE_PASSWORD = process.env.SITE_PASSWORD || '18AION';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'sagye-guild-secret-key-2026';

function generateToken(): string {
  const payload = `authenticated:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${hmac}`;
}

function verifyToken(token: string): boolean {
  try {
    const [payloadB64, hmac] = token.split('.');
    if (!payloadB64 || !hmac) return false;
    const payload = Buffer.from(payloadB64, 'base64').toString();
    if (!payload.startsWith('authenticated:')) return false;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
    return hmac === expected;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === SITE_PASSWORD) {
      const token = generateToken();
      const response = NextResponse.json({ success: true });
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 24시간
      });
      // 클라이언트에서 인증 상태 확인용 (값 자체는 의미 없음)
      response.cookies.set('auth_status', '1', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    return NextResponse.json({ success: false, message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: '잘못된 요청입니다.' }, { status: 400 });
  }
}
