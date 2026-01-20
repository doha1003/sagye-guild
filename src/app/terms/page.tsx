import Link from 'next/link';

export default function TermsPage() {
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

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">이용약관</h1>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. 서비스 소개</h2>
            <p className="text-zinc-400">
              본 사이트는 AION2 게임 내 &quot;사계 레기온&quot; 길드원들을 위한 비공식 커뮤니티 사이트입니다.
              엔씨소프트(NCSOFT) 또는 AION2 공식 서비스와는 무관한 팬 사이트입니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. 저작권 안내</h2>
            <ul className="space-y-2 text-zinc-400">
              <li className="pl-4 border-l-2 border-zinc-700">
                AION2 및 관련 이미지, 로고, 게임 내 정보의 저작권은 <strong className="text-white">엔씨소프트(NCSOFT)</strong>에 있습니다.
              </li>
              <li className="pl-4 border-l-2 border-zinc-700">
                본 사이트는 비영리 목적으로 운영되며, 저작권 침해 의도가 없습니다.
              </li>
              <li className="pl-4 border-l-2 border-zinc-700">
                문제가 될 경우 즉시 해당 콘텐츠를 삭제하겠습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. 면책 조항</h2>
            <ul className="space-y-2 text-zinc-400">
              <li className="pl-4 border-l-2 border-zinc-700">
                본 사이트에서 제공하는 정보는 참고용이며, 정확성을 보장하지 않습니다.
              </li>
              <li className="pl-4 border-l-2 border-zinc-700">
                게임 내 실제 정보와 다를 수 있으며, 이로 인한 손해에 대해 책임지지 않습니다.
              </li>
              <li className="pl-4 border-l-2 border-zinc-700">
                외부 링크(aion2tool.com, 인벤, 디시인사이드 등)의 콘텐츠에 대해서는 책임지지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. 개인정보</h2>
            <p className="text-zinc-400">
              본 사이트는 별도의 회원가입이나 로그인 기능이 없으며, 개인정보를 수집하지 않습니다.
              방문자 수 집계를 위해 익명의 방문 횟수만 기록됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. 문의</h2>
            <p className="text-zinc-400">
              사이트 관련 문의는 사계 레기온 디스코드를 통해 연락해 주세요.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            최종 수정일: 2026년 1월 20일
          </p>
          <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm mt-2 inline-block">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
