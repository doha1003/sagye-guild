import { NextRequest, NextResponse } from 'next/server';

// Edge Runtime으로 변경하여 더 빠른 응답
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const size = request.nextUrl.searchParams.get('size') || '300'; // 기본 300px

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // 허용된 도메인만 프록시
  const allowedDomains = ['upload3.inven.co.kr', 'upload.inven.co.kr'];
  let finalUrl = url;

  try {
    const parsedUrl = new URL(url);
    if (!allowedDomains.includes(parsedUrl.hostname)) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }
    // 인벤 이미지 리사이즈 파라미터 추가
    finalUrl = `${url}?MW=${size}`;
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const response = await fetch(finalUrl, {
      headers: {
        'Referer': 'https://www.inven.co.kr/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400', // 7일 캐시
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
