'use client';

import Link from 'next/link';
import Image from 'next/image';
import AlertBar from '../components/AlertBar';

const TOC = [
  { id: 'rules', label: '레기온 규칙' },
  { id: 'party', label: '파티 규칙' },
  { id: 'site', label: '사이트 가이드' },
  { id: 'bot', label: '사계봇' },
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
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 레기온
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
          </nav>
        </div>
      </header>
      <AlertBar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">공지사항</h1>

        {/* 목차 */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {TOC.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-sm font-medium whitespace-nowrap transition-colors border border-zinc-700"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 전체 내용 */}
        <div className="space-y-16">
          <section id="rules"><GuildRules /></section>
          <section id="party"><PartyRules /></section>
          <section id="site"><SiteGuide /></section>
          <section id="bot"><BotGuide /></section>
        </div>

        {/* 참여 링크 */}
        <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-zinc-800">
          <a
            href="https://discord.gg/KB5Ef2C37Z"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 rounded-lg p-4 text-center transition-colors"
          >
            <div className="font-semibold text-white">디스코드 참여</div>
          </a>
          <a
            href="https://open.kakao.com/o/gr52NRmg"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-400 rounded-lg p-4 text-center transition-colors"
          >
            <div className="font-semibold text-zinc-900">카카오톡 참여</div>
            <div className="text-xs text-zinc-700">참여코드: Aion222</div>
          </a>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   1. 레기온 규칙
   ============================================================ */
function GuildRules() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        레기온 규칙 (필독)
      </h2>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8 text-center">
        <p className="text-amber-300 font-medium mb-2">
          닉넴/년생/직업 → 디스코드 서버프로필 변경 필수
        </p>
        <p className="text-zinc-400 text-sm">
          디스코드 좌측 서버 목록에서 사계 서버 우클릭 → 서버 프로필 수정
        </p>
      </div>

      {/* 1. 소통 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">1. 소통 수단</h3>
        <ul className="space-y-3 text-zinc-300">
          <li className="pl-4 border-l-2 border-zinc-700">
            <strong className="text-white">디스코드 필수 참여</strong><br />
            <span className="text-zinc-400">공지, 파티 모집, 운영 안내는 모두 디스코드 기준 (음성 필수 아님)</span>
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            미접 예정 시 디코 <strong className="text-white">#미접-사유</strong> 채널에 기재<br />
            <span className="text-zinc-400">4일 이상 미접 시 자동 추방</span>
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            카카오톡 단톡방 참여는 선택 사항
          </li>
        </ul>
      </section>

      {/* 2. 채널 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">2. 디스코드 채널 사용</h3>
        <ul className="space-y-2 text-zinc-400 ml-4">
          <li>• 루드라 / 던전 → 루드라·던전 전용 음성 채널</li>
          <li>• PVP / 쟁 → 쟁 전용 음성 채널</li>
          <li>• 그 외 → 잡담방</li>
        </ul>
        <p className="text-zinc-500 mt-3 text-sm">
          맞지 않는 채널 사용 시 운영진이 이동을 요청할 수 있습니다.
        </p>
      </section>

      {/* 3. 존중 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">3. 상호 존중</h3>
        <p className="text-zinc-300 mb-2">
          레기온 내 모든 구성원은 <strong className="text-white">상호 존중</strong>을 기본으로 합니다.
        </p>
        <p className="text-zinc-400 mb-2">
          과한 반말, 비꼬기, 선 넘는 농담/지적/압박은 자제해 주세요.
        </p>
        <p className="text-zinc-500 text-sm">
          반복 시 운영자 판단으로 즉시 추방될 수 있습니다.
        </p>
      </section>

      {/* 4. 미접 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">4. 접속 / 미접 기준</h3>
        <ul className="space-y-3 text-zinc-300">
          <li className="pl-4 border-l-2 border-red-500/50">
            <strong className="text-white">사전 공유 없는 미접속 4일 시 추방</strong>
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            미접 사유는 <strong className="text-white">#미접-사유</strong> 채널에 캐릭터명 + 기간 + 사유 기재
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            <span className="text-zinc-400">미접일 미작성 역시 추방 대상</span>
          </li>
        </ul>
      </section>

      {/* 5. 문화 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">5. 플레이 문화</h3>
        <p className="text-zinc-300 mb-2">
          서로 필요한 상황에서는 가능한 범위 내에서 도와주는 문화를 지향합니다.
        </p>
        <p className="text-zinc-400">모든 도움은 강요가 아닌 자율 원칙입니다.</p>
      </section>

      {/* 6. 부캐 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">6. 부캐 가입</h3>
        <p className="text-zinc-300 mb-3">부캐도 사계 레기온에 함께 가입 가능합니다.</p>
        <ul className="space-y-2 text-zinc-300">
          <li className="pl-4 border-l-2 border-zinc-700">
            가입을 원하시면 군단장 <strong className="text-amber-400">텐구</strong>에게 게임 내 귓말
          </li>
          <li className="pl-4 border-l-2 border-red-500/50">
            <strong className="text-white">가입 후 소개글(한마디)에 본캐 닉네임 기재 필수!</strong><br />
            <span className="text-zinc-400">미기재 시 사전 경고 없이 추방될 수 있습니다.</span>
          </li>
        </ul>
      </section>

      {/* 7. 기타 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">7. 기타</h3>
        <ul className="space-y-2 text-zinc-300">
          <li className="pl-4 border-l-2 border-zinc-700">레기온 내부 대화, 운영 관련 내용의 외부 공유 금지</li>
          <li className="pl-4 border-l-2 border-zinc-700">모든 제재/추방은 운영자 판단 기준</li>
        </ul>
      </section>

      <div className="bg-zinc-800 rounded-lg p-6 text-center">
        <p className="text-zinc-300">
          레기온은 단기 플레이가 아닌<br />
          <strong className="text-white">장기적으로 함께 재미있게 할 분들</strong>을 위한 공간입니다.
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
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        루드라 파티 운영 안내
      </h2>

      {/* 파티 유형 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">파티 유형</h3>
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">확클팟</span>
              <span className="text-white font-medium">확정 클리어 파티</span>
            </div>
            <p className="text-zinc-300 mb-2">
              루드라를 <strong className="text-white">1번이라도 클리어한 경험이 있는 분들</strong>끼리 진행합니다.
            </p>
            <div className="bg-green-500/10 rounded p-3 mt-2">
              <p className="text-green-300 text-sm">
                <strong>클경이 없어도</strong> 참여하고 싶다면 모집글 작성자에게 먼저 물어보세요!<br />
                <span className="text-zinc-400">1~2명 정도는 학원팟처럼 데려갈 수 있습니다.</span>
              </p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">학원팟</span>
              <span className="text-white font-medium">기믹 교육 파티</span>
            </div>
            <p className="text-zinc-300 mb-2">
              고점 분들이 기믹을 알려주면서 함께 진행하는 버스 형태 파티입니다.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
              <p className="text-blue-300 font-medium text-center">
                참여 희망 시 군단장 <strong className="text-white text-lg">&quot;텐구&quot;</strong> 또는 <strong className="text-white text-lg">&quot;텐겐&quot;</strong>에게 귓말!
              </p>
            </div>
          </div>

          <div className="bg-zinc-700/30 border border-zinc-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-zinc-600 text-white text-xs font-bold px-2 py-0.5 rounded">트라이팟</span>
              <span className="text-white font-medium">연습 파티</span>
            </div>
            <p className="text-zinc-300">
              아예 모르는 분들끼리 처음부터 연습하는 파티입니다. 클리어가 아닌 기믹 숙지가 목표.
            </p>
            <p className="text-zinc-500 text-sm mt-2">* 8명 모집이 쉽지 않아 자주 진행되지는 않습니다.</p>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-4 mt-4 text-center">
          <p className="text-zinc-300">
            현재 주로 <strong className="text-green-400">확클팟</strong>과 <strong className="text-blue-400">학원팟</strong> 위주로 운영됩니다.
          </p>
        </div>
      </section>

      {/* 사랑합니다 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">기본 마인드</h3>
        <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 mb-4">
          <p className="text-pink-300 font-medium text-center text-lg">
            실수했을 때: &quot;죄송합니다&quot; ❌ → &quot;사랑합니다&quot; ⭕
          </p>
        </div>
        <ul className="space-y-2 text-zinc-300">
          <li className="pl-4 border-l-2 border-zinc-700">실수, 전멸, 실패에 부담/책임을 묻는 분위기는 지양</li>
          <li className="pl-4 border-l-2 border-zinc-700">랭커 지향이 아닙니다. 재미있게 게임하자가 기본</li>
          <li className="pl-4 border-l-2 border-red-500/50">
            <strong className="text-white">레기온팟 고정팟 운영 안 함</strong>
            <span className="text-zinc-400 text-sm block mt-1">신입이 들어와도 함께 즐길 수 있는 방향 우선</span>
          </li>
        </ul>
      </section>

      {/* 모집글 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">모집글 작성 방법</h3>
        <p className="text-zinc-300 mb-4">
          디스코드 <strong className="text-indigo-400">#루드라-모집-게시판</strong> 채널에 아래 항목을 포함해서 작성해 주세요.
        </p>
        <div className="bg-zinc-800 rounded-lg p-4 mb-4">
          <ul className="space-y-2 text-zinc-300">
            <li>• <strong className="text-white">파티 유형</strong> (확클팟 / 학원팟 / 트라이팟)</li>
            <li>• <strong className="text-white">날짜 + 요일</strong> · <strong className="text-white">시간</strong> · <strong className="text-white">트 수</strong></li>
            <li>• <strong className="text-white">루드라 범위</strong> (1~2넴 / 막넴까지 등)</li>
          </ul>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
          <p className="text-zinc-500 text-sm mb-2">예시:</p>
          <p className="text-indigo-300 font-medium">확클팟 3월 5일 수요일 루드라 막넴까지 2트 22:00~23:30 모집</p>
          <p className="text-indigo-300 font-medium mt-1">학원팟 3월 8일 토요일 루드라 1~2넴 1트 16:00~17:00 모집</p>
        </div>
      </section>

      {/* 이모지 참가 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">참가 체크 (이모지 반응)</h3>
        <p className="text-zinc-300 mb-4">
          모집글에 <strong className="text-white">내 역할에 맞는 하트 이모지</strong>를 달아서 참가 신청합니다.
        </p>

        <div className="bg-zinc-800 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">❤️</div>
              <div className="text-white font-medium">치유</div>
              <div className="text-zinc-500 text-xs">치유성</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🩵</div>
              <div className="text-white font-medium">딜러</div>
              <div className="text-zinc-500 text-xs">살성/궁성/마도성/정령성</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🖤</div>
              <div className="text-white font-medium">탱커</div>
              <div className="text-zinc-500 text-xs">검성/수호성</div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mb-4">
          <p className="text-indigo-300 font-medium mb-3">이모지 다는 방법</p>
          <ol className="space-y-2 text-zinc-300 text-sm">
            <li><strong className="text-indigo-400">1.</strong> 모집글에 마우스를 올리면 (모바일은 길게 누르면) 이모지 추가 버튼이 나타남</li>
            <li><strong className="text-indigo-400">2.</strong> 내 역할에 맞는 하트를 클릭 (이미 달려있으면 해당 이모지 클릭 시 숫자 증가)</li>
            <li><strong className="text-indigo-400">3.</strong> 모집글 아래에 이모지 + 숫자가 표시되면 완료!</li>
          </ol>
          <p className="text-zinc-500 text-xs mt-3">잘못 달았을 경우 같은 이모지를 다시 클릭하면 취소됩니다.</p>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <ul className="space-y-1 text-zinc-300 text-sm">
            <li>• <strong className="text-white">모집글 작성자도</strong> 본인 역할 이모지 필수</li>
            <li>• <strong className="text-red-300">8명 다 찼으면 추가 이모지 달지 마세요</strong></li>
          </ul>
        </div>
      </section>

      {/* 출발 기준 */}
      <div className="bg-zinc-800 rounded-lg p-6 text-center">
        <p className="text-white font-semibold mb-3">출발 기준</p>
        <div className="flex justify-center gap-4 mb-3">
          <span className="bg-zinc-700 rounded px-3 py-1.5">❤️ × 2</span>
          <span className="bg-zinc-700 rounded px-3 py-1.5">🖤 × 2</span>
          <span className="bg-zinc-700 rounded px-3 py-1.5">🩵 × 4</span>
        </div>
        <p className="text-zinc-400 text-sm">총 8명 (치유 2 / 탱커 2 / 딜러 4)</p>
      </div>
    </article>
  );
}

/* ============================================================
   3. 사이트 & 앱 가이드 (통합)
   ============================================================ */
function SiteGuide() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        사이트 & 앱 가이드
      </h2>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8 text-center">
        <p className="text-amber-300 font-medium">sagye.kr</p>
        <p className="text-zinc-400 text-sm mt-1">레기온원 정보, 일정, 필드보스 타이머, 제작 계산기 등</p>
      </div>

      {/* 주요 페이지 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">주요 페이지</h3>
        <div className="space-y-3">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-white font-medium mb-2">레기온원 (/members)</div>
            <p className="text-zinc-400 text-sm">길드원 목록, 직업별 필터, 전투정보(최고점수/현재점수/전투력), 본캐/부캐 표시, aion2tool 연동</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-white font-medium mb-2">일정 (/schedule)</div>
            <p className="text-zinc-400 text-sm">일일/주간 컨텐츠 일정, 실시간 필드보스 타이머(Firebase 공유), 보스 지도, 알림 설정</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-white font-medium mb-2">제작 계산기 (/craft)</div>
            <p className="text-zinc-400 text-sm">제작 레시피 검색, 시세 자동 연동, 재료비 · 성공률 · 기대수익 계산</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-white font-medium mb-1 text-sm">외형 DB</div>
              <p className="text-zinc-500 text-xs">외형 아이템 정보</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-white font-medium mb-1 text-sm">펫 DB</div>
              <p className="text-zinc-500 text-xs">펫 종류, 스탯, 획득처</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-white font-medium mb-1 text-sm">시즌2 정보</div>
              <p className="text-zinc-500 text-xs">타임라인, 보스, 아르카나</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="text-white font-medium mb-1 text-sm">업데이트 내역</div>
              <p className="text-zinc-500 text-xs">사이트 변경 기록</p>
            </div>
          </div>
        </div>
      </section>

      {/* 앱 설치 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">앱처럼 설치하기</h3>
        <p className="text-zinc-300 mb-4">홈 화면에 앱 아이콘을 추가하면 전체화면으로 빠르게 접속할 수 있습니다.</p>

        <div className="bg-zinc-800 rounded-xl p-4 flex justify-center mb-4">
          <Image
            src="/images/pwa-install.jpg"
            alt="사계 레기온 앱 설치 예시"
            width={200}
            height={400}
            className="rounded-lg border border-zinc-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Android */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-green-400 font-medium mb-3">Android (Chrome)</h4>
            <ol className="space-y-2 text-zinc-300 text-sm">
              <li><span className="text-green-400 font-bold">1.</span> Chrome으로 sagye.kr 접속</li>
              <li><span className="text-green-400 font-bold">2.</span> 우측 상단 <strong className="text-white">⋮</strong> 메뉴</li>
              <li><span className="text-green-400 font-bold">3.</span> <strong className="text-white">&quot;홈 화면에 추가&quot;</strong> 또는 <strong className="text-white">&quot;앱 설치&quot;</strong></li>
              <li><span className="text-green-400 font-bold">4.</span> 설치 완료!</li>
            </ol>
          </div>
          {/* iOS */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-3">iOS (Safari 필수)</h4>
            <ol className="space-y-2 text-zinc-300 text-sm">
              <li><span className="text-blue-400 font-bold">1.</span> <strong className="text-white">Safari</strong>로 sagye.kr 접속</li>
              <li><span className="text-blue-400 font-bold">2.</span> 하단 <strong className="text-white">공유 버튼 (□↑)</strong></li>
              <li><span className="text-blue-400 font-bold">3.</span> <strong className="text-white">&quot;홈 화면에 추가&quot;</strong></li>
              <li><span className="text-blue-400 font-bold">4.</span> 우측 상단 <strong className="text-white">&quot;추가&quot;</strong></li>
            </ol>
            <p className="text-zinc-500 text-xs mt-2">* Chrome에서는 설치 불가!</p>
          </div>
        </div>
      </section>

      <div className="bg-zinc-800 rounded-lg p-6 text-center">
        <p className="text-zinc-300">
          문의 및 건의사항은 <strong className="text-indigo-400">디스코드</strong>로 연락해주세요!
        </p>
      </div>
    </article>
  );
}

/* ============================================================
   4. 사계봇 가이드
   ============================================================ */
function BotGuide() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        사계봇 사용 가이드
      </h2>

      <div className="bg-zinc-800 rounded-lg p-4 mb-8">
        <p className="text-zinc-300 text-center">
          디스코드 채팅창에 <strong className="text-indigo-400">/</strong> 입력 → 명령어 목록 표시
        </p>
      </div>

      {/* 인증 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-green-400 mb-4">인증</h3>
        <div className="space-y-3">
          <CmdCard cmd="/인증" desc="본캐 인증" usage="/인증 캐릭터명:내캐릭터" color="green" note="시트에 등록된 캐릭터명이어야 합니다" />
          <CmdCard cmd="/부캐인증" desc="부캐 추가 등록" usage="/부캐인증 캐릭터명:내부캐" color="green" note="본캐 인증 선행 필요" />
          <CmdCard cmd="/닉변경" desc="닉네임 변경" usage="/닉변경 기존닉:옛날닉 새닉:새로운닉" color="green" note="본인 인증 캐릭터만 가능" />
          <div className="grid grid-cols-2 gap-3">
            <CmdCardSimple cmd="/인증해제" desc="인증 정보 삭제" color="red" />
            <CmdCardSimple cmd="/내정보" desc="내 인증 정보 확인" color="cyan" />
          </div>
        </div>
      </section>

      {/* 조회 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">전투력 조회</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <CmdCardSimple cmd="/아툴" desc="내 전투점수 조회" color="blue" />
            <CmdCardSimple cmd="/전투력" desc="내 전투력 조회" color="blue" />
          </div>
          <CmdCard cmd="/검색" desc="다른 캐릭터 검색" usage="/검색 캐릭터명:검색할캐릭터" color="blue" />
        </div>
      </section>

      {/* 수집 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">데이터 수집</h3>
        <div className="space-y-3">
          <CmdCardSimple cmd="/수집" desc="내 캐릭터 전투정보 수집 → 시트 자동 저장" color="purple" />
          <CmdCardSimple cmd="/통합수집" desc="전체 레기온원 일괄 수집 (관리자 전용)" color="purple" />
          <CmdCardSimple cmd="/동기화" desc="디스코드-시트 참여현황 동기화" color="purple" />
        </div>
      </section>

      {/* 기타 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-400 mb-4">기타</h3>
        <div className="grid grid-cols-2 gap-3">
          <CmdCardSimple cmd="/핑" desc="봇 응답 속도 테스트" color="zinc" />
          <CmdCardSimple cmd="/사이트" desc="사계 레기온 사이트 링크" color="zinc" />
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4">자주 묻는 질문</h3>
        <div className="space-y-3">
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-white font-medium mb-1">명령어가 안 보여요</p>
            <p className="text-zinc-400 text-sm">디스코드를 새로고침하거나 재접속해보세요.</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-white font-medium mb-1">인증했는데 닉네임이 안 바뀌어요</p>
            <p className="text-zinc-400 text-sm">봇의 역할이 내 역할보다 낮으면 닉네임 변경 불가. 운영진에게 문의.</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-white font-medium mb-1">부캐 인증이 안 돼요</p>
            <p className="text-zinc-400 text-sm">본캐 인증이 먼저 필요합니다. /내정보로 확인해보세요.</p>
          </div>
        </div>
      </section>
    </article>
  );
}

/* ============================================================
   공용 컴포넌트
   ============================================================ */
function CmdCard({ cmd, desc, usage, color, note }: { cmd: string; desc: string; usage: string; color: string; note?: string }) {
  const colorMap: Record<string, string> = { green: 'text-green-400', blue: 'text-blue-400', purple: 'text-purple-400', red: 'text-red-400', cyan: 'text-cyan-400', zinc: 'text-zinc-300' };
  return (
    <div className="bg-zinc-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <code className={`bg-zinc-700 px-2 py-1 rounded font-mono ${colorMap[color]}`}>{cmd}</code>
        <span className="text-zinc-500 text-sm">{desc}</span>
      </div>
      <div className="bg-zinc-700/50 rounded p-2">
        <code className="text-indigo-300 text-sm">{usage}</code>
      </div>
      {note && <p className="text-zinc-500 text-xs mt-2">* {note}</p>}
    </div>
  );
}

function CmdCardSimple({ cmd, desc, color }: { cmd: string; desc: string; color: string }) {
  const colorMap: Record<string, string> = { green: 'text-green-400', blue: 'text-blue-400', purple: 'text-purple-400', red: 'text-red-400', cyan: 'text-cyan-400', zinc: 'text-zinc-300' };
  return (
    <div className="bg-zinc-800 rounded-lg p-4">
      <code className={`bg-zinc-700 px-2 py-1 rounded font-mono ${colorMap[color]}`}>{cmd}</code>
      <p className="text-zinc-400 text-sm mt-2">{desc}</p>
    </div>
  );
}
