import { NextRequest, NextResponse } from 'next/server';

const PLAYNC_BASE_URL = 'https://aion2.plaync.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${PLAYNC_BASE_URL}/${pathString}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 60 }, // 1분 캐시
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'PlayNC API error', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('PlayNC proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from PlayNC' },
      { status: 500 }
    );
  }
}
