'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PersonalSettings {
  shugoFesta: boolean;
  riftPortal: boolean;
  blackCloudTrade: boolean;
  nahmaAlert: boolean;
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
  });
  const [bossTimers, setBossTimers] = useState<BossTimer[]>([]);
  const [now, setNow] = useState(new Date());

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

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${alerts.some(a => a.urgent) ? 'bg-red-900/50' : 'bg-zinc-800/80'} border-b border-zinc-700`}>
      <div className="py-1 whitespace-nowrap animate-marquee">
        <div className="inline-flex items-center gap-6 px-4">
          {[...alerts, ...alerts].map((alert, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5">
              <span>{alert.icon}</span>
              <span className={`font-medium ${alert.color}`}>{alert.text}</span>
            </span>
          ))}
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
