'use client';

import { useState } from 'react';

interface AnalyticsData {
  realtime: number;
  today: { users: number; pageViews: number; avgDuration: number; newUsers: number };
  pages: { path: string; views: number; users: number; avgDuration: number }[];
  devices: { device: string; users: number }[];
  cities: { city: string; users: number }[];
  weekly: { date: string; users: number; pageViews: number }[];
  deviceDetails: { device: string; brand: string; os: string; browser: string; users: number }[];
  sessionDetails: { city: string; device: string; brand: string; page: string; users: number; avgDuration: number }[];
  referrals: { source: string; medium: string; users: number; pageViews: number }[];
}

type DateRange = 'today' | '7days' | '30days';

const PAGE_NAMES: Record<string, string> = {
  '/': '메인',
  '/members': '레기온원',
  '/schedule': '일정표',
  '/notice': '공지사항',
  '/season2': '시즌2',
  '/craft': '제작 계산기',
  '/tips/appearance': '외형 정보',
  '/tips/pets': '펫 DB',
  '/tips/tuning': '조율 팁',
  '/updates': '업데이트 내역',
  '/terms': '이용약관',
};

const DEVICE_NAMES: Record<string, string> = {
  desktop: 'PC',
  mobile: '모바일',
  tablet: '태블릿',
};

const DATE_RANGE_CONFIG: Record<DateRange, { label: string; startDate: string; endDate: string }> = {
  today: { label: '오늘', startDate: 'today', endDate: 'today' },
  '7days': { label: '7일', startDate: '7daysAgo', endDate: 'today' },
  '30days': { label: '30일', startDate: '30daysAgo', endDate: 'today' },
};

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

function formatDate(raw: string) {
  if (raw.length !== 8) return raw;
  return `${raw.slice(4, 6)}/${raw.slice(6, 8)}`;
}

function notSet(v: string) {
  return v === '(not set)' || v === '(not provided)';
}

function PasswordSection({ adminPassword }: { adminPassword: string }) {
  const [siteForm, setSiteForm] = useState({ newPassword: '', confirm: '' });
  const [adminForm, setAdminForm] = useState({ newPassword: '', confirm: '' });
  const [siteMsg, setSiteMsg] = useState({ text: '', ok: false });
  const [adminMsg, setAdminMsg] = useState({ text: '', ok: false });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = async (type: 'site' | 'admin') => {
    const form = type === 'site' ? siteForm : adminForm;
    const setMsg = type === 'site' ? setSiteMsg : setAdminMsg;
    const setForm = type === 'site' ? setSiteForm : setAdminForm;

    if (!form.newPassword || !form.confirm) {
      setMsg({ text: '모든 항목을 입력해주세요.', ok: false });
      return;
    }
    if (form.newPassword !== form.confirm) {
      setMsg({ text: '새 비밀번호가 일치하지 않습니다.', ok: false });
      return;
    }
    if (form.newPassword.length < 4) {
      setMsg({ text: '비밀번호는 4자 이상이어야 합니다.', ok: false });
      return;
    }

    setSubmitting(true);
    setMsg({ text: '', ok: false });
    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword, type, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: `${type === 'site' ? '사이트' : '관리자'} 비밀번호가 변경되었습니다.`, ok: true });
        setForm({ newPassword: '', confirm: '' });
      } else {
        setMsg({ text: data.error || '변경에 실패했습니다.', ok: false });
      }
    } catch {
      setMsg({ text: '오류가 발생했습니다.', ok: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
      <h2 className="font-bold text-white mb-4">비밀번호 관리</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-amber-400 text-sm font-bold mb-3">사이트 비밀번호 변경</h3>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="새 비밀번호"
              value={siteForm.newPassword}
              onChange={e => setSiteForm(f => ({ ...f, newPassword: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
            />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              value={siteForm.confirm}
              onChange={e => setSiteForm(f => ({ ...f, confirm: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
            />
            {siteMsg.text && <p className={`text-sm ${siteMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{siteMsg.text}</p>}
            <button
              onClick={() => handleChange('site')}
              disabled={submitting}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? '변경 중...' : '변경'}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-amber-400 text-sm font-bold mb-3">관리자 비밀번호 변경</h3>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="새 비밀번호"
              value={adminForm.newPassword}
              onChange={e => setAdminForm(f => ({ ...f, newPassword: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
            />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              value={adminForm.confirm}
              onChange={e => setAdminForm(f => ({ ...f, confirm: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
            />
            {adminMsg.text && <p className={`text-sm ${adminMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{adminMsg.text}</p>}
            <button
              onClick={() => handleChange('admin')}
              disabled={submitting}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? '변경 중...' : '변경'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('7days');

  const fetchData = async (pw: string, range?: DateRange) => {
    setLoading(true);
    setError('');
    const r = range || dateRange;
    const { startDate, endDate } = DATE_RANGE_CONFIG[r];
    try {
      const res = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw, startDate, endDate }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error('비밀번호가 틀렸습니다.');
        throw new Error('데이터를 불러올 수 없습니다.');
      }
      const result = await res.json();
      setData(result);
      setAuthenticated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(password);
  };

  const refresh = () => fetchData(password);

  const handleDateRange = (range: DateRange) => {
    setDateRange(range);
    fetchData(password, range);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-amber-400 mb-6 text-center">관리자 대시보드</h1>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="관리자 비밀번호"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-amber-500"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    );
  }

  if (!data) return null;

  const totalDeviceUsers = data.devices.reduce((s, d) => s + d.users, 0);
  const maxWeeklyViews = Math.max(...data.weekly.map(w => w.pageViews), 1);

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/80 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-amber-400">관리자 대시보드</h1>
          <div className="flex items-center gap-2">
            <a
              href="https://docs.google.com/spreadsheets/d/1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-400 hover:text-green-300 bg-green-900/30 border border-green-700/50 px-3 py-1.5 rounded-lg"
            >
              구글시트
            </a>
            <button onClick={refresh} className="text-sm text-zinc-400 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg">
              {loading ? '로딩...' : '새로고침'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* 날짜 범위 선택 */}
        <div className="flex gap-2">
          {(Object.entries(DATE_RANGE_CONFIG) as [DateRange, typeof DATE_RANGE_CONFIG[DateRange]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => handleDateRange(key)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === key
                  ? 'bg-amber-500 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              } disabled:opacity-50`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* 실시간 + 오늘 요약 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{data.realtime}</div>
            <div className="text-zinc-400 text-sm mt-1">실시간 접속</div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{data.today.users}</div>
            <div className="text-zinc-400 text-sm mt-1">오늘 방문자</div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{data.today.pageViews}</div>
            <div className="text-zinc-400 text-sm mt-1">페이지뷰</div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{data.today.newUsers}</div>
            <div className="text-zinc-400 text-sm mt-1">신규 방문</div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{formatDuration(data.today.avgDuration)}</div>
            <div className="text-zinc-400 text-sm mt-1">평균 체류</div>
          </div>
        </div>

        {/* 추이 차트 */}
        <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
          <h2 className="font-bold text-white mb-4">방문 추이</h2>
          <div className="flex items-end gap-1 h-32">
            {data.weekly.map(day => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-zinc-400">{day.pageViews}</div>
                <div
                  className="w-full bg-amber-500/70 rounded-t"
                  style={{ height: `${(day.pageViews / maxWeeklyViews) * 100}%`, minHeight: 4 }}
                />
                <div className="text-xs text-zinc-500">{formatDate(day.date)}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>방문자: {data.weekly.map(w => w.users).join(' → ')}</span>
          </div>
        </section>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* 인기 페이지 (체류시간 포함) */}
          <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
            <h2 className="font-bold text-white mb-4">인기 페이지</h2>
            <div className="space-y-2">
              {data.pages.map((page, i) => (
                <div key={page.path} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 w-5">{i + 1}</span>
                    <span className="text-white">{PAGE_NAMES[page.path] || page.path}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-amber-400">{page.views}뷰</span>
                    <span className="text-zinc-500">{page.users}명</span>
                    <span className="text-zinc-600">{formatDuration(page.avgDuration)}</span>
                  </div>
                </div>
              ))}
              {data.pages.length === 0 && <p className="text-zinc-500 text-sm">데이터 없음</p>}
            </div>
          </section>

          {/* 기기 + 지역 */}
          <div className="space-y-6">
            <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
              <h2 className="font-bold text-white mb-4">기기 비율</h2>
              <div className="space-y-3">
                {data.devices.map(d => {
                  const pct = totalDeviceUsers > 0 ? Math.round((d.users / totalDeviceUsers) * 100) : 0;
                  return (
                    <div key={d.device}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{DEVICE_NAMES[d.device] || d.device}</span>
                        <span className="text-zinc-400">{pct}% ({d.users}명)</span>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
              <h2 className="font-bold text-white mb-4">지역별 방문</h2>
              <div className="space-y-2">
                {data.cities.map((c, i) => (
                  <div key={c.city} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 w-5">{i + 1}</span>
                      <span className="text-white">{notSet(c.city) ? '알 수 없음' : c.city}</span>
                    </div>
                    <span className="text-zinc-400">{c.users}명</span>
                  </div>
                ))}
                {data.cities.length === 0 && <p className="text-zinc-500 text-sm">데이터 없음</p>}
              </div>
            </section>
          </div>
        </div>

        {/* 기기 상세 */}
        <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
          <h2 className="font-bold text-white mb-4">기기 상세</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-700">
                  <th className="text-left py-2 pr-4">기기</th>
                  <th className="text-left py-2 pr-4">제조사</th>
                  <th className="text-left py-2 pr-4">OS</th>
                  <th className="text-left py-2 pr-4">브라우저</th>
                  <th className="text-right py-2">방문자</th>
                </tr>
              </thead>
              <tbody>
                {data.deviceDetails.map((d, i) => (
                  <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="py-2 pr-4 text-white">{DEVICE_NAMES[d.device] || d.device}</td>
                    <td className="py-2 pr-4 text-zinc-300">{notSet(d.brand) ? '-' : d.brand}</td>
                    <td className="py-2 pr-4 text-zinc-300">{notSet(d.os) ? '-' : d.os}</td>
                    <td className="py-2 pr-4 text-zinc-300">{notSet(d.browser) ? '-' : d.browser}</td>
                    <td className="py-2 text-right text-amber-400">{d.users}명</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.deviceDetails.length === 0 && <p className="text-zinc-500 text-sm mt-2">데이터 없음</p>}
          </div>
        </section>

        {/* 세션 상세 */}
        <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
          <h2 className="font-bold text-white mb-4">세션 상세</h2>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-800">
                <tr className="text-zinc-400 border-b border-zinc-700">
                  <th className="text-left py-2 pr-4">도시</th>
                  <th className="text-left py-2 pr-4">기기</th>
                  <th className="text-left py-2 pr-4">제조사</th>
                  <th className="text-left py-2 pr-4">페이지</th>
                  <th className="text-right py-2 pr-4">방문자</th>
                  <th className="text-right py-2">체류시간</th>
                </tr>
              </thead>
              <tbody>
                {data.sessionDetails.map((s, i) => (
                  <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="py-2 pr-4 text-white">{notSet(s.city) ? '알 수 없음' : s.city}</td>
                    <td className="py-2 pr-4 text-zinc-300">{DEVICE_NAMES[s.device] || s.device}</td>
                    <td className="py-2 pr-4 text-zinc-300">{notSet(s.brand) ? '-' : s.brand}</td>
                    <td className="py-2 pr-4 text-zinc-300">{PAGE_NAMES[s.page] || s.page}</td>
                    <td className="py-2 pr-4 text-right text-amber-400">{s.users}명</td>
                    <td className="py-2 text-right text-zinc-400">{formatDuration(s.avgDuration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.sessionDetails.length === 0 && <p className="text-zinc-500 text-sm mt-2">데이터 없음</p>}
          </div>
        </section>

        {/* 유입 경로 */}
        <section className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
          <h2 className="font-bold text-white mb-4">유입 경로</h2>
          <div className="space-y-2">
            {data.referrals.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 w-5">{i + 1}</span>
                  <span className="text-white">
                    {notSet(r.source) ? '직접 방문' : r.source}
                    {!notSet(r.medium) && <span className="text-zinc-500 ml-1">/ {r.medium}</span>}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-400">{r.users}명</span>
                  <span className="text-zinc-500">{r.pageViews}뷰</span>
                </div>
              </div>
            ))}
            {data.referrals.length === 0 && <p className="text-zinc-500 text-sm">데이터 없음</p>}
          </div>
        </section>

        <PasswordSection adminPassword={password} />
      </main>
    </div>
  );
}
