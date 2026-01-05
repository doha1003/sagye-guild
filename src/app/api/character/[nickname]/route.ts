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
    // aion2tool 캐릭터 검색 API 호출
    const searchUrl = `${AION2TOOL_BASE_URL}/api/character/search?nickname=${encodeURIComponent(nickname)}&server=${encodeURIComponent(server)}&race=${encodeURIComponent(race)}`;

    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.aion2tool.com/',
      },
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Character not found', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 전투력 및 주요 스탯 추출
    const combatScore = data?.combat_score_power_range?.combat_score ||
                       data?.data?.combat_stats?.combat_score || 0;
    const combatPower = data?.combat_score_power_range?.combat_power ||
                       data?.data?.combat_stats?.combat_power || 0;

    // DPS 관련 스탯 (딜러 평가용)
    const combatStats = data?.data?.combat_stats || {};
    const dpsStats = {
      attackPower: combatStats.attack_power || 0,
      criticalHit: combatStats.critical_hit || 0,
      criticalDamage: combatStats.critical_damage_amplification || 0,
      damageAmplification: combatStats.damage_amplification || 0,
      skillDamage: combatStats.skill_damage || 0,
      multiHit: combatStats.multi_hit || 0,
    };

    return NextResponse.json({
      nickname,
      server,
      race,
      combatScore,
      combatPower,
      dpsStats,
      raw: data,
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
