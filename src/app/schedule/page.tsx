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
            사계 레기온
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
          <p>사계 레기온 · AION2 지켈 서버 (마족)</p>
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
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
              <p className="text-red-300 text-xs sm:text-sm font-bold">
                ⚠️ 일요일 자정 초기화 (수요일 아님!)
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
  const showNotification = useCallback((bossName: string) => {
    // 브라우저 알림
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔥 보스 리젠!', {
        body: `${bossName} 리젠 시간입니다!`,
        icon: '/favicon.ico',
        tag: bossName,
      });
    }
    playNotificationSound(3);
  }, [playNotificationSound]);

  // 1분 전 알림
  const showPreNotification = useCallback((bossName: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⏰ 1분 전!', {
        body: `${bossName} 리젠 1분 전!`,
        icon: '/favicon.ico',
        tag: `${bossName}-pre`,
      });
    }
    playNotificationSound(3);
  }, [playNotificationSound]);

  // 1초마다 시간 업데이트 + 완료된 타이머 알림 처리 + 자동 재시작 (30초 딜레이)
  const notifiedTimersRef = useRef<Set<string>>(new Set());
  const preNotifiedTimersRef = useRef<Set<string>>(new Set()); // 1분 전 알림용
  const restartingTimersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      const currentTime = Date.now();

      timers.forEach(async timer => {
        const remaining = timer.endTime - currentTime;

        // 1분 전 알림 (55초~65초 범위에서 한 번만)
        if (remaining > 0 && remaining <= 60000 && remaining > 55000) {
          if (!preNotifiedTimersRef.current.has(timer.bossName)) {
            showPreNotification(timer.bossName);
            preNotifiedTimersRef.current.add(timer.bossName);
          }
        }

        // 리젠 완료 알림 + 자동 재시작
        if (timer.endTime <= currentTime && !notifiedTimersRef.current.has(timer.bossName)) {
          showNotification(timer.bossName);
          notifiedTimersRef.current.add(timer.bossName);

          // 자동 재시작: 30초 후 리젠 시간만큼 다시 타이머 설정 (보스 잡는 시간 고려)
          if (timer.respawnMinutes > 0 && !restartingTimersRef.current.has(timer.bossName)) {
            restartingTimersRef.current.add(timer.bossName);
            const savedRespawnMinutes = timer.respawnMinutes; // 클로저에 저장
            setTimeout(async () => {
              const newEndTime = Date.now() + savedRespawnMinutes * 60 * 1000;
              // respawnMinutes 전달하여 타이머가 없어도 새로 생성되도록 함
              await updateBossTimer(timer.bossName, newEndTime, savedRespawnMinutes);
              restartingTimersRef.current.delete(timer.bossName);
              // 다음 알림을 위해 notified 해제
              notifiedTimersRef.current.delete(timer.bossName);
              preNotifiedTimersRef.current.delete(timer.bossName);
            }, 30000); // 30초 딜레이
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, showNotification, showPreNotification]);

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

  // 타이머 시간 보정 (분 단위)
  const adjustTimer = async (bossName: string, adjustMinutes: number) => {
    const timer = timers.find(t => t.bossName === bossName);
    if (!timer) return;

    const newEndTime = timer.endTime + adjustMinutes * 60 * 1000;
    // 과거 시간으로 설정되지 않도록 최소 1분 보장
    const minEndTime = Date.now() + 60 * 1000;
    const finalEndTime = Math.max(newEndTime, minEndTime);

    try {
      await updateBossTimer(bossName, finalEndTime);
    } catch (error) {
      console.error('타이머 보정 실패:', error);
    }
  };

  // 보정 모달 상태
  const [adjustModalBoss, setAdjustModalBoss] = useState<string | null>(null);
  const [customAdjustMinutes, setCustomAdjustMinutes] = useState<string>('');
  const [customTimeInput, setCustomTimeInput] = useState<string>('');

  // 점검 리셋 상태
  const [maintenanceEndTime, setMaintenanceEndTime] = useState<string>('');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // 직접 시간 설정 (HH:MM 또는 HH:MM:SS 형식)
  const setCustomTime = async (bossName: string, timeStr: string) => {
    const timer = timers.find(t => t.bossName === bossName);
    if (!timer) return;

    // HH:MM 또는 HH:MM:SS 파싱
    const parts = timeStr.split(':').map(p => parseInt(p));
    if (parts.length < 2 || parts.some(isNaN)) {
      alert('시간 형식: HH:MM 또는 HH:MM:SS');
      return;
    }

    const [hours, minutes, seconds = 0] = parts;
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, seconds, 0);

    // 입력한 시간이 현재보다 과거면 내일로 설정
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    try {
      await updateBossTimer(bossName, target.getTime());
      setCustomTimeInput('');
    } catch (error) {
      console.error('시간 설정 실패:', error);
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

  // 점검 종료 시간으로 모든 활성 타이머 리셋
  const resetAllTimersToMaintenanceEnd = async () => {
    if (!maintenanceEndTime) {
      alert('점검 종료 시간을 입력해주세요 (예: 14:30)');
      return;
    }

    // HH:MM 파싱
    const parts = maintenanceEndTime.split(':').map(p => parseInt(p));
    if (parts.length < 2 || parts.some(isNaN)) {
      alert('시간 형식: HH:MM (예: 14:30)');
      return;
    }

    const [hours, minutes] = parts;
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    // 입력한 시간이 현재보다 과거면 내일로 설정
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const maintenanceEndMs = target.getTime();

    // 모든 활성 타이머를 점검 종료 시간으로 리셋
    for (const timer of timers) {
      try {
        await updateBossTimer(timer.bossName, maintenanceEndMs, timer.respawnMinutes);
      } catch (error) {
        console.error(`타이머 리셋 실패: ${timer.bossName}`, error);
      }
    }

    // notified refs 초기화
    notifiedTimersRef.current.clear();
    preNotifiedTimersRef.current.clear();
    restartingTimersRef.current.clear();

    alert(`${timers.length}개 타이머가 ${maintenanceEndTime} 기준으로 리셋되었습니다.\n보스 처치 시 [처치] 버튼으로 보정하세요.`);
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
      {timers.length > 0 && (
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
                점검 종료 시간을 입력하면 모든 활성 타이머가 해당 시간으로 리셋됩니다.
                <br />이후 보스를 처치하면 [처치] 버튼을 눌러 정상 타이머로 보정하세요.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs">점검 종료:</span>
                  <input
                    type="text"
                    value={maintenanceEndTime}
                    onChange={(e) => setMaintenanceEndTime(e.target.value)}
                    placeholder="14:30"
                    className="w-20 bg-zinc-800 border border-zinc-600 rounded px-2 py-1.5 text-sm text-white font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={resetAllTimersToMaintenanceEnd}
                  className="bg-orange-500 hover:bg-orange-600 text-zinc-900 font-bold text-xs px-4 py-1.5 rounded-lg transition-colors"
                >
                  전체 리셋 ({timers.length}개)
                </button>
              </div>
              <p className="text-orange-400/70 text-xs">
                ⚠️ 모든 타이머가 점검 종료 시간에 리젠으로 설정됩니다
              </p>
            </div>
          )}
        </div>
      )}

      {/* 활성 타이머 */}
      {timers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30 rounded-xl p-4">
          <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
            <span className="animate-pulse">⏱️</span> 활성 타이머 ({timers.length})
            <span className="text-zinc-500 text-xs font-normal ml-2">리젠 시 자동 재시작</span>
          </h4>
          <div className="space-y-2">
            {timers.map(timer => {
              const remaining = timer.endTime - now;
              const isUrgent = remaining < 5 * 60 * 1000; // 5분 이하
              const isAdjusting = adjustModalBoss === timer.bossName;
              return (
                <div
                  key={timer.bossName}
                  className={`p-3 rounded-lg ${
                    isUrgent ? 'bg-red-500/20 animate-pulse' : 'bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-bold text-sm ${isUrgent ? 'text-red-400' : 'text-white'}`}>
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

                  {/* 보정 패널 */}
                  {isAdjusting && (
                    <div className="mt-3 pt-3 border-t border-zinc-700">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-zinc-400 text-xs">빠르게:</span>
                        <button
                          onClick={() => adjustTimer(timer.bossName, -5)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                        >
                          -5분
                        </button>
                        <button
                          onClick={() => adjustTimer(timer.bossName, -1)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                        >
                          -1분
                        </button>
                        <span className="text-zinc-600">|</span>
                        <span className="text-zinc-400 text-xs">느리게:</span>
                        <button
                          onClick={() => adjustTimer(timer.bossName, 1)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1 rounded"
                        >
                          +1분
                        </button>
                        <button
                          onClick={() => adjustTimer(timer.bossName, 5)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1 rounded"
                        >
                          +5분
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-zinc-400 text-xs">보정:</span>
                        <input
                          type="number"
                          value={customAdjustMinutes}
                          onChange={(e) => setCustomAdjustMinutes(e.target.value)}
                          placeholder="±분"
                          className="w-16 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-xs text-white"
                        />
                        <button
                          onClick={() => {
                            const mins = parseInt(customAdjustMinutes);
                            if (!isNaN(mins)) {
                              adjustTimer(timer.bossName, mins);
                              setCustomAdjustMinutes('');
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
                        >
                          적용
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-zinc-400 text-xs">시간 직접 설정:</span>
                        <input
                          type="text"
                          value={customTimeInput}
                          onChange={(e) => setCustomTimeInput(e.target.value)}
                          placeholder="14:30"
                          className="w-20 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => {
                            if (customTimeInput) {
                              setCustomTime(timer.bossName, customTimeInput);
                            }
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded"
                        >
                          설정
                        </button>
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
              return (
                <div key={bIdx} className="bg-zinc-900/80 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{boss.name}</div>
                      <div className="text-zinc-500 text-xs">{boss.location}</div>
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
                            onClick={() => startTimer(boss.name, boss.minutes)}
                            className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold text-xs px-2 py-1 rounded transition-colors"
                          >
                            처치
                          </button>
                        </>
                      )}
                    </div>
                  </div>
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
            <p>5. 리젠 후 <span className="text-green-400 font-bold">30초 뒤 자동으로 다음 사이클 시작</span></p>
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
            <p>• <span className="text-orange-400 font-bold">[점검 리셋]</span> 버튼 클릭 → 점검 종료 시간 입력 (예: 14:30)</p>
            <p>• <span className="text-orange-400 font-bold">[전체 리셋]</span> 클릭 시 모든 활성 타이머가 해당 시간으로 설정</p>
            <p>• 이후 보스 처치 시 <span className="text-amber-400 font-bold">[처치]</span> 버튼으로 정상 타이머 보정</p>
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
          <p>• 보스는 보통 리젠 후 1분 내외로 처치되므로, 자동 재시작 시 30초 딜레이가 적용됩니다</p>
          <p>• 타이머 시간은 ±10분 정도 오차가 있을 수 있습니다</p>
          <p>• 모바일에서도 브라우저를 열어두면 알림을 받을 수 있습니다</p>
          <p>• 여러 보스 타이머를 동시에 관리할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}
