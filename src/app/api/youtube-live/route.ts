import { NextResponse } from 'next/server';

// AION2 공식 유튜브 채널 핸들
const AION2_CHANNEL_HANDLE = 'AION2';

// 채널 ID 캐시 (서버 메모리)
let cachedChannelId: string | null = null;

async function getChannelId(apiKey: string): Promise<string | null> {
  // 캐시된 채널 ID가 있으면 사용
  if (cachedChannelId) {
    return cachedChannelId;
  }

  try {
    // 채널 핸들로 채널 ID 조회
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${AION2_CHANNEL_HANDLE}&key=${apiKey}`;
    const response = await fetch(channelUrl);

    if (!response.ok) {
      console.error('Failed to get channel ID');
      return null;
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      cachedChannelId = data.items[0].id;
      console.log('AION2 Channel ID:', cachedChannelId);
      return cachedChannelId;
    }

    return null;
  } catch (error) {
    console.error('Error getting channel ID:', error);
    return null;
  }
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // 채널 ID 가져오기
    const channelId = await getChannelId(apiKey);

    if (!channelId) {
      return NextResponse.json({
        isLive: false,
        error: 'Channel not found'
      });
    }

    // 채널의 라이브 방송 검색
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}`;

    const response = await fetch(searchUrl, {
      next: { revalidate: 60 }, // 1분마다 캐시 갱신
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API error:', errorData);
      return NextResponse.json({
        isLive: false,
        error: 'YouTube API error'
      });
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const liveVideo = data.items[0];
      return NextResponse.json({
        isLive: true,
        videoId: liveVideo.id.videoId,
        title: liveVideo.snippet.title,
        thumbnail: liveVideo.snippet.thumbnails.high?.url || liveVideo.snippet.thumbnails.default?.url,
        channelId: channelId,
      });
    }

    return NextResponse.json({
      isLive: false,
      channelId: channelId,
    });
  } catch (error) {
    console.error('YouTube live check error:', error);
    return NextResponse.json({
      isLive: false,
      error: 'Failed to check live status'
    });
  }
}
