'use client';

import { useState } from 'react';
import Link from 'next/link';

type Grade = 'all' | 'normal' | 'rare' | 'legacy' | 'unique' | 'hero';

interface AppearanceItem {
  name: string;
  equipment: string;
  source: string;
  grade: 'normal' | 'rare' | 'legacy' | 'unique' | 'hero';
}

const GRADE_INFO: Record<Grade, { name: string; color: string; bgColor: string }> = {
  all: { name: '전체', color: 'text-white', bgColor: 'bg-zinc-600' },
  normal: { name: '일반', color: 'text-zinc-300', bgColor: 'bg-zinc-600/20' },
  rare: { name: '희귀', color: 'text-green-400', bgColor: 'bg-green-600/20' },
  legacy: { name: '전승', color: 'text-blue-400', bgColor: 'bg-blue-600/20' },
  unique: { name: '유일', color: 'text-yellow-400', bgColor: 'bg-yellow-600/20' },
  hero: { name: '영웅', color: 'text-orange-400', bgColor: 'bg-orange-600/20' },
};

const RARE_ITEMS: AppearanceItem[] = [
  { name: '고결한 서약', equipment: '오리하르콘', source: "제작", grade: 'rare' },
];
const LEGACY_ITEMS: AppearanceItem[] = [];
const UNIQUE_ITEMS: AppearanceItem[] = [];
const HERO_ITEMS: AppearanceItem[] = [];
const NORMAL_ITEMS: AppearanceItem[] = [];

const ALL_ITEMS = [...NORMAL_ITEMS, ...RARE_ITEMS, ...LEGACY_ITEMS, ...UNIQUE_ITEMS, ...HERO_ITEMS];

export default function AppearancePage() {
  const [activeGrade, setActiveGrade] = useState<Grade>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = ALL_ITEMS.filter((item) => {
    const matchesGrade = activeGrade === 'all' || item.grade === activeGrade;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const gradeCount = {
    all: ALL_ITEMS.length,
    normal: NORMAL_ITEMS.length,
    rare: RARE_ITEMS.length,
    legacy: LEGACY_ITEMS.length,
    unique: UNIQUE_ITEMS.length,
    hero: HERO_ITEMS.length,
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400">사계 레기온</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/tips/pets" className="text-zinc-400 hover:text-white">펫DB</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-4">외형 정보</h1>
        
        <div className="flex flex-wrap items-center gap-1 mb-4 text-xs">
          <span className="text-zinc-500">등급:</span>
          <span className="text-zinc-300">일반</span><span className="text-zinc-600">&lt;</span>
          <span className="text-green-400">희귀</span><span className="text-zinc-600">&lt;</span>
          <span className="text-blue-400">전승</span><span className="text-zinc-600">&lt;</span>
          <span className="text-yellow-400">유일</span><span className="text-zinc-600">&lt;</span>
          <span className="text-orange-400">영웅</span>
        </div>

        <div className="mb-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색..." className="w-full max-w-md bg-zinc-800 border border-zinc-600 text-white rounded-lg px-4 py-2" />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(GRADE_INFO) as Grade[]).map((grade) => (
            <button key={grade} onClick={() => setActiveGrade(grade)}
              className={`px-4 py-2 rounded-lg text-sm ${activeGrade === grade ? 'bg-amber-500 text-zinc-900' : `${GRADE_INFO[grade].bgColor} ${GRADE_INFO[grade].color} border border-zinc-700`}`}>
              {GRADE_INFO[grade].name} ({gradeCount[grade]})
            </button>
          ))}
        </div>

        <div className="bg-zinc-800 rounded-xl border border-zinc-700">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900"><tr className="text-zinc-400">
              <th className="text-left p-3">등급</th><th className="text-left p-3">외형명</th>
              <th className="text-left p-3">장비</th><th className="text-left p-3">획득처</th>
            </tr></thead>
            <tbody className="divide-y divide-zinc-700">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-700/50">
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${GRADE_INFO[item.grade].bgColor} ${GRADE_INFO[item.grade].color}`}>{GRADE_INFO[item.grade].name}</span></td>
                  <td className="p-3"><span className={`font-medium ${GRADE_INFO[item.grade].color}`}>{item.name}</span></td>
                  <td className="p-3 text-zinc-300">{item.equipment}</td>
                  <td className="p-3 text-zinc-400">{item.source || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">구글 시트 연동 예정</p>
      </main>
    </div>
  );
}
