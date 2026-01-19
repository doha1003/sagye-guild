'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface PersonalSettings {
  shugoFesta: boolean;
  riftPortal: boolean;
  blackCloudTrade: boolean;
  nahmaAlert: boolean;
  soundEnabled: boolean;
}

interface BossTimer {
  bossName: string;
  endTime: number;
}

export default function AlertBar() {
  const [settings, setSettings] = useState<PersonalSettings>({
    shugoFesta: true,
    riftPortal: true,
    blackCloudTrade: true,
    nahmaAlert: true,
    soundEnabled: true,
  });
  const [bossTimers, setBossTimers] = useState<BossTimer[]>([]);
  const [now, setNow] = useState(new Date());
  const notifiedAlertsRef = useRef<Set<string>>(new Set());
  const startNotifiedRef = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);

  // 비프음 재생 함수
  const playBeep = useCallback(() => {
    if (!settings.soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800; // 800Hz 음
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio API 지원하지 않는 경우 무시
    }
  }, [settings.soundEnabled]);

  // 설정 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('personalAlertSettings');
    if (saved) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch {
        // ignore
      }
    }
  }, []);

  // 보스 타이머 로드
  useEffect(() => {
    const loadTimers = () => {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem('bossTimers');
      if (saved) {
        try {
          const timers = JSON.parse(saved) as BossTimer[];
          setBossTimers(timers.filter(t => t.endTime > Date.now()));
        } catch {
          setBossTimers([]);
        }
      }
    };
    loadTimers();
    const interval = setInterval(loadTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1초마다 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 다음 슈고 페스타까지 남은 시간 (초)
  const getSecondsUntilShugo = () => {
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    let nextTarget = [15, 45].find(m => m > currentMinute);
    if (nextTarget === undefined) nextTarget = 15 + 60;
    return (nextTarget - currentMinute - 1) * 60 + (60 - currentSecond);
  };

  // 다음 시공까지 남은 시간 (초)
  const getSecondsUntilRift = () => {
    const riftHours = [2, 5, 8, 11, 14, 17, 20, 23];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    let nextRift = riftHours.find(h => h > currentHour);
    if (nextRift === undefined) nextRift = riftHours[0] + 24;
    return (nextRift - currentHour - 1) * 3600 + (59 - currentMinute) * 60 + (60 - currentSecond);
  };

  // 다음 무역단 초기화까지 남은 시간 (초)
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

  // 초를 포맷
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

  // 모든 알림 항목 생성
  const getAllAlerts = () => {
    const alerts: { text: string; icon: string; color: string; urgent: boolean }[] = [];
    const FIVE_MINUTES = 300;

    // 보스 타이머 (5분 이내)
    bossTimers.forEach(timer => {
      const secsLeft = Math.floor((timer.endTime - Date.now()) / 1000);
      if (secsLeft > 0 && secsLeft <= FIVE_MINUTES) {
        alerts.push({
          text: `${timer.bossName} ${formatSeconds(secsLeft)}`,
          icon: '🔥',
          color: secsLeft <= 60 ? 'text-red-400' : 'text-amber-400',
          urgent: secsLeft <= 60,
        });
      }
    });

    // 슈고 페스타 (5분 이내)
    if (settings.shugoFesta) {
      const secs = getSecondsUntilShugo();
      if (secs <= FIVE_MINUTES) {
        alerts.push({
          text: `슈고 페스타 ${formatSeconds(secs)}`,
          icon: '🦊',
          color: secs <= 60 ? 'text-red-400' : 'text-orange-400',
          urgent: secs <= 60,
        });
      }
    }

    // 시공의 균열 (5분 이내)
    if (settings.riftPortal) {
      const secs = getSecondsUntilRift();
      if (secs <= FIVE_MINUTES) {
        alerts.push({
          text: `시공의 균열 ${formatSeconds(secs)}`,
          icon: '🌀',
          color: secs <= 60 ? 'text-red-400' : 'text-cyan-400',
          urgent: secs <= 60,
        });
      }
    }

    // 무역단 (5분 이내)
    if (settings.blackCloudTrade) {
      const secs = getSecondsUntilTrade();
      if (secs <= FIVE_MINUTES) {
        alerts.push({
          text: `무역단 초기화 ${formatSeconds(secs)}`,
          icon: '🌑',
          color: secs <= 60 ? 'text-red-400' : 'text-yellow-400',
          urgent: secs <= 60,
        });
      }
    }

    // 나흐마 (10분 이내)
    if (settings.nahmaAlert) {
      const secs = getSecondsUntilNahma();
      if (secs <= 600 && secs > 0) {
        alerts.push({
          text: `나흐마 ${formatSeconds(secs)}`,
          icon: '👑',
          color: secs <= 60 ? 'text-red-400' : 'text-purple-400',
          urgent: secs <= 60,
        });
      }
    }

    return alerts.sort((a, b) => (a.urgent === b.urgent ? 0 : a.urgent ? -1 : 1));
  };

  const alerts = getAllAlerts();

  // 소리 설정 토글
  const toggleSound = () => {
    setSettings(prev => {
      const updated = { ...prev, soundEnabled: !prev.soundEnabled };
      localStorage.setItem('personalAlertSettings', JSON.stringify(updated));
      return updated;
    });
  };

  // 새 알림이 5분 이내로 들어왔을 때 비프음 + 시작 시 비프음
  useEffect(() => {
    if (!settings.soundEnabled) return;

    const currentAlertKeys = alerts.map(a => {
      // 알림 타입만 추출 (시간 제외)
      const match = a.text.match(/^(.+?)\s+[\d:]/);
      return match ? match[1] : a.text;
    });

    // 새로 추가된 알림 확인 (5분 전)
    currentAlertKeys.forEach(key => {
      if (!notifiedAlertsRef.current.has(key)) {
        playBeep();
        notifiedAlertsRef.current.add(key);
      }
    });

    // 시작 시 알림 (urgent 상태가 된 알림)
    alerts.forEach(a => {
      const match = a.text.match(/^(.+?)\s+[\d:]/);
      const key = match ? match[1] : a.text;
      if (a.urgent && !startNotifiedRef.current.has(key)) {
        playBeep();
        startNotifiedRef.current.add(key);
      }
    });

    // 지나간 알림 정리
    notifiedAlertsRef.current.forEach(key => {
      if (!currentAlertKeys.includes(key)) {
        notifiedAlertsRef.current.delete(key);
        startNotifiedRef.current.delete(key);
      }
    });
  }, [alerts, settings.soundEnabled, playBeep]);

  // 알림 없을 때
  if (alerts.length === 0) {
    return (
      <div className="bg-zinc-800/50 border-b border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <span>⏰</span>
          <span>임박한 이벤트 없음</span>
          <span className="text-zinc-600">·</span>
          <button
            onClick={toggleSound}
            className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
              settings.soundEnabled
                ? 'text-green-400 hover:text-green-300'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${alerts.some(a => a.urgent) ? 'bg-red-900/50' : 'bg-zinc-800/80'} border-b border-zinc-700`}>
      <div className="flex items-center">
        {/* 소리 토글 버튼 */}
        <button
          onClick={toggleSound}
          className={`px-2 py-1 text-sm flex-shrink-0 transition-colors ${
            settings.soundEnabled
              ? 'text-green-400 hover:text-green-300'
              : 'text-zinc-500 hover:text-zinc-400'
          }`}
          title={settings.soundEnabled ? '알림음 끄기' : '알림음 켜기'}
        >
          {settings.soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* 스크롤 알림 */}
        <div className="overflow-hidden flex-1">
          <div className="py-1 whitespace-nowrap animate-marquee">
            <div className="inline-flex items-center gap-6 px-2">
              {[...alerts, ...alerts].map((alert, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5">
                  <span>{alert.icon}</span>
                  <span className={`font-medium ${alert.color}`}>{alert.text}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
