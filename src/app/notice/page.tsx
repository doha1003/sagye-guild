'use client';

import { useState } from 'react';
import Link from 'next/link';

type NoticeType = 'guild' | 'ludra';

export default function NoticePage() {
  const [activeTab, setActiveTab] = useState<NoticeType>('guild');

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 길드
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">길드원</Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📢</span> 공지사항
        </h1>

        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('guild')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'guild'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            길드 규칙
          </button>
          <button
            onClick={() => setActiveTab('ludra')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'ludra'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            루드라 파티 규칙
          </button>
        </div>

        {/* 공지 내용 */}
        <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
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
        </div>
      </main>
    </div>
  );
}

function GuildRules() {
  return (
    <div className="text-sm text-zinc-300 space-y-6">
      <h2 className="text-xl font-bold text-white text-center mb-4">
        아이온2 레기온 공지사항 (필독)
      </h2>

      <div className="text-center text-amber-400 font-bold py-3 bg-zinc-900 rounded-lg">
        ⭕️ 닉넴/년생/직업 → 서버프로필 변경 필수 ⭕️
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">1️⃣ 소통 수단 규칙</h4>
        <p>📌 <strong className="text-white">디스코드 필수 참여</strong>: 레기온 공지, 파티 모집, 운영 안내는 모두 디스코드 기준으로 진행됩니다. (음성 필수 아님)</p>
        <p className="mt-2">📌 미접일 예정 시 디코 미접일 방에 적어주세요 (4일 이상 미접 시 자동 추방)</p>
        <p className="mt-2">📌 카카오톡 단톡방 참여는 선택 사항</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">2️⃣ 디스코드 채널 사용 규칙</h4>
        <p>📌 각 컨텐츠 별 방으로 이동하시면서 이용해주세요.</p>
        <div className="mt-2 ml-4 space-y-1">
          <p>• 루드라 / 던전 트라이 시 → 루드라·던전 전용 음성 채널 사용</p>
          <p>• PVP / 쟁 콘텐츠 진행 시 → 쟁 전용 음성 채널 사용</p>
          <p>• 그 외: 잡담방 이용</p>
        </div>
        <p className="mt-2">📌 콘텐츠 성격에 맞지 않는 채널 사용 시, 운영진이 채널 이동을 요청할 수 있습니다.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">3️⃣ 상호 존중 기본 원칙</h4>
        <p>📌 레기온 내 모든 구성원은 상호 존중을 기본 원칙으로 합니다.</p>
        <p className="mt-2">친해졌다는 이유로 과한 반말, 비꼬는 말투, 선 넘는 농담/지적/압박은 자제해 주시기 바랍니다.</p>
        <p className="mt-2">📌 위와 같은 상황이 반복되거나 레기온 분위기를 해친다고 판단될 경우, 운영자 판단으로 즉시 추방될 수 있습니다.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">4️⃣ 접속 / 미접 기준</h4>
        <p>📌 사전 공유 없는 미접속 4일 시 추방</p>
        <p className="mt-2">미접 사유는 반드시 디스코드 #미접-사유 채널에 캐릭터명, 미접 기간, 간단한 사유를 남겨주셔야 합니다.</p>
        <p className="mt-2">📌 미접일 미작성 역시 사유 불문 추방 대상입니다.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">5️⃣ 고정팟 / 레기온 플레이 문화</h4>
        <p>📌 저희 모두 같은 레기온으로 함께 게임하는 만큼, 서로 필요한 상황에서는 가능한 범위 내에서 도와주는 문화를 지향합니다.</p>
        <p className="mt-2">모든 도움은 강요가 아닌 자율을 원칙으로 합니다.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">6️⃣ 루드라팟 운영 규칙</h4>
        <p>📌 루드라팟 참여자는 플레이 가능 시간 공유 필수</p>
        <p className="mt-2">📌 개인 사정으로 참여가 어려운 경우 사전 공유 필수</p>
        <p className="mt-2">📌 반복적인 무단 불참, 소통 부재 시, 파티 유지 또는 레기온 활동이 어려울 수 있습니다.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">7️⃣ 루드라 트라이 기본 마인드</h4>
        <p>📌 레기온 내 루드라 트라이는 클리어가 목표가 아닌 &apos;트라이(연습)&apos; 기준으로 진행합니다.</p>
        <p className="mt-2">트라이팟으로 못 깨도 됩니다. 기믹 연습, 패턴 숙지가 우선입니다.</p>
        <p className="mt-2">실수, 전멸, 실패에 대해 개인에게 부담을 주거나 책임을 묻는 분위기는 지양합니다.</p>
        <p className="mt-2">우리는 랭커 지향 레기온이 아닙니다. 게임에 진심인 것은 좋지만, 기본은 재미있게 게임하자는 목적임을 모두가 인지해 주시기 바랍니다.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">8️⃣ 기타 운영 원칙</h4>
        <p>📌 레기온 내부 대화, 운영 관련 내용의 외부 공유는 삼가주시기 바랍니다.</p>
        <p className="mt-2">📌 모든 제재 및 추방 여부는 운영자 판단 기준으로 진행됩니다.</p>
      </div>

      <div className="text-center text-amber-400 font-bold py-3 bg-zinc-900 rounded-lg">
        레기온은 단기 플레이가 아닌 장기적으로 함께 재미있게 할 분들을 위한 공간입니다.
      </div>
    </div>
  );
}

function LudraRules() {
  return (
    <div className="text-sm text-zinc-300 space-y-6">
      <h2 className="text-xl font-bold text-white text-center mb-4">
        루드라 트라이팟 운영방식 안내 (4트 기준)
      </h2>

      <div className="text-center text-cyan-400 font-bold py-3 bg-zinc-900 rounded-lg">
        루드라 공지가 4트(4회 트라이) 기준으로 변경되었습니다
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">0️⃣ 기본 원칙</h4>
        <p>📌 본 운영은 <strong className="text-amber-400">&quot;클팟&quot;이 아닌 &quot;트라이팟&quot;</strong> 기준입니다.</p>
        <p className="mt-2">트라이 과정에서 예민한 반응/비난이 발생하면 파티 운영이 어렵습니다.</p>
        <p className="mt-2 text-cyan-400">트라이 분위기 유지가 최우선입니다.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">1️⃣ 클리어 우선이신 분</h4>
        <p>📌 <strong className="text-white">&quot;클리어&quot;가 최우선 목표</strong>이신 분은 공팟 이용을 부탁드립니다.</p>
        <p className="mt-2">레기온팟은 트라이(연습/숙련) 중심으로 운영합니다.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">2️⃣ 기본 모집 기준</h4>
        <p>📌 모집은 기본적으로 <strong className="text-amber-400">&quot;1트&quot;</strong> 기준으로 진행합니다.</p>
        <p className="mt-2">추가 트라이를 원하시는 경우, 아래 3번 기준을 따라주세요.</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">3️⃣ 2트 이상 진행 시</h4>
        <p>📌 모집글에 <strong className="text-white">시간/트 수를 반드시 명시</strong>해 주세요.</p>
        <div className="mt-3 bg-zinc-900 rounded-lg p-4 space-y-2">
          <p className="text-zinc-400">예시:</p>
          <p className="text-white">• 수요일 22:00 ~ 24:00 / 2트 모집</p>
          <p className="text-white">• 토요일 16:00 ~ 20:00 / 4트 모집</p>
        </div>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">4️⃣ 고정팟 운영 안내</h4>
        <p>📌 <strong className="text-red-400">레기온팟 고정팟 운영은 진행하지 않습니다.</strong></p>
        <p className="mt-2">레기온 내 트러블 방지를 위해 고정팟 형태의 루드라 진행은 지양합니다.</p>
        <p className="mt-2">고정팟 클리어를 원하시면 공팟/다른 방식으로 진행 부탁드립니다.</p>
        <p className="mt-2 text-cyan-400">(레기온은 신입이 들어와도 함께 즐길 수 있는 방향을 우선합니다.)</p>
      </div>

      <div>
        <h4 className="text-white font-bold mb-2 text-base">5️⃣ 참가 체크 방법</h4>
        <p>📌 참가 체크는 <strong className="text-white">이모지로 통일</strong>합니다. (작성자 포함 필수)</p>
        <div className="mt-3 bg-zinc-900 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">❤️</span>
            <span className="text-white">빨강하트 : 치유</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩵</span>
            <span className="text-white">하늘하트 : 딜러</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖤</span>
            <span className="text-white">검은하트 : 탱커 (검성/수호 등)</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
        <h4 className="text-amber-400 font-bold mb-2">출발 기준</h4>
        <p className="text-white">치유 2 / 탱커 2 / 딜러 4 체크 완료 시 출발합니다.</p>
        <p className="mt-2 text-zinc-300">인원이 찼으면 추가 이모지 체크는 하지 말아주시고, 다음 모집글을 새로 작성해 주세요.</p>
        <p className="text-zinc-400 text-xs mt-1">(출발 인원 혼선 방지)</p>
      </div>
    </div>
  );
}
