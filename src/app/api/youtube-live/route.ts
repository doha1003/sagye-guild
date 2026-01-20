import { NextResponse } from 'next/server';

// AION2 공식 유튜브 채널 핸들
const AION2_CHANNEL_HANDLE = 'AION2';

// 채널 ID 캐시 (서버 메모리)
let cachedChannelId: string | null = null;

async function getChannelId(apiKey: string): Promise<string | null> {
  if (cachedChannelId) {
    return cachedChannelId;
  }

  try {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${AION2_CHANNEL_HANDLE}&key=${apiKey}`;
    const response = await fetch(channelUrl);

    if (!response.ok) {
      console.error('Failed to get channel ID');
      return null;
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      cachedChannelId = data.items[0].id;
      return cachedChannelId;
    }

    return null;
  } catch (error) {
    console.error('Error getting channel ID:', error);
    return null;
  }
}

async function getLatestVideo(apiKey: string, channelId: string) {
  try {
    // 채널의 최신 영상 1개 가져오기
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=1&key=${apiKey}`;
    const response = await fetch(searchUrl, {
      next: { revalidate: 3600 }, // 1시간마다 캐시 갱신
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        publishedAt: video.snippet.publishedAt,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting latest video:', error);
    return null;
  }
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const channelId = await getChannelId(apiKey);

    if (!channelId) {
      return NextResponse.json({
        isLive: false,
        error: 'Channel not found'
      });
    }

    // 라이브 방송 검색
    const liveUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}`;
    const liveResponse = await fetch(liveUrl, {
      next: { revalidate: 1800 }, // 30분마다 캐시 갱신
    });

    if (liveResponse.ok) {
      const liveData = await liveResponse.json();

      if (liveData.items && liveData.items.length > 0) {
        const liveVideo = liveData.items[0];
        return NextResponse.json({
          isLive: true,
          videoId: liveVideo.id.videoId,
          title: liveVideo.snippet.title,
          thumbnail: liveVideo.snippet.thumbnails.high?.url || liveVideo.snippet.thumbnails.default?.url,
          channelId: channelId,
        });
      }
    }

    // 라이브 없으면 최신 영상 가져오기
    const latestVideo = await getLatestVideo(apiKey, channelId);

    return NextResponse.json({
      isLive: false,
      channelId: channelId,
      latestVideo: latestVideo,
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({
      isLive: false,
      error: 'Failed to check'
    });
  }
}
