'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// 직업 정보 (8개 직업)
const CLASSES = ['전체', '검성', '수호성', '살성', '궁성', '정령성', '마도성', '치유성', '호법성'] as const;

const CLASS_ICONS: Record<string, string> = {
  '검성': '⚔️',
  '수호성': '🛡️',
  '살성': '🗡️',
  '궁성': '🏹',
  '정령성': '🔮',
  '마도성': '✨',
  '치유성': '💚',
  '호법성': '📿',
};

// 지켈 서버 ID (마족)
const ZIKEL_SERVER_ID = 2002;

interface GuildMember {
  id: string;
  rank: string;
  nickname: string;
  className: string;
  age: string;
  discord: string;
  kakao: string;
  combatScore?: number;
  combatPower?: number;
  loading?: boolean;
}

export default function MembersPage() {
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingStats, setFetchingStats] = useState(false);

  // 구글 시트에서 데이터 불러오기
  const fetchMembers = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const url = forceRefresh ? '/api/sheets?refresh=true' : '/api/sheets';
      const res = await fetch(url);
      const data = await res.json();
      if (data.members) {
        setMembers(data.members.map((m: GuildMember) => ({
          ...m,
          loading: false,
        })));
        setLastUpdated(data.lastUpdated);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 단일 캐릭터 실시간 데이터 가져오기
  const fetchCharacterStats = async (nickname: string) => {
    try {
      const res = await fetch(`/api/character/${encodeURIComponent(nickname)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  // 모든 멤버의 실시간 데이터 갱신
  const fetchAllStats = async () => {
    setFetchingStats(true);

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      setMembers(prev => prev.map(m =>
        m.id === member.id ? { ...m, loading: true } : m
      ));

      const stats = await fetchCharacterStats(member.nickname);
      if (stats && !stats.error) {
        setMembers(prev => prev.map(m =>
          m.id === member.id ? {
            ...m,
            combatScore: stats.combatScore,
            combatPower: stats.combatPower,
            loading: false,
          } : m
        ));
      } else {
        setMembers(prev => prev.map(m =>
          m.id === member.id ? { ...m, loading: false } : m
        ));
      }

      // Rate limiting (300ms)
      if (i < members.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setFetchingStats(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 필터링
  const filteredMembers = members.filter((m) => {
    const matchesClass = activeFilter === '전체' || m.className === activeFilter;
    const matchesSearch = !searchQuery ||
      m.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // 직업별 통계
  const classStats = CLASSES.slice(1).map(cls => ({
    name: cls,
    count: members.filter(m => m.className === cls).length,
  }));

  // 전투점수 순 정렬
  const sortedMembers = [...filteredMembers].sort((a, b) =>
    (b.combatScore || 0) - (a.combatScore || 0)
  );

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 길드
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-amber-400">길드원</Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
            <Link href="/party" className="text-zinc-400 hover:text-white">파티</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">길드원 관리</h1>
            <p className="text-zinc-400 mt-1">지켈 서버 · 마족 · {members.length}명</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchMembers(true)}
              disabled={loading}
              className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로딩...' : '⟳ 시트 새로고침'}
            </button>
            <button
              onClick={fetchAllStats}
              disabled={fetchingStats || members.length === 0}
              className="text-sm bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fetchingStats ? '갱신 중...' : '⟳ 아툴 데이터 갱신'}
            </button>
            <a
              href="https://docs.google.com/spreadsheets/d/1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg"
            >
              📝 시트 편집
            </a>
          </div>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="캐릭터명 검색..."
            className="w-full max-w-md bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 직업별 필터 */}
        <section className="flex flex-wrap gap-2 mb-6">
          {CLASSES.map((cls) => {
            const count = cls === '전체'
              ? members.length
              : members.filter(m => m.className === cls).length;
            return (
              <button
                key={cls}
                onClick={() => setActiveFilter(cls)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === cls
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {cls !== '전체' && CLASS_ICONS[cls]} {cls} ({count})
              </button>
            );
          })}
        </section>

        {/* 길드원 목록 */}
        <section className="bg-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-700">
            <h2 className="text-lg font-semibold text-white">
              {activeFilter === '전체' ? '전체' : activeFilter} ({sortedMembers.length}명)
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-zinc-400">
              데이터 불러오는 중...
            </div>
          ) : sortedMembers.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              {members.length === 0 ? '등록된 길드원이 없습니다.' : '검색 결과가 없습니다.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900">
                  <tr className="text-zinc-400">
                    <th className="text-left p-3 font-medium">캐릭터</th>
                    <th className="text-left p-3 font-medium">직업</th>
                    <th className="text-left p-3 font-medium">계급</th>
                    <th className="text-center p-3 font-medium">년생</th>
                    <th className="text-right p-3 font-medium">전투점수</th>
                    <th className="text-right p-3 font-medium">전투력</th>
                    <th className="text-center p-3 font-medium">디코</th>
                    <th className="text-center p-3 font-medium">카톡</th>
                    <th className="text-center p-3 font-medium">아툴</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {sortedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-zinc-700/50">
                      <td className="p-3">
                        <span className="font-medium text-white">{member.nickname}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-zinc-200">
                          {CLASS_ICONS[member.className] || ''} {member.className}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-300">{member.rank}</td>
                      <td className="p-3 text-center text-zinc-300">{member.age || '-'}</td>
                      <td className="p-3 text-right font-mono">
                        {member.loading ? (
                          <span className="text-zinc-500">로딩...</span>
                        ) : member.combatScore ? (
                          <span className="text-amber-400 font-semibold">
                            {member.combatScore.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {member.loading ? (
                          <span className="text-zinc-500">...</span>
                        ) : member.combatPower ? (
                          <span className="text-zinc-200">
                            {member.combatPower.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {member.discord === 'O' ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {member.kakao === 'O' ? (
                          <span className="text-yellow-400">✓</span>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <a
                          href={`https://www.aion2tool.com/char/serverid=${ZIKEL_SERVER_ID}/${encodeURIComponent(member.nickname)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          상세
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-4 text-sm text-zinc-500 text-center">
          구글 시트 연동 · aion2tool.com 실시간 데이터
          {lastUpdated && ` · ${new Date(lastUpdated).toLocaleTimeString('ko-KR')} 갱신`}
        </p>
      </main>
    </div>
  );
}
