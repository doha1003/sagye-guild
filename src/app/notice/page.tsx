'use client';

import { useState } from 'react';
import Link from 'next/link';

type NoticeType = 'guild' | 'ludra';

export default function NoticePage() {
  const [activeTab, setActiveTab] = useState<NoticeType>('guild');

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 레기온
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* 타이틀 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-2 mb-4">
            <span className="text-2xl">📢</span>
            <span className="text-red-400 font-bold">필독 공지</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            사계 레기온 공지사항
          </h1>
        </div>

        {/* 탭 버튼 */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('guild')}
            className={`px-6 py-3 rounded-xl text-sm sm:text-base font-bold transition-all ${
              activeTab === 'guild'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            레기온 규칙
          </button>
          <button
            onClick={() => setActiveTab('ludra')}
            className={`px-6 py-3 rounded-xl text-sm sm:text-base font-bold transition-all ${
              activeTab === 'ludra'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            파티 규칙
          </button>
        </div>

        {/* 공지 내용 */}
        <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700/50 p-5 sm:p-8 backdrop-blur-sm">
          {activeTab === 'guild' ? (
            <GuildRules />
          ) : (
            <LudraRules />
          )}
        </div>

        {/* 참여 링크 */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <a
            href="https://discord.gg/DgwjWYMu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-xl p-5 text-center transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            <div className="text-3xl mb-2">💬</div>
            <div className="font-bold text-white">디스코드 참여</div>
          </a>
          <a
            href="https://open.kakao.com/o/gr52NRmg"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 rounded-xl p-5 text-center transition-all shadow-lg hover:shadow-yellow-500/30"
          >
            <div className="text-3xl mb-2">💛</div>
            <div className="font-bold text-zinc-900">카카오톡 참여</div>
            <div className="text-xs text-zinc-700 mt-1 font-medium">참여코드: Aion222</div>
          </a>
        </div>
      </main>
    </div>
  );
}

function RuleCard({ number, title, children, color = 'amber' }: { number: string; title: string; children: React.ReactNode; color?: 'amber' | 'cyan' | 'red' | 'green' }) {
  const colors = {
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
  };
  const titleColors = {
    amber: 'text-amber-400',
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    green: 'text-green-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 sm:p-5`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{number}</span>
        <h4 className={`text-lg font-bold ${titleColors[color]}`}>{title}</h4>
      </div>
      <div className="text-zinc-200 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

function GuildRules() {
  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="text-center pb-4 border-b border-zinc-700">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          아이온2 레기온 공지사항
        </h2>
        <p className="text-zinc-400">반드시 읽어주세요</p>
      </div>

      {/* 중요 안내 */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/50 rounded-xl p-4 text-center">
        <p className="text-lg font-bold text-amber-300">
          ⭕ 닉넴/년생/직업 → 서버프로필 변경 필수 ⭕
        </p>
      </div>

      {/* 규칙 카드들 */}
      <RuleCard number="1️⃣" title="소통 수단 규칙">
        <p><strong className="text-amber-300">디스코드 필수 참여</strong> - 레기온 공지, 파티 모집, 운영 안내는 모두 디스코드 기준으로 진행됩니다. (음성 필수 아님)</p>
        <p>미접일 예정 시 디코 미접일 방에 적어주세요 <span className="text-red-400">(4일 이상 미접 시 자동 추방)</span></p>
        <p>카카오톡 단톡방 참여는 <span className="text-green-400">선택 사항</span></p>
      </RuleCard>

      <RuleCard number="2️⃣" title="디스코드 채널 사용 규칙" color="cyan">
        <p>각 컨텐츠 별 방으로 이동하시면서 이용해주세요.</p>
        <div className="bg-zinc-900/50 rounded-lg p-3 mt-2 space-y-1">
          <p className="text-cyan-300">• 루드라 / 던전 트라이 시 → 루드라·던전 전용 음성 채널</p>
          <p className="text-cyan-300">• PVP / 쟁 콘텐츠 진행 시 → 쟁 전용 음성 채널</p>
          <p className="text-zinc-400">• 그 외: 잡담방 이용</p>
        </div>
        <p className="text-sm text-zinc-400">콘텐츠 성격에 맞지 않는 채널 사용 시, 운영진이 채널 이동을 요청할 수 있습니다.</p>
      </RuleCard>

      <RuleCard number="3️⃣" title="상호 존중 기본 원칙" color="green">
        <p>레기온 내 모든 구성원은 <strong className="text-green-300">상호 존중</strong>을 기본 원칙으로 합니다.</p>
        <p className="text-zinc-300">친해졌다는 이유로 과한 반말, 비꼬는 말투, 선 넘는 농담/지적/압박은 자제해 주시기 바랍니다.</p>
        <p className="text-red-400 text-sm">위와 같은 상황이 반복되거나 레기온 분위기를 해친다고 판단될 경우, 운영자 판단으로 즉시 추방될 수 있습니다.</p>
      </RuleCard>

      <RuleCard number="4️⃣" title="접속 / 미접 기준" color="red">
        <p><strong className="text-red-300">사전 공유 없는 미접속 4일 시 추방</strong></p>
        <p>미접 사유는 반드시 디스코드 <span className="text-indigo-400">#미접-사유</span> 채널에 캐릭터명, 미접 기간, 간단한 사유를 남겨주셔야 합니다.</p>
        <p className="text-red-400 text-sm">미접일 미작성 역시 사유 불문 추방 대상입니다.</p>
      </RuleCard>

      <RuleCard number="5️⃣" title="고정팟 / 레기온 플레이 문화">
        <p>저희 모두 같은 레기온으로 함께 게임하는 만큼, 서로 필요한 상황에서는 가능한 범위 내에서 도와주는 문화를 지향합니다.</p>
        <p className="text-amber-300">모든 도움은 강요가 아닌 자율을 원칙으로 합니다.</p>
      </RuleCard>

      <RuleCard number="6️⃣" title="루드라팟 운영 규칙" color="cyan">
        <p>루드라팟 참여자는 <strong className="text-cyan-300">플레이 가능 시간 공유 필수</strong></p>
        <p>개인 사정으로 참여가 어려운 경우 <strong className="text-cyan-300">사전 공유 필수</strong></p>
        <p className="text-zinc-400 text-sm">반복적인 무단 불참, 소통 부재 시, 파티 유지 또는 레기온 활동이 어려울 수 있습니다.</p>
      </RuleCard>

      <RuleCard number="7️⃣" title="루드라 트라이 기본 마인드" color="green">
        <p>레기온 내 루드라 트라이는 클리어가 목표가 아닌 <strong className="text-green-300">&apos;트라이(연습)&apos;</strong> 기준으로 진행합니다.</p>
        <p>트라이팟으로 못 깨도 됩니다. 기믹 연습, 패턴 숙지가 우선입니다.</p>
        <p>실수, 전멸, 실패에 대해 개인에게 부담을 주거나 책임을 묻는 분위기는 지양합니다.</p>
        <p className="text-amber-300 text-sm">우리는 랭커 지향 레기온이 아닙니다. 기본은 재미있게 게임하자는 목적임을 모두가 인지해 주시기 바랍니다.</p>
      </RuleCard>

      <RuleCard number="8️⃣" title="기타 운영 원칙">
        <p>레기온 내부 대화, 운영 관련 내용의 외부 공유는 삼가주시기 바랍니다.</p>
        <p>모든 제재 및 추방 여부는 운영자 판단 기준으로 진행됩니다.</p>
      </RuleCard>

      {/* 마무리 */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/50 rounded-xl p-5 text-center">
        <p className="text-lg font-bold text-amber-300">
          레기온은 단기 플레이가 아닌<br />
          장기적으로 함께 재미있게 할 분들을 위한 공간입니다.
        </p>
      </div>
    </div>
  );
}

function LudraRules() {
  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="text-center pb-4 border-b border-zinc-700">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          루드라 트라이팟 운영방식 안내
        </h2>
        <p className="text-zinc-400">4트 기준</p>
      </div>

      {/* 중요 안내 */}
      <div className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 border-2 border-cyan-500/50 rounded-xl p-4 text-center">
        <p className="text-lg font-bold text-cyan-300">
          루드라 공지가 4트(4회 트라이) 기준으로 변경되었습니다
        </p>
      </div>

      {/* 규칙 카드들 */}
      <RuleCard number="0️⃣" title="기본 원칙" color="cyan">
        <p>본 운영은 <strong className="text-amber-300">&quot;클팟&quot;이 아닌 &quot;트라이팟&quot;</strong> 기준입니다.</p>
        <p>트라이 과정에서 예민한 반응/비난이 발생하면 파티 운영이 어렵습니다.</p>
        <p className="text-cyan-300 font-bold">트라이 분위기 유지가 최우선입니다.</p>
      </RuleCard>

      <RuleCard number="1️⃣" title="클리어 우선이신 분">
        <p><strong className="text-amber-300">&quot;클리어&quot;가 최우선 목표</strong>이신 분은 공팟 이용을 부탁드립니다.</p>
        <p>레기온팟은 트라이(연습/숙련) 중심으로 운영합니다.</p>
      </RuleCard>

      <RuleCard number="2️⃣" title="기본 모집 기준" color="green">
        <p>모집은 기본적으로 <strong className="text-green-300">&quot;1트&quot;</strong> 기준으로 진행합니다.</p>
        <p>추가 트라이를 원하시는 경우, 아래 3번 기준을 따라주세요.</p>
      </RuleCard>

      <RuleCard number="3️⃣" title="2트 이상 진행 시" color="cyan">
        <p>모집글에 <strong className="text-cyan-300">시간/트 수를 반드시 명시</strong>해 주세요.</p>
        <div className="bg-zinc-900/50 rounded-lg p-3 mt-2 space-y-1">
          <p className="text-zinc-400 text-sm">예시:</p>
          <p className="text-white">• 수요일 22:00 ~ 24:00 / 2트 모집</p>
          <p className="text-white">• 토요일 16:00 ~ 20:00 / 4트 모집</p>
        </div>
      </RuleCard>

      <RuleCard number="4️⃣" title="고정팟 운영 안내" color="red">
        <p className="text-red-300 font-bold">레기온팟 고정팟 운영은 진행하지 않습니다.</p>
        <p>레기온 내 트러블 방지를 위해 고정팟 형태의 루드라 진행은 지양합니다.</p>
        <p>고정팟 클리어를 원하시면 공팟/다른 방식으로 진행 부탁드립니다.</p>
        <p className="text-cyan-400 text-sm">(레기온은 신입이 들어와도 함께 즐길 수 있는 방향을 우선합니다.)</p>
      </RuleCard>

      <RuleCard number="5️⃣" title="참가 체크 방법" color="green">
        <p>참가 체크는 <strong className="text-green-300">이모지로 통일</strong>합니다. (작성자 포함 필수)</p>
        <div className="bg-zinc-900/50 rounded-lg p-4 mt-3 space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-3xl">❤️</span>
            <div>
              <span className="text-white font-bold">빨강하트</span>
              <span className="text-emerald-400 ml-2">치유</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl">🩵</span>
            <div>
              <span className="text-white font-bold">하늘하트</span>
              <span className="text-cyan-400 ml-2">딜러</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl">🖤</span>
            <div>
              <span className="text-white font-bold">검은하트</span>
              <span className="text-zinc-400 ml-2">탱커 (검성/수호 등)</span>
            </div>
          </div>
        </div>
      </RuleCard>

      {/* 출발 기준 */}
      <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-2 border-amber-500/50 rounded-xl p-5">
        <h4 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
          <span>🚀</span> 출발 기준
        </h4>
        <div className="bg-zinc-900/50 rounded-lg p-4 mb-3">
          <p className="text-white text-lg font-bold text-center">
            치유 2 / 탱커 2 / 딜러 4 체크 완료 시 출발
          </p>
        </div>
        <p className="text-zinc-300">인원이 찼으면 추가 이모지 체크는 하지 말아주시고, 다음 모집글을 새로 작성해 주세요.</p>
        <p className="text-zinc-500 text-sm mt-1">(출발 인원 혼선 방지)</p>
      </div>
    </div>
  );
}
