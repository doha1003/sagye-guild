'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface Material {
  name: string;
  required: number;
  npcPrice: number;
  marketPrice: number | null;
}

interface InvenItemInfo {
  grade?: string;
  itemLevel?: number;
  equipLevel?: number;
  mainStat?: { option: string; value: string | number }[];
  magicstoneCount?: number;
  randomCount?: number;
  godstoneCount?: number;
  spiritstoneCount?: number;
  invenCode?: number;
  icon?: string;
}

interface CraftRecipe extends InvenItemInfo {
  id: number;
  name: string;
  grade: string;
  category: string;
  successRate: number;
  hasProc: boolean;
  procItem: string;
  procChance: number;
  procSuccessRate: number;
  materials: Material[];
  productPrice: number | null;
  procItemPrice: number | null;
  procItemInfo?: InvenItemInfo;
}

interface ApiResponse {
  recipes: CraftRecipe[];
  categories: string[];
  grades: string[];
  totalCount: number;
}

type SortKey = 'name' | 'grade' | 'successRate' | 'craftCost' | 'profit';
type SortDir = 'asc' | 'desc';

const GRADE_COLORS: Record<string, string> = {
  '일반': 'text-white',
  '고급': 'text-green-400',
  '희귀': 'text-green-400',
  '전승': 'text-blue-400',
  '유일': 'text-yellow-400',
  '영웅': 'text-orange-400',
};

const GRADE_BG: Record<string, string> = {
  '일반': 'bg-zinc-700',
  '고급': 'bg-green-900/60',
  '희귀': 'bg-green-900/60',
  '전승': 'bg-blue-900/60',
  '유일': 'bg-yellow-900/60',
  '영웅': 'bg-orange-900/60',
};

const GRADE_ORDER: Record<string, number> = { '일반': 0, '고급': 1, '희귀': 1, '전승': 2, '유일': 3, '영웅': 4 };
const CATEGORY_TABS = ['전체', '갑옷', '대장', '세공', '연금', '요리'];
const DEFAULT_FEE = 0.12;

function parseNum(value: string): number {
  const n = Number(value.replace(/,/g, '').trim());
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function fmt(value: number): string {
  return Math.round(value).toLocaleString();
}

function fmtShort(value: number): string {
  if (value >= 100_000_000) return (value / 100_000_000).toFixed(1) + '억';
  if (value >= 10_000) return (value / 10_000).toFixed(0) + '만';
  return fmt(value);
}

function getCraftCost(r: CraftRecipe): number {
  return r.materials.reduce((s, m) => s + m.required * (m.marketPrice ?? m.npcPrice), 0);
}

function getExpectedProfit(r: CraftRecipe, fee: number = DEFAULT_FEE): number {
  const cost = getCraftCost(r);
  const saleNet = (r.productPrice ?? 0) * (1 - fee);
  const procNet = (r.procItemPrice ?? 0) * (1 - fee);
  const sr = r.successRate / 100;
  const pc = r.procChance / 100;
  const psr = r.procSuccessRate / 100;
  const revenue = sr * ((1 - pc) * saleNet + pc * psr * procNet);
  return revenue - cost;
}

export default function CraftPage() {
  const [recipes, setRecipes] = useState<CraftRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [category, setCategory] = useState('전체');
  const [grade, setGrade] = useState('전체');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('grade');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const [selected, setSelected] = useState<CraftRecipe | null>(null);
  const [ownedMap, setOwnedMap] = useState<Record<string, string>>({});
  const [priceMap, setPriceMap] = useState<Record<string, string>>({});
  const [successRateOverride, setSuccessRateOverride] = useState('');
  const [procChanceOverride, setProcChanceOverride] = useState('');
  const [procSuccessRateOverride, setProcSuccessRateOverride] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [procSalePrice, setProcSalePrice] = useState('');
  const [feeType, setFeeType] = useState('market');
  const [customFee, setCustomFee] = useState('');

  useEffect(() => {
    fetch('/api/craft-recipes')
      .then((r) => r.json())
      .then((data: ApiResponse) => { setRecipes(data.recipes); setLoading(false); })
      .catch(() => { setError('데이터를 불러오지 못했습니다.'); setLoading(false); });
  }, []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'name' ? 'asc' : 'desc'); }
  }

  const filtered = useMemo(() => {
    let list = recipes.filter((r) => {
      if (category !== '전체' && r.category !== category) return false;
      if (grade !== '전체' && r.grade !== grade) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name, 'ko');
      else if (sortKey === 'grade') cmp = (GRADE_ORDER[a.grade] ?? 0) - (GRADE_ORDER[b.grade] ?? 0);
      else if (sortKey === 'successRate') cmp = a.successRate - b.successRate;
      else if (sortKey === 'craftCost') cmp = getCraftCost(a) - getCraftCost(b);
      else if (sortKey === 'profit') cmp = getExpectedProfit(a) - getExpectedProfit(b);
      const primary = sortDir === 'desc' ? -cmp : cmp;
      if (primary !== 0) return primary;
      // 2차: 등급 높은순 → 이름순
      const gradeCmp = (GRADE_ORDER[b.grade] ?? 0) - (GRADE_ORDER[a.grade] ?? 0);
      if (gradeCmp !== 0) return gradeCmp;
      return a.name.localeCompare(b.name, 'ko');
    });
    return list;
  }, [recipes, category, grade, search, sortKey, sortDir]);

  function openDetail(recipe: CraftRecipe) {
    setSelected(recipe);
    setOwnedMap({});
    setPriceMap({});
    setSuccessRateOverride('');
    setProcChanceOverride('');
    setProcSuccessRateOverride('');
    setSalePrice(recipe.productPrice ? String(recipe.productPrice) : '');
    setProcSalePrice(recipe.procItemPrice ? String(recipe.procItemPrice) : '');
    setFeeType('market');
    setCustomFee('');
  }

  const calc = useMemo(() => {
    if (!selected) return null;

    const sr = successRateOverride !== '' ? Math.min(100, Math.max(0, Number(successRateOverride) || 0)) : selected.successRate;
    const pc = procChanceOverride !== '' ? Math.min(100, Math.max(0, Number(procChanceOverride) || 0)) : selected.procChance;
    const psr = procSuccessRateOverride !== '' ? Math.min(100, Math.max(0, Number(procSuccessRateOverride) || 0)) : selected.procSuccessRate;

    const mats = selected.materials.map((m, i) => {
      const k = `${i}`;
      const owned = parseNum(ownedMap[k] ?? '0');
      const price = parseNum(priceMap[k] ?? String(m.marketPrice ?? m.npcPrice));
      const shortage = Math.max(m.required - owned, 0);
      const cost = shortage * price;
      return { ...m, key: k, owned, price, shortage, cost };
    });

    const totalCost = mats.reduce((s, m) => s + m.cost, 0);
    const sale = parseNum(salePrice);
    const pSale = parseNum(procSalePrice);

    const feeRates: Record<string, number> = { server: 0.22, market: 0.12, personal: 0 };
    const fee = feeType === 'custom' ? Math.min(100, Math.max(0, Number(customFee) || 0)) / 100 : (feeRates[feeType] ?? 0.12);

    const normalNet = sale * (1 - fee);
    const procNet = pSale * (1 - fee);

    // 시나리오별 순수익
    const normalProfit = normalNet - totalCost;  // 일반 성공 시
    const procProfit = procNet - totalCost;       // 대박 성공 시
    const failLoss = -totalCost;                  // 실패 시

    // 확률
    const s = sr / 100;
    const p = pc / 100;
    const ps = psr / 100;

    // 시나리오별 확률
    const normalChance = s * (1 - p);            // 일반 성공 확률
    const procSuccessChance = s * p * ps;         // 대박 성공 확률
    const failChance = 1 - normalChance - procSuccessChance; // 실패 확률

    // 기대 수익 = 각 시나리오 확률 × 수익 합산
    const expectedProfit = normalChance * normalProfit + procSuccessChance * procProfit + failChance * failLoss;

    return { mats, totalCost, sr, pc, psr, fee, normalNet, procNet, normalProfit, procProfit, failLoss, normalChance, procSuccessChance, failChance, expectedProfit };
  }, [selected, ownedMap, priceMap, successRateOverride, procChanceOverride, procSuccessRateOverride, salePrice, procSalePrice, feeType, customFee]);

  const sortArrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  // 헤더 컴포넌트
  const Header = () => (
    <header className="border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">사계 레기온</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
          <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
          <Link href="/craft" className="text-amber-400">제작 계산기</Link>
        </nav>
      </div>
    </header>
  );

  if (loading) return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <div className="text-zinc-400 animate-pulse">레시피 데이터 로딩 중...</div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <div className="text-red-400">{error}</div>
    </div>
  );

  // === 상세 화면 ===
  if (selected && calc) return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => setSelected(null)} className="text-sm text-zinc-400 hover:text-white mb-4 flex items-center gap-1">
          ← 목록으로
        </button>

        {/* 아이템 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`text-xs px-2 py-0.5 rounded ${GRADE_BG[selected.grade] || 'bg-zinc-700'} ${GRADE_COLORS[selected.grade] || ''}`}>
            {selected.grade}
          </span>
          <h1 className={`text-xl font-bold ${GRADE_COLORS[selected.grade] || ''}`}>{selected.name}</h1>
          <span className="text-xs text-zinc-500">{selected.category}</span>
          {selected.hasProc && <span className="text-xs text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">대박</span>}
        </div>

        {/* 완성품 정보 */}
        {(selected.itemLevel || selected.mainStat) && (
          <div className="bg-zinc-800/60 rounded-xl p-5 mb-4">
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">완성품 정보</h2>
            <div className="flex flex-wrap gap-4 text-sm mb-3">
              {!!selected.itemLevel && (
                <div><span className="text-xs text-zinc-500 block">아이템 Lv</span><span className="font-medium">{selected.itemLevel}</span></div>
              )}
              {!!selected.equipLevel && (
                <div><span className="text-xs text-zinc-500 block">착용 Lv</span><span className="font-medium">{selected.equipLevel}</span></div>
              )}
              {!!selected.magicstoneCount && (
                <div><span className="text-xs text-zinc-500 block">마석 슬롯</span><span className="font-medium text-purple-400">{selected.magicstoneCount}</span></div>
              )}
              {!!selected.randomCount && (
                <div><span className="text-xs text-zinc-500 block">랜덤 옵션</span><span className="font-medium text-blue-400">{selected.randomCount}</span></div>
              )}
              {!!selected.godstoneCount && (
                <div><span className="text-xs text-zinc-500 block">신석 슬롯</span><span className="font-medium text-yellow-400">{selected.godstoneCount}</span></div>
              )}
              {!!selected.spiritstoneCount && (
                <div><span className="text-xs text-zinc-500 block">영혼석 슬롯</span><span className="font-medium text-cyan-400">{selected.spiritstoneCount}</span></div>
              )}
            </div>
            {selected.mainStat && selected.mainStat.length > 0 && (
              <div className="border-t border-zinc-700/50 pt-3">
                <span className="text-xs text-zinc-500 block mb-2">기본 능력치</span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {selected.mainStat.map((s, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5">
                      <span className="text-zinc-400">{s.option}</span>
                      <span className="text-zinc-200">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 대박 아이템 정보 */}
        {selected.hasProc && selected.procItemInfo && (selected.procItemInfo.itemLevel || selected.procItemInfo.mainStat) && (
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-xl p-5 mb-4">
            <h2 className="text-sm font-semibold text-amber-400 mb-3">대박 아이템: {selected.procItem}
              {selected.procItemInfo.grade && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${GRADE_BG[selected.procItemInfo.grade] || ''} ${GRADE_COLORS[selected.procItemInfo.grade] || ''}`}>
                  {selected.procItemInfo.grade}
                </span>
              )}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm mb-3">
              {!!selected.procItemInfo.itemLevel && (
                <div><span className="text-xs text-zinc-500 block">아이템 Lv</span><span className="font-medium">{selected.procItemInfo.itemLevel}</span></div>
              )}
              {!!selected.procItemInfo.equipLevel && (
                <div><span className="text-xs text-zinc-500 block">착용 Lv</span><span className="font-medium">{selected.procItemInfo.equipLevel}</span></div>
              )}
              {!!selected.procItemInfo.magicstoneCount && (
                <div><span className="text-xs text-zinc-500 block">마석 슬롯</span><span className="font-medium text-purple-400">{selected.procItemInfo.magicstoneCount}</span></div>
              )}
              {!!selected.procItemInfo.randomCount && (
                <div><span className="text-xs text-zinc-500 block">랜덤 옵션</span><span className="font-medium text-blue-400">{selected.procItemInfo.randomCount}</span></div>
              )}
              {!!selected.procItemInfo.godstoneCount && (
                <div><span className="text-xs text-zinc-500 block">신석 슬롯</span><span className="font-medium text-yellow-400">{selected.procItemInfo.godstoneCount}</span></div>
              )}
            </div>
            {selected.procItemInfo.mainStat && selected.procItemInfo.mainStat.length > 0 && (
              <div className="border-t border-amber-800/30 pt-3">
                <span className="text-xs text-zinc-500 block mb-2">기본 능력치</span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {selected.procItemInfo.mainStat.map((s, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5">
                      <span className="text-zinc-400">{s.option}</span>
                      <span className="text-zinc-200">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 확률 설정 */}
        <div className="bg-zinc-800/60 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">확률 설정</h2>
          <div className={`grid gap-4 ${selected.hasProc ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-1 max-w-xs'}`}>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">성공률</label>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="100" className="flex-1 accent-amber-400"
                  value={successRateOverride !== '' ? Number(successRateOverride) : selected.successRate}
                  onChange={(e) => setSuccessRateOverride(e.target.value)} />
                <input type="number" min="0" max="100"
                  className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-right"
                  placeholder={String(selected.successRate)} value={successRateOverride}
                  onChange={(e) => setSuccessRateOverride(e.target.value)} />
                <span className="text-xs text-zinc-500">%</span>
              </div>
            </div>
            {selected.hasProc && (
              <>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">대박 확률</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="100" className="flex-1 accent-amber-400"
                      value={procChanceOverride !== '' ? Number(procChanceOverride) : selected.procChance}
                      onChange={(e) => setProcChanceOverride(e.target.value)} />
                    <input type="number" min="0" max="100"
                      className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-right"
                      placeholder={String(selected.procChance)} value={procChanceOverride}
                      onChange={(e) => setProcChanceOverride(e.target.value)} />
                    <span className="text-xs text-zinc-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">대박 성공률</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="100" className="flex-1 accent-amber-400"
                      value={procSuccessRateOverride !== '' ? Number(procSuccessRateOverride) : selected.procSuccessRate}
                      onChange={(e) => setProcSuccessRateOverride(e.target.value)} />
                    <input type="number" min="0" max="100"
                      className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-right"
                      placeholder={String(selected.procSuccessRate)} value={procSuccessRateOverride}
                      onChange={(e) => setProcSuccessRateOverride(e.target.value)} />
                    <span className="text-xs text-zinc-500">%</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {selected.hasProc && (
            <p className="text-xs text-zinc-500 mt-3">대박 아이템: <span className="text-amber-400">{selected.procItem}</span></p>
          )}
        </div>

        {/* 재료 테이블 */}
        <div className="bg-zinc-800/60 rounded-xl overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-zinc-700/50">
            <h2 className="text-sm font-semibold text-zinc-300">재료 ({selected.materials.length}종)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-zinc-500 border-b border-zinc-700/50">
                  <th className="text-left px-5 py-2.5">재료명</th>
                  <th className="text-right px-3 py-2.5 w-14">필요</th>
                  <th className="text-right px-3 py-2.5 w-20">보유</th>
                  <th className="text-right px-3 py-2.5 w-14">부족</th>
                  <th className="text-right px-3 py-2.5 w-28">단가</th>
                  <th className="text-right px-5 py-2.5 w-28">부족 비용</th>
                </tr>
              </thead>
              <tbody>
                {calc.mats.map((m) => (
                  <tr key={m.key} className="border-b border-zinc-700/30 hover:bg-zinc-700/20">
                    <td className="px-5 py-2.5">
                      {m.name}
                      {m.marketPrice !== null && (
                        <span className="ml-2 text-[10px] text-zinc-500">시세 {fmtShort(m.marketPrice)}</span>
                      )}
                    </td>
                    <td className="text-right px-3 py-2.5">{m.required}</td>
                    <td className="text-right px-3 py-2.5">
                      <input type="text" inputMode="numeric"
                        className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-right text-xs"
                        value={ownedMap[m.key] ?? ''} placeholder="0"
                        onChange={(e) => setOwnedMap((p) => ({ ...p, [m.key]: e.target.value }))} />
                    </td>
                    <td className={`text-right px-3 py-2.5 ${m.shortage > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>{m.shortage}</td>
                    <td className="text-right px-3 py-2.5">
                      <input type="text" inputMode="numeric"
                        className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-right text-xs"
                        value={priceMap[m.key] ?? ''} placeholder={fmt(m.marketPrice ?? m.npcPrice)}
                        onChange={(e) => setPriceMap((p) => ({ ...p, [m.key]: e.target.value }))} />
                    </td>
                    <td className="text-right px-5 py-2.5 font-medium">{fmt(m.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-zinc-900/50 flex justify-between items-center">
            <span className="text-sm text-zinc-400">총 재료비</span>
            <span className="text-lg font-bold text-amber-400">{fmt(calc.totalCost)} 키나</span>
          </div>
        </div>

        {/* 수익 계산 */}
        <div className="bg-zinc-800/60 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">수익 계산</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                완성품 판매가
                {selected.productPrice !== null && (
                  <span className="ml-1 text-zinc-600">(시세 {fmtShort(selected.productPrice)})</span>
                )}
              </label>
              <input type="text" inputMode="numeric"
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm"
                value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="0" />
            </div>
            {selected.hasProc && (
              <div>
                <label className="text-xs text-zinc-500 block mb-1">
                  대박 아이템 판매가
                  {selected.procItemPrice !== null && (
                    <span className="ml-1 text-zinc-600">(시세 {fmtShort(selected.procItemPrice)})</span>
                  )}
                </label>
                <input type="text" inputMode="numeric"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm"
                  value={procSalePrice} onChange={(e) => setProcSalePrice(e.target.value)} placeholder="0" />
              </div>
            )}
          </div>

          <div className="mb-5">
            <label className="text-xs text-zinc-500 block mb-2">수수료</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'server', label: '서버 22%' },
                { id: 'market', label: '거래소 12%' },
                { id: 'personal', label: '개인 0%' },
                { id: 'custom', label: '직접입력' },
              ].map((opt) => (
                <button key={opt.id}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                    feeType === opt.id ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                  onClick={() => setFeeType(opt.id)}>
                  {opt.label}
                </button>
              ))}
              {feeType === 'custom' && (
                <input type="number" min="0" max="100"
                  className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-right"
                  value={customFee} onChange={(e) => setCustomFee(e.target.value)} placeholder="%" />
              )}
            </div>
          </div>

          {/* 시나리오별 결과 */}
          <div className="border-t border-zinc-700/50 pt-4 space-y-3 text-sm">
            <h3 className="text-xs text-zinc-500 font-semibold mb-2">시나리오별 손익</h3>

            {/* 일반 성공 */}
            <div className="bg-zinc-900/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-emerald-400 font-medium">일반 성공</span>
                <span className="text-xs text-zinc-500">확률 {(calc.normalChance * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>정산 {fmt(calc.normalNet)} - 재료 {fmt(calc.totalCost)}</span>
                <span className={calc.normalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {calc.normalProfit >= 0 ? '+' : ''}{fmt(calc.normalProfit)} 키나
                </span>
              </div>
            </div>

            {/* 대박 성공 */}
            {selected.hasProc && (
              <div className="bg-zinc-900/50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-amber-400 font-medium">대박 성공</span>
                  <span className="text-xs text-zinc-500">확률 {(calc.procSuccessChance * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>정산 {fmt(calc.procNet)} - 재료 {fmt(calc.totalCost)}</span>
                  <span className={calc.procProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {calc.procProfit >= 0 ? '+' : ''}{fmt(calc.procProfit)} 키나
                  </span>
                </div>
              </div>
            )}

            {/* 실패 */}
            <div className="bg-zinc-900/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-red-400 font-medium">실패 (재료 소멸)</span>
                <span className="text-xs text-zinc-500">확률 {(calc.failChance * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>재료비 전액 손실</span>
                <span className="text-red-400">{fmt(calc.failLoss)} 키나</span>
              </div>
            </div>

            {/* 기대 수익 */}
            <div className="pt-3 border-t border-zinc-700/50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">1회 제작 기대 수익</span>
                <span className={`text-xl font-bold ${
                  calc.expectedProfit > 0 ? 'text-emerald-400' : calc.expectedProfit < 0 ? 'text-red-400' : 'text-zinc-300'
                }`}>
                  {calc.expectedProfit > 0 ? '+' : ''}{fmt(calc.expectedProfit)} 키나
                </span>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-3 text-[11px] text-zinc-500 font-mono space-y-1">
                <div>= ({(calc.normalChance * 100).toFixed(1)}% × {fmt(calc.normalProfit)}){selected.hasProc ? ` + (${(calc.procSuccessChance * 100).toFixed(1)}% × ${fmt(calc.procProfit)})` : ''} + ({(calc.failChance * 100).toFixed(1)}% × {fmt(calc.failLoss)})</div>
                <div className="text-zinc-600">일반성공 확률×손익{selected.hasProc ? ' + 대박성공 확률×손익' : ''} + 실패 확률×손실</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // === 목록 화면 ===
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">제작 계산기</h1>
        <p className="text-zinc-500 text-sm mb-5">마족 제작 레시피 {recipes.length}종 · 실시간 시세 반영</p>

        {/* 카테고리 탭 */}
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {CATEGORY_TABS.map((c) => (
            <button key={c}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                category === c ? 'bg-amber-400 text-zinc-900 font-semibold' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
              onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* 등급 필터 + 검색 */}
        <div className="flex gap-3 mb-4">
          <select className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
            value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="전체">등급 전체</option>
            {['일반', '고급', '희귀', '전승', '유일', '영웅'].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <input type="text"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm"
              placeholder="아이템 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="self-center text-xs text-zinc-500 whitespace-nowrap">{filtered.length}건</span>
        </div>

        {/* 아이템 테이블 */}
        <div className="bg-zinc-800/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-zinc-500 border-b border-zinc-700">
                  <th className="text-left px-5 py-3 cursor-pointer hover:text-zinc-300 select-none" onClick={() => toggleSort('name')}>
                    아이템명{sortArrow('name')}
                  </th>
                  <th className="text-center px-3 py-3 w-16 cursor-pointer hover:text-zinc-300 select-none" onClick={() => toggleSort('grade')}>
                    등급{sortArrow('grade')}
                  </th>
                  <th className="text-center px-2 py-3 w-12">Lv</th>
                  <th className="text-center px-3 py-3 w-16">분류</th>
                  <th className="text-right px-3 py-3 w-16 cursor-pointer hover:text-zinc-300 select-none" onClick={() => toggleSort('successRate')}>
                    성공률{sortArrow('successRate')}
                  </th>
                  <th className="text-right px-3 py-3 w-24 cursor-pointer hover:text-zinc-300 select-none" onClick={() => toggleSort('craftCost')}>
                    제작비{sortArrow('craftCost')}
                  </th>
                  <th className="text-right px-5 py-3 w-24 cursor-pointer hover:text-zinc-300 select-none" onClick={() => toggleSort('profit')}>
                    기대수익{sortArrow('profit')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const cost = getCraftCost(r);
                  const profit = getExpectedProfit(r);
                  return (
                    <tr key={r.id} className="border-b border-zinc-700/30 cursor-pointer hover:bg-zinc-700/30 transition-colors"
                      onClick={() => openDetail(r)}>
                      <td className={`px-5 py-3 font-medium ${GRADE_COLORS[r.grade] || ''}`}>
                        {r.name}
                        {r.hasProc && <span className="ml-1.5 text-[10px] text-amber-400 opacity-70">대박</span>}
                      </td>
                      <td className="text-center px-3 py-3">
                        <span className={`text-[11px] px-1.5 py-0.5 rounded ${GRADE_BG[r.grade] || ''} ${GRADE_COLORS[r.grade] || ''}`}>
                          {r.grade}
                        </span>
                      </td>
                      <td className="text-center px-2 py-3 text-xs text-zinc-500">{r.itemLevel || '-'}</td>
                      <td className="text-center px-3 py-3 text-xs text-zinc-400">{r.category}</td>
                      <td className="text-right px-3 py-3">{r.successRate}%</td>
                      <td className="text-right px-3 py-3 text-zinc-400">{cost > 0 ? fmtShort(cost) : '-'}</td>
                      <td className={`text-right px-5 py-3 font-medium ${
                        profit > 0 ? 'text-emerald-400' : profit < 0 ? 'text-red-400' : 'text-zinc-500'
                      }`}>
                        {(r.productPrice ?? 0) > 0 ? (profit > 0 ? '+' : '') + fmtShort(profit) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-500">검색 결과가 없습니다</div>
          )}
        </div>
      </main>
    </div>
  );
}
