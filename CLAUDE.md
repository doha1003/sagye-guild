# 사계 길드 사이트 프로젝트

## 프로젝트 개요
- **목적**: 아이온2 루드라 서버 사계 길드 관리 사이트
- **기능**: 길드원 관리, 일정표, 파티 매칭
- **서버**: 루드라 (마족, serverId: 2011)

## 현재 상태: 기본 배포 완료

### 완료된 작업
- [x] Next.js 14 프로젝트 생성
- [x] 기본 랜딩 페이지 구현
- [x] GitHub 저장소 생성 (doha1003/sagye-guild)
- [x] Vercel 배포 완료

### 접속 URL
- **Vercel**: https://sagye-guild.vercel.app
- **GitHub**: https://github.com/doha1003/sagye-guild

### 도메인 연결 (미완료)
- doha.kr은 이미 다른 서비스에 연결됨
- 서브도메인 sagye.doha.kr 사용 예정
- DNS 설정 필요: CNAME → cname.vercel-dns.com

---

## 기술 스택
- **프론트엔드**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **호스팅**: Vercel (무료)
- **DB**: Supabase (예정)
- **API**: PlayNC API + aion2tool.com API 활용

---

## 발견한 API 정보

### PlayNC 공식 API (aion2.plaync.com)
```
GET /api/gameinfo/servers?lang=ko          # 서버 목록 (42개)
GET /api/gameinfo/classes?lang=ko          # 직업 목록 (8개)
GET /ko-kr/api/search/aion2/search/v2/character?keyword=검색어&race=1&serverId=&page=1&size=30
                                           # 캐릭터 검색
GET /api/ranking/list?lang=ko&rankingContentsType=1&rankingType=0&serverId=1001
                                           # 랭킹 조회
```

### aion2tool.com API
```
GET /api/character/search?nickname=닉네임&server=서버&race=종족
                                           # 캐릭터 상세 (장비, 스탯)
GET /api/character/ranking?nickname=닉네임&server=서버&race=종족
                                           # 캐릭터 순위
GET /api/character/combat-score-rankings   # 전투력 순위
GET /api/character/combat-stats-percentiles # 스탯 백분위
GET /api/stats/skills?job=직업명           # 직업별 스킬 통계
GET /api/server-stats                      # 서버 통계
```

---

## 다음 작업 (TODO)

### Phase 2: 핵심 기능
- [ ] API 프록시 구현 (CORS 우회)
  - `/api/plaync/[...path]` - PlayNC API 프록시
  - `/api/aion2tool/[...path]` - aion2tool API 프록시
- [ ] 길드원 등록/조회 페이지 (`/members`)
- [ ] 캐릭터 정보 자동 갱신
- [ ] 역할별 필터링 (탱커/딜러/힐러)

### Phase 3: 일정 시스템
- [ ] Supabase 연결 및 DB 스키마 생성
- [ ] 일정 생성/조회 (`/schedule`)
- [ ] 참여 신청 기능

### Phase 4: 파티 매칭
- [ ] 파티 생성 (`/party`)
- [ ] 전투력 기반 추천

---

## 프로젝트 구조

```
C:/Users/alchemist/sagye-guild/
├── src/
│   └── app/
│       ├── layout.tsx      # 루트 레이아웃
│       ├── page.tsx        # 메인 페이지
│       ├── globals.css     # 전역 스타일
│       ├── members/        # (예정) 길드원 관리
│       ├── schedule/       # (예정) 일정표
│       └── party/          # (예정) 파티 매칭
├── .vercel/                # Vercel 설정
└── package.json
```

---

## 관련 문서
- `C:/Users/alchemist/aion2-site/API-DOCS.md` - PlayNC API 문서
- `C:/Users/alchemist/aion2-site/AION2TOOL-API.md` - aion2tool API 문서
- `C:/Users/alchemist/aion2-site/PROJECT-DESIGN.md` - 상세 설계서
- `C:/Users/alchemist/aion2-site/PLAN.md` - 기획서

---

## 계정 정보
- **GitHub**: doha1003
- **Vercel**: doha1003 (dohas-projects-4691afdc)
- **Supabase**: (연결 예정)

---

## 이어서 작업할 때
1. 이 파일 읽기
2. 현재 상태 확인: `https://sagye-guild.vercel.app`
3. TODO 항목 순서대로 진행

---

*마지막 업데이트: 2025-12-30*
