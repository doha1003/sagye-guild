'use client';

import { useState } from 'react';
import Link from 'next/link';

type Grade = 'all' | 'rare' | 'hero' | 'legend' | 'myth';

interface AppearanceItem {
  name: string;
  equipment: string;
  source: string;
  grade: 'rare' | 'hero' | 'legend' | 'myth';
}

const GRADE_INFO: Record<Grade, { name: string; color: string; bgColor: string }> = {
  all: { name: '전체', color: 'text-white', bgColor: 'bg-zinc-600' },
  rare: { name: '희귀', color: 'text-green-400', bgColor: 'bg-green-600/20' },
  hero: { name: '영웅', color: 'text-purple-400', bgColor: 'bg-purple-600/20' },
  legend: { name: '전설', color: 'text-orange-400', bgColor: 'bg-orange-600/20' },
  myth: { name: '신화', color: 'text-yellow-400', bgColor: 'bg-yellow-600/20' },
};

// 희귀 등급
const RARE_ITEMS: AppearanceItem[] = [
  { name: '고결한 서약', equipment: '오리하르콘', source: "제작('빛나는' 동일)", grade: 'rare' },
  { name: '방향을 정한 자', equipment: '위장자', source: '퀘스트 지급(외형추출100%)', grade: 'rare' },
  { name: '새벽의 서리', equipment: '그늘/잊혀진', source: '사명 보상/슈고 페스타/몬스터 드랍', grade: 'rare' },
  { name: '생각하는 자', equipment: '환몽/강가', source: '사명 보상/슈고 페스타/몬스터 드랍', grade: 'rare' },
  { name: '수석 탐구자', equipment: '새벽', source: '퀘스트 지급(외형추출100%)', grade: 'rare' },
  { name: '시작의 빛', equipment: '여명', source: '퀘스트 지급(외형추출100%)', grade: 'rare' },
  { name: '이계 속 탐험가', equipment: '대지', source: '원정/몬스터 드랍(어비스)/사명 보상(어비스)', grade: 'rare' },
];

// 영웅 등급
const HERO_ITEMS: AppearanceItem[] = [
  { name: '강인한 조언자', equipment: '란나르', source: '필드 보스(모슬란 숲)', grade: 'hero' },
  { name: '고요한 바람', equipment: '광명/유성', source: '사명 보상/슈고 페스타/몬스터 드랍', grade: 'hero' },
  { name: '굳건한 수호자', equipment: '떠돌이', source: '[탐험]드라웁니르 이상/[원정]ALL/몬스터 드랍(어비스)', grade: 'hero' },
  { name: '기사의 의지', equipment: '장인의 오리하르콘', source: "제작('빛나는' 동일)", grade: 'hero' },
  { name: '길 위의 여행자', equipment: '티간트', source: '필드 보스(요새 폐허)/천', grade: 'hero' },
  { name: '모래 언덕 공방', equipment: '발그', source: '필드 보스(성소 감시 초소)', grade: 'hero' },
  { name: '미지의 추구자', equipment: '네이켈', source: '필드 보스(칸타스 계곡)/천', grade: 'hero' },
  { name: '수련의 시작', equipment: '코린', source: '필드 보스(엘룬강 중류)/천', grade: 'hero' },
  { name: '숲의 은둔자', equipment: '쿠타르', source: '필드 보스(엘룬강 늪지)/천', grade: 'hero' },
  { name: '신의 가호', equipment: '전선', source: '[탐험]크라오 동굴/사명 보상(어비스)', grade: 'hero' },
  { name: '어둠의 송곳니', equipment: '칩입자', source: '[탐험]우루구구 협곡/불의 신전/사명 보상(어비스)', grade: 'hero' },
  { name: '여행의 성장', equipment: '케르논', source: '필드 보스(칸타스 계곡)/천', grade: 'hero' },
  { name: '여행의 흐름', equipment: '다나르', source: '필드 보스(드레드기온 추락지)', grade: 'hero' },
  { name: '은빛 처형자', equipment: '쫓는 자/산들바람', source: '퀘스트 지급(외형추출100%)', grade: 'hero' },
  { name: '자연의 녹림', equipment: '폭풍/비오는 숲', source: '사명 보상/슈고 페스타/몬스터 드랍', grade: 'hero' },
  { name: '침묵의 강철', equipment: '라지트', source: '필드 보스(성소 감시 초소)', grade: 'hero' },
  { name: '푸른 숨의 탐색자', equipment: '아에드', source: '필드 보스(이름없는 묘지)', grade: 'hero' },
  { name: '환영의 그림자', equipment: '혼돈', source: '사명 보상/슈고 페스타/몬스터 드랍', grade: 'hero' },
];

// 전설 등급
const LEGEND_ITEMS: AppearanceItem[] = [
  { name: '강철의 벽', equipment: '쿠산', source: '필드 보스(요새 폐허)/천', grade: 'legend' },
  { name: '강철의 요새', equipment: '우라무', source: '필드 보스(아울라우 부락)/천', grade: 'legend' },
  { name: '강철의 인내', equipment: '복수자/표류자', source: '퀘스트 지급(외형추출100%)', grade: 'legend' },
  { name: '강철의 중갑', equipment: '가르산', source: '필드 보스(모슬란 숲)', grade: 'legend' },
  { name: '고대의 수호자', equipment: '가르심', source: '필드 보스(요새 폐허)/천', grade: 'legend' },
  { name: '고독한 추격자', equipment: '유물 발견자/원로', source: '사명 보상/몬스터 드랍', grade: 'legend' },
  { name: '고요한 사냥꾼', equipment: '르사나', source: '필드 보스(드라낙투스)', grade: 'legend' },
  { name: '광휘의 심장', equipment: '쉬라크', source: '필드 보스(임페투시움 광장)', grade: 'legend' },
  { name: '그림자의 가면', equipment: '피를 부르는', source: '몬스터 드랍(어비스)/사명 보상(어비스)', grade: 'legend' },
  { name: '기록하는 자', equipment: '트리드', source: '필드 보스(우르툼헤임)', grade: 'legend' },
  { name: '기사의 신념', equipment: '슈자칸', source: '필드 보스(검은 발톱 부락)', grade: 'legend' },
  { name: '꿈속의 집행자', equipment: '세트람', source: '필드 보스(나히드 군단 요새)/천', grade: 'legend' },
  { name: '망각의 중재자', equipment: '링크스', source: '필드 보스(바스펠트 폐허)', grade: 'legend' },
  { name: '모래바람의 방랑자', equipment: '악시오스', source: '필드 보스(바스펠트 폐허)', grade: 'legend' },
  { name: '밤 그림자', equipment: '검은 발톱', source: '[탐험/원정]사나운 뿔 암굴/[성역]루드라', grade: 'legend' },
  { name: '밤안개 유령', equipment: '카루카', source: '필드 보스(검은 발톱 부락)', grade: 'legend' },
  { name: '밤의 용', equipment: '광기', source: '[성역]루드라', grade: 'legend' },
  { name: '별의 예언자', equipment: '파괴/환영', source: '몬스터 드랍(정령/불멸섬)/사명 보상', grade: 'legend' },
  { name: '복원된 조사대', equipment: '외형 전용', source: '포코룬의 외형 꾸러미(채집)', grade: 'legend' },
  { name: '북풍의 철갑', equipment: '데미로스', source: '필드 보스(아르타미아 고원)/천', grade: 'legend' },
  { name: '불멸의 심장', equipment: '하디룬', source: '필드 보스(파프나이트 매장지)', grade: 'legend' },
  { name: '빛길의 흔적', equipment: '외형 전용', source: '슈고 페스타 상점', grade: 'legend' },
  { name: '섬광의 철벽', equipment: '비슈베다', source: '필드 보스(라그타 요새/붉은 숲)', grade: 'legend' },
  { name: '숨은 도피자', equipment: '크나쉬', source: '필드 보스(드라나 재배지)/천', grade: 'legend' },
  { name: '숲의 학자', equipment: '누타', source: '필드 보스(드라낙투스)', grade: 'legend' },
  { name: '신성한 고대', equipment: '번뇌', source: '[탐험/정복]드라웁니르/[성역]루드라', grade: 'legend' },
  { name: '약속의 레기온', equipment: '외형 전용', source: '포코룬의 외형 꾸러미(채집)', grade: 'legend' },
  { name: '어스름의 길', equipment: '속삭이는 망각', source: '사명 보상(어비스)', grade: 'legend' },
  { name: '연구하는 자', equipment: '프닌', source: '필드 보스(톨바스 숲)/천', grade: 'legend' },
  { name: '영광의 심판', equipment: '안사스', source: '필드 보스(아르타미아 고원)/천', grade: 'legend' },
  { name: '운명의 제단사', equipment: '규율/질서', source: '사명 보상/슈고 페스타', grade: 'legend' },
  { name: '운명의 현자', equipment: '켈피나', source: '필드 보스(정화의 숲)', grade: 'legend' },
  { name: '운석의 가호', equipment: '바르시엔', source: '필드 보스(그리바데 협곡 서부)', grade: 'legend' },
  { name: '은방울 요정의 꿈', equipment: '불굴', source: '[탐험/원정]바크론의 공중섬/[성역]루드라', grade: 'legend' },
  { name: '은빛의 장벽', equipment: '실리주의자/신전 수호자', source: '사명 보상/몬스터 드랍', grade: 'legend' },
  { name: '은색의 빛', equipment: '달인의 오리하르콘', source: "제작('빛나는' 동일)", grade: 'legend' },
  { name: '자수빛 비늘', equipment: '신앙', source: '[탐험]우루구구 협곡', grade: 'legend' },
  { name: '전투의 의지', equipment: '라와', source: '필드 보스(아르타미아 협곡)/천', grade: 'legend' },
  { name: '정적의 숨', equipment: '라울라', source: '필드 보스(아울라우 부락)/천', grade: 'legend' },
  { name: '지식을 잇는 자', equipment: '모샤브', source: '필드 보스(드라나 재배지)/천', grade: 'legend' },
  { name: '지키는 자', equipment: '서약', source: '사명 보상(어비스)', grade: 'legend' },
  { name: '철갑의 서약', equipment: '노블루드', source: '필드 보스(바스펠트 폐허)', grade: 'legend' },
  { name: '철의 심장', equipment: '해방자/순례자', source: '퀘스트 지급(외형추출100%)', grade: 'legend' },
  { name: '청운의 기운', equipment: '레일라', source: '필드 보스(아르타미아 고원)/천', grade: 'legend' },
  { name: '침묵의 결의', equipment: '외형 전용', source: '포코룬의 외형 꾸러미(채집)', grade: 'legend' },
  { name: '침묵의 망령', equipment: '구루타', source: '필드 보스(그리바데 협곡 동부)', grade: 'legend' },
  { name: '크로메데의 욕망', equipment: '타락한 심판관', source: '[정복]불의 신전/[성역]루드라', grade: 'legend' },
  { name: '태양의 광휘', equipment: '방위병', source: '사명 보상(어비스)', grade: 'legend' },
  { name: '핏빛그림', equipment: '분열', source: '[정복]크라오 동굴/[성역]루드라', grade: 'legend' },
  { name: '하늘깃의 수호자', equipment: '신성한 협곡', source: '[정복]우루구구 협곡/[성역]루드라', grade: 'legend' },
  { name: '하늘빛 서약', equipment: '붉은 강옥', source: '[탐험]크라오 동굴', grade: 'legend' },
  { name: '하늘의 깃털', equipment: '밀약', source: '', grade: 'legend' },
  { name: '하늘의 속삭임', equipment: '사루스', source: '필드 보스(톨바스 숲)/천', grade: 'legend' },
  { name: '황금빛의 수호', equipment: '카시아', source: '필드 보스(환영신의 정원)/천', grade: 'legend' },
  { name: '황야의 결', equipment: '타울로', source: '필드 보스(아울라우 부락)/천', grade: 'legend' },
  { name: '황야의 방랑자', equipment: '외형 전용', source: '포코룬의 외형 꾸러미(채집)', grade: 'legend' },
  { name: '황혼의 비단', equipment: '심판관', source: '[탐험]불의 신전', grade: 'legend' },
];

// 신화 등급
const MYTH_ITEMS: AppearanceItem[] = [
  { name: '각성한 자', equipment: '외형 전용', source: '악몽 교환 상점', grade: 'myth' },
  { name: '고요한 숲', equipment: '정복', source: '', grade: 'myth' },
  { name: '구원의 은홍', equipment: '외형 전용', source: '모노리스 보상(어비스)', grade: 'myth' },
  { name: '달의 광채', equipment: '용기', source: '몬스터 드랍(어비스)', grade: 'myth' },
  { name: '바람의 가호', equipment: '가디언 십부장', source: '어비스 교환 상점(외형추출100%)', grade: 'myth' },
  { name: '밤의 칠흑', equipment: '사령/성령', source: '몬스터 드랍(정령/불멸섬)/슈고 페스타', grade: 'myth' },
  { name: '분노의 철벽', equipment: '평정', source: '', grade: 'myth' },
  { name: '비탄에 잠긴 어둠', equipment: '타르탄', source: '필드 보스(정화의 숲/아르타미아 고원 남부)', grade: 'myth' },
  { name: '새벽을 여는자', equipment: '암룡왕', source: "제작('빛나는' 동일)", grade: 'myth' },
  { name: '생명의 빛', equipment: '외형 전용', source: '모노리스 보상', grade: 'myth' },
  { name: '생명의 축복', equipment: '몰락한 고대신', source: '필드 보스(어비스)', grade: 'myth' },
  { name: '섀도우 슬레이어', equipment: '외형 전용', source: '시즌 상점', grade: 'myth' },
  { name: '성광의 예복', equipment: '가디언 천부장', source: '어비스 교환 상점(외형추출100%)', grade: 'myth' },
  { name: '숙달된 전문가', equipment: '외형 전용', source: '슈고 페스타 상점', grade: 'myth' },
  { name: '숲의 수호자', equipment: '가르투아', source: '필드 보스(불멸의 섬/영원의 섬)', grade: 'myth' },
  { name: '영광의 수호자', equipment: '누아쿰', source: '[탐험/원정]사나운 뿔 암굴/[성역]루드라', grade: 'myth' },
  { name: '영원의 뿔', equipment: '외형 전용', source: '악몽 교환 상점', grade: 'myth' },
  { name: '영혼의 맹세', equipment: '환상/지혜', source: '몬스터 드랍', grade: 'myth' },
  { name: '용의 가호', equipment: '흑룡왕', source: "제작('빛나는' 동일)", grade: 'myth' },
  { name: '용의 기운', equipment: '건룡왕', source: "제작('빛나는' 동일)", grade: 'myth' },
  { name: '용의 분노', equipment: '군단장 라그타', source: '필드 보스(라그타 요새)', grade: 'myth' },
  { name: '운명의 날개', equipment: '가디언 백부장', source: '어비스 교환 상점(외형추출100%)', grade: 'myth' },
  { name: '울부짖는 용', equipment: '초월자', source: '[탐험]드라웁니르', grade: 'myth' },
  { name: '이계의 탐구자', equipment: '심연', source: '[성역]루드라', grade: 'myth' },
  { name: '이름없는 구원자', equipment: '카이라', source: '필드 보스(어비스)', grade: 'myth' },
  { name: '잊혀진 조사대', equipment: '카샤파', source: '필드 보스(파프나이트 매장지/아르타미아 고원 동부)', grade: 'myth' },
  { name: '파괴의 창날', equipment: '아그로', source: '필드 보스(어비스)', grade: 'myth' },
  { name: '파멸의 포식자', equipment: '바크론', source: '[탐험/원정]바크론의 공중섬/[성역]루드라', grade: 'myth' },
  { name: '포효하는 용', equipment: '수호신장 나흐마', source: '필드 보스(어비스)', grade: 'myth' },
  { name: '폭풍의 유산', equipment: '바카르마', source: '[정복]드라웁니르/[성역]루드라', grade: 'myth' },
  { name: '핏빛 황혼의 드레스', equipment: '외형 전용', source: '모노리스 보상', grade: 'myth' },
  { name: '적색의 군주', equipment: '가디언 군단장', source: '어비스 교환 상점(외형추출100%)', grade: 'myth' },
  { name: '초월한 자', equipment: '기룡왕', source: "제작('빛나는' 동일)", grade: 'myth' },
  { name: '하늘의 노래', equipment: '고대 정령', source: '[원정/성역]각 부위/루드라', grade: 'myth' },
];

const ALL_ITEMS = [...RARE_ITEMS, ...HERO_ITEMS, ...LEGEND_ITEMS, ...MYTH_ITEMS];

export default function AppearancePage() {
  const [activeGrade, setActiveGrade] = useState<Grade>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = ALL_ITEMS.filter((item) => {
    const matchesGrade = activeGrade === 'all' || item.grade === activeGrade;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const gradeCount = {
    all: ALL_ITEMS.length,
    rare: RARE_ITEMS.length,
    hero: HERO_ITEMS.length,
    legend: LEGEND_ITEMS.length,
    myth: MYTH_ITEMS.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 레기온
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
            <Link href="/tips/pets" className="text-zinc-400 hover:text-white">펫DB</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">홈</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 text-sm">외형 정보</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span>👗</span> 외형 정보
        </h1>
        <p className="text-zinc-400 text-sm mb-6">등급별 가나다 순 정렬 / 천마족 통합표기 (&apos;/천&apos;은 천족 해당)</p>

        {/* 안내 */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 text-sm space-y-1">
          <p className="text-amber-200"><strong>외형추출 확률:</strong> 일반 25% / 보스 드랍 10% / 제작 20%</p>
          <p className="text-zinc-300">인게임 표기 기준이며, 몬스터 드랍의 세부위치 확인은 거래소에서 검색</p>
          <p className="text-zinc-300">일반(흰색)~전승(파랑)까지는 검은구름무역단 상점에서 랜덤 판매</p>
          <p className="text-zinc-300">모든 외형 합성으로 획득 가능</p>
        </div>

        {/* 검색 */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="외형명, 장비명, 획득처 검색..."
            className="w-full max-w-md bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 등급 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(GRADE_INFO) as Grade[]).map((grade) => (
            <button
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeGrade === grade
                  ? 'bg-amber-500 text-zinc-900'
                  : `${GRADE_INFO[grade].bgColor} ${GRADE_INFO[grade].color} hover:opacity-80 border border-zinc-700`
              }`}
            >
              {GRADE_INFO[grade].name} ({gradeCount[grade]})
            </button>
          ))}
        </div>

        {/* 테이블 */}
        <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
          <div className="p-4 border-b border-zinc-700">
            <h2 className="text-lg font-semibold text-white">
              {activeGrade === 'all' ? '전체' : GRADE_INFO[activeGrade].name} 외형 ({filteredItems.length}개)
            </h2>
          </div>

          {/* 모바일 카드 */}
          <div className="md:hidden divide-y divide-zinc-700">
            {filteredItems.map((item, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold ${GRADE_INFO[item.grade].color}`}>{item.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${GRADE_INFO[item.grade].bgColor} ${GRADE_INFO[item.grade].color}`}>
                    {GRADE_INFO[item.grade].name}
                  </span>
                </div>
                <div className="text-sm text-zinc-300 mb-1">
                  <span className="text-zinc-500">장비:</span> {item.equipment}
                </div>
                <div className="text-sm text-zinc-400">
                  <span className="text-zinc-500">획득:</span> {item.source || '-'}
                </div>
              </div>
            ))}
          </div>

          {/* 데스크탑 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900">
                <tr className="text-zinc-400">
                  <th className="text-left p-3 font-medium w-12">등급</th>
                  <th className="text-left p-3 font-medium">외형명</th>
                  <th className="text-left p-3 font-medium">추출 장비</th>
                  <th className="text-left p-3 font-medium">획득처</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-700/50">
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${GRADE_INFO[item.grade].bgColor} ${GRADE_INFO[item.grade].color}`}>
                        {GRADE_INFO[item.grade].name}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`font-medium ${GRADE_INFO[item.grade].color}`}>{item.name}</span>
                    </td>
                    <td className="p-3 text-zinc-300">{item.equipment}</td>
                    <td className="p-3 text-zinc-400">{item.source || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 추천 획득방법 */}
        <div className="mt-8 bg-zinc-800 rounded-xl p-6 border border-zinc-700">
          <h3 className="text-lg font-bold text-white mb-4">추천 획득방법</h3>
          <ol className="space-y-3 text-sm text-zinc-300">
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold">1)</span>
              <div>
                <strong className="text-white">거래소에서 외형 장비 구입</strong>
                <p className="text-zinc-400">여유되면 추출장비도 구매 후 분해</p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold">2)</span>
              <div>
                <strong className="text-white">검은구름 무역단에서 외형 구입 (1시간 갱신)</strong>
                <p className="text-zinc-400">전승(파랑)은 보이는 대로 구입 / 희귀(초록)/일반(하양)/외형 상자는 할인율이 높으면 구입 (중복도 합성용으로)</p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold">3)</span>
              <div>
                <strong className="text-white">탐험/원정/성역에서 얻은 장비 분해</strong>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold">4)</span>
              <div>
                <strong className="text-white">합성</strong>
              </div>
            </li>
          </ol>
        </div>

        <div className="mt-4 text-center text-xs text-zinc-500">
          출처: <a href="https://www.inven.co.kr/board/aion2/6444/985" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">인벤</a> | 수시로 업데이트 중
        </div>
      </main>
    </div>
  );
}
