'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GuildMember {
  className: string;
  discord: string;
  kakao: string;
  maxCombatScore?: number;
  combatScore?: number;
  combatPower?: number;
}

const CLASS_INFO: { name: string; icon: string; color: string }[] = [
  { name: '검성', icon: '⚔️', color: 'text-red-400' },
  { name: '수호성', icon: '🛡️', color: 'text-blue-400' },
  { name: '살성', icon: '🗡️', color: 'text-purple-400' },
  { name: '궁성', icon: '🏹', color: 'text-green-400' },
  { name: '정령성', icon: '🔮', color: 'text-cyan-400' },
  { name: '마도성', icon: '✨', color: 'text-pink-400' },
  { name: '치유성', icon: '💚', color: 'text-emerald-400' },
  { name: '호법성', icon: '📿', color: 'text-yellow-400' },
];

export default function Home() {
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sheets')
      .then(res => res.json())
      .then(data => {
        if (data.members) {
          setMembers(data.members);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getClassCount = (className: string) =>
    members.filter(m => m.className === className).length;

  // 전투력 계산
  const membersWithPower = members.filter(m => m.combatPower && Number(m.combatPower) > 0);
  const totalPower = membersWithPower.reduce((sum, m) => sum + Number(m.combatPower || 0), 0);
  const avgPower = membersWithPower.length > 0 ? Math.round(totalPower / membersWithPower.length) : 0;

  const stats = {
    total: members.length,
    discord: members.filter(m => m.discord === 'O').length,
    kakao: members.filter(m => m.kakao === 'O').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-400">사계 길드</h1>
          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/DgwjWYMu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              Discord
            </a>
            <span className="text-zinc-500 text-sm">AION2 지켈</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 타이틀 */}
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-amber-400">사계</span>{' '}
            <span className="text-white">길드</span>
          </h2>
          <p className="text-zinc-400">지켈 서버 · 마족</p>
        </section>

        {/* 공지사항 - 강조 */}
        <Link
          href="/notice"
          className="block bg-red-900/30 rounded-xl border-2 border-red-500/50 p-4 mb-6 hover:bg-red-900/50 hover:border-red-500 transition-all animate-pulse-slow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📢</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg">공지사항</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">필독</span>
                </div>
                <span className="text-zinc-300 text-sm">길드 규칙 · 루드라 파티 규칙</span>
              </div>
            </div>
            <span className="text-red-400 text-xl">→</span>
          </div>
        </Link>

        {/* 참여 링크 */}
        <section className="grid grid-cols-2 gap-4 mb-8">
          <a
            href="https://discord.gg/DgwjWYMu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 rounded-xl p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-1">💬</div>
            <div className="font-semibold text-white">디스코드 참여</div>
          </a>
          <a
            href="https://open.kakao.com/o/gr52NRmg"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-400 rounded-xl p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-1">💛</div>
            <div className="font-semibold text-zinc-900">카카오톡 참여</div>
            <div className="text-xs text-zinc-700 mt-1">참여코드: Aion222</div>
          </a>
        </section>

        {/* 메뉴 버튼 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/members" className="bg-zinc-800 rounded-xl p-5 border border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-750 transition-all group text-center">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400">길드원</h3>
          </Link>
          <Link href="/schedule" className="bg-zinc-800 rounded-xl p-5 border border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-750 transition-all group text-center">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400">일정표</h3>
          </Link>
        </div>

        {/* 길드 통계 */}
        <section className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
          {loading ? (
            <p className="text-center text-zinc-400 py-4">로딩 중...</p>
          ) : (
            <>
              {/* 주요 통계 */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-zinc-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-amber-400">{stats.total}</div>
                  <div className="text-zinc-400 text-sm mt-1">길드원</div>
                </div>
                <div className="bg-zinc-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-cyan-400">{avgPower.toLocaleString()}</div>
                  <div className="text-zinc-400 text-sm mt-1">평균 전투력</div>
                </div>
                <div className="bg-zinc-900 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400">{totalPower.toLocaleString()}</div>
                  <div className="text-zinc-400 text-sm mt-1">총 전투력</div>
                </div>
              </div>

              {/* 직업별 분포 */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
                {CLASS_INFO.map((cls) => (
                  <div key={cls.name} className="text-center">
                    <div className="text-xl">{cls.icon}</div>
                    <div className={`text-lg font-bold ${cls.color}`}>{getClassCount(cls.name)}</div>
                    <div className="text-zinc-500 text-xs">{cls.name}</div>
                  </div>
                ))}
              </div>

              {/* 소통 현황 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-700">
                <div className="flex items-center justify-center gap-3 bg-zinc-900 rounded-lg p-3">
                  <span className="text-indigo-400 text-xl">💬</span>
                  <div>
                    <span className="text-white font-bold">{stats.discord}</span>
                    <span className="text-zinc-400 text-sm ml-1">디스코드</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 bg-zinc-900 rounded-lg p-3">
                  <span className="text-yellow-400 text-xl">💛</span>
                  <div>
                    <span className="text-white font-bold">{stats.kakao}</span>
                    <span className="text-zinc-400 text-sm ml-1">카카오톡</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-zinc-500 text-sm">
          <p>사계 길드 · AION2 지켈 서버 (마족)</p>
        </div>
      </footer>
    </div>
  );
}
