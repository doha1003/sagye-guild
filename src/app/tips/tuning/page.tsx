'use client';

import { useState } from 'react';
import Link from 'next/link';

type SlotKey = 'weapon' | 'top' | 'bottom' | 'helmet' | 'shoulder' | 'gloves' | 'boots' | 'cloak' | 'necklace' | 'ring';

interface SlotData {
  name: string;
  icon: string;
  options: string[];
}

const SLOTS: Record<SlotKey, SlotData> = {
  weapon: {
    name: '무기/가더',
    icon: '🗡️',
    options: ['전속', '무피증', '위력', '피증', '정확', '다단히트', '상태이상적중'],
  },
  top: {
    name: '상의',
    icon: '👕',
    options: ['피해증폭', '공격력', '치명타', '명중', '패시브스킬'],
  },
  bottom: {
    name: '하의',
    icon: '👖',
    options: ['공격력증가', '공격력', '치명타', '명중', '피해내성', '패시브스킬'],
  },
  helmet: {
    name: '투구',
    icon: '⛑️',
    options: ['강타', '공격력증가', '공격력', '치명타', '명중', '받는치유량'],
  },
  shoulder: {
    name: '견갑',
    icon: '🦺',
    options: ['치명타피해증폭', '공격력', '치명타', '명중', '패시브스킬'],
  },
  gloves: {
    name: '장갑',
    icon: '🧤',
    options: ['전투속도', '공격력', '치명타', '명중', '패시브스킬'],
  },
  boots: {
    name: '장화',
    icon: '👢',
    options: ['이동속도', '공격력', '치명타', '명중', '패시브스킬'],
  },
  cloak: {
    name: '망토',
    icon: '🧣',
    options: ['강타', '공격력증가', '공격력', '치명타', '명중', '치명타피해내성', '무기피해내성', '패시브스킬'],
  },
  necklace: {
    name: '목걸이/귀걸이',
    icon: '📿',
    options: ['공격력', '치명타', '명중', '패시브스킬'],
  },
  ring: {
    name: '반지',
    icon: '💍',
    options: ['공격력/치명타/명중 택1', '액티브스킬', '액티브스킬', '액티브스킬', '액티브스킬'],
  },
};

const SLOT_KEYS: SlotKey[] = ['weapon', 'top', 'bottom', 'helmet', 'shoulder', 'gloves', 'boots', 'cloak', 'necklace', 'ring'];

const BRACELETS = [
  { name: '시간의 팔찌', option: '전속' },
  { name: '지혜의 팔찌', option: '강타' },
  { name: '환상의 팔찌', option: '재감' },
  { name: '죽음의 팔찌', option: '치명타' },
  { name: '파괴의 팔찌', option: '공격력' },
  { name: '자유의 팔찌', option: '명중' },
];

const CELL_STYLE = 'bg-zinc-700/30 text-zinc-200 border-zinc-600';

export default function TuningPage() {
  const [selectedSlot, setSelectedSlot] = useState<SlotKey | null>(null);

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400">접속중 레기온</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/tips/pets" className="text-zinc-400 hover:text-white">펫DB</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">조율 우선순위</h1>
        <p className="text-zinc-400 text-sm mb-6">장비 부위별 조율 옵션 우선순위 (공격 기준, 위에서 아래로 우선)</p>

        {/* 부위 선택 버튼 (모바일) */}
        <div className="md:hidden flex flex-wrap gap-2 mb-6">
          {SLOT_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedSlot(selectedSlot === key ? null : key)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedSlot === key
                  ? 'bg-amber-500 text-zinc-900 font-medium'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              }`}
            >
              {SLOTS[key].icon} {SLOTS[key].name}
            </button>
          ))}
        </div>

        {/* 모바일: 선택된 부위 카드 */}
        <div className="md:hidden">
          {selectedSlot ? (
            <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-5">
              <h2 className="text-lg font-bold text-white mb-4">
                {SLOTS[selectedSlot].icon} {SLOTS[selectedSlot].name}
              </h2>
              <div className="space-y-2">
                {SLOTS[selectedSlot].options.map((opt, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${CELL_STYLE}`}>
                    <span className="text-xs font-bold w-5 text-center">{idx + 1}</span>
                    <span className="font-medium">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-zinc-500 py-8">부위를 선택하세요</p>
          )}
        </div>

        {/* 데스크탑: 전체 테이블 */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-zinc-800">
                <th className="text-left p-3 text-zinc-400 font-medium border-b border-zinc-700 sticky left-0 bg-zinc-800 z-10">순위</th>
                {SLOT_KEYS.map((key) => (
                  <th key={key} className="text-center p-3 text-zinc-400 font-medium border-b border-zinc-700 whitespace-nowrap">
                    <div>{SLOTS[key].icon}</div>
                    <div className="mt-1">{SLOTS[key].name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }, (_, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-zinc-800/50">
                  <td className="p-3 text-center font-bold text-amber-400 border-b border-zinc-800 sticky left-0 bg-zinc-900 z-10">
                    {rowIdx + 1}
                  </td>
                  {SLOT_KEYS.map((key) => {
                    const opt = SLOTS[key].options[rowIdx];
                    return (
                      <td key={key} className="p-2 text-center border-b border-zinc-800">
                        {opt ? (
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${CELL_STYLE}`}>
                            {opt}
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 팔찌 종류 */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-white mb-3">팔찌 종류</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {BRACELETS.map((b) => (
              <div key={b.name} className="bg-zinc-800 rounded-lg border border-zinc-700 p-3 text-center">
                <div className="text-sm text-zinc-300">{b.name}</div>
                <div className="text-amber-400 font-bold mt-1">{b.option}</div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-zinc-500">
          * 대략적인 감 기준이며, 직업/상황에 따라 달라질 수 있습니다.
        </p>
      </main>
    </div>
  );
}
