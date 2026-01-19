'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Tribe = 'all' | 'intellect' | 'wild' | 'nature' | 'transform';

interface Pet {
  name: string;
  tribe: string;
  location: string;
}

interface TribeData {
  name: string;
  pets: Pet[];
}

interface TribeStats {
  korName: string;
  color: string;
  bgColor: string;
}

const TRIBE_INFO: Record<Tribe, TribeStats> = {
  all: { korName: '전체', color: 'text-white', bgColor: 'bg-zinc-600' },
  intellect: { korName: '지성', color: 'text-blue-400', bgColor: 'bg-blue-600/20' },
  wild: { korName: '야성', color: 'text-red-400', bgColor: 'bg-red-600/20' },
  nature: { korName: '자연', color: 'text-green-400', bgColor: 'bg-green-600/20' },
  transform: { korName: '변형', color: 'text-purple-400', bgColor: 'bg-purple-600/20' },
};

const TRIBE_EFFECTS: Record<Exclude<Tribe, 'all'>, string[]> = {
  intellect: [
    'LV 1 : 생명력 10',
    'LV 2 : 생명력 20, 치명타 1',
    'LV 3 : 생명력 30, 치명타 2, 위력 1',
    'LV 4 : 생명력 50, 치명타 4, 위력 1, 지식 1',
    'LV 5 : 생명력 60, 치명타 5, 위력 1, 지식 1, 지성족 피해 증폭 0.1%',
  ],
  wild: [
    'LV 1 : 탑승물 지상 이동 속도 1',
    'LV 2 : 탑승물 지상 이동 속도 2, 추가 명중 1',
    'LV 3 : 탑승물 지상 이동 속도 3, 추가 명중 2, 민첩 1',
    'LV 4 : 탑승물 지상 이동 속도 5, 추가 명중 4, 민첩 1, 지식 1',
    'LV 5 : 탑승물 지상 이동 속도 6, 추가 명중 5, 민첩 1, 지식 1, 야성족 피해 증폭 0.1%',
  ],
  nature: [
    'LV 1 : 정신력 5',
    'LV 2 : 정신력 10, 치명타 저항 1',
    'LV 3 : 정신력 15, 치명타 저항 2, 정확 1',
    'LV 4 : 정신력 25, 치명타 저항 4, 정확 1, 의지 1',
    'LV 5 : 정신력 30, 치명타 저항 5, 정확 1, 의지 1, 자연족 피해 증폭 0.1%',
  ],
  transform: [
    'LV 1 : 탑승물 질주 행동력 소모량 감소율 0.1%',
    'LV 2 : 탑승물 질주 행동력 소모량 감소율 0.2%, 추가 회피 1',
    'LV 3 : 탑승물 질주 행동력 소모량 감소율 0.3%, 추가 회피 2, 체력 1',
    'LV 4 : 탑승물 질주 행동력 소모량 감소율 0.5%, 추가 회피 4, 체력 1, 의지 1',
    'LV 5 : 탑승물 질주 행동력 소모량 감소율 0.6%, 추가 회피 5, 체력 1, 의지 1, 변형족 피해 증폭 0.1%',
  ],
};

const tribeNameToKey = (name: string): Tribe => {
  const map: Record<string, Tribe> = { '지성': 'intellect', '야성': 'wild', '자연': 'nature', '변형': 'transform' };
  return map[name] || 'all';
};

export default function PetsPage() {
  const [tribes, setTribes] = useState<TribeData[]>([]);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTribe, setActiveTribe] = useState<Tribe>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = (refresh = false) => {
    setLoading(true);
    fetch('/api/pets' + (refresh ? '?refresh=true' : ''))
      .then(res => res.json())
      .then(data => {
        if (data.tribes) {
          setTribes(data.tribes);
          setAllPets(data.allPets || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const filteredPets = allPets.filter((pet) => {
    const matchesTribe = activeTribe === 'all' || tribeNameToKey(pet.tribe) === activeTribe;
    const matchesSearch = !searchQuery ||
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTribe && matchesSearch;
  });

  const tribeCount: Record<Tribe, number> = {
    all: allPets.length,
    intellect: allPets.filter(p => p.tribe === '지성').length,
    wild: allPets.filter(p => p.tribe === '야성').length,
    nature: allPets.filter(p => p.tribe === '자연').length,
    transform: allPets.filter(p => p.tribe === '변형').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">사계 레기온</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/tips/appearance" className="text-zinc-400 hover:text-white">외형</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">홈</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 text-sm">펫 DB</span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white">펫 영혼 DB</h1>
          <button
            onClick={() => fetchData(true)}
            disabled={loading}
            className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? '로딩...' : '새로고침'}
          </button>
        </div>
        <p className="text-zinc-400 text-sm mb-6">종족별 펫 영혼 획득처 정보 {!loading && `· 총 ${allPets.length}종`}</p>

        {loading ? (
          <div className="text-center py-12 text-zinc-400">데이터 불러오는 중...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {(['intellect', 'wild', 'nature', 'transform'] as const).map((tribe) => (
                <button
                  key={tribe}
                  onClick={() => setActiveTribe(tribe)}
                  className={`${TRIBE_INFO[tribe].bgColor} border border-zinc-700 rounded-lg p-3 sm:p-4 transition-all hover:border-zinc-500 text-left ${activeTribe === tribe ? 'ring-2 ring-amber-500' : ''}`}
                >
                  <div className="flex items-center gap-1 sm:gap-2 mb-2">
                    <span className={`font-bold text-sm sm:text-base ${TRIBE_INFO[tribe].color}`}>{TRIBE_INFO[tribe].korName}</span>
                    <span className="text-zinc-500 text-xs">({tribeCount[tribe]})</span>
                  </div>
                  <div className="space-y-0.5">
                    {TRIBE_EFFECTS[tribe].map((effect, i) => (
                      <p key={i} className={`text-xs ${i === 4 ? 'text-amber-400 font-medium' : 'text-zinc-400'}`}>{effect}</p>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-4">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="펫 이름, 위치 검색..." className="w-full max-w-md bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500" />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {(Object.keys(TRIBE_INFO) as Tribe[]).map((tribe) => (
                <button key={tribe} onClick={() => setActiveTribe(tribe)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTribe === tribe ? 'bg-amber-500 text-zinc-900' : `${TRIBE_INFO[tribe].bgColor} ${TRIBE_INFO[tribe].color} hover:opacity-80 border border-zinc-700`}`}>
                  {TRIBE_INFO[tribe].korName} ({tribeCount[tribe]})
                </button>
              ))}
            </div>

            <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
              <div className="p-4 border-b border-zinc-700">
                <h2 className="text-lg font-semibold text-white">{activeTribe === 'all' ? '전체' : TRIBE_INFO[activeTribe].korName} 펫 ({filteredPets.length}종)</h2>
              </div>

              <div className="md:hidden divide-y divide-zinc-700">
                {filteredPets.map((pet, i) => {
                  const tribeKey = tribeNameToKey(pet.tribe);
                  return (
                    <div key={i} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-bold ${TRIBE_INFO[tribeKey].color}`}>{pet.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${TRIBE_INFO[tribeKey].bgColor} ${TRIBE_INFO[tribeKey].color}`}>{pet.tribe}</span>
                      </div>
                      {pet.location ? (
                        <div className="text-sm text-zinc-300 whitespace-pre-line pl-2 border-l-2 border-zinc-700">{pet.location}</div>
                      ) : (
                        <div className="text-sm text-zinc-500 italic">획득처 정보 없음</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900">
                    <tr className="text-zinc-400">
                      <th className="text-left p-3 font-medium w-20">종족</th>
                      <th className="text-left p-3 font-medium w-48">펫 이름</th>
                      <th className="text-left p-3 font-medium">획득 위치</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {filteredPets.map((pet, i) => {
                      const tribeKey = tribeNameToKey(pet.tribe);
                      return (
                        <tr key={i} className="hover:bg-zinc-700/50">
                          <td className="p-3 align-top">
                            <span className={`text-xs px-2 py-1 rounded ${TRIBE_INFO[tribeKey].bgColor} ${TRIBE_INFO[tribeKey].color}`}>{pet.tribe}</span>
                          </td>
                          <td className="p-3 align-top">
                            <span className={`font-medium ${TRIBE_INFO[tribeKey].color}`}>{pet.name}</span>
                          </td>
                          <td className="p-3 align-top">
                            {pet.location ? (
                              <div className="text-zinc-300 whitespace-pre-line text-xs leading-relaxed">{pet.location}</div>
                            ) : (
                              <span className="text-zinc-500 italic text-xs">획득처 정보 없음</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-zinc-500">
              구글 시트 연동 · 출처: <a href="https://www.inven.co.kr/board/aion2/6444/689" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">인벤</a>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
