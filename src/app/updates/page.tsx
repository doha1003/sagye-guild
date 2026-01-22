'use client';

import Link from 'next/link';

interface Update {
  version?: string;
  title: string;
  description?: string;
  features: string[];
}

interface UpdateLog {
  date: string;
  updates: Update[];
}

const updateLogs: UpdateLog[] = [
  {
    date: '2026-01-22',
    updates: [
      {
        version: 'v2.6',
        title: '필드보스 타이머 개선',
        description: '자동 반복 버그 수정 + 점검 리셋 기능',
        features: [
          '타이머 자동 반복 버그 수정 (30초 후 재시작 정상 작동)',
          '점검 리셋 기능 추가 (점검 종료 시간 입력 → 모든 타이머 리셋)',
          '점검 후 보스 리젠 시 일괄 타이머 재설정 가능',
        ],
      },
      {
        title: '유튜브 라이브 감지 개선',
        features: [
          '라이브 방송 감지 주기 단축 (1시간 → 1분 캐시)',
          '클라이언트 체크 주기 개선 (55분마다 → 5분마다)',
          '라이브 시작 시 빠른 자동 전환',
        ],
      },
    ],
  },
  {
    date: '2026-01-20',
    updates: [
      {
        version: 'v2.5',
        title: 'PWA 지원 추가',
        description: '앱처럼 설치 가능',
        features: [
          '홈화면에 앱 아이콘 설치 가능 (Android/iOS)',
          '사계절 컨셉 아이콘 디자인',
          '오프라인 캐싱 지원',
          '전체화면 앱 모드',
        ],
      },
      {
        title: 'AION2 공식 유튜브 연동',
        features: [
          'YouTube Data API 연동',
          'AION2 공식 채널 라이브 방송 자동 감지',
          '라이브 없을 때 최신 영상 표시',
          '라이브 시작 시 자동 전환',
          '매시 55분 라이브 상태 자동 확인',
        ],
      },
      {
        title: '부캐 관리 기능',
        features: [
          '부캐여부 칼럼 추가 (본캐 닉네임 표시)',
          '부캐 자동 정보 상속 (년생/디스코드/카카오톡)',
          '레기온원 페이지에서 부캐 표시 및 본캐 연결',
        ],
      },
      {
        title: '일정 페이지 UI 개선',
        features: [
          '탭 구조 변경: 일일/주간 (합침), 필드보스, 매뉴얼',
          '상단에 알림 설정 상태 + 활성 타이머 개수 표시',
          '매뉴얼 탭: 상세 사용방법 가이드 분리',
        ],
      },
      {
        title: '필드보스 타이머 대폭 개선',
        features: [
          '타이머 만료 시 30초 후 자동 재시작',
          '시간 보정 버튼 추가 (±1분, ±5분)',
          '직접 시간 입력 (분 단위, HH:MM 형식)',
          '1분 전 알림 + 비프음 3번',
          '리젠 시 비프음 3번',
        ],
      },
    ],
  },
  {
    date: '2026-01-19',
    updates: [
      {
        version: 'v2.0',
        title: 'Firebase 실시간 타이머 공유',
        description: '길드원 모두 타이머 공유',
        features: [
          'Firebase Realtime Database 연동',
          '보스 타이머 실시간 공유 (누군가 등록하면 모두에게 표시)',
          '타이머 중복 등록 방지 (30초)',
        ],
      },
      {
        title: '알림바 시스템 개선',
        features: [
          '스크롤 알림바로 변경 (마퀴 효과)',
          '모든 페이지 헤더 아래 추가',
          '알림음 기능 추가',
          '알림 기본값 ON으로 변경',
        ],
      },
      {
        title: '개인 알림 설정',
        features: [
          '슈고 페스타 알림 (매시 15분, 45분)',
          '시공의 균열 알림 (2,5,8,11,14,17,20,23시)',
          '검은 구름 무역단 알림',
          '나흐마 알림 (토/일 20:00)',
          '알림음 ON/OFF 설정',
        ],
      },
      {
        title: '필드보스 지도 추가',
        features: [
          '마족/천족/어비스 진영별 지도 이미지',
          '인벤 출처 지도 이미지 연동',
          '어비스 보스 지도 추가',
          '이미지 프록시 최적화 (Edge Runtime)',
        ],
      },
      {
        title: '주간 숙제 상세 정보',
        features: [
          '물질변환 오드 에너지 정보',
          '산들바람 상회 특수 품목',
          '성역 루드라 상세 정보',
          '주간 오드 에너지 총합 계산',
        ],
      },
      {
        title: '시즌2 페이지',
        features: [
          '시즌2 전용 페이지 (/season2)',
          '천칭 아르카나, 보스명, 균열 지대 정보',
          '펫작 수치 50% 하향 안내',
        ],
      },
    ],
  },
  {
    date: '2026-01-06',
    updates: [
      {
        version: 'v1.5',
        title: 'UI 대폭 개선',
        features: [
          '전체 UI 리디자인',
          '접근성 개선',
          '3컬럼 전투정보 (최고점수/현재점수/전투력)',
          '메인페이지 레이아웃 변경',
        ],
      },
      {
        title: '일정표 페이지 추가',
        features: [
          '일일/주간 컨텐츠 정보',
          '필드보스 시간표',
          '루드라 상세 정보',
        ],
      },
      {
        title: '외형/펫 DB 페이지',
        features: [
          '외형 DB 페이지 (/tips/appearance)',
          '펫 DB 페이지 (/tips/pets)',
          '펫 전체 데이터 업데이트',
        ],
      },
      {
        title: '기타 개선',
        features: [
          '히든큐브 바로가기 추가',
          '인벤/디시 외부 링크 추가',
          '공지사항 페이지 분리',
          '년생 표시 수정 (00년생, 01년생)',
        ],
      },
    ],
  },
  {
    date: '2026-01-05',
    updates: [
      {
        version: 'v1.0',
        title: '길드원 관리 페이지 구현',
        features: [
          '레기온원 목록 페이지',
          '직업별 필터링',
          'aion2tool 연동',
          '구글 시트 연동',
        ],
      },
    ],
  },
  {
    date: '2025-12-30',
    updates: [
      {
        version: 'v0.1',
        title: '프로젝트 시작',
        features: [
          'Next.js 14 프로젝트 생성',
          'Vercel 배포 설정',
          '기본 레이아웃 구성',
        ],
      },
    ],
  },
];

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">업데이트 내역</h1>
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">사계 레기온 사이트 변경 기록</p>
        </div>

        <div className="space-y-8">
          {updateLogs.map((log, logIdx) => (
            <div key={logIdx} className="relative">
              {/* 날짜 헤더 */}
              <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur py-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <h2 className="text-lg font-bold text-amber-400">{log.date}</h2>
                </div>
              </div>

              {/* 업데이트 목록 */}
              <div className="ml-6 border-l-2 border-zinc-700 pl-6 space-y-6">
                {log.updates.map((update, updateIdx) => (
                  <div
                    key={updateIdx}
                    className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-4 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-white font-bold">{update.title}</h3>
                      {update.version && (
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                          {update.version}
                        </span>
                      )}
                    </div>
                    {update.description && (
                      <p className="text-zinc-400 text-sm mb-3">{update.description}</p>
                    )}
                    <ul className="space-y-1">
                      {update.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="text-zinc-300 text-sm flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-12 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 text-center">
          <p className="text-zinc-400 text-sm">
            문의 및 건의사항은 디스코드로 연락해주세요
          </p>
        </div>
      </main>

      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-zinc-500 text-sm">
          <p>사계 레기온 · AION2 지켈 서버 (마족)</p>
          <p className="text-xs text-zinc-600 mt-2">
            <Link href="/" className="hover:text-zinc-400">메인으로</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
