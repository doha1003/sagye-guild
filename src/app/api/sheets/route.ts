import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = '1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

export async function GET(request: NextRequest) {
  const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

  try {
    // 캐시 무효화를 위해 타임스탬프 추가
    const urlWithTimestamp = forceRefresh
      ? `${SHEET_URL}&_t=${Date.now()}`
      : SHEET_URL;

    const response = await fetch(urlWithTimestamp, {
      cache: forceRefresh ? 'no-store' : 'default',
      next: forceRefresh ? undefined : { revalidate: 30 },
    });

    const text = await response.text();

    // Google Sheets API 응답에서 JSON 추출
    // 응답 형식: /*O_o*/google.visualization.Query.setResponse({...});
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse sheet data' }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[1]);
    const table = data.table;

    // 컬럼 헤더 추출
    const headers = table.cols.map((col: { label: string }) => col.label);

    // 년생 정리 함수 (앞의 따옴표 제거, 숫자 처리)
    const cleanAge = (value: string | number | null): string => {
      if (value === null || value === undefined || value === '') return '';
      const str = String(value).replace(/^['']/, '').trim(); // 앞의 따옴표 제거
      // 숫자면 년생으로 표시 (0~9는 00~09로 패딩)
      if (/^\d{1,2}$/.test(str)) {
        const padded = str.padStart(2, '0');
        return `${padded}년생`;
      }
      return str;
    };

    // 행 데이터 변환
    const members = table.rows.map((row: { c: Array<{ v: string | number | null }> }, index: number) => {
      const cells = row.c.map((cell: { v: string | number | null } | null) => cell?.v ?? '');

      return {
        id: `member-${index}`,
        rank: cells[0] || '',           // A: 계급
        nickname: cells[1] || '',       // B: 캐릭터명
        className: cells[2] || '',      // C: 직업
        age: cleanAge(cells[3]),        // D: 나이 (정리됨)
        discord: cells[4] || '',        // E: 디스코드
        kakao: cells[5] || '',          // F: 카카오톡
        combatScore: cells[6] || 0,     // G: 전투점수
        combatPower: cells[7] || 0,     // H: 전투력
      };
    }).filter((m: { nickname: string }) => m.nickname); // 빈 행 제거

    return NextResponse.json({
      headers,
      members,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sheets API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sheet data' },
      { status: 500 }
    );
  }
}
