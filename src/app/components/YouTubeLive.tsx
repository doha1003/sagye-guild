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

    // 초기 체크
    checkLive();

    // 30분마다 정기 체크 (API 쿼터 절약)
    const intervalId = setInterval(() => {
      checkLive();
    }, 30 * 60 * 1000); // 30분

    return () => clearInterval(intervalId);
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
