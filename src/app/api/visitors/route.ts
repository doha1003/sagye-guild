import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// 오늘 날짜 키 생성 (KST 기준)
function getTodayKey(): string {
  const now = new Date();
  // KST = UTC + 9
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');
  return `visitors:${year}-${month}-${day}`;
}

// GET: 방문자 수 조회
export async function GET() {
  try {
    const todayKey = getTodayKey();

    const [total, today] = await Promise.all([
      kv.get<number>('visitors:total') || 0,
      kv.get<number>(todayKey) || 0,
    ]);

    return NextResponse.json({
      total: total || 0,
      today: today || 0,
    });
  } catch (error) {
    console.error('Visitors API error:', error);
    return NextResponse.json({ total: 0, today: 0 });
  }
}

// POST: 방문자 수 증가
export async function POST() {
  try {
    const todayKey = getTodayKey();

    const [total, today] = await Promise.all([
      kv.incr('visitors:total'),
      kv.incr(todayKey),
    ]);

    // 오늘 키는 48시간 후 자동 만료 (정리용)
    await kv.expire(todayKey, 60 * 60 * 48);

    return NextResponse.json({
      total,
      today,
    });
  } catch (error) {
    console.error('Visitors API error:', error);
    return NextResponse.json({ total: 0, today: 0 });
  }
}
