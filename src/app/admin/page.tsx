'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PetData {
  id?: number;
  name: string;
  tribe: 'intellect' | 'wild' | 'nature' | 'transform';
  locations: string;
}

interface AppearanceData {
  id?: number;
  name: string;
  equipment: string;
  source: string;
  grade: 'rare' | 'hero' | 'legend' | 'myth';
}

const TRIBE_NAMES: Record<string, string> = {
  intellect: '지성',
  wild: '야성',
  nature: '자연',
  transform: '변형',
};

const GRADE_NAMES: Record<string, string> = {
  rare: '희귀',
  hero: '영웅',
  legend: '전설',
  myth: '신화',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'pets' | 'appearance'>('pets');
  const [pets, setPets] = useState<PetData[]>([]);
  const [appearances, setAppearances] = useState<AppearanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPet, setEditingPet] = useState<PetData | null>(null);
  const [editingAppearance, setEditingAppearance] = useState<AppearanceData | null>(null);
  const [message, setMessage] = useState('');

  // 데이터 로드
  useEffect(() => {
    if (session?.user?.isAdmin) {
      loadPets();
      loadAppearances();
    }
  }, [session]);

  const loadPets = async () => {
    try {
      const res = await fetch('/api/pets');
      const data = await res.json();
      if (data.pets) setPets(data.pets);
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  };

  const loadAppearances = async () => {
    try {
      const res = await fetch('/api/appearance');
      const data = await res.json();
      if (data.items) setAppearances(data.items);
    } catch (error) {
      console.error('Failed to load appearances:', error);
    }
  };

  // 펫 저장
  const savePet = async (pet: PetData) => {
    setLoading(true);
    try {
      const method = pet.id ? 'PUT' : 'POST';
      const url = pet.id ? `/api/pets/${pet.id}` : '/api/pets';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet),
      });

      if (res.ok) {
        setMessage('저장되었습니다!');
        setEditingPet(null);
        loadPets();
      } else {
        const data = await res.json();
        setMessage(`오류: ${data.error}`);
      }
    } catch (error) {
      setMessage('저장 실패');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 펫 삭제
  const deletePet = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('삭제되었습니다!');
        loadPets();
      }
    } catch (error) {
      setMessage('삭제 실패');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 외형 저장
  const saveAppearance = async (item: AppearanceData) => {
    setLoading(true);
    try {
      const method = item.id ? 'PUT' : 'POST';
      const url = item.id ? `/api/appearance/${item.id}` : '/api/appearance';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        setMessage('저장되었습니다!');
        setEditingAppearance(null);
        loadAppearances();
      } else {
        const data = await res.json();
        setMessage(`오류: ${data.error}`);
      }
    } catch (error) {
      setMessage('저장 실패');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 외형 삭제
  const deleteAppearance = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/appearance/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('삭제되었습니다!');
        loadAppearances();
      }
    } catch (error) {
      setMessage('삭제 실패');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-white">로딩 중...</p>
      </div>
    );
  }

  // 로그인 안됨
  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">관리자 페이지</h1>
        <p className="text-zinc-400 mb-6">관리자 권한이 필요합니다.</p>
        <button
          onClick={() => signIn('discord')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <span>🎮</span> 디스코드로 로그인
        </button>
        <Link href="/" className="text-zinc-400 hover:text-white mt-4">
          ← 홈으로
        </Link>
      </div>
    );
  }

  // 관리자 아님
  if (!session.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">접근 거부</h1>
        <p className="text-zinc-400 mb-2">관리자 권한이 없습니다.</p>
        <p className="text-zinc-500 text-sm mb-6">Discord ID: {session.user?.discordId}</p>
        <div className="flex gap-4">
          <button
            onClick={() => signOut()}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg"
          >
            로그아웃
          </button>
          <Link href="/" className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg">
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 레기온
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">{session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="text-zinc-400 hover:text-white text-sm"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">관리자 페이지</h1>

        {/* 메시지 */}
        {message && (
          <div className="bg-amber-500/20 border border-amber-500/50 text-amber-200 px-4 py-2 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'pets'
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            펫 관리 ({pets.length})
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'appearance'
                ? 'bg-amber-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            외형 관리 ({appearances.length})
          </button>
        </div>

        {/* 펫 관리 탭 */}
        {activeTab === 'pets' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">펫 목록</h2>
              <button
                onClick={() => setEditingPet({ name: '', tribe: 'intellect', locations: '' })}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                + 새 펫 추가
              </button>
            </div>

            {/* 펫 편집 폼 */}
            {editingPet && (
              <div className="bg-zinc-800 rounded-lg p-4 mb-4 border border-zinc-700">
                <h3 className="text-white font-medium mb-4">
                  {editingPet.id ? '펫 수정' : '새 펫 추가'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="펫 이름"
                    value={editingPet.name}
                    onChange={(e) => setEditingPet({ ...editingPet, name: e.target.value })}
                    className="bg-zinc-900 border border-zinc-600 text-white px-3 py-2 rounded-lg"
                  />
                  <select
                    value={editingPet.tribe}
                    onChange={(e) => setEditingPet({ ...editingPet, tribe: e.target.value as PetData['tribe'] })}
                    className="bg-zinc-900 border border-zinc-600 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="intellect">지성</option>
                    <option value="wild">야성</option>
                    <option value="nature">자연</option>
                    <option value="transform">변형</option>
                  </select>
                </div>
                <textarea
                  placeholder="획득 위치 (줄바꿈으로 구분)"
                  value={editingPet.locations}
                  onChange={(e) => setEditingPet({ ...editingPet, locations: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-600 text-white px-3 py-2 rounded-lg h-32 mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => savePet(editingPet)}
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {loading ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => setEditingPet(null)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 펫 목록 */}
            <div className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900">
                  <tr className="text-zinc-400">
                    <th className="text-left p-3">이름</th>
                    <th className="text-left p-3">종족</th>
                    <th className="text-left p-3">획득처</th>
                    <th className="text-center p-3 w-24">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {pets.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-zinc-500">
                        {PETS_SHEET_ID ? '데이터가 없습니다.' : '구글 시트가 설정되지 않았습니다.'}
                      </td>
                    </tr>
                  ) : (
                    pets.slice(0, 50).map((pet) => (
                      <tr key={pet.id} className="hover:bg-zinc-700/50">
                        <td className="p-3 text-white">{pet.name}</td>
                        <td className="p-3 text-zinc-300">{TRIBE_NAMES[pet.tribe] || pet.tribe}</td>
                        <td className="p-3 text-zinc-400 text-xs max-w-xs truncate">{pet.locations.split('\n')[0]}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setEditingPet(pet)}
                            className="text-blue-400 hover:text-blue-300 mr-2"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => pet.id && deletePet(pet.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {pets.length > 50 && (
                <p className="text-zinc-500 text-sm text-center p-4">
                  처음 50개만 표시됩니다. 전체 {pets.length}개
                </p>
              )}
            </div>
          </div>
        )}

        {/* 외형 관리 탭 */}
        {activeTab === 'appearance' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">외형 목록</h2>
              <button
                onClick={() => setEditingAppearance({ name: '', equipment: '', source: '', grade: 'rare' })}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                + 새 외형 추가
              </button>
            </div>

            {/* 외형 편집 폼 */}
            {editingAppearance && (
              <div className="bg-zinc-800 rounded-lg p-4 mb-4 border border-zinc-700">
                <h3 className="text-white font-medium mb-4">
                  {editingAppearance.id ? '외형 수정' : '새 외형 추가'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="외형명"
                    value={editingAppearance.name}
                    onChange={(e) => setEditingAppearance({ ...editingAppearance, name: e.target.value })}
                    className="bg-zinc-900 border border-zinc-600 text-white px-3 py-2 rounded-lg"
                  />
                  <select
                    value={editingAppearance.grade}
                    onChange={(e) => setEditingAppearance({ ...editingAppearance, grade: e.target.value as AppearanceData['grade'] })}
                    className="bg-zinc-900 border border-zinc-600 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="rare">희귀</option>
                    <option value="hero">영웅</option>
                    <option value="legend">전설</option>
                    <option value="myth">신화</option>
                  </select>
                  <input
                    type="text"
                    placeholder="추출 장비"
                    value={editingAppearance.equipment}
                    onChange={(e) => setEditingAppearance({ ...editingAppearance, equipment: e.target.value })}
                    className="bg-zinc-900 border border-zinc-600 text-white px-3 py-2 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="획득처"
                    value={editingAppearance.source}
                    onChange={(e) => setEditingAppearance({ ...editingAppearance, source: e.target.value })}
                    className="bg-zinc-900 border border-zinc-600 text-white px-3 py-2 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveAppearance(editingAppearance)}
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {loading ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => setEditingAppearance(null)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 외형 목록 */}
            <div className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900">
                  <tr className="text-zinc-400">
                    <th className="text-left p-3">외형명</th>
                    <th className="text-left p-3">등급</th>
                    <th className="text-left p-3">장비</th>
                    <th className="text-left p-3">획득처</th>
                    <th className="text-center p-3 w-24">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {appearances.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-zinc-500">
                        {APPEARANCE_SHEET_ID ? '데이터가 없습니다.' : '구글 시트가 설정되지 않았습니다.'}
                      </td>
                    </tr>
                  ) : (
                    appearances.slice(0, 50).map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-700/50">
                        <td className="p-3 text-white">{item.name}</td>
                        <td className="p-3 text-zinc-300">{GRADE_NAMES[item.grade] || item.grade}</td>
                        <td className="p-3 text-zinc-400">{item.equipment}</td>
                        <td className="p-3 text-zinc-400 text-xs max-w-xs truncate">{item.source}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setEditingAppearance(item)}
                            className="text-blue-400 hover:text-blue-300 mr-2"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => item.id && deleteAppearance(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {appearances.length > 50 && (
                <p className="text-zinc-500 text-sm text-center p-4">
                  처음 50개만 표시됩니다. 전체 {appearances.length}개
                </p>
              )}
            </div>
          </div>
        )}

        {/* 환경 변수 안내 */}
        <div className="mt-8 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
          <h3 className="text-white font-medium mb-2">환경 변수 설정 필요</h3>
          <p className="text-zinc-400 text-sm mb-2">Vercel에서 다음 환경 변수를 설정해야 합니다:</p>
          <pre className="bg-zinc-900 text-zinc-300 text-xs p-3 rounded overflow-x-auto">
{`NEXTAUTH_URL=https://sagye-guild.vercel.app
NEXTAUTH_SECRET=<랜덤문자열>
DISCORD_CLIENT_ID=<디스코드앱ID>
DISCORD_CLIENT_SECRET=<디스코드시크릿>
ADMIN_DISCORD_IDS=<관리자디스코드ID들,쉼표구분>
PETS_SHEET_ID=<펫구글시트ID>
APPEARANCE_SHEET_ID=<외형구글시트ID>
GOOGLE_CLIENT_EMAIL=<서비스계정이메일>
GOOGLE_PRIVATE_KEY=<서비스계정키>`}
          </pre>
        </div>
      </main>
    </div>
  );
}

const PETS_SHEET_ID = process.env.NEXT_PUBLIC_PETS_SHEET_ID || '';
const APPEARANCE_SHEET_ID = process.env.NEXT_PUBLIC_APPEARANCE_SHEET_ID || '';
