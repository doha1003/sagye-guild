'use client';

import { useState, useEffect } from 'react';

interface LatestVideo {
  videoId: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
}

interface LiveData {
  isLive: boolean;
  videoId?: string;
  title?: string;
  thumbnail?: string;
  latestVideo?: LatestVideo;
  error?: string;
}

export default function YouTubeLive() {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkLive = async () => {
      try {
        const res = await fetch('/api/youtube-live');
        const data = await res.json();
        setLiveData(data);

        // 라이브 중이면 자동으로 펼침
        if (data.isLive) {
          setExpanded(true);
        }
      } catch (error) {
        console.error('Failed to check live status:', error);
        setLiveData({ isLive: false, error: 'Failed to check' });
      } finally {
        setLoading(false);
      }
    };

    // 초기 체크 (12시~22시 사이만)
    const isInLiveHours = () => {
      const hour = new Date().getHours();
      return hour >= 12 && hour < 22;
    };

    if (isInLiveHours()) {
      checkLive();
    } else {
      setLoading(false);
    }

    // 다음 체크 시간까지 남은 ms 계산 (매시 29분, 59분 / 12시~22시만)
    const getMsUntilNextCheck = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // 22시 이후면 다음날 12시 29분까지
      if (hour >= 22) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 29, 0, 0);
        return tomorrow.getTime() - now.getTime();
      }

      // 12시 이전이면 오늘 12시 29분까지
      if (hour < 12) {
        const today = new Date(now);
        today.setHours(12, 29, 0, 0);
        return today.getTime() - now.getTime();
      }

      // 12시~22시 사이: 다음 29분 또는 59분
      let targetMinute;
      let targetHour = hour;

      if (minutes < 29) {
        targetMinute = 29;
      } else if (minutes < 59) {
        targetMinute = 59;
      } else {
        targetMinute = 29;
        targetHour = hour + 1;
      }

      // 다음 체크가 22시 이후면 다음날 12시 29분
      if (targetHour >= 22) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 29, 0, 0);
        return tomorrow.getTime() - now.getTime();
      }

      const target = new Date(now);
      target.setHours(targetHour, targetMinute, 0, 0);
      return target.getTime() - now.getTime();
    };

    // 매시 29분, 59분 체크 (12시~22시만, 하루 20회 = 2,000 유닛)
    let timeoutId: NodeJS.Timeout;

    const scheduleCheck = () => {
      const delay = getMsUntilNextCheck();
      timeoutId = setTimeout(() => {
        if (isInLiveHours()) {
          checkLive();
        }
        scheduleCheck();
      }, delay);
    };

    scheduleCheck();

    return () => clearTimeout(timeoutId);
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <div className="mt-3">
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">📺</span>
            <span className="text-zinc-500 text-sm">AION2 방송 확인 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // 라이브 중일 때
  if (liveData?.isLive && liveData.videoId) {
    return (
      <div className="mt-3">
        <div className="bg-gradient-to-r from-red-600/20 to-red-500/10 border border-red-500/30 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-500/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-400 font-bold text-sm">LIVE</span>
              </div>
              <span className="text-white font-medium text-sm truncate max-w-[200px] sm:max-w-none">
                {liveData.title || 'AION2 공식 방송'}
              </span>
            </div>
            <span className="text-zinc-400 text-lg">{expanded ? '▲' : '▼'}</span>
          </button>

          {expanded && (
            <div className="px-4 pb-4">
              <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${liveData.videoId}?autoplay=0`}
                  title={liveData.title || 'AION2 Live'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${liveData.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-zinc-400 hover:text-white text-xs"
              >
                YouTube에서 보기 →
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 라이브 없을 때 - 최신 영상 표시
  const latestVideo = liveData?.latestVideo;

  return (
    <div className="mt-3">
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-red-500">▶</span>
            <span className="text-zinc-300 text-sm font-medium">AION2 공식 영상</span>
            {latestVideo && (
              <span className="text-zinc-500 text-xs truncate max-w-[150px] sm:max-w-[250px]">
                {latestVideo.title}
              </span>
            )}
          </div>
          <span className="text-zinc-500 text-lg">{expanded ? '▲' : '▼'}</span>
        </button>

        {expanded && latestVideo && (
          <div className="px-4 pb-4">
            <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${latestVideo.videoId}`}
                title={latestVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-zinc-500 text-xs truncate max-w-[200px]">{latestVideo.title}</span>
              <a
                href={`https://www.youtube.com/watch?v=${latestVideo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white text-xs"
              >
                YouTube →
              </a>
            </div>
          </div>
        )}

        {expanded && !latestVideo && (
          <div className="px-4 pb-4">
            <a
              href="https://www.youtube.com/@AION2"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-8 text-zinc-500 hover:text-zinc-300"
            >
              AION2 채널 바로가기 →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
