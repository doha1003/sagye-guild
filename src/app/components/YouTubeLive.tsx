'use client';

import { useState, useEffect } from 'react';

interface LiveData {
  isLive: boolean;
  videoId?: string;
  title?: string;
  thumbnail?: string;
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

    checkLive();

    // 5분마다 라이브 상태 확인 (매주 화요일 8시 방송)
    const interval = setInterval(checkLive, 300000);
    return () => clearInterval(interval);
  }, []);

  // 로딩 중이거나 라이브가 아니면 숨김 (접힌 상태로 표시)
  if (loading) {
    return null;
  }

  // 라이브가 아니면 아예 표시하지 않음
  if (!liveData?.isLive) {
    return null;
  }

  return (
    <div className="mt-3">
      <div
        className="bg-gradient-to-r from-red-600/20 to-red-500/10 border border-red-500/30 rounded-xl overflow-hidden"
      >
        {/* 헤더 - 클릭하면 접기/펼치기 */}
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

        {/* 비디오 임베드 */}
        {expanded && liveData.videoId && (
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
