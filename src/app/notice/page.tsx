'use client';

import Link from 'next/link';
import Image from 'next/image';
import AlertBar from '../components/AlertBar';

const TOC = [
  { id: 'rules', label: '레기온 규칙', emoji: '📋' },
  { id: 'party', label: '파티 규칙', emoji: '⚔️' },
  { id: 'site', label: '사이트 가이드', emoji: '🌐' },
  { id: 'bot', label: '레기온봇 (디스코드)', emoji: '🤖' },
];

export default function NoticePage() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/50 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            접속중 레기온
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
          </nav>
        </div>
      </header>
      <AlertBar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">공지사항</h1>
        <p className="text-zinc-500 mb-8">접속중 레기온 운영 규칙 및 가이드</p>

        {/* 목차 */}
        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-12">
          {TOC.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="group flex flex-col items-center gap-1.5 px-3 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-sm transition-all border border-zinc-800/50 hover:border-zinc-700"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-zinc-400 group-hover:text-white font-medium transition-colors">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 전체 내용 */}
        <div className="space-y-20">
          <section id="rules"><GuildRules /></section>
          <section id="party"><PartyRules /></section>
          <section id="site"><SiteGuide /></section>
          <section id="bot"><BotGuide /></section>
        </div>

        {/* 참여 링크 */}
        <div className="grid grid-cols-2 gap-4 mt-16 pt-8 border-t border-zinc-800/50">
          <a
            href="https://discord.gg/ukWwsQbA"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5865F2] hover:bg-[#4752C4] rounded-xl p-5 text-center transition-colors"
          >
            <div className="text-2xl mb-1">💬</div>
            <div className="font-semibold text-white">디스코드 참여</div>
          </a>
          <a
            href="https://open.kakao.com/o/gsMtbrki"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FEE500] hover:bg-[#F5DC00] rounded-xl p-5 text-center transition-colors"
          >
            <div className="text-2xl mb-1">💛</div>
            <div className="font-semibold text-zinc-900">카카오톡 참여</div>
            <div className="text-xs text-zinc-700 mt-0.5">참여코드: 18aion</div>
          </a>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ number, title, color }: { number: string; title: string; color: string }) {
  const borderColors: Record<string, string> = {
    amber: 'border-amber-500',
    red: 'border-red-500',
    blue: 'border-blue-500',
    indigo: 'border-indigo-500',
  };
  const textColors: Record<string, string> = {
    amber: 'text-amber-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
    indigo: 'text-indigo-400',
  };
  return (
    <div className={`border-l-4 ${borderColors[color]} pl-4 mb-8`}>
      <span className={`text-xs font-bold uppercase tracking-widest ${textColors[color]}`}>{number}</span>
      <h2 className="text-2xl font-bold text-white mt-1">{title}</h2>
    </div>
  );
}

/* ============================================================
   1. 레기온 규칙
   ============================================================ */
function GuildRules() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <SectionHeader number="SECTION 01" title="레기온 규칙" color="amber" />

      {/* 핵심 공지 */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-10">
        <p className="text-amber-300 font-bold text-lg text-center mb-1">
          닉넴 / 년생 / 직업 → 디스코드 서버프로필 변경 필수
        </p>
        <p className="text-zinc-500 text-sm text-center">
          디스코드 좌측 서버 목록에서 레기온 서버 우클릭 → 서버 프로필 수정
        </p>
      </div>

      <div className="space-y-8">
        <RuleBlock num="1" title="소통 수단">
          <Li highlight>디스코드 필수 참여 (공지/파티모집/운영 안내 기준)</Li>
          <Li>미접 예정 시 디코 <W>#미접-사유</W> 채널에 기재</Li>
          <Li sub>카카오톡 단톡방 참여는 선택 사항</Li>
        </RuleBlock>

        <RuleBlock num="2" title="디스코드 채널 사용">
          <Li>루드라 / 던전 → 루드라·던전 전용 음성 채널</Li>
          <Li>PVP / 쟁 → 쟁 전용 음성 채널</Li>
          <Li>그 외 → 잡담방</Li>
          <Li sub>맞지 않는 채널 사용 시 운영진이 이동을 요청할 수 있습니다.</Li>
        </RuleBlock>

        <RuleBlock num="3" title="상호 존중">
          <Li>레기온 내 모든 구성원은 <W>상호 존중</W>을 기본으로 합니다.</Li>
          <Li>과한 반말, 비꼬기, 선 넘는 농담/지적/압박은 자제해 주세요.</Li>
          <Li warn>반복 시 운영자 판단으로 즉시 추방될 수 있습니다.</Li>
        </RuleBlock>

        <RuleBlock num="4" title="접속 / 미접 기준">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-3">
            <p className="text-red-300 font-bold text-center text-lg">사전 공유 없는 미접속 4일 → 추방</p>
          </div>
          <Li>미접 사유: <W>#미접-사유</W> 채널에 캐릭터명 + 기간 + 사유 기재</Li>
          <Li warn>미접일 미작성도 추방 대상</Li>
        </RuleBlock>

        <RuleBlock num="5" title="플레이 문화">
          <Li>서로 필요한 상황에서는 가능한 범위 내에서 도와주는 문화를 지향</Li>
          <Li sub>모든 도움은 강요가 아닌 자율 원칙입니다.</Li>
        </RuleBlock>

        <RuleBlock num="6" title="부캐 가입">
          <Li>부캐도 레기온에 함께 가입 가능합니다.</Li>
          <Li>가입 → 군단장 <span className="text-amber-400 font-semibold">텐구</span>에게 게임 내 귓말</Li>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-2">
            <p className="text-red-300 font-semibold text-sm text-center">
              가입 후 소개글(한마디)에 본캐 닉네임 기재 필수!
            </p>
            <p className="text-zinc-500 text-xs text-center mt-1">미기재 시 경고 없이 추방될 수 있습니다.</p>
          </div>
        </RuleBlock>

        <RuleBlock num="7" title="기타">
          <Li>레기온 내부 대화, 운영 관련 내용의 외부 공유 금지</Li>
          <Li>모든 제재/추방은 운영자 판단 기준</Li>
        </RuleBlock>
      </div>

      <div className="bg-zinc-900 rounded-xl p-6 text-center mt-10 border border-zinc-800/50">
        <p className="text-zinc-400">
          레기온은 단기 플레이가 아닌
        </p>
        <p className="text-white font-semibold text-lg mt-1">
          장기적으로 함께 재미있게 할 분들을 위한 공간입니다.
        </p>
      </div>
    </article>
  );
}

/* ============================================================
   2. 파티 규칙 (루드라)
   ============================================================ */
function PartyRules() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <SectionHeader number="SECTION 02" title="루드라 파티 운영 안내" color="red" />

      {/* 파티 유형 3종 */}
      <div className="grid gap-4 mb-10">
        {/* 확클팟 */}
        <div className="rounded-xl overflow-hidden border border-green-500/20">
          <div className="bg-green-500/15 px-5 py-3 flex items-center gap-3">
            <span className="bg-green-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-md">확클팟</span>
            <span className="text-white font-semibold">확정 클리어 파티</span>
          </div>
          <div className="bg-zinc-900/50 px-5 py-4">
            <p className="text-zinc-300 mb-3">
              루드라를 <W>1번이라도 클리어한 경험이 있는 분들</W>끼리 진행합니다.
            </p>
            <div className="bg-green-500/5 border border-green-500/15 rounded-lg px-4 py-3">
              <p className="text-green-300 text-sm">
                <strong>클경이 없어도</strong> 참여하고 싶다면 모집글 작성자에게 먼저 물어보세요!
              </p>
              <p className="text-zinc-500 text-sm mt-1">1~2명 정도는 학원팟처럼 데려갈 수 있습니다.</p>
            </div>
          </div>
        </div>

        {/* 학원팟 */}
        <div className="rounded-xl overflow-hidden border border-blue-500/20">
          <div className="bg-blue-500/15 px-5 py-3 flex items-center gap-3">
            <span className="bg-blue-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-md">학원팟</span>
            <span className="text-white font-semibold">기믹 교육 파티</span>
          </div>
          <div className="bg-zinc-900/50 px-5 py-4">
            <p className="text-zinc-300 mb-3">
              고점 분들이 기믹을 알려주면서 함께 진행하는 버스 형태 파티입니다.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 text-center">
              <p className="text-blue-300 font-medium">
                참여 희망 시 군단장 <W className="text-lg">&quot;텐구&quot;</W> 또는 <W className="text-lg">&quot;텐겐&quot;</W>에게 귓말!
              </p>
            </div>
          </div>
        </div>

        {/* 트라이팟 */}
        <div className="rounded-xl overflow-hidden border border-zinc-700/50">
          <div className="bg-zinc-800/50 px-5 py-3 flex items-center gap-3">
            <span className="bg-zinc-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-md">트라이팟</span>
            <span className="text-white font-semibold">연습 파티</span>
          </div>
          <div className="bg-zinc-900/50 px-5 py-4">
            <p className="text-zinc-300">
              아예 모르는 분들끼리 처음부터 연습하는 파티입니다. 클리어가 아닌 기믹 숙지가 목표.
            </p>
            <p className="text-zinc-500 text-sm mt-2">* 8명 모집이 쉽지 않아 자주 진행되지는 않습니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-4 mb-10 text-center">
        <p className="text-zinc-400">
          현재 주로 <strong className="text-green-400">확클팟</strong>과 <strong className="text-blue-400">학원팟</strong> 위주로 운영됩니다.
        </p>
      </div>

      {/* 기본 마인드 */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4">기본 마인드</h3>
        <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-5 mb-4 text-center">
          <p className="text-pink-300 font-bold text-xl">
            실수했을 때: &quot;죄송합니다&quot; ❌ → &quot;사랑합니다&quot; ⭕
          </p>
        </div>
        <ul className="space-y-2">
          <Li>실수, 전멸, 실패에 부담/책임을 묻는 분위기는 지양</Li>
          <Li>랭커 지향이 아닙니다. 재미있게 게임하자가 기본</Li>
          <Li warn><W>레기온팟 고정팟 운영 안 함</W> — 신입이 들어와도 함께 즐길 수 있는 방향 우선</Li>
        </ul>
      </div>

      {/* 모집글 */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4">모집글 작성 방법</h3>
        <p className="text-zinc-400 mb-4">
          디스코드 <strong className="text-indigo-400">#루드라-모집-게시판</strong> 채널에 아래 항목을 포함해서 작성해 주세요.
        </p>
        <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-5 mb-4">
          <ul className="space-y-2 text-zinc-300">
            <li className="flex gap-2"><span className="text-zinc-600">•</span> <W>파티 유형</W> (확클팟 / 학원팟 / 트라이팟)</li>
            <li className="flex gap-2"><span className="text-zinc-600">•</span> <W>날짜 + 요일</W> · <W>시간</W> · <W>트 수</W></li>
            <li className="flex gap-2"><span className="text-zinc-600">•</span> <W>루드라 범위</W> (1~2넴 / 막넴까지 등)</li>
          </ul>
        </div>
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider font-semibold">예시</p>
          <p className="text-indigo-300">3월5일 수요일 루드라 확클 막넴 2타임 22:00~23:30</p>
          <p className="text-indigo-300 mt-1">3월8일 토요일 루드라 학원 1~2넴 1타임 16:00~17:00</p>
        </div>
      </div>

      {/* 이모지 참가 */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4">참가 체크 (이모지 반응)</h3>
        <p className="text-zinc-400 mb-4">
          모집글에 <W>내 역할에 맞는 하트 이모지</W>를 달아서 참가 신청합니다.
        </p>

        <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-6 mb-4">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">❤️</div>
              <div className="text-white font-bold">치유</div>
              <div className="text-zinc-500 text-xs mt-1">치유성</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🩵</div>
              <div className="text-white font-bold">딜러</div>
              <div className="text-zinc-500 text-xs mt-1">살성/궁성/마도성/정령성</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🖤</div>
              <div className="text-white font-bold">탱커</div>
              <div className="text-zinc-500 text-xs mt-1">검성/수호성</div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 mb-4">
          <p className="text-indigo-300 font-bold mb-3">이모지 다는 방법</p>
          <ol className="space-y-3 text-zinc-300 text-sm">
            <li className="flex gap-3">
              <span className="text-indigo-400 font-bold shrink-0">1.</span>
              <span>모집글에 마우스를 올리면 (모바일은 길게 누르면) 이모지 추가 버튼이 나타남</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-400 font-bold shrink-0">2.</span>
              <span>내 역할에 맞는 하트를 클릭 (이미 달려있으면 해당 이모지 클릭 시 숫자 증가)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-400 font-bold shrink-0">3.</span>
              <span>모집글 아래에 이모지 + 숫자가 표시되면 완료!</span>
            </li>
          </ol>
          <p className="text-zinc-500 text-xs mt-3">잘못 달았을 경우 같은 이모지를 다시 클릭하면 취소됩니다.</p>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <ul className="space-y-1.5 text-sm">
            <li className="text-zinc-300"><span className="text-zinc-600">•</span> <W>모집글 작성자도</W> 본인 역할 이모지 필수</li>
            <li className="text-red-300 font-semibold"><span className="text-zinc-600">•</span> 8명 다 찼으면 추가 이모지 달지 마세요</li>
          </ul>
        </div>
      </div>

      {/* 출발 기준 */}
      <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-6 text-center">
        <p className="text-white font-bold text-lg mb-4">출발 기준</p>
        <div className="flex justify-center gap-3 mb-3">
          <span className="bg-zinc-800 rounded-lg px-4 py-2 text-lg">❤️ × 2</span>
          <span className="bg-zinc-800 rounded-lg px-4 py-2 text-lg">🖤 × 2</span>
          <span className="bg-zinc-800 rounded-lg px-4 py-2 text-lg">🩵 × 4</span>
        </div>
        <p className="text-zinc-500 text-sm">총 8명 (치유 2 / 탱커 2 / 딜러 4)</p>
      </div>
    </article>
  );
}

/* ============================================================
   3. 사이트 & 앱 가이드
   ============================================================ */
function SiteGuide() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <SectionHeader number="SECTION 03" title="사이트 & 앱 가이드" color="blue" />

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-10 text-center">
        <p className="text-blue-300 font-bold text-2xl tracking-wide">sagye.kr</p>
        <p className="text-zinc-500 text-sm mt-1">레기온원 정보, 일정, 필드보스 타이머, 제작 계산기 등</p>
      </div>

      {/* 주요 페이지 */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4">주요 페이지</h3>
        <div className="space-y-3">
          <PageCard title="레기온원" path="/members" desc="길드원 목록, 직업별 필터, 전투정보(최고점수/현재점수/전투력), 본캐/부캐 표시" />
          <PageCard title="일정" path="/schedule" desc="일일/주간 컨텐츠 일정, 실시간 필드보스 타이머(Firebase 공유), 보스 지도, 알림 설정" />
          <PageCard title="제작 계산기" path="/craft" desc="제작 레시피 검색, 시세 자동 연동, 재료비 · 성공률 · 기대수익 계산" />
          <div className="grid grid-cols-2 gap-3">
            <MiniCard title="외형 DB" desc="외형 아이템 정보" />
            <MiniCard title="펫 DB" desc="펫 종류, 스탯, 획득처" />
            <MiniCard title="시즌2 정보" desc="타임라인, 보스, 아르카나" />
            <MiniCard title="업데이트 내역" desc="사이트 변경 기록" />
          </div>
        </div>
      </div>

      {/* 앱 설치 */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4">앱처럼 설치하기</h3>
        <p className="text-zinc-400 mb-4">홈 화면에 앱 아이콘을 추가하면 전체화면으로 빠르게 접속할 수 있습니다.</p>

        <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-4 flex justify-center mb-6">
          <Image
            src="/images/pwa-install.jpg"
            alt="접속중 레기온 앱 설치 예시"
            width={200}
            height={400}
            className="rounded-lg border border-zinc-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-green-500/20 rounded-xl p-5">
            <h4 className="text-green-400 font-bold mb-3">Android (Chrome)</h4>
            <ol className="space-y-2.5 text-zinc-300 text-sm">
              <li className="flex gap-2"><span className="text-green-400 font-bold">1.</span> Chrome으로 sagye.kr 접속</li>
              <li className="flex gap-2"><span className="text-green-400 font-bold">2.</span> 우측 상단 <W>⋮</W> 메뉴</li>
              <li className="flex gap-2"><span className="text-green-400 font-bold">3.</span> <W>&quot;홈 화면에 추가&quot;</W> 또는 <W>&quot;앱 설치&quot;</W></li>
              <li className="flex gap-2"><span className="text-green-400 font-bold">4.</span> 설치 완료!</li>
            </ol>
          </div>
          <div className="bg-zinc-900 border border-blue-500/20 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">iOS (Safari 필수)</h4>
            <ol className="space-y-2.5 text-zinc-300 text-sm">
              <li className="flex gap-2"><span className="text-blue-400 font-bold">1.</span> <W>Safari</W>로 sagye.kr 접속</li>
              <li className="flex gap-2"><span className="text-blue-400 font-bold">2.</span> 하단 <W>공유 버튼 (□↑)</W></li>
              <li className="flex gap-2"><span className="text-blue-400 font-bold">3.</span> <W>&quot;홈 화면에 추가&quot;</W></li>
              <li className="flex gap-2"><span className="text-blue-400 font-bold">4.</span> 우측 상단 <W>&quot;추가&quot;</W></li>
            </ol>
            <p className="text-zinc-500 text-xs mt-3">* Chrome에서는 설치 불가!</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-5 text-center">
        <p className="text-zinc-400">
          문의 및 건의사항은 <strong className="text-indigo-400">디스코드</strong>로 연락해주세요!
        </p>
      </div>
    </article>
  );
}

/* ============================================================
   4. 레기온봇 가이드 (디스코드 전용)
   ============================================================ */
function BotGuide() {
  return (
    <article className="text-zinc-300 leading-relaxed">
      <SectionHeader number="SECTION 04" title="레기온봇 사용 가이드" color="indigo" />

      {/* 디스코드 전용 강조 */}
      <div className="bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-xl p-5 mb-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-2xl">💬</span>
          <span className="text-[#5865F2] font-extrabold text-lg">Discord 전용 봇</span>
        </div>
        <p className="text-zinc-400 text-center text-sm">
          레기온봇은 <strong className="text-white">디스코드 서버</strong>에서만 사용 가능합니다.
        </p>
        <p className="text-zinc-500 text-center text-sm mt-1">
          채팅창에 <code className="bg-zinc-800 text-indigo-400 px-1.5 py-0.5 rounded">/</code> 입력 → 명령어 목록 표시
        </p>
      </div>

      {/* 인증 */}
      <CmdSection title="인증" color="green">
        <CmdCard cmd="/인증" desc="본캐 인증" usage="/인증 캐릭터명:내캐릭터" color="green" note="시트에 등록된 캐릭터명이어야 합니다" />
        <CmdCard cmd="/부캐인증" desc="부캐 추가 등록" usage="/부캐인증 캐릭터명:내부캐" color="green" note="본캐 인증 선행 필요" />
        <CmdCard cmd="/닉변경" desc="닉네임 변경" usage="/닉변경 기존닉:옛날닉 새닉:새로운닉" color="green" note="본인 인증 캐릭터만 가능" />
        <div className="grid grid-cols-2 gap-3">
          <CmdCardSimple cmd="/인증해제" desc="인증 정보 삭제" color="red" />
          <CmdCardSimple cmd="/내정보" desc="내 인증 정보 확인" color="cyan" />
        </div>
      </CmdSection>

      {/* 조회 */}
      <CmdSection title="전투력 조회" color="blue">
        <div className="grid grid-cols-2 gap-3">
          <CmdCardSimple cmd="/아툴" desc="내 전투점수 조회" color="blue" />
          <CmdCardSimple cmd="/전투력" desc="내 전투력 조회" color="blue" />
        </div>
        <CmdCard cmd="/검색" desc="다른 캐릭터 검색" usage="/검색 캐릭터명:검색할캐릭터" color="blue" />
      </CmdSection>

      {/* 수집 */}
      <CmdSection title="데이터 수집" color="purple">
        <CmdCardSimple cmd="/수집" desc="내 캐릭터 전투정보 수집 → 시트 자동 저장" color="purple" />
        <CmdCardSimple cmd="/통합수집" desc="전체 레기온원 일괄 수집 (관리자 전용)" color="purple" />
        <CmdCardSimple cmd="/동기화" desc="디스코드-시트 참여현황 동기화" color="purple" />
      </CmdSection>

      {/* 기타 */}
      <CmdSection title="기타" color="zinc">
        <div className="grid grid-cols-2 gap-3">
          <CmdCardSimple cmd="/핑" desc="봇 응답 속도 테스트" color="zinc" />
          <CmdCardSimple cmd="/사이트" desc="접속중 레기온 사이트 링크" color="zinc" />
        </div>
      </CmdSection>

      {/* FAQ */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-white mb-4">자주 묻는 질문</h3>
        <div className="space-y-3">
          <FaqItem q="명령어가 안 보여요" a="디스코드를 새로고침하거나 재접속해보세요." />
          <FaqItem q="인증했는데 닉네임이 안 바뀌어요" a="봇의 역할이 내 역할보다 낮으면 닉네임 변경 불가. 운영진에게 문의." />
          <FaqItem q="부캐 인증이 안 돼요" a="본캐 인증이 먼저 필요합니다. /내정보로 확인해보세요." />
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   공용 컴포넌트
   ============================================================ */

function W({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <strong className={`text-white ${className}`}>{children}</strong>;
}

function Li({ children, highlight, warn, sub }: { children: React.ReactNode; highlight?: boolean; warn?: boolean; sub?: boolean }) {
  if (sub) {
    return <p className="text-zinc-500 text-sm pl-4 mt-1">{children}</p>;
  }
  const border = warn ? 'border-red-500/50' : highlight ? 'border-amber-500/50' : 'border-zinc-800';
  return (
    <div className={`pl-4 py-1.5 border-l-2 ${border}`}>
      <p className="text-zinc-300">{children}</p>
    </div>
  );
}

function RuleBlock({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-zinc-800 text-amber-400 font-bold text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0">{num}</span>
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
      <div className="space-y-2 ml-10">
        {children}
      </div>
    </div>
  );
}

function PageCard({ title, path, desc }: { title: string; path: string; desc: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-4 flex gap-4 items-start">
      <div className="shrink-0">
        <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-2 py-1 rounded">{path}</span>
      </div>
      <div>
        <p className="text-white font-semibold">{title}</p>
        <p className="text-zinc-500 text-sm mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function MiniCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-4">
      <p className="text-white font-medium text-sm">{title}</p>
      <p className="text-zinc-500 text-xs mt-1">{desc}</p>
    </div>
  );
}

function CmdSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const titleColors: Record<string, string> = {
    green: 'text-green-400', blue: 'text-blue-400', purple: 'text-purple-400', zinc: 'text-zinc-400',
  };
  return (
    <div className="mb-8">
      <h3 className={`text-base font-bold ${titleColors[color]} mb-3`}>{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function CmdCard({ cmd, desc, usage, color, note }: { cmd: string; desc: string; usage: string; color: string; note?: string }) {
  const colorMap: Record<string, string> = { green: 'text-green-400', blue: 'text-blue-400', purple: 'text-purple-400', red: 'text-red-400', cyan: 'text-cyan-400', zinc: 'text-zinc-300' };
  return (
    <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <code className={`bg-zinc-800 px-2.5 py-1 rounded-lg font-mono text-sm ${colorMap[color]}`}>{cmd}</code>
        <span className="text-zinc-500 text-sm">{desc}</span>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-2.5">
        <code className="text-indigo-300 text-sm">{usage}</code>
      </div>
      {note && <p className="text-zinc-600 text-xs mt-2">* {note}</p>}
    </div>
  );
}

function CmdCardSimple({ cmd, desc, color }: { cmd: string; desc: string; color: string }) {
  const colorMap: Record<string, string> = { green: 'text-green-400', blue: 'text-blue-400', purple: 'text-purple-400', red: 'text-red-400', cyan: 'text-cyan-400', zinc: 'text-zinc-300' };
  return (
    <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-4">
      <code className={`bg-zinc-800 px-2.5 py-1 rounded-lg font-mono text-sm ${colorMap[color]}`}>{cmd}</code>
      <p className="text-zinc-500 text-sm mt-2">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl p-4">
      <p className="text-white font-medium mb-1">{q}</p>
      <p className="text-zinc-500 text-sm">{a}</p>
    </div>
  );
}
