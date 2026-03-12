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

    // 기본 6개 report (기존 기능)
    const [
      realtimeRes, todayRes, pagesRes, deviceRes, cityRes, weeklyRes,
    ] = await Promise.all([
      client.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      }),
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
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
      }),
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
      }),
    ]);

    // 추가 report (실패해도 기본 데이터는 반환)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const safeReport = async (fn: () => Promise<any[]>): Promise<any[]> => {
      try { return await fn(); } catch { return [{ rows: [] }]; }
    };

    const [deviceDetailRes, sessionDetailRes, referralRes, buttonClickRes, referralDetailRes, searchLandingRes] = await Promise.all([
      safeReport(() => client.runReport({
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
      })),
      safeReport(() => client.runReport({
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
      })),
      safeReport(() => client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 20,
      })),
      safeReport(() => client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: 'button_click' },
          },
        },
        dimensions: [{ name: 'customEvent:button_name' }, { name: 'pagePath' }],
        metrics: [{ name: 'eventCount' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 30,
      })),
      safeReport(() => client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensions: [
          { name: 'sessionSource' },
          { name: 'sessionMedium' },
          { name: 'sessionDefaultChannelGroup' },
          { name: 'landingPagePlusQueryString' },
        ],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 30,
      })),
      safeReport(() => client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: rangeStart, endDate: rangeEnd }],
        dimensionFilter: {
          filter: {
            fieldName: 'sessionDefaultChannelGroup',
            stringFilter: { value: 'Organic Search' },
          },
        },
        dimensions: [{ name: 'sessionSource' }, { name: 'pagePath' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 20,
      })),
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

    const mapRows = (res: any[], fn: (row: any) => any) => (res[0]?.rows || []).map(fn);

    const deviceDetails = mapRows(deviceDetailRes, row => ({
      device: row.dimensionValues?.[0]?.value || '',
      brand: row.dimensionValues?.[1]?.value || '',
      os: row.dimensionValues?.[2]?.value || '',
      browser: row.dimensionValues?.[3]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    const sessionDetails = mapRows(sessionDetailRes, row => ({
      city: row.dimensionValues?.[0]?.value || '',
      device: row.dimensionValues?.[1]?.value || '',
      brand: row.dimensionValues?.[2]?.value || '',
      page: row.dimensionValues?.[3]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
      avgDuration: Math.round(Number(row.metricValues?.[1]?.value || 0)),
    }));

    const referrals = mapRows(referralRes, row => ({
      source: row.dimensionValues?.[0]?.value || '',
      medium: row.dimensionValues?.[1]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
      pageViews: Number(row.metricValues?.[1]?.value || 0),
    }));

    const buttonClicks = mapRows(buttonClickRes, row => ({
      buttonName: row.dimensionValues?.[0]?.value || '',
      pagePath: row.dimensionValues?.[1]?.value || '',
      count: Number(row.metricValues?.[0]?.value || 0),
    }));

    const referralDetails = mapRows(referralDetailRes, row => ({
      source: row.dimensionValues?.[0]?.value || '',
      medium: row.dimensionValues?.[1]?.value || '',
      channelGroup: row.dimensionValues?.[2]?.value || '',
      landingPage: row.dimensionValues?.[3]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
      pageViews: Number(row.metricValues?.[1]?.value || 0),
    }));

    const searchLandings = mapRows(searchLandingRes, row => ({
      source: row.dimensionValues?.[0]?.value || '',
      pagePath: row.dimensionValues?.[1]?.value || '',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    // Vercel KV 자체 카운터 데이터 조회
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const kvDailyData: { date: string; visitors: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(kst.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `visitors:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      const val = await kv.get<number>(key);
      if (val) kvDailyData.push({ date: key.replace('visitors:', ''), visitors: val });
    }
    const kvTotal = await kv.get<number>('visitors:total') || 0;
    const kvTodayKey = `visitors:${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, '0')}-${String(kst.getUTCDate()).padStart(2, '0')}`;
    const kvToday = await kv.get<number>(kvTodayKey) || 0;

    return NextResponse.json({
      realtime, today, pages, devices, cities, weekly,
      deviceDetails, sessionDetails, referrals, buttonClicks,
      referralDetails, searchLandings,
      kvStats: { total: kvTotal, today: kvToday, daily: kvDailyData.reverse() },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
