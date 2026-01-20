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

    // 1차: 모든 멤버 기본 데이터 파싱 (부캐여부 포함)
    const rawMembers = table.rows.map((row: { c: Array<{ v: string | number | null }> }, index: number) => {
      const cells = row.c.map((cell: { v: string | number | null } | null) => cell?.v ?? '');

      return {
        id: `member-${index}`,
        rank: cells[0] || '',           // A: 계급
        nickname: cells[1] || '',       // B: 캐릭터명
        className: cells[2] || '',      // C: 직업
        age: cleanAge(cells[3]),        // D: 나이 (정리됨)
        discord: cells[4] || '',        // E: 디스코드
        kakao: cells[5] || '',          // F: 카카오톡
        maxCombatScore: cells[6] || 0,  // G: 최고 전투점수
        combatScore: cells[7] || 0,     // H: 현재 전투점수
        combatPower: cells[8] || 0,     // I: 전투력
        mainCharacter: String(cells[9] || '').trim(), // J: 부캐여부 (본캐 닉네임)
      };
    }).filter((m: { nickname: string }) => m.nickname); // 빈 행 제거

    // 2차: 본캐 닉네임으로 빠르게 찾을 수 있도록 맵 생성
    const mainCharMap = new Map<string, { age: string; discord: string; kakao: string }>();
    for (const m of rawMembers) {
      if (!m.mainCharacter) {
        // 본캐인 경우에만 맵에 추가
        mainCharMap.set(m.nickname, {
          age: m.age,
          discord: m.discord,
          kakao: m.kakao,
        });
      }
    }

    // 3차: 부캐의 경우 본캐 정보 상속
    interface RawMember {
      id: string;
      rank: string;
      nickname: string;
      className: string;
      age: string;
      discord: string;
      kakao: string;
      maxCombatScore: string | number;
      combatScore: string | number;
      combatPower: string | number;
      mainCharacter: string;
    }
    const members = rawMembers.map((m: RawMember) => {
      if (m.mainCharacter) {
        // 부캐인 경우 본캐 정보 가져오기
        const mainInfo = mainCharMap.get(m.mainCharacter);
        if (mainInfo) {
          return {
            ...m,
            age: m.age || mainInfo.age,           // 직접 입력값 우선, 없으면 본캐에서 상속
            discord: m.discord || mainInfo.discord,
            kakao: m.kakao || mainInfo.kakao,
          };
        }
      }
      return m;
    });

    // K열에서 수집 시간 가져오기 (J에서 K로 이동됨)
    let collectTime = '';
    try {
      if (table.cols.length >= 11 && table.rows[0]?.c[10]?.v) {
        const rawValue = String(table.rows[0].c[10].v);
        // Google Sheets Date 형식 파싱: Date(year,month,day,hour,min,sec)
        const dateMatch = rawValue.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
        if (dateMatch) {
          const [, year, month, day, hour, min] = dateMatch;
          const m = String(Number(month) + 1).padStart(2, '0'); // month는 0부터 시작
          const d = String(day).padStart(2, '0');
          const h = String(hour).padStart(2, '0');
          const mi = String(min).padStart(2, '0');
          collectTime = `${year}-${m}-${d} ${h}:${mi}`;
        } else {
          collectTime = rawValue;
        }
      }
    } catch {}

    return NextResponse.json({
      headers,
      members,
      collectTime,
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
