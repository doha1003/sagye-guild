import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = '1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo';
const PET_SHEET_GID = '1930672648';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${PET_SHEET_GID}`;

interface Pet {
  name: string;
  tribe: string;
  location: string;
}

interface TribeData {
  name: string;
  pets: Pet[];
}

// 종족 목록 (순서대로)
const TRIBE_NAMES = ['지성', '야성', '자연', '변형'];

export async function GET(request: NextRequest) {
  const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

  try {
    const urlWithTimestamp = forceRefresh
      ? `${SHEET_URL}&_t=${Date.now()}`
      : SHEET_URL;

    const response = await fetch(urlWithTimestamp, {
      cache: forceRefresh ? 'no-store' : 'default',
      next: forceRefresh ? undefined : { revalidate: 300 }, // 5분 캐시
    });

    const text = await response.text();

    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse sheet data' }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table.rows;

    // 전체 펫 목록
    const allPets: Pet[] = [];

    for (const row of rows) {
      const cells = row.c.map((cell: { v: string | null } | null) => cell?.v ?? '');
      const name = String(cells[0] || '').trim();
      const tribe = String(cells[1] || '').trim();
      const location = String(cells[2] || '').trim();

      // 헤더 행 스킵 (펫, 종족, 획득처)
      if (name === '펫' && tribe === '종족') continue;

      // 빈 행 스킵
      if (!name || !tribe) continue;

      // 유효한 종족인지 확인
      if (!TRIBE_NAMES.includes(tribe)) continue;

      allPets.push({
        name,
        tribe,
        location: location || '',
      });
    }

    // 종족별로 그룹화
    const tribes: TribeData[] = TRIBE_NAMES.map(tribeName => ({
      name: tribeName,
      pets: allPets.filter(pet => pet.tribe === tribeName),
    }));

    return NextResponse.json({
      tribes,
      allPets,
      totalCount: allPets.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Pets API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pet data' },
      { status: 500 }
    );
  }
}
