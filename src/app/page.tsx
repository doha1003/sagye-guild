'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AlertBar from './components/AlertBar';

interface GuildMember {
  className: string;
  discord: string;
  kakao: string;
  maxCombatScore?: number;
  combatScore?: number;
  combatPower?: number;
}

const CLASS_INFO: { name: string; icon: string; color: string }[] = [
  { name: '검성', icon: '🗡️', color: 'text-red-400' },
  { name: '수호성', icon: '🛡️', color: 'text-blue-400' },
  { name: '살성', icon: '⚔️', color: 'text-purple-400' },
  { name: '궁성', icon: '🏹', color: 'text-green-400' },
  { name: '정령성', icon: '🔮', color: 'text-cyan-400' },
  { name: '마도성', icon: '✨', color: 'text-pink-400' },
  { name: '치유성', icon: '💚', color: 'text-emerald-400' },
  { name: '호법성', icon: '📿', color: 'text-yellow-400' },
];

export default function Home() {
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState({ total: 0, today: 0 });

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

    // 방문자 수 증가 및 조회
    const hasVisited = sessionStorage.getItem('visited');
    if (!hasVisited) {
      fetch('/api/visitors', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setVisitors(data);
          sessionStorage.setItem('visited', 'true');
        })
        .catch(() => {});
    } else {
      fetch('/api/visitors')
        .then(res => res.json())
        .then(data => setVisitors(data))
        .catch(() => {});
    }
  }, []);

  const getClassCount = (className: string) =>
    members.filter(m => m.className === className).length;

  const membersWithPower = members.filter(m => m.combatPower && Number(m.combatPower) > 0);
  const totalPower = membersWithPower.reduce((sum, m) => sum + Number(m.combatPower || 0), 0);
  const avgPower = membersWithPower.length > 0 ? Math.round(totalPower / membersWithPower.length) : 0;

  const stats = {
    total: members.length,
    discord: members.filter(m => m.discord === 'O').length,
    kakao: members.filter(m => m.kakao === 'O').length,
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 배경 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-zinc-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/20 rounded-full blur-[150px]" />
      </div>

      {/* 헤더 */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-400">사계 레기온</h1>
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
      <AlertBar />

      {/* 메인 */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 relative z-10">
        {/* 시즌2 배너 */}
        <Link
          href="/season2"
          className="block bg-gradient-to-r from-cyan-600/20 to-indigo-600/20 border border-cyan-500/30 rounded-xl p-4 mb-6 hover:from-cyan-600/30 hover:to-indigo-600/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-300">시즌2 시작</span>
                  <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded">1/21</span>
                </div>
                <span className="text-zinc-400 text-sm">신규 던전 · 어비스 개편 · 랭킹 초기화</span>
              </div>
            </div>
            <span className="text-cyan-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* 타이틀 */}
        <section className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">
            <span className="text-amber-400">사계</span>{' '}
            <span className="text-white">레기온</span>
          </h2>
          <p className="text-zinc-400">지켈 서버 · 마족</p>
        </section>

        {/* 공지사항 */}
        <Link
          href="/notice"
          className="block bg-zinc-800/50 rounded-xl border border-zinc-700 p-5 mb-6 hover:bg-zinc-800 hover:border-zinc-600 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📢</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-lg">공지사항</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">필독</span>
                </div>
                <span className="text-zinc-400">레기온 규칙 · 파티 규칙</span>
              </div>
            </div>
            <span className="text-zinc-500 text-xl group-hover:text-zinc-300 transition-colors">→</span>
          </div>
        </Link>

        {/* 참여 링크 */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <a
            href="https://discord.gg/DgwjWYMu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 rounded-xl p-5 text-center transition-colors"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="font-bold text-white">디스코드</div>
            <div className="text-indigo-200 text-sm">참여하기</div>
          </a>
          <a
            href="https://open.kakao.com/o/gr52NRmg"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-400 rounded-xl p-5 text-center transition-colors"
          >
            <div className="text-2xl mb-2">💛</div>
            <div className="font-bold text-zinc-900">카카오톡</div>
            <div className="text-zinc-700 text-sm">참여코드: Aion222</div>
          </a>
        </section>

        {/* 레기온 통계 */}
        <section className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 mb-6">
          {loading ? (
            <p className="text-center text-zinc-400 py-4">로딩 중...</p>
          ) : (
            <>
              {/* 주요 통계 */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.total}</div>
                  <div className="text-zinc-400 text-sm mt-1">레기온원</div>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <div className="text-xl sm:text-2xl font-bold text-white">{avgPower.toLocaleString()}</div>
                  <div className="text-zinc-400 text-sm mt-1">평균 전투력</div>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <div className="text-lg sm:text-xl font-bold text-white break-all">{totalPower.toLocaleString()}</div>
                  <div className="text-zinc-400 text-sm mt-1">총 전투력</div>
                </div>
              </div>

              {/* 직업별 분포 */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                {CLASS_INFO.map((cls) => (
                  <div key={cls.name} className="text-center p-2">
                    <div className="text-lg">{cls.icon}</div>
                    <div className={`text-base font-bold ${cls.color}`}>{getClassCount(cls.name)}</div>
                    <div className="text-zinc-500 text-xs">{cls.name}</div>
                  </div>
                ))}
              </div>

              {/* 소통 현황 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-700">
                <div className="flex items-center justify-center gap-2 bg-zinc-900/50 rounded-lg p-3">
                  <span className="text-lg">💬</span>
                  <span className="text-white font-bold">{stats.discord}</span>
                  <span className="text-zinc-400 text-sm">디스코드</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-zinc-900/50 rounded-lg p-3">
                  <span className="text-lg">💛</span>
                  <span className="text-white font-bold">{stats.kakao}</span>
                  <span className="text-zinc-400 text-sm">카카오톡</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* 메뉴 버튼 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link href="/members" className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-white group-hover:text-amber-400">레기온원</h3>
            <p className="text-zinc-500 text-sm mt-1">멤버 관리</p>
          </Link>
          <Link href="/schedule" className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-bold text-white group-hover:text-amber-400">일정표</h3>
            <p className="text-zinc-500 text-sm mt-1">컨텐츠 일정</p>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/tips/appearance" className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-2xl mb-1">👗</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 text-sm">외형 정보</h3>
          </Link>
          <Link href="/tips/pets" className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-2xl mb-1">🐾</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 text-sm">펫 DB</h3>
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 bg-zinc-900/80 mt-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-500 mb-3 text-center">AION2 바로가기</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[
                { href: 'https://www.youtube.com/@AION2', icon: '▶️', label: '유튜브' },
                { href: 'https://aion2.plaync.com/ko-kr/board/notice/list', icon: '📢', label: '공지' },
                { href: 'https://aion2.plaync.com/ko-kr/board/update/list', icon: '🔄', label: '업데이트' },
                { href: 'https://aion2.plaync.com/ko-kr/board/all/list', icon: '👥', label: '커뮤니티' },
                { href: 'https://aion2.plaync.com/ko-kr/styleshop/popular', icon: '👗', label: '스타일샵' },
                { href: 'https://tc-imba.com/?map=World_L_A', icon: '🗺️', label: '히든큐브' },
                { href: 'https://aion2.inven.co.kr/', icon: '📰', label: '인벤' },
                { href: 'https://gall.dcinside.com/mgallery/board/lists/?id=aion2', icon: '💬', label: '디시' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg p-2 text-center transition-colors"
                >
                  <div className="text-lg">{item.icon}</div>
                  <div className="text-xs text-zinc-400">{item.label}</div>
                </a>
              ))}
            </div>
          </div>
          <div className="text-center text-zinc-500 text-sm">
            <p>사계 레기온 · AION2 지켈 서버 (마족)</p>
            <p className="text-xs text-zinc-600 mt-2">
              AION2 오픈 2025.11.19 · 사이트 개설 2026.01.06
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Today {visitors.today.toLocaleString()} · Total {visitors.total.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-700 mt-2">
              <Link href="/updates" className="hover:text-zinc-500">업데이트 내역</Link>
              {' · '}
              <Link href="/terms" className="hover:text-zinc-500">이용약관</Link>
              {' · '}
              <span>© 2026 사계 레기온</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
