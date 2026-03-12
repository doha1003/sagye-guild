import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

interface TrackEvent {
  type: 'pageview' | 'auth' | 'leave';
  page: string;
  timestamp: number;
  duration?: number;
  referrer?: string;
}

interface VisitorSession {
  id: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  device: string;
  os: string;
  browser: string;
  authenticated: boolean;
  firstSeen: number;
  lastSeen: number;
  events: TrackEvent[];
}

function getKSTDateKey(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `track:${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, '0')}-${String(kst.getUTCDate()).padStart(2, '0')}`;
}

function parseUA(ua: string) {
  let os = 'Unknown';
  let browser = 'Unknown';
  let device = 'desktop';

  if (/iPhone|iPad|iPod/.test(ua)) { os = 'iOS'; device = /iPad/.test(ua) ? 'tablet' : 'mobile'; }
  else if (/Android/.test(ua)) { os = 'Android'; device = /Mobile/.test(ua) ? 'mobile' : 'tablet'; }
  else if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac OS/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = 'Safari';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/KAKAOTALK/.test(ua)) browser = 'KakaoTalk';
  else if (/NAVER/.test(ua)) browser = 'Naver';

  return { os, browser, device };
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, event } = await request.json() as { sessionId: string; event: TrackEvent };
    if (!sessionId || !event) {
      return NextResponse.json({ error: 'Invalid' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const region = request.headers.get('x-vercel-ip-country-region') || '';
    const country = request.headers.get('x-vercel-ip-country') || '';
    const ua = request.headers.get('user-agent') || '';
    const { os, browser, device } = parseUA(ua);

    const dateKey = getKSTDateKey();
    const sessionKey = `${dateKey}:${sessionId}`;

    let session = await kv.get<VisitorSession>(sessionKey);

    if (!session) {
      session = {
        id: sessionId,
        ip: ip.replace(/\.\d+$/, '.***'),
        city: decodeURIComponent(city),
        region: decodeURIComponent(region),
        country,
        device, os, browser,
        authenticated: false,
        firstSeen: event.timestamp,
        lastSeen: event.timestamp,
        events: [],
      };
    }

    if (event.type === 'auth') {
      session.authenticated = true;
    }

    session.lastSeen = event.timestamp;
    session.events.push(event);

    // 이벤트 최대 100개로 제한
    if (session.events.length > 100) {
      session.events = session.events.slice(-100);
    }

    await kv.set(sessionKey, session, { ex: 60 * 60 * 24 * 90 });

    // 날짜별 세션 ID 목록 관리
    const indexKey = `${dateKey}:index`;
    const index = await kv.get<string[]>(indexKey) || [];
    if (!index.includes(sessionId)) {
      index.push(sessionId);
      await kv.set(indexKey, index, { ex: 60 * 60 * 24 * 90 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ ok: false });
  }
}
