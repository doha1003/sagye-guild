'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AlertBar from '../components/AlertBar';

type NoticeType = 'guild' | 'subguild' | 'ludra' | 'pwa' | 'siteGuide' | 'discordBot';

export default function NoticePage() {
  const [activeTab, setActiveTab] = useState<NoticeType>('guild');

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

        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-8 border-b border-zinc-700 overflow-x-auto pb-px scrollbar-hide">
          <button
            onClick={() => setActiveTab('guild')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'guild'
                ? 'text-amber-400 border-amber-400'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            레기온 규칙
          </button>
          <button
            onClick={() => setActiveTab('subguild')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'subguild'
                ? 'text-amber-400 border-amber-400'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            부캐 가입
          </button>
          <button
            onClick={() => setActiveTab('ludra')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'ludra'
                ? 'text-amber-400 border-amber-400'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            파티 규칙
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'text-amber-400 border-amber-400'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            앱 설치
          </button>
          <button
            onClick={() => setActiveTab('siteGuide')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'siteGuide'
                ? 'text-amber-400 border-amber-400'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            사이트 가이드
          </button>
          <button
            onClick={() => setActiveTab('discordBot')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'discordBot'
                ? 'text-amber-400 border-amber-400'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            사계봇 가이드
          </button>
        </div>

        {/* 공지 내용 */}
        <div className="prose-custom">
          {activeTab === 'guild' && <GuildRules />}
          {activeTab === 'subguild' && <SubGuildRules />}
          {activeTab === 'ludra' && <LudraRules />}
          {activeTab === 'pwa' && <PWAGuide />}
          {activeTab === 'siteGuide' && <SiteGuide />}
          {activeTab === 'discordBot' && <DiscordBotGuide />}
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

function GuildRules() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        아이온2 레기온 공지사항 (필독)
      </h2>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8 text-center">
        <p className="text-amber-300 font-medium mb-2">
          닉넴/년생/직업 → 디스코드 서버프로필 변경 필수
        </p>
        <p className="text-zinc-400 text-sm">
          디스코드 좌측 서버 목록에서 사계 서버 우클릭 → 서버 프로필 수정
        </p>
      </div>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">1. 소통 수단 규칙</h3>
        <ul className="space-y-3 text-zinc-300">
          <li className="pl-4 border-l-2 border-zinc-700">
            <strong className="text-white">디스코드 필수 참여</strong><br />
            <span className="text-zinc-400">레기온 공지, 파티 모집, 운영 안내는 모두 디스코드 기준으로 진행됩니다. (음성 필수 아님)</span>
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            미접일 예정 시 디코 미접일 방에 적어주세요<br />
            <span className="text-zinc-400">4일 이상 미접 시 자동 추방</span>
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            카카오톡 단톡방 참여는 선택 사항
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">2. 디스코드 채널 사용 규칙</h3>
        <p className="text-zinc-300 mb-3">각 컨텐츠 별 방으로 이동하시면서 이용해주세요.</p>
        <ul className="space-y-2 text-zinc-400 ml-4">
          <li>• 루드라 / 던전 트라이 시 → 루드라·던전 전용 음성 채널 사용</li>
          <li>• PVP / 쟁 콘텐츠 진행 시 → 쟁 전용 음성 채널 사용</li>
          <li>• 그 외: 잡담방 이용</li>
        </ul>
        <p className="text-zinc-400 mt-3 text-sm">
          콘텐츠 성격에 맞지 않는 채널 사용 시, 운영진이 채널 이동을 요청할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">3. 상호 존중 기본 원칙</h3>
        <p className="text-zinc-300 mb-3">
          레기온 내 모든 구성원은 <strong className="text-white">상호 존중</strong>을 기본 원칙으로 합니다.
        </p>
        <p className="text-zinc-400 mb-3">
          친해졌다는 이유로 과한 반말, 비꼬는 말투, 선 넘는 농담/지적/압박은 자제해 주시기 바랍니다.
        </p>
        <p className="text-zinc-500 text-sm">
          위와 같은 상황이 반복되거나 레기온 분위기를 해친다고 판단될 경우, 운영자 판단으로 즉시 추방될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">4. 접속 / 미접 기준</h3>
        <ul className="space-y-3 text-zinc-300">
          <li className="pl-4 border-l-2 border-red-500/50">
            <strong className="text-white">사전 공유 없는 미접속 4일 시 추방</strong>
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            미접 사유는 반드시 디스코드 #미접-사유 채널에 캐릭터명, 미접 기간, 간단한 사유를 남겨주셔야 합니다.
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            <span className="text-zinc-400">미접일 미작성 역시 사유 불문 추방 대상입니다.</span>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">5. 고정팟 / 레기온 플레이 문화</h3>
        <p className="text-zinc-300 mb-3">
          저희 모두 같은 레기온으로 함께 게임하는 만큼, 서로 필요한 상황에서는 가능한 범위 내에서 도와주는 문화를 지향합니다.
        </p>
        <p className="text-zinc-400">
          모든 도움은 강요가 아닌 자율을 원칙으로 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">6. 루드라팟 운영 규칙</h3>
        <ul className="space-y-2 text-zinc-300">
          <li className="pl-4 border-l-2 border-zinc-700">루드라팟 참여자는 플레이 가능 시간 공유 필수</li>
          <li className="pl-4 border-l-2 border-zinc-700">개인 사정으로 참여가 어려운 경우 사전 공유 필수</li>
          <li className="pl-4 border-l-2 border-zinc-700">
            <span className="text-zinc-400">반복적인 무단 불참, 소통 부재 시, 파티 유지 또는 레기온 활동이 어려울 수 있습니다.</span>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">7. 루드라 트라이 기본 마인드</h3>
        <p className="text-zinc-300 mb-3">
          레기온 내 루드라 트라이는 클리어가 목표가 아닌 <strong className="text-white">&apos;트라이(연습)&apos;</strong> 기준으로 진행합니다.
        </p>
        <ul className="space-y-2 text-zinc-400">
          <li>• 트라이팟으로 못 깨도 됩니다. 기믹 연습, 패턴 숙지가 우선입니다.</li>
          <li>• 실수, 전멸, 실패에 대해 개인에게 부담을 주거나 책임을 묻는 분위기는 지양합니다.</li>
          <li>• 우리는 랭커 지향 레기온이 아닙니다. 기본은 재미있게 게임하자는 목적입니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">8. 기타 운영 원칙</h3>
        <ul className="space-y-2 text-zinc-300">
          <li className="pl-4 border-l-2 border-zinc-700">레기온 내부 대화, 운영 관련 내용의 외부 공유는 삼가주시기 바랍니다.</li>
          <li className="pl-4 border-l-2 border-zinc-700">모든 제재 및 추방 여부는 운영자 판단 기준으로 진행됩니다.</li>
        </ul>
      </section>

      <div className="bg-zinc-800 rounded-lg p-6 text-center mt-10">
        <p className="text-zinc-300 leading-relaxed">
          레기온은 단기 플레이가 아닌<br />
          <strong className="text-white">장기적으로 함께 재미있게 할 분들</strong>을 위한 공간입니다.
        </p>
      </div>
    </article>
  );
}

function SubGuildRules() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        부캐 가입 안내
      </h2>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-8">
        <p className="text-green-300 font-medium text-center mb-2">
          부캐도 사계 레기온에 바로 가입!
        </p>
        <p className="text-zinc-400 text-sm text-center">
          레기온 인원이 128명으로 늘어나 부캐도 사계에 함께 가입합니다
        </p>
      </div>

      <section className="mb-8">
        <div className="bg-zinc-800 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🍂</div>
          <div className="text-2xl font-bold text-amber-400">사계</div>
          <div className="text-zinc-400 text-sm mt-1">본캐 + 부캐 통합 운영</div>
          <div className="text-zinc-500 text-xs mt-2">최대 128명</div>
        </div>
        <div className="bg-zinc-700/30 border border-zinc-600 rounded-lg p-3 mt-4 text-center">
          <p className="text-zinc-400 text-sm">
            <span className="text-zinc-500 line-through">오계 (부캐 레기온)</span> → 해체됨
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">부캐 가입 방법</h3>
        <ul className="space-y-3 text-zinc-300">
          <li className="pl-4 border-l-2 border-amber-500/50">
            <strong className="text-white">본캐가 사계 레기온 소속</strong>이어야 합니다
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            게임 내 레기온 검색 → <strong className="text-amber-400">사계</strong> → 가입 신청
          </li>
        </ul>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4 text-center">
          <p className="text-zinc-400 text-sm mb-1">가입 비밀번호</p>
          <p className="text-green-400 font-bold text-xl">Aion22</p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-red-400 mb-4">필수 규칙</h3>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
          <p className="text-red-300 font-medium text-center">
            한마디에 본캐 닉네임 기재 필수!
          </p>
        </div>
        <ul className="space-y-3 text-zinc-300">
          <li className="pl-4 border-l-2 border-red-500/50">
            <strong className="text-white">게임 내 &apos;한마디&apos;에 본캐 닉네임을 반드시 적어주세요</strong><br />
            <span className="text-zinc-400">예시: 본캐 - 홍길동</span>
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            본캐 닉네임이 없으면 누구인지 확인이 어려워 관리가 불가능합니다
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            한마디 미기재 시 사전 경고 없이 추방될 수 있습니다
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">한마디 설정 방법</h3>
        <div className="bg-zinc-800 rounded-lg p-4">
          <ol className="space-y-2 text-zinc-300">
            <li>1. 게임 내 <strong className="text-white">L</strong> 키 눌러서 레기온 창 열기</li>
            <li>2. 레기온 탭에서 내 캐릭터 ID 옆 <strong className="text-white">아이콘</strong> 클릭</li>
            <li>3. <strong className="text-white">본캐 닉네임</strong> 입력 후 저장</li>
          </ol>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">운영 방침</h3>
        <ul className="space-y-2 text-zinc-300">
          <li className="pl-4 border-l-2 border-zinc-700">
            부캐도 본캐와 동일한 레기온 규칙을 적용합니다
          </li>
          <li className="pl-4 border-l-2 border-zinc-700">
            부캐로 인한 트러블 발생 시 본캐에도 제재가 적용될 수 있습니다
          </li>
        </ul>
      </section>

      <div className="bg-zinc-800 rounded-lg p-6 text-center mt-10">
        <p className="text-zinc-300 leading-relaxed">
          부캐도 결국 <strong className="text-white">같은 레기온원</strong>입니다.<br />
          본캐와 동일하게 서로 존중하며 즐겁게 플레이해주세요!
        </p>
      </div>
    </article>
  );
}

function PWAGuide() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        사계 레기온 앱 설치 가이드
      </h2>

      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-8">
        <p className="text-cyan-300 font-medium text-center mb-2">
          홈 화면에 앱처럼 설치 가능!
        </p>
        <p className="text-zinc-400 text-sm text-center">
          사계 레기온 사이트를 앱처럼 사용할 수 있습니다 (Android / iOS 모두 지원)
        </p>
      </div>

      {/* 설치 이미지 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">설치된 모습</h3>
        <div className="bg-zinc-800 rounded-xl p-4 flex justify-center">
          <Image
            src="/images/pwa-install.jpg"
            alt="사계 레기온 앱 설치 예시"
            width={300}
            height={600}
            className="rounded-lg border border-zinc-600"
          />
        </div>
        <p className="text-zinc-500 text-sm text-center mt-3">
          홈 화면에 사계 레기온 아이콘이 추가됩니다
        </p>
      </section>

      {/* 안드로이드 설치 방법 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-green-400 mb-4">Android 설치 방법</h3>
        <div className="bg-zinc-800 rounded-lg p-4">
          <ol className="space-y-4 text-zinc-300">
            <li className="flex gap-3">
              <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
              <div>
                <strong className="text-white">Chrome 브라우저</strong>로 sagye.kr 접속
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
              <div>
                우측 상단 <strong className="text-white">점 3개 메뉴 (⋮)</strong> 클릭
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
              <div>
                <strong className="text-white">&quot;홈 화면에 추가&quot;</strong> 또는 <strong className="text-white">&quot;앱 설치&quot;</strong> 선택
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
              <div>
                <strong className="text-white">&quot;설치&quot;</strong> 버튼 클릭
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* iOS 설치 방법 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">iOS (iPhone/iPad) 설치 방법</h3>
        <div className="bg-zinc-800 rounded-lg p-4">
          <ol className="space-y-4 text-zinc-300">
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
              <div>
                <strong className="text-white">Safari 브라우저</strong>로 sagye.kr 접속
                <p className="text-zinc-500 text-sm mt-1">* Chrome에서는 설치 불가, Safari 필수!</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
              <div>
                하단 <strong className="text-white">공유 버튼 (□↑)</strong> 클릭
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
              <div>
                스크롤해서 <strong className="text-white">&quot;홈 화면에 추가&quot;</strong> 선택
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
              <div>
                우측 상단 <strong className="text-white">&quot;추가&quot;</strong> 버튼 클릭
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 앱 기능 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">앱 설치 시 장점</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-zinc-800 rounded-lg p-4 flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <div className="text-white font-medium">전체화면 모드</div>
              <div className="text-zinc-500 text-sm">브라우저 UI 없이 깔끔하게</div>
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-white font-medium">빠른 접근</div>
              <div className="text-zinc-500 text-sm">홈 화면에서 바로 실행</div>
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <div className="text-white font-medium">보스 타이머 알림</div>
              <div className="text-zinc-500 text-sm">필드보스 리젠 알림 수신</div>
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 flex items-center gap-3">
            <span className="text-2xl">💾</span>
            <div>
              <div className="text-white font-medium">오프라인 지원</div>
              <div className="text-zinc-500 text-sm">일부 페이지 오프라인 접근</div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-zinc-800 rounded-lg p-6 text-center">
        <p className="text-zinc-300 leading-relaxed">
          설치 후 홈 화면의 <strong className="text-amber-400">사계 레기온</strong> 아이콘을 터치하면<br />
          바로 사이트에 접속할 수 있습니다!
        </p>
      </div>
    </article>
  );
}

function LudraRules() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        루드라 트라이팟 운영방식 안내 (4트 기준)
      </h2>

      <div className="bg-zinc-800 rounded-lg p-4 mb-8 text-center">
        <p className="text-zinc-300">
          루드라 공지가 <strong className="text-white">4트(4회 트라이)</strong> 기준으로 변경되었습니다
        </p>
      </div>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">0. 기본 원칙</h3>
        <p className="text-zinc-300 mb-3">
          본 운영은 <strong className="text-white">&quot;클팟&quot;이 아닌 &quot;트라이팟&quot;</strong> 기준입니다.
        </p>
        <p className="text-zinc-400 mb-2">트라이 과정에서 예민한 반응/비난이 발생하면 파티 운영이 어렵습니다.</p>
        <p className="text-zinc-300">트라이 분위기 유지가 최우선입니다.</p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">1. 실수했을 때는 "사랑합니다" 💕</h3>
        <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 mb-4">
          <p className="text-pink-300 font-medium text-center text-lg">
            "죄송합니다" ❌ → "사랑합니다" ⭕
          </p>
        </div>
        <p className="text-zinc-300 mb-2">
          트라이 중 실수는 누구나 합니다. 하지만 매번 <strong className="text-white">"죄송합니다"</strong>라고 하면 분위기가 무거워져요.
        </p>
        <p className="text-zinc-300">
          우리 사계는 리트라이 뜰 때 <strong className="text-pink-300">"사랑합니다"</strong>라고 말하기로 했습니다. 가볍고 즐거운 분위기로 트라이해요!
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">2. 클리어 우선이신 분</h3>
        <p className="text-zinc-300 mb-2">
          <strong className="text-white">&quot;클리어&quot;가 최우선 목표</strong>이신 분은 공팟 이용을 부탁드립니다.
        </p>
        <p className="text-zinc-400">레기온팟은 트라이(연습/숙련) 중심으로 운영합니다.</p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">3. 모집글 작성 방법</h3>
        <p className="text-zinc-300 mb-4">
          디스코드 <strong className="text-indigo-400">#루드라-모집-게시판</strong> 채널에 모집글 작성 시 아래 항목을 <strong className="text-white">반드시 포함</strong>해 주세요.
        </p>
        <div className="bg-zinc-800 rounded-lg p-4 mb-4">
          <ul className="space-y-2 text-zinc-300">
            <li>• <strong className="text-white">날짜</strong> (예: 1월 7일)</li>
            <li>• <strong className="text-white">요일</strong> (예: 수요일)</li>
            <li>• <strong className="text-white">루드라 범위</strong> (1~2넴 / 막넴까지 등)</li>
            <li>• <strong className="text-white">시간</strong> (예: 22:30~23:30)</li>
            <li>• <strong className="text-white">트 수</strong> (1트 / 2트 등)</li>
          </ul>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
          <p className="text-zinc-500 text-sm mb-2">모집글 예시:</p>
          <p className="text-indigo-300 font-medium">1월 7일 수요일 루드라 1~2넴 1트 22:30~23:30 모집</p>
          <p className="text-indigo-300 font-medium mt-1">1월 11일 토요일 루드라 막넴까지 2트 16:00~18:00 모집</p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">4. 고정팟 운영 안내</h3>
        <p className="text-zinc-300 mb-3 pl-4 border-l-2 border-red-500/50">
          <strong className="text-white">레기온팟 고정팟 운영은 진행하지 않습니다.</strong>
        </p>
        <ul className="space-y-2 text-zinc-400">
          <li>• 레기온 내 트러블 방지를 위해 고정팟 형태의 루드라 진행은 지양합니다.</li>
          <li>• 고정팟 클리어를 원하시면 공팟/다른 방식으로 진행 부탁드립니다.</li>
          <li>• 레기온은 신입이 들어와도 함께 즐길 수 있는 방향을 우선합니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">5. 참가 체크 방법</h3>
        <p className="text-zinc-300 mb-4">
          디스코드 <strong className="text-indigo-400">#루드라-모집-게시판</strong> 채널에서 참가 체크는 <strong className="text-white">이모지로 통일</strong>합니다. (작성자 포함 필수)
        </p>
        <div className="bg-zinc-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-2xl w-8">❤️</span>
            <span className="text-zinc-300">빨강하트 : <strong className="text-white">치유</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl w-8">🩵</span>
            <span className="text-zinc-300">하늘하트 : <strong className="text-white">딜러</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl w-8">🖤</span>
            <span className="text-zinc-300">검은하트 : <strong className="text-white">탱커</strong> (검성/수호 등)</span>
          </div>
        </div>
      </section>

      <section className="bg-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">출발 기준</h3>
        <p className="text-xl text-center text-white font-medium mb-4">
          치유 2 / 탱커 2 / 딜러 4
        </p>
        <p className="text-zinc-400 text-sm">
          인원이 찼으면 추가 이모지 체크는 하지 말아주시고, 다음 모집글을 새로 작성해 주세요. (출발 인원 혼선 방지)
        </p>
      </section>
    </article>
  );
}

function SiteGuide() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        사계 레기온 사이트 사용 가이드
      </h2>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
        <p className="text-amber-300 font-medium text-center mb-2">
          sagye.kr - 사계 레기온 공식 사이트
        </p>
        <p className="text-zinc-400 text-sm text-center">
          레기온원 정보, 일정, 필드보스 타이머 등 다양한 기능을 제공합니다
        </p>
      </div>

      {/* 메인 페이지 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">메인 페이지</h3>
        <div className="bg-zinc-800 rounded-lg p-4">
          <ul className="space-y-3 text-zinc-300">
            <li className="pl-4 border-l-2 border-cyan-500/50">
              <strong className="text-white">AION2 공식 유튜브 연동</strong><br />
              <span className="text-zinc-400">라이브 방송 중이면 자동 표시, 없으면 최신 영상 표시</span>
            </li>
            <li className="pl-4 border-l-2 border-zinc-700">
              <strong className="text-white">빠른 링크</strong><br />
              <span className="text-zinc-400">레기온원, 일정, 공지사항, 업데이트 내역 바로가기</span>
            </li>
            <li className="pl-4 border-l-2 border-zinc-700">
              <strong className="text-white">외부 링크</strong><br />
              <span className="text-zinc-400">인벤, 아이온2 디시, 히든큐브 바로가기</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 레기온원 페이지 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-green-400 mb-4">레기온원 페이지 (/members)</h3>
        <div className="bg-zinc-800 rounded-lg p-4 mb-4">
          <ul className="space-y-3 text-zinc-300">
            <li className="pl-4 border-l-2 border-green-500/50">
              <strong className="text-white">길드원 목록 조회</strong><br />
              <span className="text-zinc-400">계급, 캐릭터명, 직업, 나이, 디스코드, 전투정보 표시</span>
            </li>
            <li className="pl-4 border-l-2 border-zinc-700">
              <strong className="text-white">직업별 필터링</strong><br />
              <span className="text-zinc-400">상단 직업 버튼으로 특정 직업만 필터링</span>
            </li>
            <li className="pl-4 border-l-2 border-zinc-700">
              <strong className="text-white">본캐/부캐 표시</strong><br />
              <span className="text-zinc-400">부캐의 경우 본캐 닉네임 함께 표시</span>
            </li>
            <li className="pl-4 border-l-2 border-zinc-700">
              <strong className="text-white">aion2tool 연동</strong><br />
              <span className="text-zinc-400">캐릭터명 클릭 시 aion2tool 상세 페이지로 이동</span>
            </li>
          </ul>
        </div>
        <div className="bg-zinc-700/30 rounded-lg p-3 text-sm text-zinc-400">
          <strong className="text-zinc-300">전투정보 칼럼:</strong> 최고점수 / 현재점수 / 전투력 순서로 표시
        </div>
      </section>

      {/* 일정 페이지 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">일정 페이지 (/schedule)</h3>

        <div className="space-y-4">
          {/* 일일/주간 탭 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">일일/주간 탭</h4>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• <strong className="text-white">슈고 페스타</strong>: 매시 15분, 45분</li>
              <li>• <strong className="text-white">시공의 균열</strong>: 2,5,8,11,14,17,20,23시</li>
              <li>• <strong className="text-white">검은 구름 무역단</strong>: 화/목/토/일 00:00~24:00</li>
              <li>• <strong className="text-white">주간 컨텐츠</strong>: 물질변환, 산들바람 상회, 루드라 등</li>
            </ul>
          </div>

          {/* 필드보스 탭 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">필드보스 탭 (핵심 기능)</h4>
            <ul className="space-y-3 text-zinc-300">
              <li className="pl-4 border-l-2 border-purple-500/50">
                <strong className="text-white">실시간 타이머 공유</strong><br />
                <span className="text-zinc-400">Firebase 연동으로 길드원 전체가 타이머 공유</span>
              </li>
              <li className="pl-4 border-l-2 border-zinc-700">
                <strong className="text-white">처치 버튼</strong><br />
                <span className="text-zinc-400">보스 처치 시 클릭 → 자동으로 리젠 타이머 시작</span>
              </li>
              <li className="pl-4 border-l-2 border-zinc-700">
                <strong className="text-white">직접 시간 입력</strong><br />
                <span className="text-zinc-400">[입력] 버튼으로 게임에서 본 남은 시간 직접 입력<br />
                형식: H:MM:SS, MM:SS, MM (예: 1:23:45, 45:30, 30)</span>
              </li>
              <li className="pl-4 border-l-2 border-amber-500/50">
                <strong className="text-amber-400">관심 보스 기능</strong><br />
                <span className="text-zinc-400">⭐ 버튼으로 관심 보스 등록 → 황금 테두리 + 5분 전 추가 알림</span>
              </li>
              <li className="pl-4 border-l-2 border-zinc-700">
                <strong className="text-white">점검 리셋</strong><br />
                <span className="text-zinc-400">점검 종료 날짜+시간 입력 → 모든 보스 리젠 시간 자동 계산</span>
              </li>
              <li className="pl-4 border-l-2 border-zinc-700">
                <strong className="text-white">지도 보기</strong><br />
                <span className="text-zinc-400">마족/천족/어비스 진영별 필드보스 위치 지도</span>
              </li>
            </ul>
          </div>

          {/* 알림 설정 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">알림 설정</h4>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• <strong className="text-white">알림음 ON/OFF</strong>: 비프음 알림 토글</li>
              <li>• <strong className="text-white">슈고 페스타 알림</strong>: 매시 14분, 44분에 1분 전 알림</li>
              <li>• <strong className="text-white">시공의 균열 알림</strong>: 5분 전 알림</li>
              <li>• <strong className="text-white">검은 구름 무역단 알림</strong>: 자정에 알림</li>
              <li>• <strong className="text-white">나흐마 알림</strong>: 토/일 19:55에 알림</li>
            </ul>
          </div>

          {/* 매뉴얼 탭 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">매뉴얼 탭</h4>
            <p className="text-zinc-400 text-sm">
              필드보스 타이머 상세 사용법, 점검 리셋 사용법, 시간 입력 형식 등 자세한 가이드 제공
            </p>
          </div>
        </div>
      </section>

      {/* 팁 페이지들 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-orange-400 mb-4">정보 페이지</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-white font-medium mb-2">외형 DB (/tips/appearance)</div>
            <p className="text-zinc-400 text-sm">아이온2 외형 아이템 정보</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-white font-medium mb-2">펫 DB (/tips/pets)</div>
            <p className="text-zinc-400 text-sm">펫 종류, 스탯, 획득처 정보</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-white font-medium mb-2">시즌2 (/season2)</div>
            <p className="text-zinc-400 text-sm">시즌2 아르카나, 보스, 균열 정보</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-white font-medium mb-2">업데이트 내역 (/updates)</div>
            <p className="text-zinc-400 text-sm">사이트 변경 기록</p>
          </div>
        </div>
      </section>

      {/* 앱 설치 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">앱처럼 사용하기 (PWA)</h3>
        <div className="bg-zinc-800 rounded-lg p-4">
          <p className="text-zinc-300 mb-3">
            홈 화면에 앱 아이콘을 추가하면 더 빠르고 편리하게 이용할 수 있습니다.
          </p>
          <ul className="space-y-2 text-zinc-400 text-sm">
            <li>• <strong className="text-zinc-300">Android</strong>: Chrome → 메뉴(⋮) → 홈 화면에 추가</li>
            <li>• <strong className="text-zinc-300">iOS</strong>: Safari → 공유(□↑) → 홈 화면에 추가</li>
          </ul>
          <p className="text-zinc-500 text-sm mt-3">
            자세한 설치 방법은 &quot;앱 설치&quot; 탭을 참고하세요.
          </p>
        </div>
      </section>

      <div className="bg-zinc-800 rounded-lg p-6 text-center">
        <p className="text-zinc-300 leading-relaxed">
          문의 및 건의사항은<br />
          <strong className="text-indigo-400">디스코드</strong>로 연락해주세요!
        </p>
      </div>
    </article>
  );
}

function DiscordBotGuide() {
  return (
    <article className="text-zinc-200 leading-relaxed tracking-wide">
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-700">
        사계봇 사용 가이드
      </h2>

      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 mb-8">
        <p className="text-indigo-300 font-medium text-center mb-2">
          디스코드 사계봇 - 레기온 전용 봇
        </p>
        <p className="text-zinc-400 text-sm text-center">
          인증, 전투력 조회, 파티 모집 등 다양한 기능을 디스코드에서 바로 사용
        </p>
      </div>

      {/* 기본 사용법 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">기본 사용법</h3>
        <div className="bg-zinc-800 rounded-lg p-4">
          <p className="text-zinc-300 mb-3">
            모든 명령어는 <strong className="text-indigo-400">/</strong> (슬래시)로 시작합니다.
          </p>
          <p className="text-zinc-400 text-sm">
            디스코드 채팅창에 <strong className="text-white">/</strong>를 입력하면 사용 가능한 명령어 목록이 표시됩니다.
          </p>
        </div>
      </section>

      {/* 인증 시스템 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-green-400 mb-4">인증 시스템</h3>

        <div className="space-y-4">
          {/* /인증 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-green-400 font-mono">/인증</code>
              <span className="text-zinc-500 text-sm">본캐 인증</span>
            </div>
            <p className="text-zinc-300 mb-2">게임 캐릭터를 디스코드 계정에 연결합니다.</p>
            <div className="bg-zinc-700/50 rounded p-3 mt-2">
              <p className="text-zinc-400 text-sm mb-1">사용 예시:</p>
              <code className="text-indigo-300">/인증 닉네임:도하</code>
            </div>
            <ul className="mt-3 space-y-1 text-zinc-400 text-sm">
              <li>• 인증 후 디스코드 닉네임이 자동으로 변경됩니다</li>
              <li>• 레기온원 정보와 연동되어 역할이 부여됩니다</li>
            </ul>
          </div>

          {/* /부캐인증 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-green-400 font-mono">/부캐인증</code>
              <span className="text-zinc-500 text-sm">부캐 등록</span>
            </div>
            <p className="text-zinc-300 mb-2">본캐 인증 후 부캐를 추가로 등록합니다.</p>
            <div className="bg-zinc-700/50 rounded p-3 mt-2">
              <p className="text-zinc-400 text-sm mb-1">사용 예시:</p>
              <code className="text-indigo-300">/부캐인증 닉네임:부캐닉</code>
            </div>
            <p className="text-zinc-500 text-sm mt-2">* 본캐 인증이 선행되어야 합니다</p>
          </div>

          {/* /닉변경 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-green-400 font-mono">/닉변경</code>
              <span className="text-zinc-500 text-sm">닉네임 변경</span>
            </div>
            <p className="text-zinc-300 mb-2">게임 내 닉네임 변경 시 인증 정보를 업데이트합니다.</p>
            <div className="bg-zinc-700/50 rounded p-3 mt-2">
              <p className="text-zinc-400 text-sm mb-1">사용 예시:</p>
              <code className="text-indigo-300">/닉변경 새닉네임:새닉</code>
            </div>
          </div>

          {/* /인증해제 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-red-400 font-mono">/인증해제</code>
              <span className="text-zinc-500 text-sm">인증 삭제</span>
            </div>
            <p className="text-zinc-300">등록된 인증 정보를 삭제합니다.</p>
          </div>

          {/* /내정보 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-cyan-400 font-mono">/내정보</code>
              <span className="text-zinc-500 text-sm">내 인증 정보 확인</span>
            </div>
            <p className="text-zinc-300">현재 등록된 본캐/부캐 정보를 확인합니다.</p>
          </div>
        </div>
      </section>

      {/* 전투력 조회 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">전투력 조회</h3>

        <div className="space-y-4">
          {/* /아툴 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-blue-400 font-mono">/아툴</code>
              <span className="text-zinc-500 text-sm">aion2tool 링크</span>
            </div>
            <p className="text-zinc-300 mb-2">캐릭터의 aion2tool 상세 페이지 링크를 생성합니다.</p>
            <div className="bg-zinc-700/50 rounded p-3 mt-2">
              <p className="text-zinc-400 text-sm mb-1">사용 예시:</p>
              <code className="text-indigo-300">/아툴 닉네임:도하</code>
            </div>
          </div>

          {/* /전투력 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-blue-400 font-mono">/전투력</code>
              <span className="text-zinc-500 text-sm">전투력 조회</span>
            </div>
            <p className="text-zinc-300 mb-2">캐릭터의 현재 전투력, 전투점수 등을 조회합니다.</p>
            <div className="bg-zinc-700/50 rounded p-3 mt-2">
              <p className="text-zinc-400 text-sm mb-1">사용 예시:</p>
              <code className="text-indigo-300">/전투력 닉네임:도하</code>
            </div>
            <p className="text-zinc-400 text-sm mt-2">aion2tool API를 통해 실시간 데이터를 가져옵니다.</p>
          </div>

          {/* /검색 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-blue-400 font-mono">/검색</code>
              <span className="text-zinc-500 text-sm">캐릭터 검색</span>
            </div>
            <p className="text-zinc-300 mb-2">PlayNC 공식 API로 캐릭터를 검색합니다.</p>
            <div className="bg-zinc-700/50 rounded p-3 mt-2">
              <p className="text-zinc-400 text-sm mb-1">사용 예시:</p>
              <code className="text-indigo-300">/검색 닉네임:도하</code>
            </div>
          </div>
        </div>
      </section>

      {/* 데이터 수집 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">데이터 수집 (운영진 전용)</h3>

        <div className="space-y-4">
          {/* /수집 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-purple-400 font-mono">/수집</code>
              <span className="text-zinc-500 text-sm">단일 캐릭터 수집</span>
            </div>
            <p className="text-zinc-300 mb-2">특정 캐릭터의 전투정보를 수집하여 구글 시트에 저장합니다.</p>
            <div className="bg-zinc-700/50 rounded p-3 mt-2">
              <p className="text-zinc-400 text-sm mb-1">사용 예시:</p>
              <code className="text-indigo-300">/수집 닉네임:도하</code>
            </div>
          </div>

          {/* /통합수집 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-purple-400 font-mono">/통합수집</code>
              <span className="text-zinc-500 text-sm">전체 레기온원 수집</span>
            </div>
            <p className="text-zinc-300 mb-2">레기온원 전체의 전투정보를 일괄 수집합니다.</p>
            <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mt-2">
              <p className="text-red-300 text-sm">* 운영진 전용 명령어입니다</p>
            </div>
          </div>

          {/* /동기화 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-purple-400 font-mono">/동기화</code>
              <span className="text-zinc-500 text-sm">시트 동기화</span>
            </div>
            <p className="text-zinc-300">구글 시트 데이터를 최신 상태로 동기화합니다.</p>
          </div>
        </div>
      </section>

      {/* 파티 모집 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-orange-400 mb-4">파티 모집</h3>

        <div className="space-y-4">
          {/* /파티 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-orange-400 font-mono">/파티</code>
              <span className="text-zinc-500 text-sm">파티 모집 생성</span>
            </div>
            <p className="text-zinc-300 mb-2">파티 모집 게시물을 생성합니다.</p>
            <div className="bg-zinc-700/50 rounded p-3 mt-2">
              <p className="text-zinc-400 text-sm mb-1">사용 예시:</p>
              <code className="text-indigo-300">/파티 컨텐츠:루드라 시간:22:00 메모:1~2넴</code>
            </div>
            <ul className="mt-3 space-y-1 text-zinc-400 text-sm">
              <li>• 이모지 반응으로 참가 신청</li>
              <li>• 역할(탱/힐/딜)별 자동 분류</li>
              <li>• 인원 충족 시 알림</li>
            </ul>
          </div>

          {/* /참가현황 */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-zinc-700 px-2 py-1 rounded text-orange-400 font-mono">/참가현황</code>
              <span className="text-zinc-500 text-sm">참가 현황 확인</span>
            </div>
            <p className="text-zinc-300">현재 모집 중인 파티의 참가 현황을 확인합니다.</p>
          </div>
        </div>
      </section>

      {/* 기타 명령어 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-zinc-400 mb-4">기타 명령어</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-zinc-800 rounded-lg p-4">
            <code className="bg-zinc-700 px-2 py-1 rounded text-zinc-300 font-mono">/핑</code>
            <p className="text-zinc-400 text-sm mt-2">봇 응답 속도 테스트</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <code className="bg-zinc-700 px-2 py-1 rounded text-zinc-300 font-mono">/사이트</code>
            <p className="text-zinc-400 text-sm mt-2">사계 레기온 사이트 링크</p>
          </div>
        </div>
      </section>

      {/* 자주 묻는 질문 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">자주 묻는 질문</h3>

        <div className="space-y-3">
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-white font-medium mb-2">Q. 명령어가 작동하지 않아요</p>
            <p className="text-zinc-400 text-sm">
              디스코드를 새로고침하거나 재접속해보세요. 명령어 목록이 갱신되지 않았을 수 있습니다.
            </p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-white font-medium mb-2">Q. 인증했는데 닉네임이 안 바뀌어요</p>
            <p className="text-zinc-400 text-sm">
              봇의 역할이 내 역할보다 낮으면 닉네임 변경이 불가합니다. 운영진에게 문의해주세요.
            </p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-white font-medium mb-2">Q. 부캐 인증이 안 돼요</p>
            <p className="text-zinc-400 text-sm">
              본캐 인증이 먼저 되어 있어야 합니다. /내정보로 현재 인증 상태를 확인해보세요.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-zinc-800 rounded-lg p-6 text-center">
        <p className="text-zinc-300 leading-relaxed">
          사계봇 관련 문의는<br />
          <strong className="text-indigo-400">디스코드 #봇-건의</strong> 채널을 이용해주세요!
        </p>
      </div>
    </article>
  );
}
