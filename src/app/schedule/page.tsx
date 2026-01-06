'use client';

import { useState } from 'react';
import Link from 'next/link';

// 요일
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 컨텐츠 타입별 색상
const CONTENT_COLORS: Record<string, string> = {
  '루드라': 'bg-purple-600',
  '던전': 'bg-blue-600',
  '필보': 'bg-red-600',
  '쟁': 'bg-orange-600',
  '레이드': 'bg-green-600',
  '기타': 'bg-zinc-600',
};

// 고정 일정 (매주 반복)
const WEEKLY_SCHEDULE = [
  // 월요일
  { day: 1, time: '21:00', title: '루드라 트라이', type: '루드라', duration: 120 },
  // 화요일
  { day: 2, time: '21:00', title: '던전 파밍', type: '던전', duration: 90 },
  // 수요일
  { day: 3, time: '21:00', title: '루드라 트라이', type: '루드라', duration: 120 },
  // 목요일
  { day: 4, time: '21:00', title: '던전 파밍', type: '던전', duration: 90 },
  // 금요일
  { day: 5, time: '21:00', title: '자유 컨텐츠', type: '기타', duration: 120 },
  // 토요일
  { day: 6, time: '16:00', title: '루드라 트라이 (4트)', type: '루드라', duration: 240 },
  { day: 6, time: '21:00', title: '쟁/PVP', type: '쟁', duration: 120 },
  // 일요일
  { day: 0, time: '16:00', title: '레이드', type: '레이드', duration: 180 },
  { day: 0, time: '21:00', title: '쟁/PVP', type: '쟁', duration: 120 },
];

// 필드보스 시간표
const FIELD_BOSS_TIMES = [
  { time: '12:00', boss: '필드보스' },
  { time: '19:00', boss: '필드보스' },
  { time: '22:00', boss: '필드보스' },
];

export default function SchedulePage() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // 현재 주의 시작일 (일요일 기준)
  const getWeekStart = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (offset * 7);
    const weekStart = new Date(today.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  const weekStart = getWeekStart(currentWeekOffset);

  // 주간 날짜 배열 생성
  const weekDates = DAYS.map((_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  // 오늘 날짜 확인
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 해당 요일의 일정 가져오기
  const getScheduleForDay = (dayIndex: number) => {
    return WEEKLY_SCHEDULE.filter(s => s.day === dayIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 길드
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">길드원</Link>
            <Link href="/schedule" className="text-amber-400">일정</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">일정표</h1>
            <p className="text-zinc-400 mt-1">주간 레기온 일정</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg"
            >
              ◀ 이전주
            </button>
            <button
              onClick={() => setCurrentWeekOffset(0)}
              className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-2 rounded-lg font-medium"
            >
              이번주
            </button>
            <button
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg"
            >
              다음주 ▶
            </button>
          </div>
        </div>

        {/* 안내 */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 text-sm text-zinc-300">
          <p>📌 일정은 변동될 수 있으며, 정확한 일정은 <span className="text-indigo-400">디스코드</span>에서 확인해주세요.</p>
          <p className="mt-1">📌 루드라 파티 모집은 디스코드 채널에서 진행됩니다.</p>
        </div>

        {/* 주간 달력 */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden mb-8">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-zinc-700">
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`p-3 text-center border-r border-zinc-700 last:border-r-0 ${
                  isToday(date) ? 'bg-amber-500/20' : ''
                } ${index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-zinc-300'}`}
              >
                <div className="font-medium">{DAYS[index]}</div>
                <div className={`text-2xl font-bold ${isToday(date) ? 'text-amber-400' : ''}`}>
                  {date.getDate()}
                </div>
                {isToday(date) && (
                  <div className="text-xs text-amber-400 mt-1">오늘</div>
                )}
              </div>
            ))}
          </div>

          {/* 일정 내용 */}
          <div className="grid grid-cols-7 min-h-[300px]">
            {weekDates.map((date, dayIndex) => (
              <div
                key={dayIndex}
                className={`p-2 border-r border-zinc-700 last:border-r-0 ${
                  isToday(date) ? 'bg-amber-500/5' : ''
                }`}
              >
                {getScheduleForDay(dayIndex).map((schedule, idx) => (
                  <div
                    key={idx}
                    className={`${CONTENT_COLORS[schedule.type]} rounded-lg p-2 mb-2 text-xs`}
                  >
                    <div className="font-bold text-white">{schedule.time}</div>
                    <div className="text-white/90 mt-1">{schedule.title}</div>
                    <div className="text-white/60 text-[10px] mt-1">
                      {Math.floor(schedule.duration / 60)}시간 {schedule.duration % 60 > 0 ? `${schedule.duration % 60}분` : ''}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 필드보스 시간표 */}
        <section className="bg-zinc-800 rounded-xl border border-zinc-700 p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🐉</span> 필드보스 시간표
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {FIELD_BOSS_TIMES.map((fb, idx) => (
              <div key={idx} className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{fb.time}</div>
                <div className="text-zinc-300 text-sm mt-1">{fb.boss}</div>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-xs mt-4 text-center">* 필드보스 시간은 서버 상황에 따라 변동될 수 있습니다</p>
        </section>

        {/* 컨텐츠 범례 */}
        <section className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4">컨텐츠 분류</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CONTENT_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color}`}></div>
                <span className="text-zinc-300 text-sm">{type}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-zinc-500 text-sm">
          <p>사계 길드 · AION2 지켈 서버 (마족)</p>
        </div>
      </footer>
    </div>
  );
}
