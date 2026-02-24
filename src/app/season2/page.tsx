'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AlertBar from '../components/AlertBar';

// D-Day 계산 함수
function getDDay() {
  const target = new Date('2026-01-21T00:00:00+09:00');
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-Day';
  return '시즌2 진행중';
}

const DUNGEON_TYPES = [
  {
    name: '원정',
    icon: '🏰',
    color: 'amber',
    desc: '4인 파티 던전',
    details: [
      '탐험(쉬움) / 정복(어려움) 난이도',
      '티켓 소모, 회차 제한 있음',
      '장비 및 재화 획득 메인 콘텐츠',
    ],
  },
  {
    name: '토벌전',
    icon: '⚔️',
    color: 'red',
    desc: '4인 보스 레이드',
    details: [
      '제한된 부활 횟수 내 클리어',
      '고정 보스 패턴 학습 필요',
      '고급 장비 및 재화 보상',
    ],
  },
  {
    name: '각성전',
    icon: '💀',
    color: 'purple',
    desc: '제한 시간 보스전',
    details: [
      '주간 로테이션 보스',
      '제한 시간 내 처치 필요',
      '각성 재료 및 고급 보상',
    ],
  },
  {
    name: '초월',
    icon: '🔥',
    color: 'orange',
    desc: '랭킹 경쟁 던전',
    details: [
      '1~10단계 난이도 선택',
      '일일 2회 입장 제한',
      '클래스별 랭킹 시스템',
    ],
  },
  {
    name: '성역',
    icon: '👑',
    color: 'yellow',
    desc: '8인 엔드게임 레이드',
    details: [
      '최상위 난이도 콘텐츠',
      '8인 협동 플레이 필수',
      '최고급 장비 드롭',
    ],
  },
  {
    name: '악몽',
    icon: '😈',
    color: 'pink',
    desc: '보스 러쉬',
    details: [
      '연속 보스 처치',
      '일일 2회 무료 입장',
      '보스별 순차 도전',
    ],
  },
];

const NEW_DUNGEONS = [
  {
    date: '1/21',
    type: '원정',
    name: '죽은 드라마타의 둥지',
    difficulty: '탐험 (어려움 2/18)',
    boss: '드라마타',
    desc: '고대 용의 둥지에서 벌어지는 사투',
    color: 'cyan',
    status: 'live',
  },
  {
    date: '1/21',
    type: '토벌전',
    name: '죽은 오르쿠스의 심장 / 파프나이트 제련소',
    difficulty: '주간 로테이션',
    boss: '오르쿠스 / 파프나이트 (4마리)',
    desc: '두 던전이 번갈아 등장',
    color: 'red',
    status: 'live',
  },
  {
    date: '1/21',
    type: '각성전',
    name: '궤적 보관소',
    difficulty: '주간 로테이션',
    boss: '클라우디아',
    desc: '새로운 각성전 던전',
    color: 'purple',
    status: 'live',
  },
  {
    date: '1/21',
    type: '각성전',
    name: '폭군의 은신처',
    difficulty: '주간 로테이션',
    boss: '메녹스',
    desc: '새로운 각성전 던전',
    color: 'purple',
    status: 'live',
  },
  {
    date: '1/28',
    type: '원정',
    name: '무의 요람',
    difficulty: '탐험 (어려움 2/18)',
    boss: '고뇌하는 바카르마',
    desc: '허무의 근원지에서의 탐험',
    color: 'cyan',
    status: 'live',
  },
  {
    date: '2/25',
    type: '초월',
    name: '가라앉은 생명의 신전',
    difficulty: '1~10단계',
    boss: '가라앉은 에몬',
    desc: '수몰된 고대 신전의 비밀',
    color: 'orange',
    status: 'upcoming',
  },
  {
    date: '3/11',
    type: '성역',
    name: '침식의 정화소',
    difficulty: '8인 레이드',
    boss: '중합체 바고트',
    desc: '최상위 엔드게임 레이드',
    color: 'yellow',
    status: 'upcoming',
  },
];

const ARCANA_SETS = [
  { name: '죽음', icon: '💀', effect: '피해 증가 · 생존력 감소', color: 'text-gray-300' },
  { name: '전쟁', icon: '⚔️', effect: '공격 특화 · 전투 지속력', color: 'text-red-400' },
  { name: '신비', icon: '✨', effect: '마법 강화 · 정신력 증가', color: 'text-purple-400' },
  { name: '자유', icon: '🕊️', effect: '이동 속도 · 회피 특화', color: 'text-cyan-400' },
  { name: '일격', icon: '⚡', effect: '치명타 특화 · 폭딜', color: 'text-yellow-400' },
];

export default function Season2Page() {
  const [dDay, setDDay] = useState(getDDay());

  useEffect(() => {
    // 자정에 D-Day 업데이트
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setDDay(getDDay());
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [dDay]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <AlertBar />
      {/* 히어로 섹션 - 더 화려하게 */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-indigo-900/30 to-zinc-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>사계 레기온</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-bold px-4 py-1.5 rounded-full animate-pulse">
                  2026.01.21 START
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded border ${
                  dDay === '시즌2 진행중'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {dDay}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                AION2
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  SEASON 2
                </span>
              </h1>

              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                새로운 던전, 새로운 아르카나, 새로운 도전
                <br />
                <span className="text-zinc-500">모든 랭킹이 초기화되고 새 시즌이 시작됩니다</span>
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://aion2.plaync.com/ko-kr/conts/260116_update"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105"
                >
                  공식 안내 보기 →
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '신규 원정', value: '2종', icon: '🏰', color: 'from-amber-500/20 to-amber-600/10' },
                { label: '신규 토벌전', value: '2종', icon: '⚔️', color: 'from-red-500/20 to-red-600/10' },
                { label: '신규 각성전', value: '2종', icon: '💀', color: 'from-purple-500/20 to-purple-600/10' },
                { label: '신규 아르카나', value: '천칭', icon: '⚜️', color: 'from-cyan-500/20 to-cyan-600/10' },
                { label: '신규 초월', value: '1종', icon: '🔥', color: 'from-orange-500/20 to-orange-600/10' },
                { label: '신규 성역', value: '1종', icon: '👑', color: 'from-yellow-500/20 to-yellow-600/10' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br ${stat.color} backdrop-blur border border-zinc-700/50 rounded-xl p-4 hover:border-zinc-600 transition-colors`}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-zinc-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 서버 매칭 - 지켈 vs 시엘 */}
      <section className="bg-gradient-to-r from-red-950/30 via-zinc-900 to-cyan-950/30 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-red-900/30 to-cyan-900/30 rounded-2xl p-6 md:p-8 border border-zinc-700">
            <div className="text-center mb-6">
              <span className="bg-amber-500 text-zinc-900 text-xs font-bold px-3 py-1 rounded">시즌2 3차매칭</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-3">서버 매칭 변경</h2>
              <p className="text-zinc-500 text-xs mt-2">2/25 업데이트 적용</p>
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* 지켈 */}
              <div className="text-center flex-1">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600/30 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-500">
                  <span className="text-2xl md:text-3xl">😈</span>
                </div>
                <div className="text-red-400 font-bold text-lg md:text-xl">지켈</div>
                <div className="text-zinc-500 text-sm">마족</div>
                <div className="mt-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-1 rounded inline-block">
                  사계 레기온
                </div>
              </div>

              {/* VS */}
              <div className="text-4xl md:text-5xl font-black text-zinc-600">VS</div>

              {/* 네자칸 */}
              <div className="text-center flex-1">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-600/30 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-cyan-500">
                  <span className="text-2xl md:text-3xl">😇</span>
                </div>
                <div className="text-cyan-400 font-bold text-lg md:text-xl">네자칸</div>
                <div className="text-zinc-500 text-sm">천족</div>
              </div>
            </div>

            <div className="text-center mt-6 space-y-2">
              <p className="text-zinc-400 text-sm">
                3차 매칭으로 지켈 서버는 천족 <span className="text-cyan-400">네자칸</span> 서버와 매칭됩니다
              </p>
              <p className="text-zinc-600 text-xs">
                1차 시엘 → 2차 이스라펠 → 3차 네자칸
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 던전 유형 가이드 */}
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              ⚔️ 던전 유형 가이드
            </h2>
            <p className="text-zinc-400">각 던전 유형의 특성과 플레이 방식</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DUNGEON_TYPES.map((dungeon, i) => (
              <div
                key={i}
                className={`bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 hover:border-${dungeon.color}-500/50 transition-all group`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{dungeon.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {dungeon.name}
                    </h3>
                    <p className="text-zinc-500 text-sm">{dungeon.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {dungeon.details.map((detail, j) => (
                    <li key={j} className="text-zinc-400 text-sm flex items-start gap-2">
                      <span className="text-zinc-600 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 신규 던전 상세 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              🆕 시즌2 신규 던전
            </h2>
            <p className="text-zinc-400">새롭게 추가되는 던전과 보스 정보</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {NEW_DUNGEONS.map((dungeon, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br from-${dungeon.color}-900/20 to-zinc-900/50 border border-${dungeon.color}-500/30 rounded-xl p-5 hover:border-${dungeon.color}-500/50 transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`bg-${dungeon.color}-600/30 text-${dungeon.color}-400 text-xs font-bold px-2 py-1 rounded`}>
                      {dungeon.type}
                    </span>
                    <span className="bg-zinc-700 text-zinc-300 text-xs font-bold px-2 py-1 rounded">
                      {dungeon.date}
                    </span>
                    {dungeon.status === 'live' ? (
                      <span className="bg-green-600/30 text-green-400 text-xs font-bold px-2 py-1 rounded animate-pulse">
                        LIVE
                      </span>
                    ) : (
                      <span className="bg-zinc-600/30 text-zinc-400 text-xs font-bold px-2 py-1 rounded">
                        예정
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500 text-xs">{dungeon.difficulty}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{dungeon.name}</h3>
                <p className="text-zinc-400 text-sm mb-3">{dungeon.desc}</p>

                <div className="flex items-center gap-2 pt-3 border-t border-zinc-700/50">
                  <span className="text-zinc-500 text-xs">보스</span>
                  <span className="text-amber-400 font-medium text-sm">{dungeon.boss}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 업데이트 타임라인 */}
      <section className="bg-zinc-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              📅 업데이트 로드맵
            </h2>
            <p className="text-zinc-400">시즌2 컨텐츠 순차 오픈 일정</p>
          </div>

          <div className="relative">
            {/* 타임라인 라인 */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-500" />

            <div className="space-y-8">
              {/* 1/21 - LIVE */}
              <div className="relative flex items-start gap-8 md:justify-center">
                <div className="hidden md:block w-1/2 text-right pr-8">
                  <div className="bg-gradient-to-r from-cyan-600/20 to-cyan-600/5 rounded-xl p-4 inline-block text-left border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-cyan-400 font-bold">시즌2 시작</span>
                      <span className="bg-green-600/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                    <ul className="text-zinc-400 text-sm space-y-1">
                      <li>• 랭킹 전체 초기화</li>
                      <li>• 서버 매칭 시스템</li>
                      <li>• 어비스 중층 오픈</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10 ring-4 ring-zinc-950">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <div className="md:w-1/2 pl-12 md:pl-8">
                  <span className="text-cyan-400 font-bold text-lg">1월</span>
                  <div className="md:hidden bg-cyan-600/20 rounded-lg p-3 mt-2 border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-300 font-medium text-sm">시즌2 시작</span>
                      <span className="bg-green-600/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1/28 - LIVE */}
              <div className="relative flex items-start gap-8 md:justify-center">
                <div className="hidden md:block w-1/2 text-right pr-8" />
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10 ring-4 ring-zinc-950">
                  <span className="text-[10px] font-bold text-white">✓</span>
                </div>
                <div className="md:w-1/2 pl-12 md:pl-8">
                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 font-medium text-sm">신규 원정: 무의 요람</span>
                      <span className="bg-green-600/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2/11 - LIVE */}
              <div className="relative flex items-start gap-8 md:justify-center">
                <div className="hidden md:block w-1/2 text-right pr-8">
                  <div className="bg-purple-600/20 rounded-lg p-3 border border-green-500/30">
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <span className="text-purple-300 font-medium text-sm">균열 지대 + 시스템 개선</span>
                      <span className="bg-green-600/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                    <ul className="text-zinc-400 text-xs space-y-1 text-right">
                      <li>• 신규 PvPvE 균열 지대</li>
                      <li>• 토벌전 최소 기여도 도입</li>
                      <li>• 어비스 PVP 포인트만 랭킹 반영</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10 ring-4 ring-zinc-950">
                  <span className="text-[10px] font-bold text-white">✓</span>
                </div>
                <div className="md:w-1/2 pl-12 md:pl-8">
                  <span className="text-purple-400 font-bold text-lg">2월</span>
                  <div className="md:hidden bg-purple-600/20 rounded-lg p-3 mt-2 border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-300 font-medium text-sm">균열 지대 + 시스템 개선</span>
                      <span className="bg-green-600/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2/18 - LIVE */}
              <div className="relative flex items-start gap-8 md:justify-center">
                <div className="hidden md:block w-1/2 text-right pr-8">
                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-green-500/30">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-zinc-300 font-medium text-sm">원정 어려움 난이도 추가</span>
                      <span className="bg-green-600/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10 ring-4 ring-zinc-950">
                  <span className="text-[10px] font-bold text-white">✓</span>
                </div>
                <div className="md:w-1/2 pl-12 md:pl-8 md:hidden">
                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 font-medium text-sm">원정 어려움 난이도</span>
                      <span className="bg-green-600/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2/25 - 대규모 업데이트 */}
              <div className="relative flex items-start gap-8 md:justify-center">
                <div className="hidden md:block w-1/2 text-right pr-8">
                  <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-lg p-3 border border-orange-500/30">
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <span className="text-orange-300 font-medium text-sm">100일 대규모 업데이트</span>
                      <span className="bg-orange-600/30 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">NEW!</span>
                    </div>
                    <ul className="text-zinc-400 text-xs space-y-1 text-right">
                      <li>• 초월: 가라앉은 생명의 신전</li>
                      <li>• 3차 서버 매칭 적용</li>
                      <li>• PvP 랭킹 포인트 감소 완화</li>
                      <li>• 100일 기념 이벤트</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center z-10 ring-4 ring-zinc-950 animate-pulse">
                  <span className="text-[10px] font-bold text-white">25</span>
                </div>
                <div className="md:w-1/2 pl-12 md:pl-8">
                  <span className="hidden md:inline text-orange-400 font-bold text-lg">2/25</span>
                  <div className="md:hidden bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-lg p-3 mt-2 border border-orange-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-300 font-medium text-sm">100일 대규모 업데이트</span>
                      <span className="bg-orange-600/30 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">NEW!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3월 - 혼돈의 어비스 */}
              <div className="relative flex items-start gap-8 md:justify-center">
                <div className="hidden md:block w-1/2 text-right pr-8">
                  <div className="bg-red-600/20 rounded-lg p-3 border border-red-500/30">
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <span className="text-red-300 font-medium text-sm">혼돈의 어비스</span>
                      <span className="bg-red-600/30 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">예정</span>
                    </div>
                    <ul className="text-zinc-400 text-xs space-y-1 text-right">
                      <li>• 종족 무관 매칭 시스템</li>
                      <li>• 천족 vs 천족, 마족 vs 마족 가능</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center z-10 ring-4 ring-zinc-950">
                  <span className="text-[10px] font-bold text-white">3</span>
                </div>
                <div className="md:w-1/2 pl-12 md:pl-8">
                  <span className="text-red-400 font-bold text-lg">3월</span>
                  <div className="md:hidden bg-red-600/20 rounded-lg p-3 mt-2 border border-red-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-red-300 font-medium text-sm">혼돈의 어비스</span>
                      <span className="bg-red-600/30 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">예정</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3/11 - 성역 */}
              <div className="relative flex items-start gap-8 md:justify-center">
                <div className="hidden md:block w-1/2 text-right pr-8" />
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center z-10 ring-4 ring-zinc-950">
                  <span className="text-[10px] font-bold text-white">11</span>
                </div>
                <div className="md:w-1/2 pl-12 md:pl-8">
                  <div className="bg-yellow-600/20 rounded-lg p-3 border border-yellow-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 font-medium text-sm">성역: 침식의 정화소 (8인 레이드)</span>
                      <span className="bg-yellow-600/30 text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded">예정</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 아르카나 섹션 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              ⚜️ 신규 아르카나: 천칭
            </h2>
            <p className="text-zinc-400">새로운 아르카나 슬롯과 5종의 세트 추가</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/20 via-zinc-900 to-indigo-900/20 rounded-2xl p-8 border border-amber-500/20">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 천칭 설명 */}
              <div className="space-y-6">
                <div className="bg-zinc-800/50 rounded-xl p-6 border border-amber-500/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-3xl">
                      ⚖️
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-amber-400">천칭 (Libra)</h3>
                      <p className="text-zinc-400">신규 아르카나 슬롯</p>
                    </div>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    기존 아르카나 시스템에 새로운 <span className="text-amber-400 font-medium">천칭 슬롯</span>이 추가됩니다.
                    5종의 신규 아르카나 세트를 수집하고 조합하여 더욱 강력한 캐릭터를 만들어보세요.
                  </p>
                </div>

                <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700">
                  <h4 className="text-white font-semibold mb-3">획득 방법</h4>
                  <ul className="text-zinc-400 text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      시즌2 신규 던전 드롭
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      어비스 중층 보상
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      시즌 업적 보상
                    </li>
                  </ul>
                </div>
              </div>

              {/* 세트 목록 */}
              <div>
                <h4 className="text-white font-semibold mb-4">신규 아르카나 세트 (5종)</h4>
                <div className="space-y-3">
                  {ARCANA_SETS.map((set, i) => (
                    <div
                      key={i}
                      className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 transition-colors flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-2xl">
                        {set.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-bold ${set.color}`}>{set.name}</h5>
                        <p className="text-zinc-500 text-sm">{set.effect}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 어비스 개편 */}
      <section className="bg-gradient-to-b from-indigo-950/30 to-zinc-950 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              ⚔️ 어비스 대규모 개편
            </h2>
            <p className="text-zinc-400">PvP 콘텐츠의 새로운 시작</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-600/20 to-zinc-900 border border-indigo-500/30 rounded-xl p-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                🏔️
              </div>
              <h3 className="text-indigo-400 font-bold text-xl mb-2">어비스 중층</h3>
              <p className="text-zinc-300 text-sm mb-4">1월 21일 오픈</p>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li>• 아이템 레벨 입장 제한</li>
                <li>• 고급 장비 유저 경쟁전</li>
                <li>• 새로운 어비스 보상</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-zinc-900 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                  🌀
                </div>
                <span className="bg-green-600/30 text-green-400 text-xs font-bold px-2 py-1 rounded">LIVE</span>
              </div>
              <h3 className="text-purple-400 font-bold text-xl mb-2">균열 지대</h3>
              <p className="text-zinc-300 text-sm mb-4">2월 11일 오픈</p>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li>• 신규 PvPvE 콘텐츠</li>
                <li>• 패배 측 마을에 시공의 균열 오픈</li>
                <li>• 독점 보상 시스템</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-600/20 to-zinc-900 border border-cyan-500/30 rounded-xl p-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                ⚙️
              </div>
              <h3 className="text-cyan-400 font-bold text-xl mb-2">시스템 개선</h3>
              <p className="text-zinc-300 text-sm mb-4">1월 21일 적용</p>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li>• <span className="text-cyan-300">주간 AP 제한 폐지</span></li>
                <li>• AP 시즌 총량제로 변경</li>
                <li>• 3:0 패배 시 회랑 바로 입장</li>
                <li>• 공명전 매칭 최적화</li>
                <li>• 어비스 장비 세트효과 추가</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                <p className="text-cyan-400 text-xs font-medium mb-2">2/11 추가 적용</p>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• <span className="text-yellow-400">PVP 포인트만 랭킹 반영</span></li>
                  <li>• 토벌전 최소 기여도 필요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 악몽 보스 7종 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              😈 시즌2 악몽 보스 7종
            </h2>
            <p className="text-zinc-400">시즌1 보스 유지 + 신규 보스 7종 추가</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: '변이된 올고른', icon: '🦎', color: 'from-green-600/20' },
              { name: '영혼수확자 라트만', icon: '💀', color: 'from-gray-600/20' },
              { name: '분노한 레다', icon: '😠', color: 'from-red-600/20' },
              { name: '교도관 산트라스', icon: '⛓️', color: 'from-purple-600/20' },
              { name: '날카로운 울라크', icon: '🗡️', color: 'from-cyan-600/20' },
              { name: '봉인된 수라', icon: '🔒', color: 'from-indigo-600/20' },
              { name: '카이시넬의 환영', icon: '👻', color: 'from-amber-600/20' },
            ].map((boss, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${boss.color} to-zinc-900 border border-zinc-700 rounded-xl p-4 hover:border-zinc-500 transition-all text-center`}
              >
                <span className="text-3xl mb-2 block">{boss.icon}</span>
                <span className="text-white font-medium text-sm">{boss.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 text-center">
            <p className="text-zinc-400 text-sm">
              💡 <span className="text-amber-400">카이시넬의 환영</span> - 악몽 상점 필수템!
            </p>
          </div>
        </div>
      </section>

      {/* 적용 완료 업데이트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              ✅ 사전 업데이트 완료
            </h2>
            <p className="text-zinc-400">시즌2 시작 전 이미 적용된 변경사항</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-600 text-white text-sm font-bold px-3 py-1.5 rounded">1/7</span>
                <h3 className="text-green-400 font-bold text-lg">펫 시스템 대규모 개편</h3>
              </div>
              <ul className="text-zinc-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>종족 이해도 & 펫 보유 → <span className="text-white">서버 내 캐릭터 공유</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>모든 캐릭터 펫 레벨 합산 적용</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>필요 영혼 수량 <span className="text-red-400">50% 하향</span></span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-800/30 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-600 text-white text-sm font-bold px-3 py-1.5 rounded">1/14</span>
                <h3 className="text-green-400 font-bold text-lg">펫 스탯 밸런스 조정</h3>
              </div>
              <ul className="text-zinc-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>펫 레벨 달성 스탯 <span className="text-red-400">약 50% 하향</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>통합 프리셋에 타이틀, 아르카나 추가</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>UI/UX 편의성 개선</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 시즌2 클래스 밸런스 */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              ⚔️ 클래스 밸런스 조정
            </h2>
            <p className="text-zinc-400">2/3 라이브 발표 · 2~3주 간격 추가 조정 예정</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: '마도성', icon: '🔮', change: '상향', color: 'green', desc: '딜링 효율 개선' },
              { name: '정령성', icon: '🌿', change: '상향', color: 'green', desc: '소환수 강화' },
              { name: '살성', icon: '🗡️', change: '상향', color: 'green', desc: '암살 스킬 버프' },
              { name: '치유성', icon: '💚', change: '상향', color: 'green', desc: '보호의 빛 피해 증폭 추가' },
              { name: '궁성', icon: '🏹', change: '상향', color: 'green', desc: '원거리 딜링 개선' },
              { name: '호법성', icon: '🛡️', change: '하향', color: 'red', desc: '밸런스 조정' },
            ].map((cls, i) => (
              <div
                key={i}
                className={`bg-zinc-800/50 border rounded-xl p-4 ${
                  cls.change === '상향' ? 'border-green-500/30' : 'border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{cls.icon}</span>
                  <div className="flex-1">
                    <span className="text-white font-bold">{cls.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    cls.change === '상향'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {cls.change}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm">{cls.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-900/20 rounded-xl border border-amber-500/30 text-center">
            <p className="text-amber-400 text-sm">
              💡 클래스 변경권 도입 재검토 중 (커뮤니티 반응 수렴 중)
            </p>
          </div>
        </div>
      </section>

      {/* 시즌2 주요 시스템 변경 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              💰 시즌2 주요 시스템
            </h2>
            <p className="text-zinc-400">시즌 재화 및 장비 시스템 변경사항</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 맹세의 주화 */}
            <div className="bg-gradient-to-br from-amber-900/20 to-zinc-900 rounded-xl p-6 border border-amber-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center text-3xl">
                  🪙
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold text-xl">맹세의 주화</h3>
                  <p className="text-zinc-500 text-sm">시즌 전용 재화</p>
                </div>
              </div>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">⚠</span>
                  <span><span className="text-red-400 font-medium">시즌1 주화는 시즌2 시작 시 사용 불가</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>시즌2 전용 맹세의 주화 새로 지급</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>시즌 상점에서 성장/편의 아이템 구매</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
                <div className="text-xs text-zinc-500 mb-2">추천 구매 (시즌1 주화 소진용)</div>
                <div className="text-zinc-300 text-sm">분노의 사념/의지/자아, 격돌의 룬 상자</div>
              </div>
            </div>

            {/* 장비 계승 */}
            <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-3xl">
                  ⚗️
                </div>
                <div>
                  <h3 className="text-purple-400 font-bold text-xl">장비 계승 시스템</h3>
                  <p className="text-zinc-500 text-sm">영혼 각인 옵션 이전</p>
                </div>
              </div>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>동일 등급 장비 간 계승 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>강화, 돌파, 조율 옵션 이전 (마석/신석 제외)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>첫 계승 100% 확률, 이후 확률 감소</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-green-400">실패해도 원본 장비 유지 (재료만 소모)</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
                <div className="text-xs text-zinc-500 mb-2">추천 계승 순서</div>
                <div className="text-zinc-300 text-sm">무기 → 가더 → 상의 → 장갑</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 편의성 업데이트 */}
      <section className="bg-zinc-900/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              🛠️ 편의성 업데이트
            </h2>
            <p className="text-zinc-400">시즌2와 함께 적용되는 편의 기능</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🎫', title: '티켓 시스템 변경', desc: '원정/초월 티켓 차감 방식 개선', badge: '편의' },
              { icon: '🏆', title: '클래스별 랭킹', desc: '각성전/일일던전 클래스 랭킹 도입', badge: '신규' },
              { icon: '🛡️', title: '방어구 조율', desc: '방어구에 조율 옵션 추가', badge: '신규' },
              { icon: '⚡', title: '즉시완료권', desc: '일일던전/각성전/악몽 즉시 완료', badge: '신규' },
              { icon: '💰', title: '거래소 개선', desc: '서버/월드 최저가 비교 기능', badge: '편의' },
              { icon: '📊', title: '통합 프리셋', desc: '타이틀, 아르카나 프리셋 포함', badge: '편의' },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 hover:border-zinc-600 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.badge === '신규' ? 'bg-cyan-500/20 text-cyan-400' :
                    item.badge === '예정' ? 'bg-yellow-500/20 text-yellow-400' :
                    item.badge === '밸런스' ? 'bg-red-500/20 text-red-400' :
                    'bg-zinc-700 text-zinc-400'
                  }`}>{item.badge}</span>
                </div>
                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                <p className="text-zinc-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 혼돈의 어비스 - 3월 예정 */}
      <section className="py-16 bg-gradient-to-b from-red-950/20 to-zinc-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="bg-red-600/30 text-red-400 text-xs font-bold px-3 py-1 rounded">3월 예정</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              🌀 혼돈의 어비스
            </h2>
            <p className="text-zinc-400">종족 불균형 해소를 위한 새로운 매칭 시스템</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/20 via-zinc-900 to-purple-900/20 rounded-2xl p-8 border border-red-500/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-red-400">종족 무관 매칭</h3>
                <ul className="text-zinc-400 text-sm space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>천족 vs 천족, 마족 vs 마족 매칭 가능</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>서버 매칭이 종족 구분 없이 진행</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>시공의 균열 매칭도 무작위화</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>상대 종족 간 채팅 불가</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-amber-400">변경 사항</h3>
                <ul className="text-zinc-400 text-sm space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>승리 회랑 / 패배 버프 시스템 제거</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>인구 편중 문제 해소 목적</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 향후 계획 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              🔮 2026년 향후 로드맵
            </h2>
            <p className="text-zinc-400">시즌2 이후 예정된 대규모 업데이트</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-900/20 to-zinc-900 rounded-xl p-8 border border-red-500/20 text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6">
                ⚔️
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">신규 클래스</h3>
              <p className="text-zinc-400 leading-relaxed">
                새로운 전투 메커니즘과 호쾌한 스타일의
                <br />
                <span className="text-red-400 font-medium">신규 클래스</span>가 개발 중입니다
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/20 to-zinc-900 rounded-xl p-8 border border-emerald-500/20 text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6">
                🗺️
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">새로운 영지</h3>
              <p className="text-zinc-400 leading-relaxed">
                탐험할 수 있는 광활한
                <br />
                <span className="text-emerald-400 font-medium">신규 지역</span>이 준비 중입니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 py-8 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-amber-400 hover:text-amber-300 font-bold text-xl">
              사계 레기온
            </Link>
            <div className="flex items-center gap-6">
              <a
                href="https://discord.gg/KB5Ef2C37Z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Discord
              </a>
              <a
                href="https://open.kakao.com/o/gr52NRmg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 text-sm"
              >
                카카오톡
              </a>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-zinc-500 text-sm">
              AION2 지켈 서버 · 마족
            </p>
            <p className="text-zinc-600 text-xs mt-2">
              정보 출처: NCSOFT 공식 발표 · 마지막 업데이트: 2026.02.24
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
