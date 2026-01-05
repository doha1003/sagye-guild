import { NextRequest, NextResponse } from 'next/server';

const AION2TOOL_BASE_URL = 'https://www.aion2tool.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${AION2TOOL_BASE_URL}/${pathString}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.aion2tool.com/',
      },
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'aion2tool API error', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('aion2tool proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from aion2tool' },
      { status: 500 }
    );
  }
}
