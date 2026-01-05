'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// 직업별 역할 매핑
const CLASS_ROLES: Record<string, { role: 'tank' | 'dps' | 'healer' | 'support'; icon: string; color: string }> = {
  '검성': { role: 'dps', icon: '⚔️', color: 'text-red-400' },
  '수호성': { role: 'tank', icon: '🛡️', color: 'text-blue-400' },
  '궁성': { role: 'dps', icon: '🏹', color: 'text-orange-400' },
  '살성': { role: 'dps', icon: '🗡️', color: 'text-red-400' },
  '정령성': { role: 'dps', icon: '🔮', color: 'text-purple-400' },
  '마도성': { role: 'dps', icon: '✨', color: 'text-yellow-400' },
  '치유성': { role: 'healer', icon: '💚', color: 'text-green-400' },
  '호법성': { role: 'support', icon: '📿', color: 'text-teal-400' },
};

const ROLE_NAMES = {
  tank: '탱커',
  dps: '딜러',
  healer: '힐러',
  support: '서포터',
};

interface GuildMember {
  id: string;
  rank: string;
  nickname: string;
  className: string;
  discord: string;
  // 실시간 데이터
  combatScore?: number;
  combatPower?: number;
  loading?: boolean;
}

type RoleFilter = 'all' | 'tank' | 'dps' | 'healer' | 'support';

export default function MembersPage() {
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingStats, setFetchingStats] = useState(false);

  // 구글 시트에서 데이터 불러오기
  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/sheets');
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
    const updatedMembers = [...members];

    for (let i = 0; i < updatedMembers.length; i++) {
      const member = updatedMembers[i];
      // 로딩 상태 표시
      setMembers(prev => prev.map(m =>
        m.id === member.id ? { ...m, loading: true } : m
      ));

      const stats = await fetchCharacterStats(member.nickname);
      if (stats) {
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

      // Rate limiting 방지 (500ms 간격)
      if (i < updatedMembers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setFetchingStats(false);
  };

  // 초기 로드
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 역할별 필터링
  const getRole = (className: string) => CLASS_ROLES[className]?.role || 'dps';

  const filteredMembers = members.filter((m) => {
    const matchesRole = activeFilter === 'all' || getRole(m.className) === activeFilter;
    const matchesSearch = !searchQuery ||
      m.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.className.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  // 역할별 통계
  const stats = {
    total: members.length,
    tank: members.filter((m) => getRole(m.className) === 'tank').length,
    dps: members.filter((m) => getRole(m.className) === 'dps').length,
    healer: members.filter((m) => getRole(m.className) === 'healer').length,
    support: members.filter((m) => getRole(m.className) === 'support').length,
  };

  // 전투력 순 정렬 (실시간 데이터 우선, 없으면 시트 데이터)
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aScore = a.combatScore || 0;
    const bScore = b.combatScore || 0;
    return bScore - aScore;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">길드원 관리</h1>
            <p className="text-sm text-zinc-500 mt-1">지켈 서버 · 마족</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchAllStats}
              disabled={fetchingStats || members.length === 0}
              className="text-sm bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {fetchingStats ? '갱신 중...' : '🔄 아툴 데이터 갱신'}
            </button>
            <button
              onClick={fetchMembers}
              className="text-sm text-zinc-400 hover:text-white"
            >
              시트 새로고침
            </button>
            {lastUpdated && (
              <span className="text-xs text-zinc-500">
                {new Date(lastUpdated).toLocaleTimeString('ko-KR')}
              </span>
            )}
          </div>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="캐릭터명 또는 직업 검색..."
            className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 통계 */}
        <section className="grid grid-cols-5 gap-4 mb-8">
          {[
            { key: 'all' as const, label: '전체', count: stats.total },
            { key: 'tank' as const, label: ROLE_NAMES.tank, count: stats.tank },
            { key: 'dps' as const, label: ROLE_NAMES.dps, count: stats.dps },
            { key: 'healer' as const, label: ROLE_NAMES.healer, count: stats.healer },
            { key: 'support' as const, label: ROLE_NAMES.support, count: stats.support },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`p-4 rounded-xl border transition-all ${
                activeFilter === key
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-zinc-400">{label}</div>
            </button>
          ))}
        </section>

        {/* 길드원 목록 */}
        <section className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden">
          <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              길드원 목록 ({sortedMembers.length}명)
            </h2>
            <a
              href="https://docs.google.com/spreadsheets/d/1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-400 hover:text-amber-300"
            >
              📝 시트에서 편집
            </a>
          </div>

          {loading ? (
            <div className="p-8 text-center text-zinc-500">
              데이터 불러오는 중...
            </div>
          ) : sortedMembers.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              {members.length === 0
                ? '등록된 길드원이 없습니다.'
                : '검색 결과가 없습니다.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-zinc-400">캐릭터</th>
                    <th className="text-left p-3 font-medium text-zinc-400">직업</th>
                    <th className="text-left p-3 font-medium text-zinc-400">계급</th>
                    <th className="text-right p-3 font-medium text-zinc-400">전투점수</th>
                    <th className="text-right p-3 font-medium text-zinc-400">전투력</th>
                    <th className="text-center p-3 font-medium text-zinc-400">디스코드</th>
                    <th className="text-center p-3 font-medium text-zinc-400">아툴</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/50">
                  {sortedMembers.map((member) => {
                    const classInfo = CLASS_ROLES[member.className] || { icon: '❓', color: 'text-zinc-400', role: 'dps' };
                    return (
                      <tr key={member.id} className="hover:bg-zinc-800/30">
                        <td className="p-3">
                          <span className="font-medium">{member.nickname}</span>
                        </td>
                        <td className="p-3">
                          <span className={classInfo.color}>
                            {classInfo.icon} {member.className}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-400">{member.rank}</td>
                        <td className="p-3 text-right font-mono">
                          {member.loading ? (
                            <span className="text-zinc-500">로딩...</span>
                          ) : member.combatScore ? (
                            <span className="text-amber-400">{member.combatScore.toLocaleString()}</span>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-mono">
                          {member.loading ? (
                            <span className="text-zinc-500">...</span>
                          ) : member.combatPower ? (
                            member.combatPower.toLocaleString()
                          ) : (
                            <span className="text-zinc-600">-</span>
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
                          <a
                            href={`https://www.aion2tool.com/ko/search?nickname=${encodeURIComponent(member.nickname)}&server=지켈&race=마족`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            🔗
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-4 text-sm text-zinc-500 text-center">
          ✨ 구글 시트 연동 · aion2tool.com 실시간 데이터 ·
          <a
            href="https://docs.google.com/spreadsheets/d/1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline ml-1"
          >
            시트 편집
          </a>
        </p>
      </main>
    </div>
  );
}
