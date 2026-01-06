'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'boss'>('daily');

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 길드
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">길드원</Link>
            <Link href="/schedule" className="text-amber-400">일정</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">일정표</h1>
          <p className="text-zinc-400 mt-1">아이온2 컨텐츠 스케줄</p>
        </div>

        {/* 초기화 시간 안내 */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⏰</span>
            <span className="font-bold text-amber-400">초기화 시간</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">일일 초기화:</span>
              <span className="text-white ml-2 font-bold">매일 05:00</span>
            </div>
            <div>
              <span className="text-zinc-400">주간 초기화:</span>
              <span className="text-white ml-2 font-bold">수요일 05:00</span>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            일일 컨텐츠
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            주간 컨텐츠
          </button>
          <button
            onClick={() => setActiveTab('boss')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'boss'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            필드보스
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
          {activeTab === 'daily' && <DailyContent />}
          {activeTab === 'weekly' && <WeeklyContent />}
          {activeTab === 'boss' && <FieldBossContent />}
        </div>

        {/* 시간별 컨텐츠 */}
        <section className="bg-zinc-800 rounded-xl border border-zinc-700 p-6 mt-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🕐</span> 시간별 컨텐츠
          </h2>
          <div className="space-y-3">
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold">슈고 페스타</span>
                  <span className="text-zinc-400 text-sm ml-2">미니게임</span>
                </div>
                <span className="text-white font-mono">매시 15분, 45분</span>
              </div>
              <p className="text-zinc-500 text-sm mt-1">참여만 해도 어비스 포인트 160+ 획득</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-400 font-bold">원정 보상 충전</span>
                  <span className="text-zinc-400 text-sm ml-2">정복 난이도</span>
                </div>
                <span className="text-white font-mono">05:00 / 13:00 / 21:00</span>
              </div>
              <p className="text-zinc-500 text-sm mt-1">하루 3회 보상 획득 가능</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-red-400 font-bold">차원 침공</span>
                  <span className="text-zinc-400 text-sm ml-2">PvE 이벤트</span>
                </div>
                <span className="text-white font-mono">특정 시간 정각</span>
              </div>
              <p className="text-zinc-500 text-sm mt-1">맵에 알림 확인</p>
            </div>
          </div>
        </section>

        {/* 성역 루드라 */}
        <section className="bg-gradient-to-r from-purple-900/30 to-zinc-800 rounded-xl border border-purple-500/30 p-6 mt-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚔️</span> 성역: 루드라
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">주간 입장 횟수</span>
                <span className="text-white font-bold">4회</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">제한 시간</span>
                <span className="text-white font-bold">1시간 / 회</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">최소 아이템 레벨</span>
                <span className="text-white font-bold">2,700</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">권장 아이템 레벨</span>
                <span className="text-amber-400 font-bold">3,200+</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">인원</span>
                <span className="text-white font-bold">8인 (2파티)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">막보 큐브</span>
                <span className="text-white font-bold">주 2회</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">네임드 보상</span>
                <span className="text-green-400 font-bold">매 처치시</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">초기화</span>
                <span className="text-white font-bold">수요일 05:00</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <p className="text-sm text-zinc-400">
              <span className="text-purple-400">📌</span> 1페 라후 → 2페 케투 → 3페 루드라 (총 3보스)
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-zinc-500 text-sm">
          <p>사계 길드 · AION2 지켈 서버 (마족)</p>
        </div>
      </footer>
    </div>
  );
}

function DailyContent() {
  const dailyContents = [
    { name: '사명 임무', count: '5회', reward: '유일 장비 확률', color: 'text-green-400' },
    { name: '악몽 던전', count: '2회', reward: '몽환의 파편', color: 'text-purple-400' },
    { name: '초월 던전', count: '2회', reward: '돌파석 조각, 아르카나', color: 'text-cyan-400' },
    { name: '원정 (정복)', count: '3회', reward: '05/13/21시 충전', color: 'text-blue-400' },
    { name: '긴급 어비스 보급', count: '1회', reward: '어비스 포인트', color: 'text-red-400' },
    { name: '검은 구름 무역단', count: '시간별', reward: '골드, 재화', color: 'text-yellow-400' },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">일일 컨텐츠 (매일 05:00 초기화)</h3>
      <div className="space-y-3">
        {dailyContents.map((content, idx) => (
          <div key={idx} className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`font-bold ${content.color}`}>{content.name}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{content.count}</div>
              <div className="text-zinc-500 text-xs">{content.reward}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyContent() {
  const weeklyContents = [
    { name: '성역 (루드라)', count: '4회', reward: '최상급 장비', color: 'text-purple-400' },
    { name: '일일 던전 (미지의 틈새)', count: '7회', reward: '달성도 보상', color: 'text-blue-400' },
    { name: '각성전', count: '3회', reward: '실렌티움, 데비니온', color: 'text-cyan-400' },
    { name: '토벌전', count: '3회', reward: '마석/영석 상자', color: 'text-green-400' },
    { name: '어비스 시간', count: '7시간', reward: '멤버십 14시간', color: 'text-red-400' },
    { name: '시즌 주간 보상', count: '-', reward: '랭킹 보상', color: 'text-amber-400' },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">주간 컨텐츠 (수요일 05:00 초기화)</h3>
      <div className="space-y-3">
        {weeklyContents.map((content, idx) => (
          <div key={idx} className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`font-bold ${content.color}`}>{content.name}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{content.count}</div>
              <div className="text-zinc-500 text-xs">{content.reward}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-amber-300 text-sm">
          ⚠️ 산들바람 상회 특수 물품은 <span className="font-bold">일요일 자정</span>에 초기화
        </p>
      </div>
    </div>
  );
}

function FieldBossContent() {
  const bosses = [
    {
      faction: '마족',
      bosses: [
        { name: '녹아내린 다나르', location: '드레드기온 추락지', respawn: '1시간' },
        { name: '어둠의 타크라', location: '이름없는 묘지', respawn: '1시간' },
        { name: '절망의 에탄', location: '고대 연구 단지', respawn: '1시간' },
        { name: '군단장 라그타', location: '불멸의 요새', respawn: '24시간' },
        { name: '불멸의 가르투아', location: '불멸의 섬', respawn: '24시간' },
      ]
    },
    {
      faction: '어비스',
      bosses: [
        { name: '감시자 카이라', location: '에레슈란타 하층', respawn: '1시간' },
        { name: '정령왕 아그로', location: '시엘의 날개 군도', respawn: '12시간' },
        { name: '수호신장 나흐마', location: '어비스', respawn: '주말' },
      ]
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">필드보스 리젠 시간</h3>

      {bosses.map((group, idx) => (
        <div key={idx} className="mb-6 last:mb-0">
          <h4 className={`font-bold mb-3 ${
            group.faction === '마족' ? 'text-red-400' : 'text-purple-400'
          }`}>
            {group.faction} 진영
          </h4>
          <div className="space-y-2">
            {group.bosses.map((boss, bIdx) => (
              <div key={bIdx} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{boss.name}</div>
                  <div className="text-zinc-500 text-xs">{boss.location}</div>
                </div>
                <div className={`font-bold ${
                  boss.respawn === '1시간' ? 'text-green-400' :
                  boss.respawn === '12시간' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {boss.respawn}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 p-3 bg-zinc-900 rounded-lg">
        <p className="text-zinc-400 text-sm">
          📌 리젠 시간은 처치 후 기준이며, 실제 스폰은 ±10분 오차 있음
        </p>
        <p className="text-zinc-400 text-sm mt-1">
          📌 보스 스폰 시 맵에 아이콘 표시됨
        </p>
      </div>
    </div>
  );
}
