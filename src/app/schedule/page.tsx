'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import AlertBar from '../components/AlertBar';
import { subscribeToBossTimers, setBossTimer, removeBossTimer, updateBossTimer, BossTimer as FirebaseBossTimer } from '@/lib/firebase';

interface BossTimer {
  bossName: string;
  endTime: number;
  respawnMinutes: number;
}

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'boss' | 'manual'>('schedule');
  const [activeBossCount, setActiveBossCount] = useState(0);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Firebase에서 활성 타이머 개수 구독
  useEffect(() => {
    const unsubscribe = subscribeToBossTimers((timers) => {
      setActiveBossCount(timers.length);
    });

    // 알림 권한 확인
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    return () => unsubscribe();
  }, []);

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            레기온관리
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/schedule" className="text-amber-400">일정</Link>
          </nav>
        </div>
      </header>
      <AlertBar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">일정표</h1>
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">아이온2 컨텐츠 스케줄</p>
        </div>

        {/* 상단 고정: 알림 설정 + 활성 타이머 */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* 알림 설정 */}
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-sm">🔔 알림:</span>
              {notificationPermission === 'granted' ? (
                <span className="text-green-400 text-sm font-medium">허용됨 ✓</span>
              ) : (
                <button
                  onClick={requestNotificationPermission}
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  알림 허용하기
                </button>
              )}
            </div>

            {/* 활성 보스 타이머 */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-sm">⏱️ 활성 타이머:</span>
              {activeBossCount > 0 ? (
                <span className="bg-amber-500 text-zinc-900 font-bold px-2 py-0.5 rounded text-sm animate-pulse">
                  {activeBossCount}개
                </span>
              ) : (
                <span className="text-zinc-500 text-sm">없음</span>
              )}
            </div>
          </div>
        </div>

        {/* 탭 3개 */}
        <div className="flex gap-1.5 sm:gap-2 mb-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            일일/주간
          </button>
          <button
            onClick={() => setActiveTab('boss')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'boss'
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            필드보스
            {activeBossCount > 0 && activeTab !== 'boss' && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {activeBossCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              activeTab === 'manual'
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            📖 매뉴얼
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 sm:p-6">
          {activeTab === 'schedule' && <ScheduleContent />}
          {activeTab === 'boss' && <FieldBossContent />}
          {activeTab === 'manual' && <ManualContent />}
        </div>
      </main>

      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-zinc-500 text-sm">
          <p>레기온관리 · AION2 지켈 서버 (마족)</p>
          <p className="text-xs text-zinc-600 mt-2">
            <Link href="/updates" className="hover:text-zinc-400">업데이트 내역</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function ScheduleContent() {
  const [personalSettings, setPersonalSettings] = useState({
    shugoFesta: true,
    riftPortal: true,
    blackCloudTrade: true,
    nahmaAlert: true,
    soundEnabled: true,
  });
  const [now, setNow] = useState(new Date());
  const [subTab, setSubTab] = useState<'daily' | 'weekly'>('daily');

  // 설정 로드
  useEffect(() => {
    const saved = localStorage.getItem('personalAlertSettings');
    if (saved) {
      try {
        setPersonalSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch {
        // ignore
      }
    }
  }, []);

  // 1초마다 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 설정 토글
  const toggleSetting = (key: keyof typeof personalSettings) => {
    setPersonalSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('personalAlertSettings', JSON.stringify(updated));
      return updated;
    });
  };

  // 다음 시간까지 남은 시간 계산
  const getTimeUntilNext = (targetMinutes: number[]) => {
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // 다음 목표 시간 찾기
    let nextTarget = targetMinutes.find(m => m > currentMinute);
    if (nextTarget === undefined) {
      nextTarget = targetMinutes[0] + 60; // 다음 시간
    }

    const diffMinutes = nextTarget - currentMinute - 1;
    const diffSeconds = 60 - currentSecond;

    if (diffSeconds === 60) {
      return `${diffMinutes + 1}:00`;
    }
    return `${diffMinutes}:${diffSeconds.toString().padStart(2, '0')}`;
  };

  // 다음 정각까지 남은 시간
  const getTimeUntilNextHour = () => {
    const mins = 59 - now.getMinutes();
    const secs = 60 - now.getSeconds();
    if (secs === 60) {
      return `${mins + 1}:00`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 다음 시공의 균열까지 남은 시간 (3시간 간격: 2,5,8,11,14,17,20,23시)
  const getTimeUntilRift = () => {
    const riftHours = [2, 5, 8, 11, 14, 17, 20, 23];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // 다음 시공 시간 찾기
    let nextRift = riftHours.find(h => h > currentHour);
    if (nextRift === undefined) {
      nextRift = riftHours[0] + 24; // 다음날 01시
    }

    const hoursUntil = nextRift - currentHour - 1;
    const minsUntil = 59 - currentMinute;
    const secsUntil = 60 - currentSecond;

    if (secsUntil === 60) {
      if (hoursUntil === -1) {
        return `${minsUntil + 1}:00`;
      }
      return `${hoursUntil}:${(minsUntil + 1).toString().padStart(2, '0')}:00`;
    }

    if (hoursUntil <= 0 && minsUntil < 60) {
      return `${minsUntil}:${secsUntil.toString().padStart(2, '0')}`;
    }

    return `${hoursUntil}:${minsUntil.toString().padStart(2, '0')}:${secsUntil.toString().padStart(2, '0')}`;
  };

  // 다음 나흐마까지 남은 시간
  const getTimeUntilNahma = () => {
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // 토요일(6) 또는 일요일(0)
    let daysUntil = 0;
    if (day === 6) { // 토요일
      if (hour < 20 || (hour === 20 && minute === 0)) {
        daysUntil = 0; // 오늘
      } else {
        daysUntil = 1; // 내일 (일요일)
      }
    } else if (day === 0) { // 일요일
      if (hour < 20 || (hour === 20 && minute === 0)) {
        daysUntil = 0; // 오늘
      } else {
        daysUntil = 6; // 다음 토요일
      }
    } else {
      // 월~금
      daysUntil = 6 - day; // 토요일까지
    }

    if (daysUntil === 0) {
      const hoursUntil = 19 - hour;
      const minsUntil = 60 - minute;
      if (hoursUntil < 0) return '종료';
      if (hoursUntil === 0 && minsUntil <= 60) {
        return `${minsUntil}분`;
      }
      return `${hoursUntil}시간 ${minsUntil}분`;
    }

    return `${daysUntil}일 후`;
  };

  const dailyContents = [
    { name: '사명 임무', count: '5회', reward: '유일 장비 확률', color: 'text-green-400' },
    { name: '악몽 던전', count: '2회', reward: '몽환의 파편', color: 'text-purple-400' },
    { name: '초월 던전', count: '2회', reward: '돌파석 조각, 아르카나', color: 'text-cyan-400' },
    { name: '원정 (정복)', count: '3회', reward: '05/13/21시 충전', color: 'text-blue-400' },
    { name: '긴급 어비스 보급', count: '1회', reward: '어비스 포인트', color: 'text-red-400' },
  ];

  const weeklyContents = [
    { name: '성역 (루드라)', count: '4회', reward: '최상급 장비', color: 'text-purple-400' },
    { name: '일일 던전 (미지의 틈새)', count: '7회', reward: '달성도 보상', color: 'text-blue-400' },
    { name: '각성전', count: '3회', reward: '실렌티움, 데비니온', color: 'text-cyan-400' },
    { name: '토벌전', count: '3회', reward: '마석/영석 상자', color: 'text-green-400' },
    { name: '어비스 시간', count: '7시간', reward: '멤버십 14시간', color: 'text-red-400' },
    { name: '시즌 주간 보상', count: '-', reward: '랭킹 보상', color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      {/* 초기화 시간 안내 */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
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

      {/* 서브탭 */}
      <div className="flex gap-2 border-b border-zinc-700 pb-2">
        <button
          onClick={() => setSubTab('daily')}
          className={`px-3 py-1.5 rounded-t-lg text-sm font-medium transition-colors ${
            subTab === 'daily'
              ? 'bg-zinc-700 text-amber-400'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          일일
        </button>
        <button
          onClick={() => setSubTab('weekly')}
          className={`px-3 py-1.5 rounded-t-lg text-sm font-medium transition-colors ${
            subTab === 'weekly'
              ? 'bg-zinc-700 text-amber-400'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          주간
        </button>
      </div>

      {/* 일일 컨텐츠 */}
      {subTab === 'daily' && (
        <>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">일일 컨텐츠</h3>
        <div className="space-y-2">
          {dailyContents.map((content, idx) => (
            <div key={idx} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
              <span className={`font-bold text-sm ${content.color}`}>{content.name}</span>
              <div className="text-right">
                <div className="text-white font-bold text-sm">{content.count}</div>
                <div className="text-zinc-500 text-xs">{content.reward}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 개인 알림 설정 */}
      <div className="pt-4 border-t border-zinc-700">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span>🔔</span> 개인 알림 설정
        </h3>
        <p className="text-zinc-500 text-xs mb-4">알림을 켜면 해당 시간에 브라우저 알림을 받습니다 (브라우저 열어둬야 함)</p>

        <div className="space-y-2">
          {/* 슈고 페스타 */}
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 font-bold text-sm">🦊 슈고 페스타</span>
                  <span className="text-zinc-500 text-xs">매시 15분, 45분</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  다음: <span className="text-orange-400 font-mono">{getTimeUntilNext([15, 45])}</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('shugoFesta')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  personalSettings.shugoFesta
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                }`}
              >
                {personalSettings.shugoFesta ? '알림 ON' : '알림 OFF'}
              </button>
            </div>
          </div>

          {/* 시공의 균열 */}
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold text-sm">🌀 시공의 균열</span>
                  <span className="text-zinc-500 text-xs">3시간 간격</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  다음: <span className="text-cyan-400 font-mono">{getTimeUntilRift()}</span>
                  <span className="text-zinc-600 ml-2">(2,5,8,11,14,17,20,23시)</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('riftPortal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  personalSettings.riftPortal
                    ? 'bg-cyan-500 text-white'
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                }`}
              >
                {personalSettings.riftPortal ? '알림 ON' : '알림 OFF'}
              </button>
            </div>
          </div>

          {/* 검은 구름 무역단 */}
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold text-sm">🌑 검은 구름 무역단</span>
                  <span className="text-zinc-500 text-xs">매시 정각 초기화</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  다음 초기화: <span className="text-yellow-400 font-mono">{getTimeUntilNextHour()}</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('blackCloudTrade')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  personalSettings.blackCloudTrade
                    ? 'bg-yellow-500 text-zinc-900'
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                }`}
              >
                {personalSettings.blackCloudTrade ? '알림 ON' : '알림 OFF'}
              </button>
            </div>
          </div>

          {/* 나흐마 */}
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold text-sm">👑 수호신장 나흐마</span>
                  <span className="text-zinc-500 text-xs">토/일 20:00</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  다음: <span className="text-purple-400 font-mono">{getTimeUntilNahma()}</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('nahmaAlert')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  personalSettings.nahmaAlert
                    ? 'bg-purple-500 text-white'
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                }`}
              >
                {personalSettings.nahmaAlert ? '알림 ON' : '알림 OFF'}
              </button>
            </div>
          </div>

          {/* 알림음 설정 */}
          <div className="bg-zinc-900 rounded-lg p-3 mt-2 border border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-300 font-bold text-sm">🔊 알림음</span>
                  <span className="text-zinc-500 text-xs">5분 전 & 시작 시 비프음</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('soundEnabled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  personalSettings.soundEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                }`}
              >
                {personalSettings.soundEnabled ? '소리 ON' : '소리 OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 시간별 컨텐츠 */}
      <div className="pt-4 border-t border-zinc-700">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🕐</span> 시간별 컨텐츠
        </h3>
        <div className="space-y-2">
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="text-purple-400 font-bold text-sm">원정 보상 충전</span>
              <span className="text-white font-mono text-xs">05:00 / 13:00 / 21:00</span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">하루 3회 보상 획득 가능</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="text-red-400 font-bold text-sm">차원 침공</span>
              <span className="text-white font-mono text-xs">특정 시간 정각</span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">맵에 알림 확인</p>
          </div>
        </div>
      </div>
        </>
      )}

      {/* 주간 컨텐츠 */}
      {subTab === 'weekly' && (
        <>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">주간 컨텐츠</h3>
            <div className="space-y-2">
              {weeklyContents.map((content, idx) => (
                <div key={idx} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                  <span className={`font-bold text-sm ${content.color}`}>{content.name}</span>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm">{content.count}</div>
                    <div className="text-zinc-500 text-xs">{content.reward}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 물질변환 */}
          <div className="pt-4 border-t border-zinc-700">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🔮</span> 물질변환
            </h3>
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-cyan-400 font-bold">오드 에너지</span>
                <span className="text-white font-bold">주 7회</span>
              </div>
              <div className="text-xs text-zinc-400 space-y-1">
                <p>📍 물질변환 → 특수 → 소모품</p>
                <p>📦 재료: 오드 25개 + 순도 높은 오드 5개 + 순수한 오드 1개</p>
                <p>💰 비용: 50,000 키나</p>
                <p>⚡ 획득: 40 에너지 × 7 = <span className="text-cyan-400 font-bold">280 에너지</span></p>
              </div>
            </div>
          </div>

          {/* 산들바람 상회 */}
          <div className="pt-4 border-t border-zinc-700">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🏪</span> 산들바람 상회 특수
            </h3>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
              <p className="text-amber-300 text-xs sm:text-sm font-bold">
                ⏰ 수요일 05:00 초기화 (주간 초기화와 동일)
              </p>
            </div>
            <div className="space-y-2">
              <div className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-cyan-400 font-bold text-sm">오드 에너지</span>
                  <p className="text-zinc-500 text-xs">40 에너지 × 7개 = 280</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">7개</div>
                  <div className="text-zinc-500 text-xs">70만 키나/개</div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-green-400 font-bold text-sm">부활의 정령석</span>
                  <p className="text-zinc-500 text-xs">던전 부활용</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">7개</div>
                  <div className="text-zinc-500 text-xs">키나 구매</div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-blue-400 font-bold text-sm">일일 던전 입장권</span>
                  <p className="text-zinc-500 text-xs">생체 연구기지 도전권</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">7개</div>
                  <div className="text-zinc-500 text-xs">키나 구매</div>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-purple-400 font-bold text-sm">어비스 균열석</span>
                  <p className="text-zinc-500 text-xs">어비스 입장</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">구매</div>
                  <div className="text-zinc-500 text-xs">키나</div>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-cyan-300 text-xs">
                💡 주간 오드 에너지 총합: 기본 840 + 물질변환 280 + 상회 280 = <span className="font-bold">1,400</span>
              </p>
            </div>
          </div>

          {/* 성역 루드라 */}
          <div className="pt-4 border-t border-zinc-700">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>⚔️</span> 성역: 루드라
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">입장 횟수</span>
                  <span className="text-white font-bold">주 4회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">제한 시간</span>
                  <span className="text-white font-bold">1시간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">최소 레벨</span>
                  <span className="text-white font-bold">2,700</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">권장 레벨</span>
                  <span className="text-amber-400 font-bold">3,200+</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">인원</span>
                  <span className="text-white font-bold">8인</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">막보 큐브</span>
                  <span className="text-white font-bold">주 2회</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">보스</span>
                  <span className="text-white font-bold">3보스</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">초기화</span>
                  <span className="text-white font-bold">수 05:00</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-3">
              📌 1페 라후 → 2페 케투 → 3페 루드라
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function FieldBossContent() {
  const [timers, setTimers] = useState<BossTimer[]>([]);
  const [now, setNow] = useState(Date.now());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [expandedMaps, setExpandedMaps] = useState<Record<string, boolean>>({ 마족: true, 천족: true, 어비스: true });

  // 관심 보스 (개인 설정, localStorage 저장)
  const [favoriteBosses, setFavoriteBosses] = useState<Set<string>>(new Set());

  // 관심 보스 로드
  useEffect(() => {
    const saved = localStorage.getItem('favoriteBosses');
    if (saved) {
      try {
        setFavoriteBosses(new Set(JSON.parse(saved)));
      } catch {
        // ignore
      }
    }
  }, []);

  // 관심 보스 토글
  const toggleFavorite = (bossName: string) => {
    setFavoriteBosses(prev => {
      const next = new Set(prev);
      if (next.has(bossName)) {
        next.delete(bossName);
      } else {
        next.add(bossName);
      }
      localStorage.setItem('favoriteBosses', JSON.stringify([...next]));
      return next;
    });
  };

  // 관심 보스 여부 확인
  const isFavorite = (bossName: string) => favoriteBosses.has(bossName);

  // 이미지 프록시 URL 생성 (size: 썸네일 크기)
  const getProxyImageUrl = (url: string, size = 300) => `/api/image-proxy?url=${encodeURIComponent(url)}&size=${size}`;

  // 지도 토글
  const toggleMap = (faction: string) => {
    setExpandedMaps(prev => ({ ...prev, [faction]: !prev[faction] }));
  };

  // 지도 이미지 (인벤 출처 + 로컬)
  const factionMaps: Record<string, { name: string; url: string; isLocal?: boolean }[]> = {
    마족: [
      { name: '전체 지도', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1112262490.jpg' },
      { name: '드레드기온 추락지', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1478740011.jpg' },
      { name: '모슬란 숲', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1537219396.jpg' },
      { name: '정화의 숲', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1696484231.jpg' },
      { name: '그리바데 구릉지', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1513789306.jpg' },
      { name: '임페투시움 광장', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1572168382.jpg' },
      { name: '불멸의 섬', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1485154320.jpg' },
    ],
    천족: [
      { name: '전체 지도', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1839745143.jpg' },
      { name: '칸타스 계곡 · 엘룬강', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1346889650.jpg' },
      { name: '톨바스 숲 · 아울라우', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1493088239.jpg' },
      { name: '아르타미아 고원', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1901406732.jpg' },
      { name: '붉은 숲 · 드라나 재배지', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1244544949.jpg' },
      { name: '영원의 섬', url: 'https://upload3.inven.co.kr/upload/2025/12/17/bbs/i1838498016.jpg' },
    ],
    어비스: [
      { name: '어비스 보스 지도', url: '/abyss-map.png', isLocal: true },
    ],
  };

  // 보스 데이터 - 12/17 이후 상시 적용 (리젠 2배 빠름)
  const bosses = [
    {
      faction: '마족',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      bosses: [
        // 30분
        { name: '녹아내린 다나르', location: '드레드기온 추락지', respawn: '30분', minutes: 30 },
        { name: '검은 전사 아에드', location: '이름없는 묘지', respawn: '30분', minutes: 30 },
        { name: '충실한 라지트', location: '성소 감시 초소', respawn: '30분', minutes: 30 },
        // 1시간
        { name: '광전사 발그', location: '성소 감시 초소', respawn: '1시간', minutes: 60 },
        // 1시간 30분
        { name: '혈전사 란나르', location: '모슬란 숲', respawn: '1시간 30분', minutes: 90 },
        // 2시간
        { name: '포식자 가르산', location: '모슬란 숲', respawn: '2시간', minutes: 120 },
        { name: '기만자 트리드', location: '우르툼헤임', respawn: '2시간', minutes: 120 },
        { name: '푸른물결 켈피나', location: '정화의 숲', respawn: '2시간', minutes: 120 },
        { name: '총감독관 누타', location: '드라낙투스', respawn: '2시간', minutes: 120 },
        // 3시간
        { name: '참모관 르사나', location: '드라낙투스', respawn: '3시간', minutes: 180 },
        { name: '별동대장 링크스', location: '바스펠트 폐허', respawn: '3시간', minutes: 180 },
        { name: '중독된 하디룬', location: '파프나이트 매장지', respawn: '3시간', minutes: 180 },
        { name: '백전노장 슈자칸', location: '검은 발톱 부락', respawn: '3시간', minutes: 180 },
        // 4시간
        { name: '모독자 노블루드', location: '바스펠트 폐허', respawn: '4시간', minutes: 240 },
        { name: '망혼의 아칸 악시오스', location: '바스펠트 폐허', respawn: '4시간', minutes: 240 },
        { name: '처형자 바르시엔', location: '그리바데 협곡 서부', respawn: '4시간', minutes: 240 },
        { name: '비전의 카루카', location: '검은 발톱 부락', respawn: '4시간', minutes: 240 },
        // 6시간
        { name: '드라칸 부대병기 구루타', location: '그리바데 협곡 동부', respawn: '6시간', minutes: 360 },
        { name: '흑암의 비슈베다', location: '라그타 요새', respawn: '6시간', minutes: 360 },
        { name: '예리한 쉬라크', location: '임페투시움 광장', respawn: '6시간', minutes: 360 },
        { name: '침묵의 타르탄', location: '정화의 숲', respawn: '6시간', minutes: 360 },
        { name: '영혼 지배자 카샤파', location: '파프나이트 매장지', respawn: '6시간', minutes: 360 },
        // 12시간
        { name: '군단장 라그타', location: '라그타 요새', respawn: '12시간', minutes: 720 },
        { name: '불멸의 가르투아', location: '불멸의 섬', respawn: '12시간', minutes: 720 },
      ]
    },
    {
      faction: '천족',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      bosses: [
        // 30분
        { name: '서쪽의 케르논', location: '칸타스 계곡', respawn: '30분', minutes: 30 },
        { name: '동쪽의 네이켈', location: '칸타스 계곡', respawn: '30분', minutes: 30 },
        { name: '썩은 쿠타르', location: '엘룬강 늪지', respawn: '30분', minutes: 30 },
        // 1시간
        { name: '만개한 코린', location: '엘룬강 중류', respawn: '1시간', minutes: 60 },
        // 1시간 30분
        { name: '호위병 티간트', location: '요새 폐허', respawn: '1시간 30분', minutes: 90 },
        // 2시간
        { name: '광투사 쿠산', location: '요새 폐허', respawn: '2시간', minutes: 120 },
        { name: '제사장 가르심', location: '요새 폐허', respawn: '2시간', minutes: 120 },
        { name: '학자 라울라', location: '아울라우 부락', respawn: '2시간', minutes: 120 },
        { name: '추격자 타울로', location: '아울라우 부락', respawn: '2시간', minutes: 120 },
        // 3시간
        { name: '피송곳니 프닌', location: '톨바스 숲', respawn: '3시간', minutes: 180 },
        { name: '분노한 사루스', location: '톨바스 숲', respawn: '3시간', minutes: 180 },
        { name: '배교자 레일라', location: '아르타미아 고원', respawn: '3시간', minutes: 180 },
        { name: '수확관리자 모샤브', location: '드라나 재배지', respawn: '3시간', minutes: 180 },
        // 4시간
        { name: '숲전사 우라무', location: '아울라우 부락', respawn: '4시간', minutes: 240 },
        { name: '검은 촉수 라와', location: '아르타미아 협곡', respawn: '4시간', minutes: 240 },
        { name: '백부장 데미로스', location: '아르타미아 고원', respawn: '4시간', minutes: 240 },
        { name: '감시병기 크나쉬', location: '드라나 재배지', respawn: '4시간', minutes: 240 },
        // 6시간
        { name: '신성한 안사스', location: '아르타미아 고원', respawn: '6시간', minutes: 360 },
        { name: '연구관 세트람', location: '나히드 군단 요새', respawn: '6시간', minutes: 360 },
        { name: '환몽의 카시아', location: '환영신의 정원', respawn: '6시간', minutes: 360 },
        { name: '침묵의 타르탄', location: '아르타미아 고원 남부', respawn: '6시간', minutes: 360 },
        { name: '영혼 지배자 카샤파', location: '아르타미아 고원 동부', respawn: '6시간', minutes: 360 },
        // 12시간
        { name: '군단장 라그타', location: '붉은 숲', respawn: '12시간', minutes: 720 },
        { name: '영원의 가르투아', location: '영원의 섬', respawn: '12시간', minutes: 720 },
      ]
    },
    {
      faction: '어비스',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      bosses: [
        { name: '감시자 카이라', location: '에레슈란타 하층', respawn: '1시간', minutes: 60 },
        { name: '정령왕 아그로', location: '시엘의 날개 군도', respawn: '12시간', minutes: 720 },
        { name: '수호신장 나흐마', location: '에레슈란타의 뿌리', respawn: '토/일 20:00', minutes: 0 },
      ]
    },
  ];

  // Firebase에서 타이머 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeToBossTimers((firebaseTimers) => {
      const localTimers: BossTimer[] = firebaseTimers.map(t => ({
        bossName: t.bossName,
        endTime: t.endTime,
        respawnMinutes: t.respawnMinutes,
      }));
      setTimers(localTimers);
      // localStorage에도 백업 저장 (오프라인 대비)
      localStorage.setItem('bossTimers', JSON.stringify(localTimers));
    });

    // 알림 권한 확인
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    return () => unsubscribe();
  }, []);

  // 소리 알림 (3번 울림)
  const playNotificationSound = useCallback((times = 3) => {
    let count = 0;
    const playOnce = () => {
      if (count >= times) return;
      try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
        count++;
        if (count < times) {
          setTimeout(playOnce, 800); // 0.8초 간격
        }
      } catch {
        // 소리 파일이 없어도 무시
      }
    };
    playOnce();
  }, []);

  // 알림 보내기 (리젠 시)
  const showNotification = useCallback((bossName: string, isFav: boolean) => {
    // 브라우저 알림
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isFav ? '⭐🔥 관심 보스 리젠!' : '🔥 보스 리젠!', {
        body: `${bossName} 리젠 시간입니다!`,
        icon: '/favicon.ico',
        tag: bossName,
      });
    }
    playNotificationSound(isFav ? 5 : 3); // 관심 보스는 5번, 일반은 3번
  }, [playNotificationSound]);

  // 1분 전 알림
  const showPreNotification = useCallback((bossName: string, isFav: boolean) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isFav ? '⭐⏰ 관심 보스 1분 전!' : '⏰ 1분 전!', {
        body: `${bossName} 리젠 1분 전!`,
        icon: '/favicon.ico',
        tag: `${bossName}-pre`,
      });
    }
    playNotificationSound(isFav ? 5 : 3);
  }, [playNotificationSound]);

  // 5분 전 알림 (관심 보스 전용)
  const showFavoritePreNotification = useCallback((bossName: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⭐ 관심 보스 5분 전!', {
        body: `${bossName} 리젠 5분 전!`,
        icon: '/favicon.ico',
        tag: `${bossName}-fav-pre`,
      });
    }
    playNotificationSound(5);
  }, [playNotificationSound]);

  // 1초마다 시간 업데이트 + 완료된 타이머 알림 처리 + 자동 재시작
  const notifiedTimersRef = useRef<Set<string>>(new Set());
  const preNotifiedTimersRef = useRef<Set<string>>(new Set()); // 1분 전 알림용
  const favPreNotifiedTimersRef = useRef<Set<string>>(new Set()); // 5분 전 알림용 (관심 보스)
  const restartingTimersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      const currentTime = Date.now();

      timers.forEach(async timer => {
        const remaining = timer.endTime - currentTime;
        const isFav = favoriteBosses.has(timer.bossName);

        // 5분 전 알림 (관심 보스 전용, 295초~305초 범위에서 한 번만)
        if (isFav && remaining > 0 && remaining <= 300000 && remaining > 295000) {
          if (!favPreNotifiedTimersRef.current.has(timer.bossName)) {
            showFavoritePreNotification(timer.bossName);
            favPreNotifiedTimersRef.current.add(timer.bossName);
          }
        }

        // 1분 전 알림 (55초~65초 범위에서 한 번만)
        if (remaining > 0 && remaining <= 60000 && remaining > 55000) {
          if (!preNotifiedTimersRef.current.has(timer.bossName)) {
            showPreNotification(timer.bossName, isFav);
            preNotifiedTimersRef.current.add(timer.bossName);
          }
        }

        // 리젠 완료 알림 + 자동 재시작
        if (timer.endTime <= currentTime && !notifiedTimersRef.current.has(timer.bossName)) {
          showNotification(timer.bossName, isFav);
          notifiedTimersRef.current.add(timer.bossName);

          // 자동 재시작: 리젠 시간만큼 다시 타이머 설정 (즉시 실행)
          if (timer.respawnMinutes > 0 && !restartingTimersRef.current.has(timer.bossName)) {
            restartingTimersRef.current.add(timer.bossName);
            const savedRespawnMinutes = timer.respawnMinutes; // 클로저에 저장
            const savedBossName = timer.bossName;
            // 즉시 실행 (IIFE)
            (async () => {
              const newEndTime = Date.now() + savedRespawnMinutes * 60 * 1000;
              // respawnMinutes 전달하여 타이머가 없어도 새로 생성되도록 함
              await updateBossTimer(savedBossName, newEndTime, savedRespawnMinutes);
              restartingTimersRef.current.delete(savedBossName);
              // 다음 알림을 위해 notified 해제
              notifiedTimersRef.current.delete(savedBossName);
              preNotifiedTimersRef.current.delete(savedBossName);
              favPreNotifiedTimersRef.current.delete(savedBossName);
            })();
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, favoriteBosses, showNotification, showPreNotification, showFavoritePreNotification]);

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // 타이머 시작 (Firebase에 저장)
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const startTimer = async (bossName: string, minutes: number) => {
    if (isSubmitting) return; // 중복 클릭 방지
    setIsSubmitting(bossName);

    try {
      const success = await setBossTimer({
        bossName,
        endTime: Date.now() + minutes * 60 * 1000,
        respawnMinutes: minutes,
      });

      if (!success) {
        alert('이미 30초 내에 등록된 타이머입니다.');
      }
    } catch (error) {
      console.error('타이머 등록 실패:', error);
      alert('타이머 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(null);
    }
  };

  // 타이머 취소 (Firebase에서 삭제)
  const cancelTimer = async (bossName: string) => {
    try {
      await removeBossTimer(bossName);
      // notifiedTimersRef에서도 제거
      notifiedTimersRef.current.delete(bossName);
    } catch (error) {
      console.error('타이머 취소 실패:', error);
    }
  };

  // 모든 타이머 삭제
  const cancelAllTimers = async () => {
    if (!confirm(`활성 타이머 ${timers.length}개를 모두 삭제하시겠습니까?`)) return;

    for (const timer of timers) {
      try {
        await removeBossTimer(timer.bossName);
        notifiedTimersRef.current.delete(timer.bossName);
        preNotifiedTimersRef.current.delete(timer.bossName);
      } catch (error) {
        console.error(`타이머 삭제 실패: ${timer.bossName}`, error);
      }
    }
    restartingTimersRef.current.clear();
  };

  // 보정 모달 상태
  const [adjustModalBoss, setAdjustModalBoss] = useState<string | null>(null);
  const [customTimeInput, setCustomTimeInput] = useState<string>('');

  // 점검 리셋 상태
  const [maintenanceEndDate, setMaintenanceEndDate] = useState<string>(''); // YYYY-MM-DD
  const [maintenanceEndTime, setMaintenanceEndTime] = useState<string>(''); // HH:MM
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // 직접 시간 입력 상태 (보스별)
  const [directTimeInputs, setDirectTimeInputs] = useState<Record<string, string>>({});
  const [showDirectInput, setShowDirectInput] = useState<string | null>(null);

  // 남은 시간 문자열을 밀리초로 변환 (H:MM:SS, MM:SS, MM 형식 지원)
  const parseRemainingTimeToMs = (timeStr: string): number | null => {
    const trimmed = timeStr.trim();
    if (!trimmed) return null;

    const parts = trimmed.split(':').map(p => parseInt(p));
    if (parts.some(isNaN)) return null;

    if (parts.length === 1) {
      // MM 형식 (분만)
      return parts[0] * 60 * 1000;
    } else if (parts.length === 2) {
      // MM:SS 형식
      const [mins, secs] = parts;
      return (mins * 60 + secs) * 1000;
    } else if (parts.length === 3) {
      // H:MM:SS 형식
      const [hours, mins, secs] = parts;
      return (hours * 3600 + mins * 60 + secs) * 1000;
    }
    return null;
  };

  // 직접 시간 입력으로 타이머 시작
  const startTimerWithDirectTime = async (bossName: string, respawnMinutes: number) => {
    const timeStr = directTimeInputs[bossName];
    const remainingMs = parseRemainingTimeToMs(timeStr);

    if (remainingMs === null || remainingMs <= 0) {
      alert('시간 형식: H:MM:SS, MM:SS, 또는 MM\n예: 1:23:45, 45:30, 30');
      return;
    }

    try {
      await setBossTimer({
        bossName,
        endTime: Date.now() + remainingMs,
        respawnMinutes,
      });
      // 입력 초기화
      setDirectTimeInputs(prev => ({ ...prev, [bossName]: '' }));
      setShowDirectInput(null);
    } catch (error) {
      console.error('타이머 시작 실패:', error);
      alert('타이머 시작에 실패했습니다.');
    }
  };

  // 남은 시간 포맷
  const formatRemaining = (endTime: number) => {
    const diff = endTime - now;
    if (diff <= 0) return '리젠!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 타이머 찾기
  const getTimer = (bossName: string) => timers.find(t => t.bossName === bossName);

  const getTimeColor = (minutes: number) => {
    if (minutes <= 30) return 'text-green-400';
    if (minutes <= 90) return 'text-cyan-400';
    if (minutes <= 180) return 'text-yellow-400';
    if (minutes <= 360) return 'text-orange-400';
    return 'text-red-400';
  };

  // 특수 보스 목록 (점검 리셋에서 제외)
  const EXCLUDED_BOSSES = ['감시자 카이라', '수호신장 나흐마'];

  // 점검 종료 시간 기준으로 모든 보스 타이머 생성 (개별 리젠 시간 적용)
  const resetAllBossesFromMaintenanceEnd = async () => {
    if (!maintenanceEndTime) {
      alert('점검 종료 시간을 입력해주세요 (예: 16:30)');
      return;
    }

    // HH:MM 파싱
    const timeParts = maintenanceEndTime.split(':').map(p => parseInt(p));
    if (timeParts.length < 2 || timeParts.some(isNaN)) {
      alert('시간 형식: HH:MM (예: 16:30)');
      return;
    }

    const [hours, minutes] = timeParts;
    const target = new Date();

    // 날짜가 입력되었으면 해당 날짜 사용
    if (maintenanceEndDate) {
      const dateParts = maintenanceEndDate.split('-').map(p => parseInt(p));
      if (dateParts.length === 3 && !dateParts.some(isNaN)) {
        const [year, month, day] = dateParts;
        target.setFullYear(year, month - 1, day); // month는 0-indexed
      }
    }

    target.setHours(hours, minutes, 0, 0);

    // 점검 종료 시간은 과거여도 그대로 사용 (리젠 사이클 계산 기준점)
    const maintenanceEndMs = target.getTime();
    const now = Date.now();
    let count = 0;

    // 모든 보스 데이터 순회 (활성 타이머가 아닌 전체 보스)
    for (const group of bosses) {
      for (const boss of group.bosses) {
        // 특수 보스 제외 (카이라: 매 정각, 나흐마: 토/일 고정)
        if (EXCLUDED_BOSSES.includes(boss.name) || boss.minutes === 0) continue;

        // 점검 종료 + 리젠 시간 = 첫 리젠 예정 시각
        let nextRespawnTime = maintenanceEndMs + (boss.minutes * 60 * 1000);

        // 현재 시간보다 과거면, 리젠 사이클을 더해서 미래 시간으로 조정
        const respawnIntervalMs = boss.minutes * 60 * 1000;
        while (nextRespawnTime <= now) {
          nextRespawnTime += respawnIntervalMs;
        }

        try {
          await setBossTimer({
            bossName: boss.name,
            endTime: nextRespawnTime,
            respawnMinutes: boss.minutes,
          });
          count++;
        } catch (error) {
          console.error(`타이머 생성 실패: ${boss.name}`, error);
        }
      }
    }

    // notified refs 초기화
    notifiedTimersRef.current.clear();
    preNotifiedTimersRef.current.clear();
    restartingTimersRef.current.clear();

    alert(`${count}개 보스 타이머가 생성되었습니다.\n\n점검 종료 기준: ${maintenanceEndTime}\n각 보스별 리젠 사이클이 계산되어 다음 리젠 시간이 설정되었습니다.\n\n※ 감시자 카이라, 수호신장 나흐마 제외`);
    setIsMaintenanceMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-bold text-white">필드보스 리젠 타이머</h3>
      </div>

      <p className="text-xs text-zinc-500 -mt-4">
        리젠 시간 2배 빠름 상시 적용 · 출처: <a href="https://www.inven.co.kr/board/aion2/6444" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">인벤</a>
      </p>

      {/* 점검 리셋 기능 */}
      <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-bold text-sm">🔧 점검 리셋</span>
              <span className="text-zinc-500 text-xs">점검 후 보스 리젠 시 사용</span>
            </div>
            <button
              onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isMaintenanceMode
                  ? 'bg-orange-500 text-zinc-900'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              {isMaintenanceMode ? '닫기' : '열기'}
            </button>
          </div>

          {isMaintenanceMode && (
            <div className="mt-4 pt-4 border-t border-orange-500/20 space-y-3">
              <p className="text-zinc-400 text-xs">
                점검 종료 시간을 입력하면 <span className="text-amber-400">모든 보스의 타이머가 자동 생성</span>됩니다.
                <br />각 보스의 리젠 시간에 맞춰 계산됩니다 (30분 보스 → +30분, 6시간 보스 → +6시간)
                <br /><span className="text-purple-400">※ 감시자 카이라(매 정각), 수호신장 나흐마(토/일 20시)는 제외</span>
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs">날짜:</span>
                  <input
                    type="date"
                    value={maintenanceEndDate}
                    onChange={(e) => setMaintenanceEndDate(e.target.value)}
                    className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1.5 text-sm text-white font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs">시간:</span>
                  <input
                    type="text"
                    value={maintenanceEndTime}
                    onChange={(e) => setMaintenanceEndTime(e.target.value)}
                    placeholder="16:30"
                    className="w-20 bg-zinc-800 border border-zinc-600 rounded px-2 py-1.5 text-sm text-white font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={resetAllBossesFromMaintenanceEnd}
                  className="bg-orange-500 hover:bg-orange-600 text-zinc-900 font-bold text-xs px-4 py-1.5 rounded-lg transition-colors"
                >
                  전체 타이머 생성
                </button>
              </div>
              <p className="text-orange-400/70 text-xs">
                ⚠️ 기존 타이머를 덮어쓰고 모든 보스의 새 타이머가 생성됩니다
              </p>
            </div>
          )}
        </div>

      {/* 활성 타이머 */}
      {timers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-amber-400 font-bold text-sm flex items-center gap-2">
              <span className="animate-pulse">⏱️</span> 활성 타이머 ({timers.length})
              <span className="text-zinc-500 text-xs font-normal ml-2">리젠 시 자동 재시작</span>
            </h4>
            <button
              onClick={cancelAllTimers}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              전체 삭제
            </button>
          </div>
          <div className="space-y-2">
            {/* 관심 보스 상단 정렬 */}
            {[...timers].sort((a, b) => {
              const aFav = favoriteBosses.has(a.bossName) ? 0 : 1;
              const bFav = favoriteBosses.has(b.bossName) ? 0 : 1;
              if (aFav !== bFav) return aFav - bFav;
              return a.endTime - b.endTime; // 같은 그룹 내에서는 시간순
            }).map(timer => {
              const remaining = timer.endTime - now;
              const isUrgent = remaining < 5 * 60 * 1000; // 5분 이하
              const isAdjusting = adjustModalBoss === timer.bossName;
              const isFav = favoriteBosses.has(timer.bossName);
              return (
                <div
                  key={timer.bossName}
                  className={`p-3 rounded-lg ${
                    isFav
                      ? 'bg-amber-500/20 border-2 border-amber-500/50'
                      : isUrgent
                        ? 'bg-red-500/20 animate-pulse'
                        : 'bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(timer.bossName)}
                        className={`text-lg transition-colors ${isFav ? 'text-amber-400' : 'text-zinc-600 hover:text-amber-400'}`}
                        title={isFav ? '관심 보스 해제' : '관심 보스 등록'}
                      >
                        {isFav ? '⭐' : '☆'}
                      </button>
                      <div className={`font-bold text-sm ${isFav ? 'text-amber-400' : isUrgent ? 'text-red-400' : 'text-white'}`}>
                        {timer.bossName}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold text-lg ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}>
                        {formatRemaining(timer.endTime)}
                      </span>
                      <button
                        onClick={() => setAdjustModalBoss(isAdjusting ? null : timer.bossName)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          isAdjusting
                            ? 'bg-cyan-500 text-zinc-900'
                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                        }`}
                        title="시간 보정"
                      >
                        보정
                      </button>
                      <button
                        onClick={() => cancelTimer(timer.bossName)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                        title="타이머 취소"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* 보정 패널 - 남은 시간 입력 */}
                  {isAdjusting && (
                    <div className="mt-3 pt-3 border-t border-zinc-700">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-zinc-400 text-xs">남은 시간:</span>
                        <input
                          type="text"
                          value={customTimeInput}
                          onChange={(e) => setCustomTimeInput(e.target.value)}
                          placeholder="1:23:45"
                          className="w-24 bg-zinc-800 border border-zinc-600 rounded px-2 py-1.5 text-sm text-white font-mono focus:border-cyan-500 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (customTimeInput) {
                              const remainingMs = parseRemainingTimeToMs(customTimeInput);
                              if (remainingMs && remainingMs > 0) {
                                updateBossTimer(timer.bossName, Date.now() + remainingMs, timer.respawnMinutes);
                                setCustomTimeInput('');
                                setAdjustModalBoss(null);
                              } else {
                                alert('시간 형식: H:MM:SS, MM:SS, 또는 MM');
                              }
                            }
                          }}
                          className="bg-cyan-500 hover:bg-cyan-600 text-zinc-900 font-bold text-xs px-3 py-1.5 rounded transition-colors"
                        >
                          설정
                        </button>
                        <span className="text-zinc-500 text-xs">(H:MM:SS, MM:SS, MM)</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 보스 목록 */}
      {bosses.map((group, idx) => (
        <div key={idx} className={`${group.bgColor} rounded-xl p-4`}>
          {/* 진영 헤더 + 지도 버튼 */}
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-bold text-sm flex items-center gap-2 ${group.color}`}>
              <span>{group.faction === '마족' ? '😈' : group.faction === '천족' ? '😇' : '🌀'}</span>
              {group.faction} 진영
            </h4>
            {factionMaps[group.faction] && (
              <button
                onClick={() => toggleMap(group.faction)}
                className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                  expandedMaps[group.faction]
                    ? 'bg-cyan-500 text-zinc-900'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                🗺️ 지도 {expandedMaps[group.faction] ? '▲' : '▼'}
              </button>
            )}
          </div>

          {/* 지도 이미지 */}
          {expandedMaps[group.faction] && factionMaps[group.faction] && (
            <div className="mb-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {factionMaps[group.faction].map((map, mIdx) => (
                  <a
                    key={mIdx}
                    href={map.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-video bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-cyan-500 transition-colors"
                  >
                    <img
                      src={map.isLocal ? map.url : getProxyImageUrl(map.url)}
                      alt={map.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5">
                      <span className="text-white text-xs font-medium">{map.name}</span>
                    </div>
                  </a>
                ))}
              </div>
              <p className="text-zinc-600 text-xs mt-2 text-center">클릭하면 원본 이미지 열기</p>
            </div>
          )}


          {/* 보스 리스트 */}
          <div className="space-y-2">
            {group.bosses.map((boss, bIdx) => {
              const activeTimer = getTimer(boss.name);
              const isFav = isFavorite(boss.name);
              return (
                <div key={bIdx} className={`rounded-lg p-3 ${isFav ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-zinc-900/80'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => toggleFavorite(boss.name)}
                        className={`text-base transition-colors ${isFav ? 'text-amber-400' : 'text-zinc-600 hover:text-amber-400'}`}
                        title={isFav ? '관심 보스 해제' : '관심 보스 등록'}
                      >
                        {isFav ? '⭐' : '☆'}
                      </button>
                      <div>
                        <div className={`font-medium text-sm ${isFav ? 'text-amber-400' : 'text-white'}`}>{boss.name}</div>
                        <div className="text-zinc-500 text-xs">{boss.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeTimer ? (
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-mono font-bold text-sm animate-pulse">
                            {formatRemaining(activeTimer.endTime)}
                          </span>
                          <button
                            onClick={() => cancelTimer(boss.name)}
                            className="text-zinc-500 hover:text-red-400 text-xs transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      ) : boss.minutes === 0 ? (
                        <span className="font-bold text-xs text-purple-400">
                          {boss.respawn}
                        </span>
                      ) : (
                        <>
                          <span className={`font-bold text-xs ${getTimeColor(boss.minutes)}`}>
                            {boss.respawn}
                          </span>
                          <button
                            onClick={() => setShowDirectInput(showDirectInput === boss.name ? null : boss.name)}
                            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-medium text-xs px-2 py-1 rounded transition-colors"
                            title="남은 시간 직접 입력"
                          >
                            입력
                          </button>
                          <button
                            onClick={() => startTimer(boss.name, boss.minutes)}
                            className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold text-xs px-2 py-1 rounded transition-colors"
                          >
                            처치
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* 직접 시간 입력 패널 */}
                  {showDirectInput === boss.name && boss.minutes > 0 && (
                    <div className="mt-2 pt-2 border-t border-zinc-700 flex items-center gap-2 flex-wrap">
                      <span className="text-zinc-400 text-xs">남은 시간:</span>
                      <input
                        type="text"
                        value={directTimeInputs[boss.name] || ''}
                        onChange={(e) => setDirectTimeInputs(prev => ({ ...prev, [boss.name]: e.target.value }))}
                        placeholder="1:23:45"
                        className="w-24 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                      <button
                        onClick={() => startTimerWithDirectTime(boss.name, boss.minutes)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-zinc-900 font-bold text-xs px-2 py-1 rounded transition-colors"
                      >
                        시작
                      </button>
                      <span className="text-zinc-500 text-xs">(H:MM:SS, MM:SS, MM)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="p-3 bg-zinc-900 rounded-lg space-y-1">
        <p className="text-zinc-400 text-xs">
          📌 리젠 시간은 처치 후 기준, ±10분 오차
        </p>
        <p className="text-zinc-400 text-xs">
          📌 보스 스폰 시 맵에 아이콘 표시
        </p>
        <p className="text-zinc-400 text-xs">
          📌 &quot;처치&quot; 버튼 클릭 시 타이머 시작, 리젠 시 알림
        </p>
        <p className="text-amber-400 text-xs">
          ⚠️ 타이머는 모든 사용자에게 실시간 공유됩니다
        </p>
      </div>
    </div>
  );
}

function ManualContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-base sm:text-lg font-bold text-white">📖 사용 매뉴얼</h3>

      {/* 필드보스 타이머 */}
      <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-xl p-4 space-y-4">
        <h4 className="text-amber-400 font-bold text-sm flex items-center gap-2">
          ⏱️ 필드보스 타이머 사용법
        </h4>

        {/* 기본 사용법 */}
        <div className="space-y-2">
          <h5 className="text-white font-bold text-xs">🎯 기본 사용법</h5>
          <div className="text-zinc-300 text-xs space-y-1 pl-4">
            <p>1. 보스를 처치하면 해당 보스의 <span className="text-amber-400 font-bold">[처치]</span> 버튼 클릭</p>
            <p>2. 타이머가 시작되고, 리젠 시간이 카운트다운됩니다</p>
            <p>3. <span className="text-cyan-400 font-bold">1분 전</span>에 알림 + 비프음 3번</p>
            <p>4. <span className="text-red-400 font-bold">리젠 시</span> 알림 + 비프음 3번</p>
            <p>5. 리젠 후 <span className="text-green-400 font-bold">즉시 자동으로 다음 사이클 시작</span></p>
          </div>
        </div>

        {/* 직접 시간 입력 */}
        <div className="space-y-2">
          <h5 className="text-white font-bold text-xs">⌨️ 직접 시간 입력 (게임 내 시간 확인 시)</h5>
          <div className="text-zinc-300 text-xs space-y-1 pl-4">
            <p>1. 보스 옆의 <span className="text-zinc-400 font-bold">[입력]</span> 버튼 클릭</p>
            <p>2. 게임에서 확인한 남은 시간을 입력합니다:</p>
            <div className="pl-4 space-y-1 mt-1">
              <p>• <span className="text-cyan-400">H:MM:SS</span>: 1:23:45 (1시간 23분 45초)</p>
              <p>• <span className="text-cyan-400">MM:SS</span>: 45:30 (45분 30초)</p>
              <p>• <span className="text-cyan-400">MM</span>: 30 (30분)</p>
            </div>
            <p>3. <span className="text-cyan-400 font-bold">[시작]</span> 버튼으로 타이머 시작</p>
          </div>
        </div>

        {/* 시간 보정 */}
        <div className="space-y-2">
          <h5 className="text-white font-bold text-xs">⏱️ 시간 보정 (타이머가 맞지 않을 때)</h5>
          <div className="text-zinc-300 text-xs space-y-1 pl-4">
            <p>1. 활성 타이머에서 <span className="text-cyan-400 font-bold">[보정]</span> 버튼 클릭</p>
            <p>2. 보정 패널이 열립니다:</p>
            <div className="pl-4 space-y-1 mt-1">
              <p>• <span className="text-blue-400">-5분, -1분</span>: 타이머를 빠르게 (예상보다 빨리 리젠될 때)</p>
              <p>• <span className="text-orange-400">+1분, +5분</span>: 타이머를 느리게 (예상보다 늦게 리젠될 때)</p>
              <p>• <span className="text-green-400">보정 입력</span>: ±분 단위로 직접 입력 (예: -3, +7)</p>
              <p>• <span className="text-purple-400">시간 직접 설정</span>: 정확한 리젠 시간 입력 (예: 14:30)</p>
            </div>
          </div>
        </div>

        {/* 타이머 취소 */}
        <div className="space-y-2">
          <h5 className="text-white font-bold text-xs">❌ 타이머 취소</h5>
          <div className="text-zinc-300 text-xs space-y-1 pl-4">
            <p>• 활성 타이머의 <span className="text-red-400 font-bold">[✕]</span> 버튼 또는 <span className="text-zinc-400">[취소]</span> 클릭</p>
            <p>• 타이머가 완전히 삭제되며, 자동 재시작도 중단됩니다</p>
          </div>
        </div>

        {/* 공유 기능 */}
        <div className="space-y-2">
          <h5 className="text-white font-bold text-xs">👥 실시간 공유</h5>
          <div className="text-zinc-300 text-xs space-y-1 pl-4">
            <p>• 타이머는 <span className="text-amber-400 font-bold">모든 사용자에게 실시간 공유</span>됩니다</p>
            <p>• 누군가 처치 버튼을 누르면 다른 사람도 타이머를 볼 수 있습니다</p>
            <p>• 길드원끼리 보스 타이머를 공유하세요!</p>
          </div>
        </div>

        {/* 점검 리셋 */}
        <div className="space-y-2">
          <h5 className="text-white font-bold text-xs">🔧 점검 리셋 (점검 후 보스 리젠 시)</h5>
          <div className="text-zinc-300 text-xs space-y-1 pl-4">
            <p>• 임시점검/정기점검 후 대부분의 필드보스가 리젠됩니다</p>
            <p>• <span className="text-orange-400 font-bold">[점검 리셋]</span> 열기 → 점검 종료 시간 입력 (예: 14:30)</p>
            <p>• <span className="text-orange-400 font-bold">[전체 타이머 생성]</span> 클릭 시:</p>
            <div className="pl-4 space-y-1 mt-1">
              <p>• 30분 보스 → 점검 종료 + 30분 후 리젠</p>
              <p>• 1시간 보스 → 점검 종료 + 1시간 후 리젠</p>
              <p>• 6시간 보스 → 점검 종료 + 6시간 후 리젠</p>
              <p>• <span className="text-purple-400">※ 감시자 카이라, 수호신장 나흐마는 제외</span></p>
            </div>
            <p>• 보정 필요 시 <span className="text-zinc-400 font-bold">[입력]</span> 버튼으로 직접 시간 입력</p>
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-4">
        <h4 className="text-cyan-400 font-bold text-sm flex items-center gap-2">
          🔔 알림 설정 방법
        </h4>

        <div className="text-zinc-300 text-xs space-y-2 pl-4">
          <p>1. 페이지 상단의 <span className="text-amber-400 font-bold">[알림 허용하기]</span> 버튼 클릭</p>
          <p>2. 브라우저에서 알림 권한 허용 팝업이 뜨면 <span className="text-green-400 font-bold">[허용]</span> 클릭</p>
          <p>3. 알림이 허용되면 &quot;허용됨 ✓&quot;로 표시됩니다</p>
        </div>

        <div className="bg-zinc-900/50 rounded-lg p-3 mt-2">
          <p className="text-zinc-400 text-xs">
            💡 <span className="text-white">브라우저를 열어둬야</span> 알림을 받을 수 있습니다.<br/>
            탭을 닫거나 브라우저를 종료하면 알림이 오지 않습니다.
          </p>
        </div>
      </div>

      {/* 일일/주간 알림 */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 space-y-4">
        <h4 className="text-purple-400 font-bold text-sm flex items-center gap-2">
          📅 일일/주간 컨텐츠 알림
        </h4>

        <div className="text-zinc-300 text-xs space-y-2 pl-4">
          <p>• 일일/주간 탭에서 각 컨텐츠별로 <span className="text-amber-400 font-bold">[알림 ON/OFF]</span> 설정 가능</p>
          <p>• 슈고 페스타, 시공의 균열, 무역단, 나흐마 등</p>
          <p>• 설정한 시간 전에 브라우저 알림이 옵니다</p>
        </div>
      </div>

      {/* 팁 */}
      <div className="bg-zinc-900 rounded-lg p-4 space-y-2">
        <h4 className="text-zinc-300 font-bold text-sm">💡 유용한 팁</h4>
        <div className="text-zinc-400 text-xs space-y-1">
          <p>• 리젠 후 즉시 다음 타이머가 자동 시작됩니다</p>
          <p>• 게임에서 남은 시간 확인 시 <span className="text-cyan-400">[입력]</span> 버튼으로 정확한 시간 설정 가능</p>
          <p>• 타이머 시간은 ±10분 정도 오차가 있을 수 있습니다</p>
          <p>• 모바일에서도 브라우저를 열어두면 알림을 받을 수 있습니다</p>
          <p>• 여러 보스 타이머를 동시에 관리할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}
