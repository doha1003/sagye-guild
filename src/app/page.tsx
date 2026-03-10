'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AlertBar from './components/AlertBar';
import YouTubeLive from './components/YouTubeLive';
import { trackClick } from '@/lib/analytics';

interface GuildMember {
  className: string;
  discord: string;
  kakao: string;
  maxCombatScore?: number;
  combatScore?: number;
  combatPower?: number;
  mainCharacter?: string;  // 부캐인 경우 본캐 닉네임
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
  const [statFilter, setStatFilter] = useState<'총합' | '본캐' | '부캐'>('총합');
  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout>(undefined);
  const router = useRouter();

  const handleLogoClick = () => {
    tapCount.current++;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      router.push('/admin');
      return;
    }
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
  };

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

  const filtered = statFilter === '본캐'
    ? members.filter(m => !m.mainCharacter)
    : statFilter === '부캐'
    ? members.filter(m => !!m.mainCharacter)
    : members;

  const getClassCount = (className: string) =>
    filtered.filter(m => m.className === className).length;

  const membersWithPower = filtered.filter(m => m.combatPower && Number(m.combatPower) > 0);
  const totalPower = membersWithPower.reduce((sum, m) => sum + Number(m.combatPower || 0), 0);
  const avgPower = membersWithPower.length > 0 ? Math.round(totalPower / membersWithPower.length) : 0;

  const membersWithScore = filtered.filter(m => m.combatScore && Number(m.combatScore) > 0);
  const avgScore = membersWithScore.length > 0
    ? Math.round(membersWithScore.reduce((sum, m) => sum + Number(m.combatScore || 0), 0) / membersWithScore.length)
    : 0;

  const mainInFiltered = statFilter === '부캐' ? filtered : filtered.filter(m => !m.mainCharacter);
  const stats = {
    total: filtered.length,
    discord: mainInFiltered.filter(m => m.discord === 'O').length,
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
          <h1 className="text-2xl font-bold text-amber-400 select-none cursor-default" onClick={handleLogoClick}>접속중 레기온</h1>
          <div className="flex items-center gap-4">
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
                  <span className="font-bold text-cyan-300">시즌2 진행중</span>
                  <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded">D+{Math.floor((Date.now() - new Date('2026-01-21').getTime()) / 86400000)}</span>
                </div>
                <span className="text-zinc-400 text-sm">시즌2 정보 · 타임라인 · 신규 컨텐츠</span>
              </div>
            </div>
            <span className="text-cyan-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* 타이틀 */}
        <section className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">
            <span className="text-amber-400">접속중 레기온</span>
          </h2>
          <p className="text-zinc-400">지켈 서버 · 마족</p>
        </section>

        {/* 공지사항 */}
        <Link
          href="/notice"
          className="block bg-gradient-to-r from-red-600 to-amber-500 rounded-xl p-[2px] mb-6 group hover:shadow-lg hover:shadow-red-500/20 transition-all"
        >
          <div className="bg-zinc-900 rounded-[10px] px-5 py-4 flex items-center justify-between group-hover:bg-zinc-900/80 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📢</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-lg">레기온 공지사항</span>
                  <span className="bg-red-500 text-white text-sm font-extrabold px-3 py-1 rounded-md animate-pulse shadow-md shadow-red-500/30">필독</span>
                </div>
                <span className="text-zinc-400 text-sm">레기온 규칙 · 파티 규칙 · 사이트 가이드</span>
              </div>
            </div>
            <span className="text-red-400 text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>


        {/* 레기온 통계 */}
        <section className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 mb-6">
          {loading ? (
            <p className="text-center text-zinc-400 py-4">로딩 중...</p>
          ) : (
            <>
              {/* 필터 버튼 */}
              <div className="flex gap-1 mb-4">
                {(['총합', '본캐', '부캐'] as const).map((f) => (
                  <button key={f}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statFilter === f
                        ? 'bg-amber-400 text-zinc-900'
                        : 'bg-zinc-900/50 text-zinc-400 hover:text-white'
                    }`}
                    onClick={() => setStatFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>

              {/* 주요 통계 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
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
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400">{avgScore.toLocaleString()}</div>
                  <div className="text-zinc-400 text-sm mt-1">평균 아툴</div>
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

            </>
          )}
        </section>

        {/* 메뉴 버튼 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link href="/members" onClick={() => trackClick('레기온원')} className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-white group-hover:text-amber-400">레기온원</h3>
            <p className="text-zinc-500 text-sm mt-1">멤버 관리</p>
          </Link>
          <Link href="/schedule" onClick={() => trackClick('일정표')} className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-bold text-white group-hover:text-amber-400">일정표</h3>
            <p className="text-zinc-500 text-sm mt-1">컨텐츠 일정</p>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/tips/appearance" onClick={() => trackClick('외형 정보')} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-2xl mb-1">👗</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 text-sm">외형 정보</h3>
          </Link>
          <Link href="/tips/pets" onClick={() => trackClick('펫 DB')} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-2xl mb-1">🐾</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 text-sm">펫 DB</h3>
          </Link>
          <Link href="/tips/tuning" onClick={() => trackClick('조율 팁')} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-2xl mb-1">🔧</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 text-sm">조율 팁</h3>
          </Link>
          <Link href="/craft" onClick={() => trackClick('제작 계산기')} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 transition-all group text-center">
            <div className="text-2xl mb-1">⚒️</div>
            <h3 className="font-semibold text-white group-hover:text-amber-400 text-sm">제작 계산기</h3>
          </Link>
        </div>

        {/* AION2 공식 라이브 방송 */}
        <YouTubeLive />

        {/* 소통 참여 */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <a
            href="https://discord.gg/XJUrkxc9Cm"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('디스코드 참여')}
            className="bg-[#5865F2] hover:bg-[#4752C4] rounded-xl p-5 text-center transition-colors"
          >
            <div className="text-2xl mb-1">💬</div>
            <div className="font-semibold text-white">디스코드 참여</div>
          </a>
          <a
            href="https://open.kakao.com/o/gsMtbrki"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('카카오톡 참여')}
            className="bg-[#FEE500] hover:bg-[#F5DC00] rounded-xl p-5 text-center transition-colors"
          >
            <div className="text-2xl mb-1">💛</div>
            <div className="font-semibold text-zinc-900">카카오톡 참여</div>
            <div className="text-xs text-zinc-700 mt-0.5">참여코드: 18aion</div>
          </a>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 bg-zinc-900/80 mt-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-zinc-500 mb-3 text-center">AION2 바로가기</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[
                { href: 'https://www.youtube.com/@AION2', icon: '▶️', label: '유튜브' },
                { href: 'https://aion2.plaync.com/ko-kr/board/notice/list', icon: '📢', label: '공지' },
                { href: 'https://aion2.plaync.com/ko-kr/board/update/list', icon: '🔄', label: '업데이트' },
                { href: 'https://aion2.plaync.com/ko-kr/board/all/list', icon: '👥', label: '커뮤니티' },
                { href: 'https://aion2.plaync.com/ko-kr/styleshop/popular', icon: '👗', label: '스타일샵' },
                { href: 'https://tc-imba.com/?map=World_L_A', icon: '🗺️', label: '히든큐브' },
                { href: 'https://aion2.inven.co.kr/', icon: '📰', label: '인벤' },
                { href: 'https://gall.dcinside.com/mgallery/board/lists/?id=aion2', icon: '💬', label: '디시' },
                { href: 'https://www.itemmania.com/sell/list.html?search_game=5799', icon: '🛒', label: '매니아' },
                { href: 'https://www.barotem.com/product/lists/3839?page=1&sell=sell&display=1&orderby=1', icon: '💰', label: '바로템' },
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
            <p>접속중 레기온 · AION2 지켈 서버 (마족)</p>
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
              <span>© 2026 접속중 레기온</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
