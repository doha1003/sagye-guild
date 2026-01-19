'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface BossTimer {
  bossName: string;
  endTime: number;
  respawnMinutes: number;
}

interface CompletedAlert {
  id: string;
  bossName: string;
  timestamp: number;
  type?: 'boss' | 'shugo' | 'rift' | 'invasion' | 'trade' | 'nahma';
}

interface PersonalSettings {
  shugoFesta: boolean;       // 슈고 페스타 (매시 15분, 45분)
  riftPortal: boolean;       // 시공의 균열 (3시간 간격)
  blackCloudTrade: boolean;  // 검은 구름 무역단 (매시 정각)
  nahmaAlert: boolean;       // 나흐마 (토/일 20:00)
}

const DEFAULT_SETTINGS: PersonalSettings = {
  shugoFesta: false,
  riftPortal: false,
  blackCloudTrade: false,
  nahmaAlert: false,
};

export default function BossTimerNotifier() {
  const [alerts, setAlerts] = useState<CompletedAlert[]>([]);
  const [activeTimers, setActiveTimers] = useState<BossTimer[]>([]);
  const [settings, setSettings] = useState<PersonalSettings>(DEFAULT_SETTINGS);
  const [now, setNow] = useState(new Date());
  const lastNotifiedRef = useRef<Record<string, number>>({});

  // 설정 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('personalAlertSettings');
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  // 알림 표시
  const showNotification = useCallback((title: string, body: string, type: CompletedAlert['type'] = 'boss') => {
    // 브라우저 알림
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `${type}-${Date.now()}`,
      });
    }

    // 인앱 팝업
    const alertId = `${type}-${Date.now()}`;
    setAlerts(prev => [...prev, { id: alertId, bossName: body, timestamp: Date.now(), type }]);

    // 10초 후 자동 닫기
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }, 10000);
  }, []);

  // 알림 닫기
  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // 1초마다 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 다음 슈고 페스타까지 남은 시간
  const getSecondsUntilShugo = () => {
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    let nextTarget = [15, 45].find(m => m > currentMinute);
    if (nextTarget === undefined) nextTarget = 15 + 60;
    return (nextTarget - currentMinute - 1) * 60 + (60 - currentSecond);
  };

  // 다음 시공까지 남은 시간
  const getSecondsUntilRift = () => {
    const riftHours = [2, 5, 8, 11, 14, 17, 20, 23];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    let nextRift = riftHours.find(h => h > currentHour);
    if (nextRift === undefined) nextRift = riftHours[0] + 24;
    return (nextRift - currentHour - 1) * 3600 + (59 - currentMinute) * 60 + (60 - currentSecond);
  };

  // 다음 무역단 초기화까지 남은 시간
  const getSecondsUntilTrade = () => {
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    return (59 - currentMinute) * 60 + (60 - currentSecond);
  };

  // 다음 나흐마까지 남은 시간 (초)
  const getSecondsUntilNahma = () => {
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    let daysUntil = 0;
    if (day === 6) {
      if (hour < 20) daysUntil = 0;
      else daysUntil = 1;
    } else if (day === 0) {
      if (hour < 20) daysUntil = 0;
      else daysUntil = 6;
    } else {
      daysUntil = 6 - day;
    }

    if (daysUntil === 0) {
      return (19 - hour) * 3600 + (60 - minute) * 60 + (60 - second);
    }
    return daysUntil * 86400 + (19 - hour) * 3600 + (60 - minute) * 60 + (60 - second);
  };

  // 초를 시:분:초로 포맷
  const formatSeconds = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '지금!';
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 임박한 이벤트 목록 (10분 이내)
  const getUpcomingEvents = () => {
    const events: { name: string; icon: string; seconds: number; color: string }[] = [];
    const TEN_MINUTES = 600;

    if (settings.shugoFesta) {
      const secs = getSecondsUntilShugo();
      if (secs <= TEN_MINUTES) {
        events.push({ name: '슈고페스타', icon: '🦊', seconds: secs, color: 'text-orange-400' });
      }
    }
    if (settings.riftPortal) {
      const secs = getSecondsUntilRift();
      if (secs <= TEN_MINUTES) {
        events.push({ name: '시공', icon: '🌀', seconds: secs, color: 'text-cyan-400' });
      }
    }
    if (settings.blackCloudTrade) {
      const secs = getSecondsUntilTrade();
      if (secs <= TEN_MINUTES) {
        events.push({ name: '무역단', icon: '🌑', seconds: secs, color: 'text-yellow-400' });
      }
    }
    if (settings.nahmaAlert) {
      const secs = getSecondsUntilNahma();
      if (secs <= TEN_MINUTES && secs > 0) {
        events.push({ name: '나흐마', icon: '👑', seconds: secs, color: 'text-purple-400' });
      }
    }

    return events.sort((a, b) => a.seconds - b.seconds);
  };

  const upcomingEvents = getUpcomingEvents();

  // 1초마다 타이머 체크 + 개인 알림 체크
  useEffect(() => {
    const checkTimers = () => {
      if (typeof window === 'undefined') return;

      const now = new Date();
      const currentMinute = now.getMinutes();
      const currentHour = now.getHours();
      const currentDay = now.getDay(); // 0=일, 6=토
      const currentSecond = now.getSeconds();
      const timeKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${currentHour}-${currentMinute}`;

      // 슈고 페스타 알림 (매시 15분, 45분 - 1분 전 알림)
      if (settings.shugoFesta) {
        const shugoKey = `shugo-${timeKey}`;
        if ((currentMinute === 14 || currentMinute === 44) && currentSecond === 0 && !lastNotifiedRef.current[shugoKey]) {
          showNotification('🦊 슈고 페스타!', '1분 후 슈고 페스타 시작!', 'shugo');
          lastNotifiedRef.current[shugoKey] = Date.now();
        }
      }

      // 검은 구름 무역단 알림 (매시 정각 - 1분 전 알림)
      if (settings.blackCloudTrade) {
        const tradeKey = `trade-${timeKey}`;
        if (currentMinute === 59 && currentSecond === 0 && !lastNotifiedRef.current[tradeKey]) {
          showNotification('🌑 검은 구름 무역단!', '1분 후 상점 초기화!', 'trade');
          lastNotifiedRef.current[tradeKey] = Date.now();
        }
      }

      // 시공의 균열 알림 (3시간 간격: 2,5,8,11,14,17,20,23시 - 5분 전 알림)
      if (settings.riftPortal) {
        const riftHours = [2, 5, 8, 11, 14, 17, 20, 23];
        const riftKey = `rift-${timeKey}`;
        if (riftHours.includes(currentHour) && currentMinute === 55 && currentSecond === 0 && !lastNotifiedRef.current[riftKey]) {
          showNotification('🌀 시공의 균열!', '5분 후 시공 포탈 오픈!', 'rift');
          lastNotifiedRef.current[riftKey] = Date.now();
        }
      }

      // 나흐마 알림 (토/일 19:55)
      if (settings.nahmaAlert) {
        const nahmaKey = `nahma-${timeKey}`;
        if ((currentDay === 0 || currentDay === 6) && currentHour === 19 && currentMinute === 55 && currentSecond === 0 && !lastNotifiedRef.current[nahmaKey]) {
          showNotification('👑 수호신장 나흐마!', '5분 후 나흐마 출현! (20:00)', 'nahma');
          lastNotifiedRef.current[nahmaKey] = Date.now();
        }
      }

      // 보스 타이머 체크
      const saved = localStorage.getItem('bossTimers');
      if (!saved) {
        setActiveTimers([]);
        return;
      }

      try {
        const timers = JSON.parse(saved) as BossTimer[];
        const nowMs = Date.now();

        // 완료된 타이머 찾기
        const completed = timers.filter(t => t.endTime <= nowMs);
        const remaining = timers.filter(t => t.endTime > nowMs);

        // 완료된 타이머에 대해 알림
        if (completed.length > 0) {
          completed.forEach(timer => {
            showNotification('🔥 보스 리젠!', `${timer.bossName} 리젠 시간입니다!`, 'boss');
          });

          // 남은 타이머만 저장
          localStorage.setItem('bossTimers', JSON.stringify(remaining));
        }

        setActiveTimers(remaining);
      } catch {
        setActiveTimers([]);
      }
    };

    // 초기 실행
    checkTimers();

    // 1초마다 확인
    const interval = setInterval(checkTimers, 1000);

    return () => clearInterval(interval);
  }, [showNotification, settings]);

  // 오래된 알림 기록 정리 (1시간 이상 지난 것)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      Object.keys(lastNotifiedRef.current).forEach(key => {
        if (now - lastNotifiedRef.current[key] > oneHour) {
          delete lastNotifiedRef.current[key];
        }
      });
    }, 60000);
    return () => clearInterval(cleanup);
  }, []);

  // 남은 시간 포맷
  const formatRemaining = (endTime: number) => {
    const diff = endTime - Date.now();
    if (diff <= 0) return '리젠!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAlertStyle = (type?: CompletedAlert['type']) => {
    switch (type) {
      case 'shugo':
        return 'from-orange-500 to-yellow-500';
      case 'trade':
        return 'from-zinc-700 to-zinc-600';
      case 'nahma':
        return 'from-purple-600 to-pink-600';
      case 'rift':
        return 'from-blue-600 to-cyan-500';
      case 'invasion':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-red-600 to-amber-600';
    }
  };

  const getAlertIcon = (type?: CompletedAlert['type']) => {
    switch (type) {
      case 'shugo': return '🦊';
      case 'trade': return '🌑';
      case 'nahma': return '👑';
      case 'rift': return '🌀';
      case 'invasion': return '⚔️';
      default: return '🔥';
    }
  };

  const getAlertTitle = (type?: CompletedAlert['type']) => {
    switch (type) {
      case 'shugo': return '슈고 페스타!';
      case 'trade': return '무역단 초기화!';
      case 'nahma': return '나흐마 출현!';
      case 'rift': return '시공의 균열!';
      case 'invasion': return '차원 침공!';
      default: return '보스 리젠!';
    }
  };

  // 아무것도 없으면 렌더링하지 않음
  if (alerts.length === 0 && activeTimers.length === 0 && upcomingEvents.length === 0) {
    return null;
  }

  return (
    <>
      {/* 상단 임박 알림 바 */}
      {upcomingEvents.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[9998] bg-zinc-900/95 backdrop-blur border-b border-zinc-700">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center gap-4 flex-wrap">
            <span className="text-zinc-400 text-xs">임박</span>
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span>{event.icon}</span>
                <span className={`text-sm font-medium ${event.color}`}>{event.name}</span>
                <span className="text-white font-mono text-sm font-bold">{formatSeconds(event.seconds)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 팝업 알림 */}
      {alerts.length > 0 && (
        <div className={`fixed ${upcomingEvents.length > 0 ? 'top-14' : 'top-4'} right-4 z-[9999] space-y-2 max-w-sm`}>
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-gradient-to-r ${getAlertStyle(alert.type)} text-white rounded-xl p-4 shadow-2xl animate-bounce`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getAlertIcon(alert.type)}</span>
                  <div>
                    <div className="font-bold text-lg">{getAlertTitle(alert.type)}</div>
                    <div className="text-sm opacity-90">{alert.bossName}</div>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-white/70 hover:text-white text-xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 활성 타이머 미니 위젯 (일정 페이지가 아닐 때만) */}
      {activeTimers.length > 0 && typeof window !== 'undefined' && !window.location.pathname.includes('/schedule') && (
        <Link
          href="/schedule"
          className="fixed bottom-4 right-4 z-50 bg-zinc-800/95 backdrop-blur border border-amber-500/50 rounded-xl p-3 shadow-lg hover:border-amber-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl animate-pulse">⏱️</span>
            <div>
              <div className="text-amber-400 font-bold text-sm">
                보스 타이머 {activeTimers.length}개
              </div>
              {activeTimers.slice(0, 2).map(timer => (
                <div key={timer.bossName} className="text-xs text-zinc-400">
                  {timer.bossName}: <span className="text-white font-mono">{formatRemaining(timer.endTime)}</span>
                </div>
              ))}
              {activeTimers.length > 2 && (
                <div className="text-xs text-zinc-500">+{activeTimers.length - 2}개 더...</div>
              )}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
