import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { kv } from '@vercel/kv';

const SITE_PASSWORD = process.env.SITE_PASSWORD!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const TOKEN_SECRET = process.env.TOKEN_SECRET!;

const MAX_ATTEMPTS = 10;
const WINDOW_SEC = 600; // 10분

async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `auth_rate:${ip}`;
    const count = await kv.incr(key);
    if (count === 1) await kv.expire(key, WINDOW_SEC);
    return count <= MAX_ATTEMPTS;
  } catch {
    return true;
  }
}

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
    if (hmac.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!(await checkRateLimit(ip))) {
      return NextResponse.json({ success: false, message: '너무 많은 시도입니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
    }

    const { password } = await request.json();

    const isAdmin = password === ADMIN_PASSWORD;
    const isUser = password === SITE_PASSWORD;

    if (isAdmin || isUser) {
      const token = generateToken();
      const response = NextResponse.json({ success: true, redirect: isAdmin ? '/admin' : null });
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
      response.cookies.set('auth_status', '1', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
      if (isAdmin) {
        const adminToken = crypto.createHmac('sha256', TOKEN_SECRET).update(`admin:${Date.now()}`).digest('hex');
        response.cookies.set('admin_token', adminToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
        });
      }
      return response;
    }

    return NextResponse.json({ success: false, message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: '잘못된 요청입니다.' }, { status: 400 });
  }
}
