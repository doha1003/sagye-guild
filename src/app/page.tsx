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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 배경 레이어 */}
      <div className="fixed inset-0 z-0">
        {/* 메인 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900" />

        {/* 은하수/별 효과 */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20px 30px, white, transparent),
                              radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                              radial-gradient(1px 1px at 90px 40px, white, transparent),
                              radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
                              radial-gradient(1px 1px at 230px 80px, white, transparent),
                              radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
                              radial-gradient(1px 1px at 350px 60px, white, transparent),
                              radial-gradient(2px 2px at 400px 200px, white, transparent)`,
            backgroundSize: '400px 200px',
          }}
        />

        {/* 빛나는 오브 효과 */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-[80px]" />

        {/* 상단 빛 효과 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>

      {/* 헤더 */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            사계 레기온
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/DgwjWYMu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              Discord
            </a>
            <span className="text-zinc-400 text-sm">AION2 지켈</span>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 relative z-10">
        {/* 타이틀 */}
        <section className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-2">⚔️</div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
              사계
            </span>{' '}
            <span className="text-white drop-shadow-lg">레기온</span>
          </h2>
          <p className="text-zinc-300 text-lg">지켈 서버 · 마족</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm">
              AION2
            </span>
            <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm">
              마족
            </span>
          </div>
        </section>

        {/* 1. 공지사항 */}
        <Link
          href="/notice"
          className="block bg-gradient-to-r from-red-900/40 to-orange-900/40 rounded-2xl border border-red-500/30 p-5 mb-6 hover:from-red-900/60 hover:to-orange-900/60 hover:border-red-500/50 transition-all backdrop-blur-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📢</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-xl">공지사항</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
                    필독
                  </span>
                </div>
                <span className="text-zinc-300">레기온 규칙 · 파티 규칙</span>
              </div>
            </div>
            <span className="text-red-400 text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* 2. 참여 링크 */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <a
            href="https://discord.gg/DgwjWYMu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-2xl p-5 text-center transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02]"
          >
            <div className="text-3xl mb-2">💬</div>
            <div className="font-bold text-white text-lg">디스코드</div>
            <div className="text-indigo-200 text-sm">참여하기</div>
          </a>
          <a
            href="https://open.kakao.com/o/gr52NRmg"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 rounded-2xl p-5 text-center transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.02]"
          >
            <div className="text-3xl mb-2">💛</div>
            <div className="font-bold text-zinc-900 text-lg">카카오톡</div>
            <div className="text-zinc-700 text-sm">참여코드: Aion222</div>
          </a>
        </section>

        {/* 3. 레기온 통계 */}
        <section className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
          {loading ? (
            <div className="text-center text-zinc-400 py-8">
              <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
              <p>로딩 중...</p>
            </div>
          ) : (
            <>
              {/* 주요 통계 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-center">
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-4 border border-amber-500/20">
                  <div className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1">{stats.total}</div>
                  <div className="text-amber-200/80 text-sm">레기온원</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-xl p-4 border border-cyan-500/20">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1">{avgPower.toLocaleString()}</div>
                  <div className="text-cyan-200/80 text-sm">평균 전투력</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/20">
                  <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1 break-all">{totalPower.toLocaleString()}</div>
                  <div className="text-green-200/80 text-sm">총 전투력</div>
                </div>
              </div>

              {/* 직업별 분포 */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                {CLASS_INFO.map((cls) => (
                  <div key={cls.name} className="text-center bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                    <div className="text-xl">{cls.icon}</div>
                    <div className={`text-lg font-bold ${cls.color}`}>{getClassCount(cls.name)}</div>
                    <div className="text-zinc-400 text-xs">{cls.name}</div>
                  </div>
                ))}
              </div>

              {/* 소통 현황 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-3 bg-indigo-500/10 rounded-xl p-3 border border-indigo-500/20">
                  <span className="text-xl">💬</span>
                  <div>
                    <span className="text-white font-bold text-lg">{stats.discord}</span>
                    <span className="text-indigo-300 text-sm ml-1">디스코드</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20">
                  <span className="text-xl">💛</span>
                  <div>
                    <span className="text-white font-bold text-lg">{stats.kakao}</span>
                    <span className="text-yellow-300 text-sm ml-1">카카오톡</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* 4. 메뉴 버튼 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link href="/members" className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 hover:bg-black/40 transition-all group text-center">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-bold text-white group-hover:text-amber-400 text-lg">레기온원</h3>
            <p className="text-zinc-400 text-sm mt-1">멤버 관리</p>
          </Link>
          <Link href="/schedule" className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 hover:bg-black/40 transition-all group text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-bold text-white group-hover:text-amber-400 text-lg">일정표</h3>
            <p className="text-zinc-400 text-sm mt-1">컨텐츠 일정</p>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/tips/appearance" className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-amber-500/50 hover:bg-black/40 transition-all group text-center">
            <div className="text-2xl mb-1">👗</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 text-sm">외형 정보</h3>
          </Link>
          <Link href="/tips/pets" className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-amber-500/50 hover:bg-black/40 transition-all group text-center">
            <div className="text-2xl mb-1">🐾</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 text-sm">펫 DB</h3>
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md mt-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* AION2 바로가기 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3 text-center">AION2 바로가기</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[
                { href: 'https://www.youtube.com/@AION2', icon: '▶️', label: '유튜브', hoverColor: 'hover:text-red-400 hover:border-red-500/30' },
                { href: 'https://aion2.plaync.com/ko-kr/board/notice/list', icon: '📢', label: '공지', hoverColor: 'hover:text-blue-400 hover:border-blue-500/30' },
                { href: 'https://aion2.plaync.com/ko-kr/board/update/list', icon: '🔄', label: '업데이트', hoverColor: 'hover:text-green-400 hover:border-green-500/30' },
                { href: 'https://aion2.plaync.com/ko-kr/board/all/list', icon: '👥', label: '커뮤니티', hoverColor: 'hover:text-cyan-400 hover:border-cyan-500/30' },
                { href: 'https://aion2.plaync.com/ko-kr/styleshop/popular', icon: '👗', label: '스타일샵', hoverColor: 'hover:text-pink-400 hover:border-pink-500/30' },
                { href: 'https://aion2.plaync.com/ko-kr/my/guild/board/free/list', icon: '📋', label: '게시판', hoverColor: 'hover:text-amber-400 hover:border-amber-500/30' },
                { href: 'https://aion2.inven.co.kr/', icon: '📰', label: '인벤', hoverColor: 'hover:text-orange-400 hover:border-orange-500/30' },
                { href: 'https://gall.dcinside.com/mgallery/board/lists/?id=aion2', icon: '💬', label: '디시', hoverColor: 'hover:text-sky-400 hover:border-sky-500/30' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-white/5 border border-white/10 rounded-lg p-2 text-center transition-all ${item.hoverColor} hover:bg-white/10`}
                >
                  <div className="text-lg">{item.icon}</div>
                  <div className="text-xs text-zinc-400">{item.label}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="text-center text-zinc-500 text-sm">
            <p>사계 레기온 · AION2 지켈 서버 (마족)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
