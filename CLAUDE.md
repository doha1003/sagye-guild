# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요
- **목적**: 아이온2 지켈 서버 사계 레기온 관리 사이트
- **기능**: 레기온원 관리, 일정표, 파티 매칭
- **서버**: 지켈 (마족)

## 기술 스택
- **프레임워크**: Next.js 14 (App Router) + TypeScript
- **스타일링**: Tailwind CSS
- **호스팅**: Vercel
- **데이터**: Google Sheets 연동 + aion2tool.com API

## 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 린트
npm run lint
```

## 프로젝트 구조

```
src/app/
├── api/
│   ├── plaync/[...path]/   # PlayNC API 프록시
│   ├── aion2tool/[...path]/ # aion2tool API 프록시
│   ├── sheets/             # 구글 시트 연동
│   └── character/[nickname]/ # 캐릭터 실시간 데이터
├── members/                # 레기온원 관리 페이지
├── schedule/               # 일정표 (예정)
├── party/                  # 파티 매칭 (예정)
├── types.ts               # 공통 타입
└── page.tsx               # 메인 페이지
```

## API 정보

### PlayNC 공식 API (aion2.plaync.com)
- `/api/gameinfo/servers` - 서버 목록
- `/api/gameinfo/classes` - 직업 목록
- `/ko-kr/api/search/aion2/search/v2/character` - 캐릭터 검색

### aion2tool.com API
- `/api/character/search` - 캐릭터 상세 (장비, 스탯, 전투력)
- `/api/character/ranking` - 순위 정보
- `/api/character/combat-score-rankings` - 전투력 순위
- `/api/character/combat-stats-percentiles` - 스탯별 백분위

## 외부 연동

### 구글 시트 (레기온원 데이터)
- Sheet ID: `1wbEUQNy9ShybtKkZRlUAsr-CcyY5LDRYOxWL6a0dMTo`
- 컬럼 구조:
  - A: 계급
  - B: 캐릭터명
  - C: 직업
  - D: 나이 (년생)
  - E: 디스코드
  - F: 카카오톡
  - G: 최고 전투점수
  - H: 현재 전투점수
  - I: 전투력
  - J: 부캐여부 (본캐 닉네임, 비어있으면 본캐)
  - K: 수집시간
- 부캐 자동 상속: 부캐의 경우 본캐 닉네임을 J열에 입력하면 나이/디스코드/카카오톡이 본캐에서 자동 상속됨
- 30초마다 자동 갱신

## 접속 URL
- **Vercel**: https://sagye-guild.vercel.app
- **GitHub**: https://github.com/doha1003/sagye-guild

## 관련 리소스
- `C:/Users/alchemist/aion2-site/` - API 분석 문서 및 테스트 스크립트
