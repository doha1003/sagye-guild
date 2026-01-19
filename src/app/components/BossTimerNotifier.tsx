'use client';

import { useState, useEffect, useCallback } from 'react';
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
}

export default function BossTimerNotifier() {
  const [alerts, setAlerts] = useState<CompletedAlert[]>([]);
  const [activeTimers, setActiveTimers] = useState<BossTimer[]>([]);

  // 알림 표시
  const showNotification = useCallback((bossName: string) => {
    // 브라우저 알림
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🔥 보스 리젠!', {
        body: `${bossName} 리젠 시간입니다!`,
        icon: '/favicon.ico',
        tag: bossName,
      });
    }

    // 인앱 팝업
    const alertId = `${bossName}-${Date.now()}`;
    setAlerts(prev => [...prev, { id: alertId, bossName, timestamp: Date.now() }]);

    // 10초 후 자동 닫기
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }, 10000);
  }, []);

  // 알림 닫기
  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // 1초마다 타이머 체크
  useEffect(() => {
    const checkTimers = () => {
      if (typeof window === 'undefined') return;

      const saved = localStorage.getItem('bossTimers');
      if (!saved) {
        setActiveTimers([]);
        return;
      }

      try {
        const timers = JSON.parse(saved) as BossTimer[];
        const now = Date.now();

        // 완료된 타이머 찾기
        const completed = timers.filter(t => t.endTime <= now);
        const remaining = timers.filter(t => t.endTime > now);

        // 완료된 타이머에 대해 알림
        if (completed.length > 0) {
          completed.forEach(timer => {
            showNotification(timer.bossName);
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
  }, [showNotification]);

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

  // 아무것도 없으면 렌더링하지 않음
  if (alerts.length === 0 && activeTimers.length === 0) {
    return null;
  }

  return (
    <>
      {/* 팝업 알림 */}
      {alerts.length > 0 && (
        <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className="bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl p-4 shadow-2xl animate-bounce"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <div className="font-bold text-lg">보스 리젠!</div>
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
