import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = '1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo';
const APPEARANCE_SHEET_GID = '1349666126';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${APPEARANCE_SHEET_GID}`;

type Grade = 'normal' | 'rare' | 'legacy' | 'unique' | 'hero';

interface AppearanceItem {
  name: string;
  equipment: string;
  source: string;
  grade: Grade;
}

// 한글 등급을 영문으로 변환
const gradeMap: Record<string, Grade> = {
  '일반': 'normal',
  '희귀': 'rare',
  '전승': 'legacy',
  '유일': 'unique',
  '영웅': 'hero',
};

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

    const items: AppearanceItem[] = [];
    const gradeCount: Record<Grade, number> = {
      normal: 0,
      rare: 0,
      legacy: 0,
      unique: 0,
      hero: 0,
    };

    for (const row of rows) {
      const cells = row.c.map((cell: { v: string | null } | null) => cell?.v ?? '');
      const gradeKor = String(cells[0] || '').trim();
      const name = String(cells[1] || '').trim();
      const equipment = String(cells[2] || '').trim();
      const source = String(cells[3] || '').trim();

      // 헤더 행 스킵
      if (gradeKor === '등급' || !gradeKor || !name) continue;

      const grade = gradeMap[gradeKor];
      if (!grade) continue;

      items.push({
        name,
        equipment,
        source,
        grade,
      });

      gradeCount[grade]++;
    }

    return NextResponse.json({
      items,
      gradeCount,
      totalCount: items.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Appearance API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appearance data' },
      { status: 500 }
    );
  }
}
