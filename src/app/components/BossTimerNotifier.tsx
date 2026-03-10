'use client';

import { useEffect, useCallback, useRef } from 'react';

// 브라우저 알림만 처리하는 간소화된 컴포넌트
export default function BossTimerNotifier() {
  const lastNotifiedRef = useRef<Record<string, number>>({});

  const showBrowserNotification = useCallback((title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  }, []);

  useEffect(() => {
    const checkAlerts = () => {
      if (typeof window === 'undefined') return;

      const now = new Date();
      const currentMinute = now.getMinutes();
      const currentHour = now.getHours();
      const currentDay = now.getDay();
      const currentSecond = now.getSeconds();
      const timeKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${currentHour}-${currentMinute}`;

      // 설정 로드
      const savedSettings = localStorage.getItem('personalAlertSettings');
      let settings: Record<string, boolean> = {};
      if (savedSettings) {
        try {
          settings = JSON.parse(savedSettings);
        } catch {
          // ignore
        }
      }

      // 슈고 페스타 (1분 전)
      if (settings.shugoFesta) {
        const key = `shugo-${timeKey}`;
        if ((currentMinute === 14 || currentMinute === 44) && currentSecond === 0 && !lastNotifiedRef.current[key]) {
          showBrowserNotification('🦊 슈고 페스타', '1분 후 시작!');
          lastNotifiedRef.current[key] = Date.now();
        }
      }

      // 시공의 균열 (5분 전)
      if (settings.riftPortal) {
        const riftHours = [2, 5, 8, 11, 14, 17, 20, 23];
        const key = `rift-${timeKey}`;
        if (riftHours.includes(currentHour) && currentMinute === 55 && currentSecond === 0 && !lastNotifiedRef.current[key]) {
          showBrowserNotification('🌀 시공의 균열', '5분 후 오픈!');
          lastNotifiedRef.current[key] = Date.now();
        }
      }

      // 무역단 (1분 전)
      if (settings.blackCloudTrade) {
        const key = `trade-${timeKey}`;
        if (currentMinute === 59 && currentSecond === 0 && !lastNotifiedRef.current[key]) {
          showBrowserNotification('🌑 검은 구름 무역단', '1분 후 초기화!');
          lastNotifiedRef.current[key] = Date.now();
        }
      }

      // 나흐마 (5분 전)
      if (settings.nahmaAlert) {
        const key = `nahma-${timeKey}`;
        if ((currentDay === 0 || currentDay === 6) && currentHour === 19 && currentMinute === 55 && currentSecond === 0 && !lastNotifiedRef.current[key]) {
          showBrowserNotification('👑 수호신장 나흐마', '5분 후 출현!');
          lastNotifiedRef.current[key] = Date.now();
        }
      }

      // 보스 타이머 체크
      const savedTimers = localStorage.getItem('bossTimers');
      if (savedTimers) {
        try {
          const timers = JSON.parse(savedTimers);
          const nowMs = Date.now();
          const completed = timers.filter((t: { endTime: number }) => t.endTime <= nowMs);
          const remaining = timers.filter((t: { endTime: number }) => t.endTime > nowMs);

          if (completed.length > 0) {
            completed.forEach((timer: { bossName: string }) => {
              showBrowserNotification('🔥 보스 리젠!', `${timer.bossName} 리젠!`);
            });
            localStorage.setItem('bossTimers', JSON.stringify(remaining));
          }
        } catch {
          // ignore
        }
      }
    };

    const interval = setInterval(checkAlerts, 1000);
    return () => clearInterval(interval);
  }, [showBrowserNotification]);

  // 오래된 알림 기록 정리
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

  return null; // UI 없음, 브라우저 알림만
}
