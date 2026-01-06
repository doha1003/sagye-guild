'use client';

import { useState } from 'react';
import Link from 'next/link';

type Tribe = 'all' | 'intellect' | 'wild' | 'nature' | 'transform';

interface PetInfo {
  name: string;
  tribe: 'intellect' | 'wild' | 'nature' | 'transform';
  locations: string[];
}

const TRIBE_INFO: Record<Tribe, { name: string; color: string; bgColor: string; icon: string; stats: string; bonus: string }> = {
  all: { name: '전체', color: 'text-white', bgColor: 'bg-zinc-600', icon: '🐾', stats: '', bonus: '' },
  intellect: { name: '지성', color: 'text-blue-400', bgColor: 'bg-blue-600/20', icon: '🧠', stats: '생명력, 치명타, 위력, 지식', bonus: '지성족 피해 증폭 0.1%' },
  wild: { name: '야성', color: 'text-red-400', bgColor: 'bg-red-600/20', icon: '🐺', stats: '이동 속도, 명중, 민첩, 지식', bonus: '야성족 피해 증폭 0.1%' },
  nature: { name: '자연', color: 'text-green-400', bgColor: 'bg-green-600/20', icon: '🌿', stats: '정신력, 치명타 저항, 정확, 의지', bonus: '자연족 피해 증폭 0.1%' },
  transform: { name: '변형', color: 'text-purple-400', bgColor: 'bg-purple-600/20', icon: '🔮', stats: '질주 행동력 감소, 회피, 체력, 의지', bonus: '변형족 피해 증폭 0.1%' },
};

// 펫 데이터
const PETS: PetInfo[] = [
  // 지성족
  { name: '개조된 루필리니', tribe: 'intellect', locations: ['천족 2시', '천족 7시 섬', '마족 7시 섬'] },
  { name: '초원 모아', tribe: 'intellect', locations: ['천족 5시', '천족 7시', '마족 6시'] },
  { name: '산악 모아', tribe: 'intellect', locations: ['천족 10시', '마족 5시', '마족 중앙 2시'] },
  { name: '해안 모아', tribe: 'intellect', locations: ['천족 6시', '마족 7시 섬', '마족 10시 섬'] },
  { name: '눈지대 모아', tribe: 'intellect', locations: ['천족 2시', '천족 7시 섬'] },
  { name: '늪지 모아', tribe: 'intellect', locations: ['마족 5시', '마족 6시'] },
  { name: '사막 모아', tribe: 'intellect', locations: ['마족 7시', '마족 10시 섬'] },
  { name: '빛의 정령', tribe: 'intellect', locations: ['천족 5시', '천족 6시', '마족 중앙 2시'] },
  { name: '물의 정령', tribe: 'intellect', locations: ['천족 7시', '천족 7시 섬', '마족 6시'] },
  { name: '상급 물의 정령', tribe: 'intellect', locations: ['천족 10시', '마족 5시', '크라오 동굴'] },

  // 야성족
  { name: '거대 스파키', tribe: 'wild', locations: ['천족 10시', '천족 6시', '천족 7시', '마족 5시', '마족 6시'] },
  { name: '산지 커크', tribe: 'wild', locations: ['천족 5시', '천족 2시', '마족 중앙 2시'] },
  { name: '숲 커크', tribe: 'wild', locations: ['천족 6시', '천족 7시', '마족 5시'] },
  { name: '동굴 커크', tribe: 'wild', locations: ['마족 6시', '마족 7시', '크라오 동굴'] },
  { name: '설원 커크', tribe: 'wild', locations: ['천족 2시', '천족 7시 섬'] },
  { name: '해변 커크', tribe: 'wild', locations: ['천족 7시 섬', '마족 7시 섬', '마족 10시 섬'] },
  { name: '사막 커크', tribe: 'wild', locations: ['마족 7시', '마족 10시 섬'] },
  { name: '바람의 정령', tribe: 'wild', locations: ['천족 5시', '천족 10시', '마족 중앙 2시'] },
  { name: '대지의 정령', tribe: 'wild', locations: ['천족 6시', '마족 5시', '마족 7시'] },
  { name: '상급 대지의 정령', tribe: 'wild', locations: ['천족 2시', '마족 6시', '불의 신전'] },

  // 자연족
  { name: '메추리', tribe: 'nature', locations: ['천족 5시', '천족 6시', '마족 5시'] },
  { name: '수리', tribe: 'nature', locations: ['천족 10시', '천족 2시', '마족 중앙 2시'] },
  { name: '황조롱이', tribe: 'nature', locations: ['천족 7시', '마족 6시', '마족 7시'] },
  { name: '올빼미', tribe: 'nature', locations: ['천족 7시 섬', '마족 7시 섬'] },
  { name: '펠리칸', tribe: 'nature', locations: ['천족 7시 섬', '마족 10시 섬'] },
  { name: '앵무새', tribe: 'nature', locations: ['마족 7시', '마족 10시 섬'] },
  { name: '불의 정령', tribe: 'nature', locations: ['천족 10시', '마족 중앙 2시', '마족 5시'] },
  { name: '상급 불의 정령', tribe: 'nature', locations: ['천족 5시', '마족 7시 섬', '불의 신전'] },
  { name: '번개의 정령', tribe: 'nature', locations: ['천족 6시', '천족 7시', '마족 6시'] },
  { name: '상급 번개의 정령', tribe: 'nature', locations: ['천족 2시', '마족 7시', '우루구구 협곡'] },

  // 변형족
  { name: '크라오 변이체', tribe: 'transform', locations: ['크라오 동굴'] },
  { name: '돌연변이 벡사', tribe: 'transform', locations: ['천족 5시', '천족 6시', '마족 5시'] },
  { name: '변이된 스핑', tribe: 'transform', locations: ['천족 10시', '마족 중앙 2시', '마족 6시'] },
  { name: '기형 카울', tribe: 'transform', locations: ['천족 7시', '천족 2시', '마족 7시'] },
  { name: '괴수 리저드', tribe: 'transform', locations: ['천족 7시 섬', '마족 7시 섬'] },
  { name: '어둠의 정령', tribe: 'transform', locations: ['천족 5시', '천족 10시', '마족 중앙 2시'] },
  { name: '상급 어둠의 정령', tribe: 'transform', locations: ['천족 6시', '마족 5시', '불의 신전'] },
  { name: '얼음의 정령', tribe: 'transform', locations: ['천족 2시', '천족 7시 섬'] },
  { name: '상급 얼음의 정령', tribe: 'transform', locations: ['천족 7시 섬', '사나운 뿔 암굴'] },
];

export default function PetsPage() {
  const [activeTribe, setActiveTribe] = useState<Tribe>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPets = PETS.filter((pet) => {
    const matchesTribe = activeTribe === 'all' || pet.tribe === activeTribe;
    const matchesSearch = !searchQuery ||
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.locations.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTribe && matchesSearch;
  });

  const tribeCount = {
    all: PETS.length,
    intellect: PETS.filter(p => p.tribe === 'intellect').length,
    wild: PETS.filter(p => p.tribe === 'wild').length,
    nature: PETS.filter(p => p.tribe === 'nature').length,
    transform: PETS.filter(p => p.tribe === 'transform').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 레기온
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
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

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span>🐾</span> 펫 영혼 DB
        </h1>
        <p className="text-zinc-400 text-sm mb-6">종족별 펫 영혼 획득처 정보</p>

        {/* 종족별 효과 안내 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {(['intellect', 'wild', 'nature', 'transform'] as const).map((tribe) => (
            <div key={tribe} className={`${TRIBE_INFO[tribe].bgColor} border border-zinc-700 rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{TRIBE_INFO[tribe].icon}</span>
                <span className={`font-bold ${TRIBE_INFO[tribe].color}`}>{TRIBE_INFO[tribe].name}</span>
              </div>
              <p className="text-xs text-zinc-300 mb-1">{TRIBE_INFO[tribe].stats}</p>
              <p className="text-xs text-amber-400">Lv5: {TRIBE_INFO[tribe].bonus}</p>
            </div>
          ))}
        </div>

        {/* 검색 */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="펫 이름, 위치 검색..."
            className="w-full max-w-md bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 종족 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(TRIBE_INFO) as Tribe[]).map((tribe) => (
            <button
              key={tribe}
              onClick={() => setActiveTribe(tribe)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                activeTribe === tribe
                  ? 'bg-amber-500 text-zinc-900'
                  : `${TRIBE_INFO[tribe].bgColor} ${TRIBE_INFO[tribe].color} hover:opacity-80 border border-zinc-700`
              }`}
            >
              {tribe !== 'all' && <span>{TRIBE_INFO[tribe].icon}</span>}
              {TRIBE_INFO[tribe].name} ({tribeCount[tribe]})
            </button>
          ))}
        </div>

        {/* 펫 목록 */}
        <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
          <div className="p-4 border-b border-zinc-700">
            <h2 className="text-lg font-semibold text-white">
              {activeTribe === 'all' ? '전체' : TRIBE_INFO[activeTribe].name} 펫 ({filteredPets.length}종)
            </h2>
          </div>

          {/* 모바일 카드 */}
          <div className="md:hidden divide-y divide-zinc-700">
            {filteredPets.map((pet, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{TRIBE_INFO[pet.tribe].icon}</span>
                  <span className={`font-bold ${TRIBE_INFO[pet.tribe].color}`}>{pet.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${TRIBE_INFO[pet.tribe].bgColor} ${TRIBE_INFO[pet.tribe].color}`}>
                    {TRIBE_INFO[pet.tribe].name}
                  </span>
                </div>
                <div className="text-sm text-zinc-300">
                  <span className="text-zinc-500">위치:</span> {pet.locations.join(', ')}
                </div>
              </div>
            ))}
          </div>

          {/* 데스크탑 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900">
                <tr className="text-zinc-400">
                  <th className="text-left p-3 font-medium w-16">종족</th>
                  <th className="text-left p-3 font-medium">펫 이름</th>
                  <th className="text-left p-3 font-medium">획득 위치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {filteredPets.map((pet, idx) => (
                  <tr key={idx} className="hover:bg-zinc-700/50">
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${TRIBE_INFO[pet.tribe].bgColor} ${TRIBE_INFO[pet.tribe].color} flex items-center gap-1 w-fit`}>
                        {TRIBE_INFO[pet.tribe].icon} {TRIBE_INFO[pet.tribe].name}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`font-medium ${TRIBE_INFO[pet.tribe].color}`}>{pet.name}</span>
                    </td>
                    <td className="p-3 text-zinc-300">{pet.locations.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-zinc-500">
          출처: <a href="https://www.inven.co.kr/board/aion2/6444/689" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">인벤</a> | 수시로 업데이트 중
        </div>
      </main>
    </div>
  );
}
