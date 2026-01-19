'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface BossTimer {
  bossName: string;
  endTime: number;
  respawnMinutes: number;
}

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'boss'>('daily');

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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">일정표</h1>
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">아이온2 컨텐츠 스케줄</p>
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
        <div className="flex gap-1.5 sm:gap-2 mb-6">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            일일
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setActiveTab('boss')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              activeTab === 'boss'
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            필드보스
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4 sm:p-6">
          {activeTab === 'daily' && <DailyContent />}
          {activeTab === 'weekly' && <WeeklyContent />}
          {activeTab === 'boss' && <FieldBossContent />}
        </div>
      </main>

      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-zinc-500 text-sm">
          <p>사계 레기온 · AION2 지켈 서버 (마족)</p>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-4">일일 컨텐츠 (매일 05:00 초기화)</h3>
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

      {/* 시간별 컨텐츠 */}
      <div className="pt-4 border-t border-zinc-700">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🕐</span> 시간별 컨텐츠
        </h3>
        <div className="space-y-2">
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="text-cyan-400 font-bold text-sm">슈고 페스타</span>
              <span className="text-white font-mono text-xs">매시 15분, 45분</span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">참여만 해도 어비스 포인트 160+ 획득</p>
          </div>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-4">주간 컨텐츠 (수요일 05:00 초기화)</h3>
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
        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-amber-300 text-xs sm:text-sm">
            ⚠️ 산들바람 상회 특수 물품은 <span className="font-bold">일요일 자정</span>에 초기화
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
    </div>
  );
}

function FieldBossContent() {
  const [timers, setTimers] = useState<BossTimer[]>([]);
  const [now, setNow] = useState(Date.now());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // 보스 데이터 - 리젠 시간 원복 (이벤트 종료)
  const bosses = [
    {
      faction: '마족',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      bosses: [
        { name: '녹아내린 다나르', location: '드레드기온 추락지', respawn: '1시간', minutes: 60 },
        { name: '어둠의 타크라', location: '이름없는 묘지', respawn: '1시간', minutes: 60 },
        { name: '절망의 에탄', location: '고대 연구 단지', respawn: '1시간', minutes: 60 },
        { name: '광기의 쿠라스', location: '아슈테론 주둔지', respawn: '2시간', minutes: 120 },
        { name: '사막 비틀레', location: '타렌스 폐광촌', respawn: '3시간', minutes: 180 },
        { name: '붉은 눈의 라키', location: '불멸의 군단 요새', respawn: '4시간', minutes: 240 },
        { name: '군단장 라그타', location: '불멸의 요새', respawn: '24시간', minutes: 1440 },
        { name: '불멸의 가르투아', location: '불멸의 섬', respawn: '24시간', minutes: 1440 },
      ]
    },
    {
      faction: '천족',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      bosses: [
        { name: '서쪽의 케르논', location: '칸타스 계곡', respawn: '1시간', minutes: 60 },
        { name: '동쪽의 네이켈', location: '칸타스 계곡', respawn: '1시간', minutes: 60 },
        { name: '썩은 쿠타르', location: '엘룬강 늪지', respawn: '1시간', minutes: 60 },
        { name: '만개한 코린', location: '엘룬강 중류', respawn: '2시간', minutes: 120 },
        { name: '호위병 티간트', location: '요새 폐허', respawn: '3시간', minutes: 180 },
        { name: '광투사 쿠산', location: '요새 폐허', respawn: '4시간', minutes: 240 },
        { name: '제사장 가르심', location: '요새 폐허', respawn: '4시간', minutes: 240 },
        { name: '피송곳니 프닌', location: '톨바스 숲', respawn: '6시간', minutes: 360 },
        { name: '신성한 안사스', location: '아르타미아 고원', respawn: '12시간', minutes: 720 },
        { name: '영원의 가르투아', location: '영원의 섬', respawn: '24시간', minutes: 1440 },
      ]
    },
    {
      faction: '어비스',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      bosses: [
        { name: '감시자 카이라', location: '에레슈란타 하층', respawn: '1시간', minutes: 60 },
        { name: '정령왕 아그로', location: '시엘의 날개 군도', respawn: '24시간', minutes: 1440 },
        { name: '수호신장 나흐마', location: '어비스 거점', respawn: '24시간', minutes: 1440 },
      ]
    },
  ];

  // localStorage에서 타이머 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('bossTimers');
    if (saved) {
      const parsed = JSON.parse(saved) as BossTimer[];
      // 만료된 타이머 필터링
      const valid = parsed.filter(t => t.endTime > Date.now());
      setTimers(valid);
      localStorage.setItem('bossTimers', JSON.stringify(valid));
    }

    // 알림 권한 확인
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // 1초마다 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());

      // 완료된 타이머 확인 및 알림
      setTimers(prev => {
        const completed = prev.filter(t => t.endTime <= Date.now());
        const remaining = prev.filter(t => t.endTime > Date.now());

        // 완료된 타이머에 대해 알림
        completed.forEach(timer => {
          showNotification(timer.bossName);
        });

        if (completed.length > 0) {
          localStorage.setItem('bossTimers', JSON.stringify(remaining));
        }

        return remaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 알림 보내기
  const showNotification = useCallback((bossName: string) => {
    // 브라우저 알림
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔥 보스 리젠!', {
        body: `${bossName} 리젠 시간입니다!`,
        icon: '/favicon.ico',
        tag: bossName,
      });
    }

    // 소리 알림 (선택적)
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {
      // 소리 파일이 없어도 무시
    }
  }, []);

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // 타이머 시작
  const startTimer = (bossName: string, minutes: number) => {
    const newTimer: BossTimer = {
      bossName,
      endTime: Date.now() + minutes * 60 * 1000,
      respawnMinutes: minutes,
    };

    setTimers(prev => {
      // 같은 보스 타이머가 있으면 덮어쓰기
      const filtered = prev.filter(t => t.bossName !== bossName);
      const updated = [...filtered, newTimer];
      localStorage.setItem('bossTimers', JSON.stringify(updated));
      return updated;
    });
  };

  // 타이머 취소
  const cancelTimer = (bossName: string) => {
    setTimers(prev => {
      const updated = prev.filter(t => t.bossName !== bossName);
      localStorage.setItem('bossTimers', JSON.stringify(updated));
      return updated;
    });
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
    if (minutes <= 60) return 'text-green-400';
    if (minutes <= 180) return 'text-cyan-400';
    if (minutes <= 360) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-white">필드보스 리젠 타이머</h3>
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            🔔 알림 허용
          </button>
        )}
      </div>

      {/* 활성 타이머 */}
      {timers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30 rounded-xl p-4">
          <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
            <span className="animate-pulse">⏱️</span> 활성 타이머 ({timers.length})
          </h4>
          <div className="space-y-2">
            {timers.map(timer => {
              const remaining = timer.endTime - now;
              const isUrgent = remaining < 5 * 60 * 1000; // 5분 이하
              return (
                <div
                  key={timer.bossName}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isUrgent ? 'bg-red-500/20 animate-pulse' : 'bg-zinc-900/50'
                  }`}
                >
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
                      onClick={() => cancelTimer(timer.bossName)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                      title="타이머 취소"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 보스 목록 */}
      {bosses.map((group, idx) => (
        <div key={idx} className={`${group.bgColor} rounded-xl p-4`}>
          <h4 className={`font-bold mb-3 text-sm flex items-center gap-2 ${group.color}`}>
            <span>{group.faction === '마족' ? '😈' : group.faction === '천족' ? '😇' : '🌀'}</span>
            {group.faction} 진영
          </h4>
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
          ⚠️ 타이머는 브라우저에 저장됩니다 (다른 페이지에서도 알림)
        </p>
      </div>
    </div>
  );
}
