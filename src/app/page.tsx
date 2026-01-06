'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GuildMember {
  className: string;
  discord: string;
  kakao: string;
}

const ROLES: Record<string, string> = {
  '수호성': 'tank',
  '검성': 'dps',
  '살성': 'dps',
  '궁성': 'dps',
  '정령성': 'dps',
  '마도성': 'dps',
  '치유성': 'healer',
  '호법성': 'support',
};

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

  const stats = {
    total: members.length,
    tank: members.filter(m => ROLES[m.className] === 'tank').length,
    dps: members.filter(m => ROLES[m.className] === 'dps').length,
    healer: members.filter(m => ROLES[m.className] === 'healer').length,
    support: members.filter(m => ROLES[m.className] === 'support').length,
    discord: members.filter(m => m.discord === 'O').length,
    kakao: members.filter(m => m.kakao === 'O').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-400">사계 길드</h1>
          <span className="text-zinc-300 text-sm">AION2 지켈 서버</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-amber-400">사계</span>{' '}
            <span className="text-white">길드 관리</span>
          </h2>
          <p className="text-zinc-300 text-lg">
            길드원 정보 조회 · 일정 관리 · 파티 매칭
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link href="/members" className="block bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-800 transition-all group">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-amber-400 transition-colors">길드원 관리</h3>
            <p className="text-zinc-300 text-sm">길드원 정보를 자동으로 업데이트하고 역할별로 분류합니다.</p>
          </Link>
          <Link href="/schedule" className="block bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-800 transition-all group">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-amber-400 transition-colors">일정표</h3>
            <p className="text-zinc-300 text-sm">필드보스, 던전, 레이드 일정을 관리하고 참여 신청을 받습니다.</p>
          </Link>
          <Link href="/party" className="block bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-800 transition-all group">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-amber-400 transition-colors">파티 매칭</h3>
            <p className="text-zinc-300 text-sm">전투력과 역할에 맞는 파티를 구성합니다.</p>
          </Link>
        </div>

        <section className="bg-zinc-800/50 rounded-xl p-8 border border-zinc-700">
          <h3 className="text-xl font-semibold mb-6 text-center text-white">길드 현황</h3>
          {loading ? (
            <p className="text-center text-zinc-400">로딩 중...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-6">
                <div>
                  <div className="text-3xl font-bold text-amber-400">{stats.total}</div>
                  <div className="text-zinc-300 text-sm mt-1">총 길드원</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">{stats.tank}</div>
                  <div className="text-zinc-300 text-sm mt-1">탱커</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">{stats.dps}</div>
                  <div className="text-zinc-300 text-sm mt-1">딜러</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">{stats.healer + stats.support}</div>
                  <div className="text-zinc-300 text-sm mt-1">힐러/서폿</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center border-t border-zinc-700 pt-6">
                <div>
                  <div className="text-2xl font-bold text-indigo-400">{stats.discord}</div>
                  <div className="text-zinc-300 text-sm mt-1">디스코드 참여</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{stats.kakao}</div>
                  <div className="text-zinc-300 text-sm mt-1">카카오톡 참여</div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-zinc-400 text-sm">
          <p>사계 길드 · AION2 지켈 서버 (마족)</p>
          <p className="mt-1">Powered by Next.js & Vercel</p>
        </div>
      </footer>
    </div>
  );
}
