'use client';

import Link from 'next/link';

export default function Season2Page() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 via-indigo-900/20 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('/season2-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <Link href="/" className="inline-block text-amber-400 hover:text-amber-300 mb-8">
            ← 사계 레기온
          </Link>
          <div className="mb-4">
            <span className="bg-cyan-500 text-white text-sm font-bold px-4 py-1 rounded-full">
              2026.01.21 START
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            AION2 <span className="text-cyan-400">SEASON 2</span>
          </h1>
          <p className="text-xl text-zinc-300 mb-8">
            새로운 던전, 새로운 도전, 새로운 시작
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-zinc-800/80 backdrop-blur px-4 py-2 rounded-lg">
              <span className="text-zinc-400">신규 원정</span>
              <span className="text-white font-bold ml-2">2종</span>
            </div>
            <div className="bg-zinc-800/80 backdrop-blur px-4 py-2 rounded-lg">
              <span className="text-zinc-400">신규 토벌전</span>
              <span className="text-white font-bold ml-2">2종</span>
            </div>
            <div className="bg-zinc-800/80 backdrop-blur px-4 py-2 rounded-lg">
              <span className="text-zinc-400">신규 각성전</span>
              <span className="text-white font-bold ml-2">2종</span>
            </div>
            <div className="bg-zinc-800/80 backdrop-blur px-4 py-2 rounded-lg">
              <span className="text-zinc-400">신규 아르카나</span>
              <span className="text-cyan-400 font-bold ml-2">천칭</span>
            </div>
          </div>
        </div>
      </section>

      {/* 업데이트 타임라인 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          📅 업데이트 로드맵
        </h2>

        <div className="space-y-4">
          {/* 1/21 */}
          <div className="bg-gradient-to-r from-cyan-600/20 to-transparent border-l-4 border-cyan-500 rounded-r-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg text-lg">1/21</span>
              <div>
                <h3 className="text-xl font-bold text-cyan-300">시즌2 시작</h3>
                <p className="text-zinc-400 text-sm">랭킹 초기화 · 서버 매칭</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-amber-400 font-semibold mb-2">🏰 신규 원정</h4>
                <p className="text-white font-medium">죽은 드라마타의 둥지</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2">⚔️ 토벌전 2종</h4>
                <ul className="text-zinc-300 text-sm space-y-1">
                  <li>• 죽은 오르쿠스의 심장</li>
                  <li>• 파프나이트 제련소</li>
                </ul>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-2">💀 각성전 2종</h4>
                <ul className="text-zinc-300 text-sm space-y-1">
                  <li>• 봉인된 재앙 클라우디아</li>
                  <li>• 타락한 폭군 메녹수스</li>
                </ul>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <h4 className="text-indigo-400 font-semibold mb-2">🌀 어비스</h4>
                <p className="text-zinc-300 text-sm">어비스 중층 오픈 (아이템 레벨 제한)</p>
              </div>
            </div>
          </div>

          {/* 1/28 */}
          <div className="bg-zinc-800/30 border-l-4 border-zinc-600 rounded-r-lg p-6">
            <div className="flex items-center gap-4">
              <span className="bg-zinc-700 text-white font-bold px-4 py-2 rounded-lg">1/28</span>
              <div>
                <h3 className="text-lg font-bold text-white">신규 원정: 무의 요람</h3>
              </div>
            </div>
          </div>

          {/* 2/4 */}
          <div className="bg-zinc-800/30 border-l-4 border-zinc-600 rounded-r-lg p-6">
            <div className="flex items-center gap-4">
              <span className="bg-zinc-700 text-white font-bold px-4 py-2 rounded-lg">2/4</span>
              <div>
                <h3 className="text-lg font-bold text-white">초월 던전: 가라앉은 생명의 신전</h3>
                <p className="text-zinc-400 text-sm">1~10단계 난이도</p>
              </div>
            </div>
          </div>

          {/* 2/11 */}
          <div className="bg-zinc-800/30 border-l-4 border-zinc-600 rounded-r-lg p-6">
            <div className="flex items-center gap-4">
              <span className="bg-zinc-700 text-white font-bold px-4 py-2 rounded-lg">2/11</span>
              <div>
                <h3 className="text-lg font-bold text-white">어비스 균열 지대</h3>
                <p className="text-zinc-400 text-sm">신규 PvPvE 콘텐츠</p>
              </div>
            </div>
          </div>

          {/* 2/18 */}
          <div className="bg-zinc-800/30 border-l-4 border-zinc-600 rounded-r-lg p-6">
            <div className="flex items-center gap-4">
              <span className="bg-zinc-700 text-white font-bold px-4 py-2 rounded-lg">2/18</span>
              <div>
                <h3 className="text-lg font-bold text-white">어려움 난이도 추가</h3>
                <p className="text-zinc-400 text-sm">죽은 드라마타의 둥지, 무의 요람</p>
              </div>
            </div>
          </div>

          {/* 2/25 */}
          <div className="bg-zinc-800/30 border-l-4 border-zinc-600 rounded-r-lg p-6">
            <div className="flex items-center gap-4">
              <span className="bg-zinc-700 text-white font-bold px-4 py-2 rounded-lg">2/25</span>
              <div>
                <h3 className="text-lg font-bold text-white">성역: 침식의 정화소</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 아르카나 섹션 */}
      <section className="bg-gradient-to-b from-amber-900/10 to-transparent py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            ⚜️ 신규 아르카나
          </h2>

          <div className="bg-zinc-800/50 backdrop-blur rounded-2xl p-8 border border-amber-500/20">
            <div className="text-center mb-8">
              <div className="inline-block bg-amber-500/20 border border-amber-500/30 rounded-full px-6 py-2 mb-4">
                <span className="text-amber-400 font-bold text-lg">신규 부위: 천칭 (Libra)</span>
              </div>
              <p className="text-zinc-400">아르카나 신규 슬롯이 추가됩니다</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-center">신규 아르카나 세트</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-6 py-3 rounded-lg font-medium">
                  💀 죽음
                </span>
                <span className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-6 py-3 rounded-lg font-medium">
                  ⚔️ 전쟁
                </span>
                <span className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-6 py-3 rounded-lg font-medium">
                  ✨ 신비
                </span>
                <span className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-6 py-3 rounded-lg font-medium">
                  🕊️ 자유
                </span>
                <span className="bg-zinc-900 border border-zinc-700 text-zinc-200 px-6 py-3 rounded-lg font-medium">
                  ⚡ 일격
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 어비스 개편 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          ⚔️ 어비스 개편
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-6">
            <h3 className="text-indigo-400 font-bold text-lg mb-3">어비스 중층</h3>
            <p className="text-zinc-300 mb-2">1월 21일 오픈</p>
            <ul className="text-zinc-400 text-sm space-y-1">
              <li>• 아이템 레벨 입장 제한</li>
              <li>• 상위 유저 경쟁 콘텐츠</li>
            </ul>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-purple-400 font-bold text-lg mb-3">어비스 균열 지대</h3>
            <p className="text-zinc-300 mb-2">2월 11일 오픈</p>
            <ul className="text-zinc-400 text-sm space-y-1">
              <li>• 신규 PvPvE 콘텐츠</li>
              <li>• 새로운 전장 경험</li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-3">어비스 포인트 개편</h3>
            <ul className="text-zinc-400 text-sm space-y-1">
              <li>• 주간 제한 → 시즌 총량 방식으로 변경</li>
              <li>• 하층 3:0 패배 시 회랑 바로 입장 가능</li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-3">공명전 개선</h3>
            <ul className="text-zinc-400 text-sm space-y-1">
              <li>• 편의성 개선</li>
              <li>• 매칭 시스템 최적화</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 적용 완료 업데이트 */}
      <section className="bg-green-900/10 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            ✅ 적용 완료된 사전 업데이트
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded">1/7</span>
                <h3 className="text-green-400 font-bold">펫 시스템 개선</h3>
              </div>
              <ul className="text-zinc-400 text-sm space-y-1">
                <li>• 종족 이해도 & 펫 보유 → 서버 내 캐릭터 공유</li>
                <li>• 모든 캐릭터 펫 레벨 합산</li>
                <li>• 필요 영혼 수량 50% 하향</li>
              </ul>
            </div>

            <div className="bg-zinc-800/50 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded">1/14</span>
                <h3 className="text-green-400 font-bold">펫 스탯 밸런스</h3>
              </div>
              <ul className="text-zinc-400 text-sm space-y-1">
                <li>• 펫 레벨 달성 스탯 약 50% 하향</li>
                <li>• 통합 프리셋 확장 (타이틀, 아르카나)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 편의성 업데이트 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          🛠️ 편의성 업데이트
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '🎫', title: '티켓 시스템', desc: '원정 및 초월 티켓 차감 방식 변경' },
            { icon: '⚜️', title: '아르카나 슬롯', desc: '신규 천칭 슬롯 추가' },
            { icon: '🏆', title: '클래스별 랭킹', desc: '각성전/일일던전 랭킹 도입' },
            { icon: '🛡️', title: '방어구 조율', desc: '조율 옵션 추가' },
            { icon: '👊', title: '보스 패턴', desc: '근거리 대상 패턴 완화' },
            { icon: '💎', title: '장비 계승', desc: '영혼 각인 옵션 계승 (예정)' },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="text-white font-medium mb-1">{item.title}</h4>
              <p className="text-zinc-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 향후 계획 */}
      <section className="bg-gradient-to-t from-indigo-900/20 to-transparent py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            🔮 2026년 향후 계획
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold text-white mb-2">신규 클래스</h3>
              <p className="text-zinc-400">새로운 전투 메커니즘과 호쾌한 스타일의 신규 클래스 개발중</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-white mb-2">새로운 영지</h3>
              <p className="text-zinc-400">탐험할 수 있는 새로운 지역 준비중</p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Link href="/" className="text-amber-400 hover:text-amber-300 font-bold text-lg">
            사계 레기온
          </Link>
          <p className="text-zinc-500 text-sm mt-2">
            AION2 지켈 서버 · 마족
          </p>
          <p className="text-zinc-600 text-xs mt-4">
            정보 출처: NCSOFT 공식 발표
          </p>
        </div>
      </footer>
    </div>
  );
}
