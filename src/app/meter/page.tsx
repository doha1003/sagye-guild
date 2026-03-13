'use client';

import Link from 'next/link';
import Image from 'next/image';
import AlertBar from '../components/AlertBar';

const DOWNLOAD_URL = 'https://github.com/doha1003/sagye-guild/releases/download/meter-v4.0/Aion2Meter_Win_v4.0.zip';

export default function MeterPage() {
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
            <Link href="/notice" className="text-zinc-400 hover:text-white">공지</Link>
          </nav>
        </div>
      </header>
      <AlertBar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">DPS 미터기 설치</h1>
        <p className="text-zinc-500 mb-8">AION2 딜량 측정 프로그램 설치 및 사용법</p>

        {/* 경고 배너 */}
        <div className="bg-red-950/50 border border-red-800/50 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-xl flex-shrink-0">&#9888;</span>
            <div>
              <h3 className="text-red-400 font-bold mb-1">주의사항</h3>
              <p className="text-red-300/80 text-sm leading-relaxed">
                DPS 미터기는 <strong>비공식 외부 프로그램</strong>입니다.
                사용 시 게임 이용약관 위반으로 <strong>계정 정지</strong>될 수 있습니다.
                본인의 판단 하에 사용해주시며, 발생하는 모든 불이익은 사용자 본인에게 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 다운로드 버튼 */}
        <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 mb-10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Aion2 DPS Meter v4.0</h2>
          <p className="text-zinc-400 text-sm mb-4">미터기 + 오버레이 통합 패키지 (약 74MB)</p>
          <a
            href={DOWNLOAD_URL}
            className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            다운로드
          </a>
          <p className="text-zinc-500 text-xs mt-3">Windows 전용 / Java 17 + Npcap 자동 설치 포함</p>
        </div>

        {/* 설치 가이드 */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-amber-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              압축 풀기
            </h2>
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p>다운로드한 <strong className="text-white">Aion2Meter_Win_v4.0.zip</strong> 파일을 원하는 위치에 압축 해제합니다.</p>
              <p>압축을 풀면 아래와 같이 파일들이 보입니다.</p>
              <div className="rounded-lg overflow-hidden border border-zinc-700">
                <Image
                  src="/images/meter/step1_folder.png"
                  alt="압축 해제된 폴더 내용"
                  width={800}
                  height={450}
                  className="w-full"
                />
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <p className="text-zinc-400 text-xs mb-3">실행 파일 설명:</p>
                <div className="space-y-3 text-xs">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-amber-400 font-bold mb-1">4_meter+overlay.bat (권장)</p>
                    <p className="text-zinc-400">미터기 + 오버레이를 한번에 실행합니다. 처음 사용하시는 분은 이걸 쓰세요.</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-zinc-200 font-bold mb-1">1_미터기_실행.bat</p>
                    <p className="text-zinc-400">미터기만 실행합니다. 오버레이 없이 <strong className="text-white">브라우저(localhost:8888)</strong>로만 확인할 때 사용합니다.</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <p className="text-zinc-200 font-bold mb-1">3_overlay.bat</p>
                    <p className="text-zinc-400">오버레이만 따로 실행합니다. <strong className="text-white">반드시 1_미터기가 먼저 실행 중</strong>이어야 합니다. 미터기 없이 단독으로 사용할 수 없습니다.</p>
                  </div>
                </div>
                <div className="mt-3 bg-blue-950/30 border border-blue-800/30 rounded p-2.5">
                  <p className="text-blue-300 text-xs">
                    <strong>조합 예시:</strong> 1번만 실행 → 브라우저로 확인 / 1번 + 3번 따로 실행 → 미터기 + 오버레이 / 4번 실행 → 한번에 둘 다
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-amber-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              관리자 권한으로 실행
            </h2>
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p><strong className="text-white">4_meter+overlay.bat</strong> 파일을 <strong className="text-amber-400">마우스 오른쪽 버튼</strong>으로 클릭합니다.</p>
              <p>메뉴에서 <strong className="text-amber-400">&quot;관리자 권한으로 실행&quot;</strong>을 선택합니다.</p>
              <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-zinc-700 rounded flex items-center justify-center text-xs">BAT</div>
                  <div>
                    <p className="text-white font-medium">4_meter+overlay.bat</p>
                    <p className="text-zinc-500 text-xs">Windows 배치 파일</p>
                  </div>
                </div>
                <div className="bg-zinc-800 rounded p-3 text-xs space-y-1.5 border border-zinc-700">
                  <p className="text-zinc-400">열기</p>
                  <p className="text-zinc-400">편집</p>
                  <p className="text-amber-400 font-bold bg-amber-400/10 -mx-2 px-2 py-0.5 rounded">&#9655; 관리자 권한으로 실행</p>
                  <p className="text-zinc-400">속성</p>
                </div>
              </div>
              <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-4">
                <p className="text-blue-300 text-xs">
                  <strong>왜 관리자 권한이 필요한가요?</strong><br />
                  네트워크 패킷을 읽기 위해 Npcap이 필요하며, 이를 위해 관리자 권한이 필요합니다.
                  &quot;이 앱이 디바이스를 변경할 수 있도록 허용하시겠습니까?&quot; 라는 창이 뜨면 <strong>&quot;예&quot;</strong>를 눌러주세요.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-amber-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              자동 설치 (최초 1회)
            </h2>
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p>처음 실행하면 필요한 프로그램을 자동으로 설치합니다. <strong className="text-white">인터넷 연결이 필요합니다.</strong></p>

              <div className="space-y-3">
                <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                  <p className="text-amber-400 font-bold text-xs mb-2">[1/3] Npcap 설치</p>
                  <p className="text-zinc-400 text-xs">네트워크 패킷 캡처 프로그램입니다. 설치 창이 뜨면 기본 설정으로 &quot;Install&quot;을 눌러주세요.</p>
                  <div className="mt-3 bg-yellow-950/30 border border-yellow-800/30 rounded p-3">
                    <p className="text-yellow-300 text-xs">
                      <strong>중요!</strong> 설치 옵션에서 <strong>&quot;Install Npcap in WinPcap API-compatible Mode&quot;</strong> 체크박스가 반드시 체크되어 있어야 합니다. (기본값으로 체크되어 있음)
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                  <p className="text-amber-400 font-bold text-xs mb-2">[2/3] Java (JRE) 설치</p>
                  <p className="text-zinc-400 text-xs">미터기 실행에 필요한 Java를 자동으로 다운로드합니다. 별도 조작 없이 자동 진행됩니다.</p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                  <p className="text-amber-400 font-bold text-xs mb-2">[3/3] 오버레이 설치</p>
                  <p className="text-zinc-400 text-xs">게임 화면 위에 표시되는 오버레이를 설치합니다. 자동 진행됩니다.</p>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 font-mono text-xs">
                <p className="text-green-400">==================================================</p>
                <p className="text-white">       AION 2 DPS METER + Overlay (Auto Setup)</p>
                <p className="text-green-400">==================================================</p>
                <p className="text-zinc-400 mt-2">[1/3] Npcap...</p>
                <p className="text-green-400">[OK] Npcap installed.</p>
                <p className="text-zinc-400">[2/3] JRE...</p>
                <p className="text-green-400">[OK] JRE ready.</p>
                <p className="text-zinc-400">[3/3] Overlay...</p>
                <p className="text-green-400">[OK] Overlay ready.</p>
              </div>
              <p className="text-zinc-500 text-xs">위 화면처럼 모두 [OK]가 뜨면 설치 완료입니다.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-amber-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              사용하기
            </h2>
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p>설치가 완료되면 미터기와 오버레이가 자동으로 실행됩니다.</p>

              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <p className="text-amber-400 font-bold text-xs mb-3">브라우저에서 보기</p>
                <p className="text-zinc-400 text-xs mb-3">
                  웹 브라우저에서 <strong className="text-white">http://localhost:8888</strong>로 접속하면 상세한 DPS 정보를 볼 수 있습니다.
                </p>
                <div className="rounded-lg overflow-hidden border border-zinc-700">
                  <Image
                    src="/images/meter/step2_browser.png"
                    alt="브라우저에서 본 DPS 미터"
                    width={800}
                    height={450}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <p className="text-amber-400 font-bold text-xs mb-3">게임 오버레이</p>
                <p className="text-zinc-400 text-xs mb-3">
                  게임 화면 위에 DPS 미터가 자동으로 표시됩니다. 아래 단축키로 조절할 수 있습니다.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'Ctrl+Alt+Up/Down', desc: '투명도 조절' },
                    { key: 'Ctrl+Alt+P', desc: '마우스 클릭 통과' },
                    { key: 'Ctrl+Alt+L', desc: '위치 잠금' },
                    { key: 'Ctrl+Alt+Q', desc: '오버레이 종료' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2 bg-zinc-800 rounded p-2">
                      <kbd className="bg-zinc-700 text-amber-400 px-2 py-0.5 rounded text-xs font-mono flex-shrink-0">{item.key}</kbd>
                      <span className="text-zinc-300 text-xs">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <p className="text-amber-400 font-bold text-xs mb-2">사용 방법</p>
                <ol className="space-y-2 text-xs text-zinc-400 list-decimal list-inside">
                  <li>미터기를 실행한 상태에서 <strong className="text-white">AION2 게임에 접속</strong>합니다.</li>
                  <li>게임에서 <strong className="text-white">몬스터나 보스를 공격</strong>하면 자동으로 DPS가 측정됩니다.</li>
                  <li>오버레이에 실시간 DPS, 기여도, 직업별 색상이 표시됩니다.</li>
                  <li>전투가 끝나면 마지막 데이터가 유지되어 결과를 확인할 수 있습니다.</li>
                  <li>초기화하려면 오버레이의 <strong className="text-red-400">R 버튼</strong>을 누르세요.</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-amber-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              다음부터 실행할 때
            </h2>
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p>최초 설치 이후에는 <strong className="text-white">4_meter+overlay.bat</strong>만 실행하면 됩니다.</p>
              <p>Npcap, Java, 오버레이가 이미 설치되어 있으면 자동으로 건너뜁니다.</p>
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 font-mono text-xs">
                <p className="text-green-400">==================================================</p>
                <p className="text-white">       AION 2 DPS METER + Overlay</p>
                <p className="text-green-400">==================================================</p>
                <p className="text-zinc-400 mt-2">   http://192.168.x.x:8888</p>
                <p className="text-zinc-400 mt-1">   [Overlay Hotkeys]</p>
                <p className="text-zinc-400">   - Ctrl+Alt+Up/Down : Opacity</p>
                <p className="text-zinc-400">   - Ctrl+Alt+P       : Click-through</p>
                <p className="text-zinc-400">   - Ctrl+Alt+L       : Lock position</p>
                <p className="text-zinc-400">   - Ctrl+Alt+Q       : Quit overlay</p>
              </div>
              <p className="text-zinc-500 text-xs">이 화면이 뜨면 정상 작동 중입니다. 터미널(검은 창)을 닫으면 미터기도 종료됩니다.</p>
            </div>
          </section>
        </div>

        {/* FAQ */}
        <div className="mt-16 pt-8 border-t border-zinc-800/50">
          <h2 className="text-xl font-bold text-white mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: '닉네임이 "User_12345" 같이 나와요',
                a: '게임 접속 후 처음 측정할 때 닉네임 패킷이 아직 수신되지 않아 임시 ID가 표시될 수 있습니다. 전투를 계속하면 정상적으로 닉네임이 표시됩니다.',
              },
              {
                q: '미터기가 안 켜져요',
                a: '반드시 "관리자 권한으로 실행"해야 합니다. 일반 더블클릭으로는 Npcap 권한이 없어 패킷을 읽을 수 없습니다.',
              },
              {
                q: 'DPS가 0으로 나와요',
                a: '게임이 실행 중이고 실제로 공격 중인지 확인해주세요. 미터기가 게임 패킷을 감지해야 측정이 시작됩니다.',
              },
              {
                q: '오버레이만 따로 쓸 수 있나요?',
                a: '3_overlay.bat은 오버레이만 실행하는 파일입니다. 반드시 1_미터기_실행.bat을 먼저 실행해둔 상태에서 사용해야 합니다. 미터기 없이 오버레이만 단독으로 사용할 수 없습니다.',
              },
              {
                q: '정지되면 어떡하나요?',
                a: '현재까지 DPS 미터기 사용으로 대규모 정지 사례는 알려지지 않았으나, 외부 프로그램 사용은 항상 위험이 있습니다. 자기 책임 하에 사용해주세요.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <p className="text-white font-medium text-sm mb-2">Q. {item.q}</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 경고 */}
        <div className="mt-10 bg-red-950/30 border border-red-800/30 rounded-xl p-5 text-center">
          <p className="text-red-400/80 text-xs leading-relaxed">
            본 프로그램은 비공식 외부 프로그램이며, 사용에 따른 모든 책임은 사용자 본인에게 있습니다.<br />
            게임사의 정책 변경에 따라 언제든 사용이 제한될 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  );
}
