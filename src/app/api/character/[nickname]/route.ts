import { NextRequest, NextResponse } from 'next/server';

const AION2TOOL_BASE_URL = 'https://www.aion2tool.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  const { nickname } = await params;
  const server = '지켈';
  const race = '마족';

  try {
    const searchUrl = `${AION2TOOL_BASE_URL}/api/character/search?nickname=${encodeURIComponent(nickname)}&server=${encodeURIComponent(server)}&race=${encodeURIComponent(race)}`;

    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.aion2tool.com/',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Character not found', status: response.status },
        { status: response.status }
      );
    }

    const result = await response.json();

    // 실제 데이터 구조: result.data.combat_score, result.data.combat_power
    const data = result.data || {};

    return NextResponse.json({
      nickname,
      server,
      race,
      combatScore: data.combat_score || 0,
      combatPower: data.combat_power || 0,
      combatScoreMax: data.combat_score_max || 0,
      powerRange: result.combat_score_power_range || data.combat_score_power_range || null,
      job: data.job || '',
      level: data.level || 0,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Character fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character data' },
      { status: 500 }
    );
  }
}
