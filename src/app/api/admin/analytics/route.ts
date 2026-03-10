import { NextRequest, NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { kv } from '@vercel/kv';
import { verifyAdminPassword } from '@/lib/firebase-server';

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID!;

function getAnalyticsClient() {
  const credentials = JSON.parse(process.env.GA_SERVICE_ACCOUNT_KEY || '{}');
  return new BetaAnalyticsDataClient({ credentials });
}

export async function POST(request: NextRequest) {
  try {
    const { password, startDate, endDate } = await request.json();

    const isAdmin = await verifyAdminPassword(password);
    if (!isAdmin) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
      const key = `admin_rate:${ip}`;
      const count = await kv.incr(key).catch(() => 0);
      if (count === 1) await kv.expire(key, 600).catch(() => {});
      if (count > 5) {
        return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = getAnalyticsClient();
    const propertyId = GA_PROPERTY_ID;

    const rangeStart = startDate || '7daysAgo';
    const rangeEnd = endDate || 'today';

    const [
      realtimeRes, todayRes, pagesRes, deviceRes, cityRes, weeklyRes,
      deviceDetailRes, sessionDetailRes, referralRes,
    ] = await Promise.all([
      // 실시간 접속자
      client.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      }),
      // 오늘 방문자
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'newUsers' },
        ],
      }),
      // 인기 페이지
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      // 기기 비율
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
      }),
      // 도시별
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),
      // 일별 방문자
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
      }),
      // 기기 상세 (제조사, OS, 브라우저)
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [
          { name: 'deviceCategory' },
          { name: 'mobileDeviceBranding' },
          { name: 'operatingSystem' },
          { name: 'browser' },
        ],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 30,
      }),
      // 세션 상세 (도시+기기+제조사+페이지)
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [
          { name: 'city' },
          { name: 'deviceCategory' },
          { name: 'mobileDeviceBranding' },
          { name: 'pagePath' },
        ],
        metrics: [{ name: 'activeUsers' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 50,
      }),
      // 유입 경로
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 20,
      }),
    ]);

    const realtime = Number(realtimeRes[0]?.rows?.[0]?.metricValues?.[0]?.value || 0);

    const todayRow = todayRes[0]?.rows?.[0]?.metricValues || [];
    const today = {
      users: Number(todayRow[0]?.value || 0),
      pageViews: Number(todayRow[1]?.value || 0),
      avgDuration: Math.round(Number(todayRow[2]?.value || 0)),
      newUsers: Number(todayRow[3]?.value || 0),
    };

    const pages = (pagesRes[0]?.rows || []).map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: Number(row.metricValues?.[0]?.value || 0),
      users: Number(row.metricValues?.[1]?.value || 0),
      avgDuration: Math.round(Number(row.metricValues?.[2]?.value || 0)),
    }));

    const devices = (deviceRes[0]?.rows || []).map(row => ({
      device: row.dimensionValues?.[0]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    const cities = (cityRes[0]?.rows || []).map(row => ({
      city: row.dimensionValues?.[0]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    const weekly = (weeklyRes[0]?.rows || []).map(row => ({
      date: row.dimensionValues?.[0]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
      pageViews: Number(row.metricValues?.[1]?.value || 0),
    }));

    const deviceDetails = (deviceDetailRes[0]?.rows || []).map(row => ({
      device: row.dimensionValues?.[0]?.value || '',
      brand: row.dimensionValues?.[1]?.value || '',
      os: row.dimensionValues?.[2]?.value || '',
      browser: row.dimensionValues?.[3]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    const sessionDetails = (sessionDetailRes[0]?.rows || []).map(row => ({
      city: row.dimensionValues?.[0]?.value || '',
      device: row.dimensionValues?.[1]?.value || '',
      brand: row.dimensionValues?.[2]?.value || '',
      page: row.dimensionValues?.[3]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
      avgDuration: Math.round(Number(row.metricValues?.[1]?.value || 0)),
    }));

    const referrals = (referralRes[0]?.rows || []).map(row => ({
      source: row.dimensionValues?.[0]?.value || '',
      medium: row.dimensionValues?.[1]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
      pageViews: Number(row.metricValues?.[1]?.value || 0),
    }));

    return NextResponse.json({
      realtime, today, pages, devices, cities, weekly,
      deviceDetails, sessionDetails, referrals,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
