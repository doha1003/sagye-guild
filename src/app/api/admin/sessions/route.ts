import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { verifyAdminPassword } from '@/lib/firebase-server';

export async function POST(request: NextRequest) {
  try {
    const { password, date } = await request.json();

    const isAdmin = await verifyAdminPassword(password);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dateKey = `track:${date}`;
    const indexKey = `${dateKey}:index`;
    const sessionIds = await kv.get<string[]>(indexKey) || [];

    if (sessionIds.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    const sessions = await Promise.all(
      sessionIds.map(id => kv.get(`${dateKey}:${id}`))
    );

    const validSessions = sessions
      .filter(Boolean)
      .sort((a: any, b: any) => b.lastSeen - a.lastSeen);

    return NextResponse.json({ sessions: validSessions });
  } catch (error) {
    console.error('Sessions API error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
