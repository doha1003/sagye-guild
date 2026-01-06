'use client';

import { useState } from 'react';
import Link from 'next/link';

type Tribe = 'all' | 'intellect' | 'wild' | 'nature' | 'transform';

interface PetInfo {
  name: string;
  tribe: 'intellect' | 'wild' | 'nature' | 'transform';
  locations: string;
}

interface TribeStats {
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  levelEffects: string[];
}

const TRIBE_INFO: Record<Tribe, TribeStats> = {
  all: { name: '전체', color: 'text-white', bgColor: 'bg-zinc-600', icon: '🐾', levelEffects: [] },
  intellect: {
    name: '지성',
    color: 'text-blue-400',
    bgColor: 'bg-blue-600/20',
    icon: '🧠',
    levelEffects: [
      'LV 1: 생명력 10',
      'LV 2: 생명력 20, 치명타 2',
      'LV 3: 생명력 30, 치명타 4, 위력 1',
      'LV 4: 생명력 50, 치명타 8, 위력 2, 지식 1',
      'LV 5: 생명력 60, 치명타 10, 위력 2, 지식 2, 지성족 피해 증폭 0.1%',
    ],
  },
  wild: {
    name: '야성',
    color: 'text-red-400',
    bgColor: 'bg-red-600/20',
    icon: '🐺',
    levelEffects: [
      'LV 1: 탑승물 지상 이동 속도 1',
      'LV 2: 탑승물 지상 이동 속도 2, 추가 명중 2',
      'LV 3: 탑승물 지상 이동 속도 3, 추가 명중 4, 민첩 1',
      'LV 4: 탑승물 지상 이동 속도 5, 추가 명중 8, 민첩 2, 지식 1',
      'LV 5: 탑승물 지상 이동 속도 6, 추가 명중 10, 민첩 2, 지식 2, 야성족 피해 증폭 0.1%',
    ],
  },
  nature: {
    name: '자연',
    color: 'text-green-400',
    bgColor: 'bg-green-600/20',
    icon: '🌿',
    levelEffects: [
      'LV 1: 정신력 5',
      'LV 2: 정신력 10, 치명타 저항 2',
      'LV 3: 정신력 15, 치명타 저항 4, 정확 1',
      'LV 4: 정신력 25, 치명타 저항 8, 정확 2, 의지 1',
      'LV 5: 정신력 30, 치명타 저항 10, 정확 2, 의지 2, 자연족 피해 증폭 0.1%',
    ],
  },
  transform: {
    name: '변형',
    color: 'text-purple-400',
    bgColor: 'bg-purple-600/20',
    icon: '🔮',
    levelEffects: [
      'LV 1: 탑승물 질주 행동력 소모량 감소율 0.1%',
      'LV 2: 탑승물 질주 행동력 소모량 감소율 0.2%, 추가 회피 2',
      'LV 3: 탑승물 질주 행동력 소모량 감소율 0.3%, 추가 회피 4, 체력 1',
      'LV 4: 탑승물 질주 행동력 소모량 감소율 0.5%, 추가 회피 8, 체력 2, 의지 1',
      'LV 5: 탑승물 질주 행동력 소모량 감소율 0.6%, 추가 회피 10, 체력 2, 의지 2, 변형족 피해 증폭 0.1%',
    ],
  },
};

// 펫 데이터
const PETS: PetInfo[] = [
  // 지성족
  { name: '감시병기 크나쉬', tribe: 'intellect', locations: '' },
  { name: '개조된 루필리니', tribe: 'intellect', locations: '[천족 2시] 쿠라카 언덕길 - 루필리니 실험체\n[천족 7시 섬] 영원의 섬 - 영원의 루필리니\n[마족 7시 섬] 불멸의 섬 - 루필리니' },
  { name: '광폭한 페르크', tribe: 'intellect', locations: '' },
  { name: '나가 정예 사제', tribe: 'intellect', locations: '[어비스 하층 10시] 유황 나무 섬 - 어비스 나가 암흑 법사\n[드라웁니르] 나가 사제' },
  { name: '나가란트 수호전사', tribe: 'intellect', locations: '[어비스 하층 10시] 유황 나무 섬 - 어비스 나가란트 투사\n[어비스 하층 10시] 유황 나무 섬 - 어비스 나가란트 전사\n[드라웁니르] 나가란트 수호전사' },
  { name: '뉴트', tribe: 'intellect', locations: '[천족 중앙 9시] 파괴된 어비스 관문 - 배회하는 뉴트\n[어비스 하층 10시] 유황 나무 섬 - 어비스 뉴트 변이체\n[드라웁니르] 뉴트 청소부' },
  { name: '뉴트 정찰병', tribe: 'intellect', locations: '[마족 중앙 2시] 정화의 숲 - 잠식된 뉴트\n[어비스 하층 1시] 검은 파편 지대 - 어비스 뉴트 변종\n[어비스 하층 7시] 파괴된 잔해 - 어비스 뉴트' },
  { name: '드라칸 감시자', tribe: 'intellect', locations: '[천족 1시] 드라나 가공구역 - 가공지 드라칸 정찰병\n[마족 1시] 드라낙투스 - 드라칸 관리자\n[마족 3시] 그리바데 구릉지 동부 - 드라칸 초계대 감시자' },
  { name: '드라쿠니 약초꾼', tribe: 'intellect', locations: '[천족 1시] 드라나 가공구역 - 드라쿠니 가공 노역꾼\n[마족 1시 섬] 정령의 섬 - 독혈 채집꾼' },
  { name: '드라토나', tribe: 'intellect', locations: '[천족 12시] 붉은 숲 - 붉은 숲 드라토나\n[마족 9시] 성소 감시초소 - 드라토나 잡역꾼\n[마족 중앙 9시] 트라네인 구릉지 - 드라토나 지원병\n[마족 1시] 드라낙투스 - 드라토나' },
  { name: '드라토나 잡역꾼', tribe: 'intellect', locations: '' },
  { name: '만두리 싸움꾼', tribe: 'intellect', locations: '[천족 1시 섬] 홍옥의 섬 - 홍옥의 만두리 싸움꾼\n[마족 5시] 검은발톱 부락 - 검은발톱 만두리 전투병' },
  { name: '만두리 투석꾼', tribe: 'intellect', locations: '[천족 2시] 쿠라카 언덕길 - 언덕 만두리\n[천족 1시 섬] 홍옥의 섬 - 홍옥의 만두리 투석꾼\n[마족 5시] 검은발톱 부락 - 검은발톱 만두리 정찰병' },
  { name: '몽환의 라크슈미', tribe: 'intellect', locations: '[드라웁니르] 몽환의 라크슈미 (영웅)' },
  { name: '무무 감독관', tribe: 'intellect', locations: '' },
  { name: '무무 일꾼', tribe: 'intellect', locations: '[마족 1시] 드라낙투스 - 무무 일꾼\n[마족 2시] 격전의 언덕 - 도망친 무무 일꾼' },
  { name: '무무 전사', tribe: 'intellect', locations: '[마족 1시] 드라낙투스 - 무무 파수꾼\n[마족 3시] 그리바데 구릉지 동부 - 그리바데 무무 전사\n[마족 5시] 검은발톱 부락 - 무무 감시병' },
  { name: '바르그 광전사', tribe: 'intellect', locations: '[마족 1시] 드라낙투스 - 바르그 전사\n[마족 5시] 검은발톱 부락 - 족장 직속부대 호위병' },
  { name: '부패된 루필리니', tribe: 'intellect', locations: '[천족 3시] 아르타미아 고원 동부 - 오염된 고원 루필리니\n[마족 중앙 11시] 드레드기온 추락지 - 루필리니\n[마족 2시] 격전의 언덕 - 부패된 루필리니\n[마족 2시] 바스펠트 폐허 - 사나운 루필리니\n[마족 중앙 9시] 트라네인 구릉지 - 부패된 루필리니\n[마족 중앙 6시] 모슬란 숲 - 부패된 루필리니' },
  { name: '비로타', tribe: 'intellect', locations: '[천족 8시] 톨바스 숲 동부 - 방랑 비로타\n[마족 11시] 이름없는 묘지 - 비로타 방랑자' },
  { name: '비로타 약초꾼', tribe: 'intellect', locations: '[마족 11시] 이름없는 묘지 - 비로타 방랑자' },
  { name: '아울라우 주술사', tribe: 'intellect', locations: '[천족 7시] 아울라우 부락 - 아울라우 수습 주술사\n[우루구구 협곡] 우루구구 마법사' },
  { name: '아울트로스의 분신', tribe: 'intellect', locations: '' },
  { name: '우루구구 투사', tribe: 'intellect', locations: '' },
  { name: '정예 뉴트', tribe: 'intellect', locations: '[천족 중앙 9시] 파괴된 어비스 관문 - 호위병 티간트 (영웅)' },
  { name: '정예 드라토나', tribe: 'intellect', locations: '' },
  { name: '정예 만두리 싸움꾼', tribe: 'intellect', locations: '[천족 중앙 8시] 순례자의 고갯길 - 배회하는 만두리 싸움꾼\n[마족 5시] 검은발톱 부락 - 검은발톱 만두리 싸움꾼' },
  { name: '중독된 슈라크 수레꾼', tribe: 'intellect', locations: '[마족 3시] 파프나이트 매장지 - 폭주한 슈라크 수레꾼' },
  { name: '케루비언', tribe: 'intellect', locations: '[천족 7시 섬] 영원의 섬 - 영원의 케루비언\n[마족 7시 섬] 불멸의 섬 - 케루비언' },
  { name: '케루비엘', tribe: 'intellect', locations: '[천족 7시 섬] 영원의 섬 - 영원의 케루비엘\n[마족 7시 섬] 불멸의 섬 - 케루비엘' },
  { name: '케루빔', tribe: 'intellect', locations: '[천족 7시 섬] 영원의 섬 - 영원의 케루빔\n[마족 7시 섬] 불멸의 섬 - 케루빔' },
  { name: '쿠루 감독관', tribe: 'intellect', locations: '[천족 7시 섬] 영원의 섬 - 영원의 쿠루 감독관\n[마족 7시 섬] 불멸의 섬 - 쿠루 감독관' },
  { name: '쿠루 일꾼', tribe: 'intellect', locations: '[천족 8시] 톨바스 숲 동부 - 톨바스 쿠루 일꾼\n[천족 7시] 추방자의 숲 - 매서운 쿠루 잡역꾼\n[천족 7시 섬] 영원의 섬 - 영원의 쿠루 일꾼\n[마족 7시 섬] 불멸의 섬 - 쿠루 일꾼' },
  { name: '쿠루 잡역꾼', tribe: 'intellect', locations: '[천족 8시] 톨바스 숲 동부 - 톨바스 쿠루 잡역꾼\n[천족 7시 섬] 영원의 섬 - 영원의 쿠루 잡역꾼\n[마족 7시 섬] 불멸의 섬 - 쿠루 잡역꾼' },
  { name: '크랄 강화 경계병', tribe: 'intellect', locations: '[천족 중앙 9시] 베르테론 요새 폐허 - 강화된 크랄 경계병' },
  { name: '크랄 강화 전투병', tribe: 'intellect', locations: '[천족 중앙 9시] 베르테론 요새 폐허 - 강화된 크랄 전투병' },
  { name: '크랄 노역꾼', tribe: 'intellect', locations: '[천족 중앙 9시] 베르테론 요새 폐허 - 크랄 무장병\n[천족 중앙 9시] 파괴된 어비스 관문 - 크랄 보초병\n[천족 12시] 붉은 숲 - 변이된 크랄 노역꾼' },
  { name: '크랄 전사', tribe: 'intellect', locations: '[천족 중앙 9시] 베르테론 요새 폐허 - 크랄 돌격병\n[천족 12시] 붉은 숲 - 개조 크랄 전사\n[천족 1시] 나히드 군단 요새 - 크랄 실험체' },
  { name: '크랄 주술병', tribe: 'intellect', locations: '[천족 중앙 9시] 베르테론 요새 폐허 - 크랄 주술병\n[천족 1시] 드라나 가공구역 - 재배지 크랄 치유병' },
  { name: '포식자 사라스와티', tribe: 'intellect', locations: '[드라웁니르] 포식자 사라스와티 (영웅)' },
  { name: '프렐 장막 관리자', tribe: 'intellect', locations: '' },

  // 야성족
  { name: '개조된 칼니프', tribe: 'wild', locations: '[천족 중앙 9시] 베르테론 요새 폐허 - 난폭한 칼니프, 조련된 칼니프, 정찰하는 칼니프\n[천족 중앙 9시] 파괴된 어비스 관문 - 예민한 칼니프\n[어비스 하층 1시] 검은 파편 지대 - 어비스 수색대 칼니프\n[어비스 하층 7시] 파괴된 잔해 - 어비스 칼니프' },
  { name: '거대 스파키', tribe: 'wild', locations: '[천족 10시] 칸타스 계곡 동부 - 빛나는 언덕 스파키\n[천족 6시] 아르타미아 고원 남부 - 고원 거대 오드 스파키\n[천족 7시] 아울라우 부락 - 아울라우 숲 거대 스파키\n[천족 7시] 추방자의 숲 - 아울라우 숲 거대 스파키\n[마족 중앙 2시] 정화의 숲 - 마른 가지 오드 스파키\n[마족 3시] 파프나이트 매장지 - 파프나이트 발광 스파키' },
  { name: '거미', tribe: 'wild', locations: '[어비스 하층 4시] 시엘의 날개 군도 - 어비스 오드 변이 벌레' },
  { name: '길들인 자이프', tribe: 'wild', locations: '[천족 중앙 8시] 순례자의 고갯길 - 약탈단 자이프' },
  { name: '길들인 칼니프', tribe: 'wild', locations: '[마족 중앙 3시] 우르툼헤임 - 칼날단 칼니프\n[마족 4시] 그리바데 구릉지 서부 - 길들여진 칼날단 야수' },
  { name: '동굴 박쥐', tribe: 'wild', locations: '[천족 12시] 붉은 숲 - 드라나 변이 박쥐' },
  { name: '드라칸 경비견', tribe: 'wild', locations: '[천족 1시] 나히드 군단 요새 - 드라칸 경비견, 나히드 드라칸 경비견\n[마족 1시] 드라낙투스 - 드라칸 경비견\n[마족 3시] 그리바데 구릉지 동부 - 드라칸 초계대 무장 야수\n[마족 6시] 라그타 요새 - 라그타 군단 경비견\n[어비스 하층 4시] 시엘의 날개 군도 - 어비스 드라칸 정찰야수' },
  { name: '드리톤', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 엘룬강 폭포 드리톤, 엘룬강 호수 드리톤\n[천족 8시] 톨바스 숲 동부 - 톨바스 숲 호수 드리톤\n[천족 중앙 8시] 순례자의 고갯길 - 고갯길 드리톤\n[천족 중앙 5시] 아르타미아 협곡 - 협곡 드리톤, 협곡 호수 드리톤\n[천족 2시] 쿠라카 언덕길 - 연못 드리톤\n[천족 10시] 칸타스 계곡 서부 - 칸타스 계곡 드리톤\n[천족 6시] 아르타미아 고원 남부 - 호수 드리톤\n[마족 중앙 9시] 트라네인 연못 - 트라네인 드리톤\n[마족 4시] 이둔의 호수 - 호수 드리톤' },
  { name: '레피스마', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 습지 레피스마\n[천족 8시] 톨바스 숲 남부 - 톨바스 레피스마\n[천족 7시 섬] 영원의 섬 - 영원의 레피스마\n[마족 4시] 그리바데 구릉지 서부 - 해안 레피스마\n[마족 7시 섬] 불멸의 섬 - 해안 레피스마\n[마족 중앙 9시] 트라네인 연못 - 레피스마\n[마족 4시] 이둔의 호수 - 레피스마\n[어비스 하층 4시] 시엘의 날개 군도 - 어비스 레피스마' },
  { name: '루필리니', tribe: 'wild', locations: '[천족 3시] 아르타미아 고원 동부 - 꼬리깃 루필리니\n[천족 3시] 오염된 성소 - 꼬리깃 루필리니' },
  { name: '류크록', tribe: 'wild', locations: '[마족 3시] 그리바데 구릉지 동부 - 수색대 류크록, 경비대 류크록\n[마족 5시] 검은발톱 부락 - 길들인 류크록' },
  { name: '마른 가지 거미', tribe: 'wild', locations: '[마족 11시] 이름없는 묘지 - 마른 가지 거미\n[마족 중앙 10시] 칼바리아 협곡 - 마른 가지 거미\n[마족 10시] 고요한 언덕 - 마른 가지 거미\n[마족 중앙 9시] 트라네인 구릉지 - 마른 가지 거미\n[마족 중앙 2시] 정화의 숲 - 마른 가지 거미\n[마족 2시] 격전의 언덕 - 마른 가지 거미\n[마족 2시] 바스펠트 폐허 - 마른 가지 거미\n[마족 4시] 그리바데 구릉지 남부 - 마른 가지 거미' },
  { name: '맹독충 스람', tribe: 'wild', locations: '' },
  { name: '무덤 쥐', tribe: 'wild', locations: '' },
  { name: '뮤타', tribe: 'wild', locations: '[천족 10시] 칸타스 계곡 서부 - 고지대 뮤타\n[천족 11시] 엘룬강 늪지 - 엘룬강 뮤타\n[천족 10시] 엘룬강 중류 - 엘린궁 뮤타\n[천족 8시] 톨바스 숲 동부 - 변종 뮤타\n[천족 중앙 8시] 순례자의 고갯길 - 고갯길 뮤타\n[천족 3시] 아르타미아 고원 동부 - 고원 뮤타\n[천족 중앙 6시] 아르타미아 고원 서부 - 고원 뮤타\n[마족 2시] 격전의 언덕 - 뮤타' },
  { name: '바실리스크', tribe: 'wild', locations: '[마족 중앙 6시] 모슬란 숲 - 검은재 바실리스크' },
  { name: '변이된 변종 오드 거미', tribe: 'wild', locations: '[천족 3시] 아르타미아 고원 동부 - 고원 오드 거미\n[천족 5시] 환영신의 정원 - 정원 거미\n[마족 1시 섬] 정령의 섬 - 불안정한 잿빛 거미' },
  { name: '변이된 시체 벌레', tribe: 'wild', locations: '[천족 중앙 8시] 순례자의 고갯길 - 고갯길 거미' },
  { name: '변이된 우르서스', tribe: 'wild', locations: '[마족 중앙 6시] 모슬란 숲 - 잿빛 우르서스' },
  { name: '변이충 발카', tribe: 'wild', locations: '' },
  { name: '변종 벌', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 검은 무늬 벌\n[천족 중앙 8시] 순례자의 고갯길 - 줄무늬 벌\n[마족 2시] 바스펠트 폐허 - 감은 갑주 벌\n[마족 10시] 고요한 언덕 - 검은 갑주 벌\n[마족 11시] 이름없는 묘지 - 검은 갑주 벌\n[마족 중앙 10시] 칼바리아 협곡 - 검은 갑주 벌\n[바크론의 공중섬] 거대한 꿀벌' },
  { name: '변종 스카마', tribe: 'wild', locations: '[천족 3시] 오염된 성소 - 노란 꼬리 스카마\n[어비스 하층 10시] 유황 나무 섬 - 어비스 유황 스카마' },
  { name: '변종 아르마돈', tribe: 'wild', locations: '[천족 10시] 칸타스 계곡 동부 - 빛나는 아르마돈\n[천족 6시] 아르타미아 고원 남부 - 고원 야생 아르마돈' },
  { name: '변종 오드 거미', tribe: 'wild', locations: '' },
  { name: '변종 자이프', tribe: 'wild', locations: '[천족 중앙 8시] 순례자의 고갯길 - 노란 갈기 자이프\n[마족 3시] 그리바데 구릉지 동부 - 금빛 자이프' },
  { name: '변종 캔서리드', tribe: 'wild', locations: '[천족 12시] 붉은 숲 - 드라나 변이 캔서리드\n[천족 1시 섬] 홍옥의 섬 - 홍옥의 이끼 게' },
  { name: '변종 코라돈', tribe: 'wild', locations: '[천족 5시] 환영신의 정원 - 정원 코라돈\n[천족 2시] 쿠라카 언덕길 - 언덕 코라돈\n[마족 2시] 바스펠트 폐허 - 코라돈\n[마족 중앙 9시] 트라네인 구릉지 - 코라돈' },
  { name: '변종 토그', tribe: 'wild', locations: '[천족 10시] 칸타스 계곡 동부 - 돌부더기 토그\n[천족 10시] 엘룬강 중류 - 배고픈 토그, 들판 토그\n[천족 6시] 아르타미아 고원 남부 - 야생 줄무늬 토그\n[천족 2시] 쿠라카 언덕길 - 언덕 토그\n[마족 2시] 격전의 언덕 - 토그\n[마족 중앙 2시] 정화의 숲 - 토그' },
  { name: '불안정한 거미', tribe: 'wild', locations: '[천족 7시] 추방자의 숲 - 아울라우 숲 오드거미\n[천족 1시 섬] 홍옥의 섬 - 홍옥의 거미\n[마족 중앙 2시] 정화의 숲 - 화염 바위 거미\n[마족 1시 섬] 정령의 섬 - 불안정한 독혈 거미\n[어비스 하층 4시] 시엘의 날개 군도 - 어비스 붉은 변이 벌레' },
  { name: '브락스', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 들판 브락스\n[천족 11시] 엘룬강 초지 - 굶주린 브락스\n[천족 중앙 6시] 아르타미아 고원 서부 - 온순한 고원 브락스\n[천족 3시] 아르타미아 고원 동부 - 온순한 고원 브락스\n[마족 2시] 바스펠트 폐허 - 브락스\n[마족 2시] 격전의 언덕 - 브락스\n[마족 중앙 9시] 트라네인 구릉지 - 브락스\n[마족 9시] 성소 감시초소 - 브락스' },
  { name: '비벨', tribe: 'wild', locations: '[천족 중앙 6시] 아르타미아 고원 서부 - 고원 비벨\n[마족 11시] 이름없는 묘지 - 흡혈 비벨' },
  { name: '새끼 오드 거미', tribe: 'wild', locations: '' },
  { name: '수컷 크레스틀리치', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 엘룬강 크레스틀리치 수컷\n[천족 6시] 아르타미아 고원 남부 - 고원 크레스틀리치 수컷' },
  { name: '스카마', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 호수 스카마\n[천족 12시] 붉은 숲 - 드라나 변이 스카마' },
  { name: '스콜피온', tribe: 'wild', locations: '[천족 3시] 오염된 성소 - 오염된 스콜피온\n[마족 3시] 파프나이트 매장지 - 광석 스콜피온' },
  { name: '스타터틀', tribe: 'wild', locations: '[천족 11시] 엘룬강 늪지 - 해안 스타터틀\n[천족 2시] 쿠라카 언덕길 - 연못 스타터틀\n[천족 7시 섬] 영원의 섬 - 영원의 스타터틀\n[마족 1시] 드라낙투스 - 해변 스타터틀\n[마족 4시] 그리바데 구릉지 서부 - 스타터틀\n[마족 7시 섬] 불멸의 섬 - 스타터틀' },
  { name: '스파키', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 야생 스파키\n[천족 11시] 엘룬강 초지 - 초지 스파키\n[천족 6시] 아르타미아 고원 남부 - 고원 오드 스파키\n[천족 중앙 6시] 아르타미아 고원 서부 - 고원 오드 스파키\n[천족 7시] 아울라우 부락 - 고지대 스파키\n[천족 7시] 추방자의 숲 - 아울라우 숲 스파키' },
  { name: '시체 벌레', tribe: 'wild', locations: '[마족 중앙 11시] 드레드기온 추락지 - 드라나 시체벌레' },
  { name: '아르마돈', tribe: 'wild', locations: '[마족 중앙 11시] 드레드기온 추락지 - 붉은 껍질 두더지\n[마족 중앙 6시] 모슬란 숲 - 메마른 아르마돈' },
  { name: '어린 레피스마', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 어린 습지 레피스마\n[천족 8시] 톨바스 숲 남부 - 톨바스 어린 레피스마\n[마족 4시] 그리바데 구릉지 남부 - 어린 레피스마\n[마족 중앙 9시] 트라네인 연못 - 어린 레피스마\n[마족 4시] 이둔의 호수 - 어린 레피스마\n[어비스 하층 4시] 시엘의 날개 군도 - 어비스 어린 레피스마' },
  { name: '어린 우르서스', tribe: 'wild', locations: '[천족 8시] 톨바스 숲 남부 - 새끼 뿔 우르서스\n[천족 2시] 쿠라카 언덕길 - 언덕 어린 우르서스\n[마족 2시] 격전의 언덕 - 어린 우르서스\n[마족 10시] 고요한 언덕 - 어린 우르서스' },
  { name: '어린 카이린', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 엘룬강 어린 카이린\n[마족 1시 섬] 정령의 섬 - 불안정한 어린 카이린\n[마족 9시] 성소 감시초소 - 어린 카이린\n[마족 중앙 9시] 트라네인 구릉지 - 어린 카이린\n[마족 2시] 격전의 언덕 - 어린 카이린\n[마족 중앙 2시] 정화의 숲 - 어린 카이린' },
  { name: '어린 토그', tribe: 'wild', locations: '' },
  { name: '영원의 코라돈', tribe: 'wild', locations: '[마족 4시] 그리바데 구릉지 남부 - 코라돈\n[어비스 하층 4시] 시엘의 날개 군도 - 어비스 코라돈\n[바크론의 공중섬] 숲의 코라돈' },
  { name: '왕벌', tribe: 'wild', locations: '[천족 중앙 8시] 순례자의 고갯길 - 거대 줄무늬 벌\n[바크론의 공중섬] 사나운 여왕벌' },
  { name: '우르서스', tribe: 'wild', locations: '[천족 8시] 톨바스 숲 남부 - 단단한 뿔 우르서스\n[천족 중앙 8시] 순례자의 고갯길 - 고갯길 우르서스, 고갯길 흉폭한 우르서스\n[천족 5시] 환영신의 정원 - 혼란한 우르서스\n[천족 2시] 쿠라카 언덕길 - 언덕 우르서스\n[마족 2시] 격전의 언덕 - 우르서스\n[마족 10시] 고요한 언덕 - 우르서스' },
  { name: '자이프', tribe: 'wild', locations: '[천족 중앙 6시] 바위 무덤 언덕 - 바위 언덕 자이프\n[천족 3시] 아르타미아 고원 동부 - 고원 숲 자이프\n[천족 6시] 아르타미아 고원 남부 - 고원 자이프\n[천족 2시] 쿠라카 언덕길 - 언덕 자이프' },
  { name: '잿빛 거미', tribe: 'wild', locations: '[천족 9시] 비탄의 언덕 - 흰 껍질 옥타사이드\n[마족 중앙 6시] 모슬란 숲 - 잿빛 거미\n[불의 신전] 용암 거미' },
  { name: '잿빛 루필리니', tribe: 'wild', locations: '' },
  { name: '잿빛 바실리스크', tribe: 'wild', locations: '' },
  { name: '정예 우르서스', tribe: 'wild', locations: '' },
  { name: '정예 칼니프', tribe: 'wild', locations: '' },
  { name: '정예 케네이르', tribe: 'wild', locations: '' },
  { name: '카이린', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 엘룬강 카이린\n[마족 1시 섬] 정령의 섬 - 불안정한 카이린\n[마족 9시] 성소 감시초소 - 카이린\n[마족 중앙 9시] 트라네인 구릉지 - 카이린\n[마족 2시] 격전의 언덕 - 카이린\n[마족 중앙 2시] 정화의 숲 - 카이린' },
  { name: '칼니프', tribe: 'wild', locations: '[천족 8시] 톨바스 숲 남부 - 사나운 칼니프\n[천족 8시] 톨바스 숲 북부 - 톨바스 칼니프, 톨바스 흉포한 칼니프\n[천족 중앙 6시] 아르타미아 고원 서부 - 질긴 갈기 고원 칼니프\n[천족 3시] 아르타미아 고원 동부 - 고원 칼니프\n[천족 2시] 쿠라카 언덕길 - 길들인 칼니프' },
  { name: '캔서리드', tribe: 'wild', locations: '[천족 11시] 엘룬강 늪지 - 늪이끼 캔서리드\n[천족 중앙 5시] 아르타미아 협곡 - 납작한 캔서리드\n[천족 7시 섬] 영원의 섬 - 영원의 이끼 게\n[마족 1시] 드라낙투스 - 이끼 게\n[마족 1시 섬] 정령의 섬 - 해안가 이끼 게\n[마족 7시 섬] 불멸의 섬 - 해안 이끼 게' },
  { name: '케르논', tribe: 'wild', locations: '' },
  { name: '코라돈', tribe: 'wild', locations: '' },
  { name: '크레스틀리치', tribe: 'wild', locations: '[천족 10시] 칸타스 계곡 서부 - 돌부리 크레스틀리치\n[천족 10시] 엘룬강 중류 - 엘룬강 크레스틀리치 암컷\n[천족 6시] 아르타미아 고원 남부 - 고원 크레스틀리치 암컷' },
  { name: '토그', tribe: 'wild', locations: '[마족 10시] 고요한 언덕 - 토그\n[마족 9시] 성소 감시초소 - 토그' },
  { name: '파이니', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 물비늘 파이니\n[천족 중앙 5시] 아르타미아 협곡 - 온순한 파이니\n[천족 7시 섬] 영원의 섬 - 영원의 파이니\n[마족 중앙 2시] 정화의 숲 - 예민한 파이니\n[마족 7시 섬] 불멸의 섬 - 파이니' },
  { name: '파피스', tribe: 'wild', locations: '[천족 10시] 칸타스 계곡 동부 - 온순한 파피스\n[천족 10시] 칸타스 계곡 서부 - 온순한 파피스\n[천족 10시] 엘룬강 중류 - 엘룬강 파피스\n[천족 5시] 환영신의 정원 - 정원 파피스\n[마족 10시] 고요한 언덕 - 빛 바랜 파피스\n[마족 9시] 성소 감시초소 - 빛 바랜 파피스\n[마족 11시] 이름없는 묘지 - 빛 바랜 파피스\n[마족 중앙 6시] 모슬란 숲 - 빛 바랜 파피스\n[마족 중앙 3시] 우르툼헤임 - 빛 바랜 파피스\n[마족 중앙 9시] 트라네인 구릉지 - 빛 바랜 파피스\n[마족 2시] 바스펠트 폐허 - 빛 바랜 파피스\n[마족 3시] 그리바데 구릉지 동부 - 빛 바랜 파피스\n[마족 4시] 그리바데 구릉지 남부 - 빛 바랜 파피스\n[마족 4시] 그리바데 구릉지 서부 - 빛 바랜 파피스' },
  { name: '포사', tribe: 'wild', locations: '[천족 8시] 톨바스 숲 남부 - 순찰하는 포사\n[마족 중앙 3시] 우르툼헤임 - 데바 변절자 포사\n[마족 2시] 바스펠트 폐허 - 길들인 야수' },
  { name: '하이브', tribe: 'wild', locations: '[천족 10시] 엘룬강 중류 - 작은부리 하이브, 뾰족부리 하이브\n[천족 중앙 5시] 아르타미아 협곡 - 단단한 부리 하이브\n[천족 중앙 6시] 아르타미아 고원 서부 - 긴 부리 고원 하이브\n[마족 3시] 그리바데 구릉지 동부 - 협곡 하이브, 협곡 하이브 새끼' },
  { name: '화염 발게스트', tribe: 'wild', locations: '' },

  // 자연족
  { name: '검은연기 무르트', tribe: 'nature', locations: '[불의 신전] 검은연기 무르트 (영웅)' },
  { name: '고대의 정령', tribe: 'nature', locations: '' },
  { name: '그라비', tribe: 'nature', locations: '[천족 8시] 톨바스 숲 북부 - 톨바스 그라비\n[천족 5시] 환영신의 정원 - 붉은 줄기 그라비\n[마족 중앙 2시] 정화의 숲 - 핑크 그라비' },
  { name: '네펜데스', tribe: 'nature', locations: '[천족 8시] 톨바스 숲 북부 - 톨바스 네펜데스\n[천족 3시] 아르타미아 고원 동부 - 진홍빛 고원 네펜데스\n[마족 9시] 성소 감시초소 - 라플레시아\n[마족 11시] 이름없는 묘지 - 라플레시아\n[마족 7시 섬] 불멸의 섬 - 라플레시아\n[마족 4시] 그리바데 구릉지 남부 - 라플레시아\n[어비스 하층 4시] 시엘의 날개 군도 - 어비스 고약한 라플레시아' },
  { name: '돌 정령', tribe: 'nature', locations: '[천족 2시] 쿠라카 언덕길 - 언덕 돌 정령\n[마족 중앙 2시] 정화의 숲 - 빛바랜 돌 정령\n[어비스 하층 4시] 시엘의 날개 군도 - 심연 바위 정령' },
  { name: '드라나 포자', tribe: 'nature', locations: '[천족 1시 섬] 홍옥의 섬 - 홍옥의 변이 포자체' },
  { name: '디오나에', tribe: 'nature', locations: '' },
  { name: '라플레시아', tribe: 'nature', locations: '[천족 1시 섬] 홍옥의 섬 - 홍옥의 라플레시아\n[마족 1시 섬] 정령의 섬 - 불안정한 라플레시아' },
  { name: '마른 잎사귀 어그린트', tribe: 'nature', locations: '[천족 8시] 톨바스 숲 남부 - 숲 어그린트' },
  { name: '마법 그라비', tribe: 'nature', locations: '[천족 8시] 톨바스 숲 북부 - 톨바스 마법 그라비\n[천족 5시] 환영신의 정원 - 환영의 마법 그라비\n[마족 중앙 2시] 정화의 숲 - 정화의 숲 마법 그라비\n[마족 1시 섬] 정령의 섬 - 불안정한 그라비' },
  { name: '말라붙은 숲의 수호자', tribe: 'nature', locations: '' },
  { name: '메마른 어그린트', tribe: 'nature', locations: '[천족 중앙 5시] 아르타미아 협곡 - 메마른 협곡 어그린트\n[천족 5시] 환영신의 정원 - 앙상한 어그린트\n[어비스 하층 10시] 유황 나무 섬 - 메마른 유황 어그린트' },
  { name: '변이된 숲 정령', tribe: 'nature', locations: '[천족 3시] 오염된 성소 - 변이 덩굴 덩어리, 오염된 덩굴 덩어리\n[마족 11시] 이름없는 묘지 - 응축된 혼령' },
  { name: '변이된 숲의 수호자', tribe: 'nature', locations: '[마족 중앙 6시] 모슬란 숲 - 변이된 숲의 수호자\n[마족 1시 섬] 정령의 섬 - 불안정한 숲의 수호자' },
  { name: '붉은불꽃 이그누스', tribe: 'nature', locations: '[불의 신전] 붉은불꽃 이그누스 (영웅)' },
  { name: '상급 땅의 정령', tribe: 'nature', locations: '[천족 5시] 환영신의 정원 - 기암의 정령\n[마족 중앙 2시] 정화의 숲 - 부식토 정령\n[마족 7시 섬] 불멸의 섬 - 불멸의 땅의 정령 수호자\n[바크론의 공중섬] 분노한 바위 정령' },
  { name: '상급 물의 정령', tribe: 'nature', locations: '[천족 5시] 환영신의 정원 - 유수의 정령\n[마족 중앙 2시] 정화의 숲 - 물보라 정령\n[마족 1시 섬] 정령의 섬 - 불안정한 물의 정령\n[마족 7시 섬] 불멸의 섬 - 불멸의 물의 정령 수호자' },
  { name: '상급 바람의 정령', tribe: 'nature', locations: '[천족 5시] 환영신의 정원 - 삭풍의 정령\n[마족 중앙 2시] 정화의 숲 - 돌풍의 정령\n[마족 7시 섬] 불멸의 섬 - 불멸의 바람의 정령 수호자' },
  { name: '상급 불의 정령', tribe: 'nature', locations: '[천족 5시] 환영신의 정원 - 업화의 정령\n[마족 중앙 2시] 정화의 숲 - 화염 정령\n[마족 1시 섬] 정령의 섬 - 불안정한 불의 정령\n[마족 7시 섬] 불멸의 섬 - 불멸의 불의 정령 수호자\n[불의 신전] 무자비한 불꽃 정령' },
  { name: '숲 디오나에', tribe: 'nature', locations: '' },
  { name: '숲 정령', tribe: 'nature', locations: '[천족 10시] 엘룬강 중류 - 오염된 덩굴정령\n[천족 중앙 8시] 순례자의 고갯길 - 고갯길 숲 정령\n[천족 중앙 5시] 아르타미아 협곡 - 깊은 협곡 숲 정령\n[마족 중앙 2시] 정화의 숲 - 숲의 정령' },
  { name: '숲의 수호자', tribe: 'nature', locations: '[천족 5시] 환영신의 정원 - 정원 수호자' },
  { name: '숲의 혼령', tribe: 'nature', locations: '[천족 중앙 5시] 아르타미아 협곡 - 협곡 덩굴 정령\n[천족 5시] 환영신의 정원 - 혼탁한 덩굴 정령' },
  { name: '암흑 정령', tribe: 'nature', locations: '[천족 2시] 쿠라카 언덕길 - 뒤틀린 정령\n[마족 5시] 임페투시움 광장 - 암흑 정령\n[어비스 하층 중앙] 에레슈란타의 뿌리 - 어비스 타락한 정령' },
  { name: '앙상한 어그린트', tribe: 'nature', locations: '[천족 1시 섬] 홍옥의 섬 - 홍옥의 어그린트\n[마족 11시] 이름없는 묘지 - 붉은 눈 어그린트\n[어비스 하층 10시] 유황 나무 섬 - 우거진 유황 어그린트' },
  { name: '어그린트', tribe: 'nature', locations: '[천족 10시] 엘룬강 중류 - 부패한 어그린트\n[천족 3시] 오염된 성소 - 오염된 어그린트\n[천족 5시] 환영신의 정원 - 오래된 어그린트\n[천족 7시 섬] 영원의 섬 - 영원의 어그린트\n[마족 중앙 6시] 모슬란 숲 - 변이된 엘림\n[마족 2시] 바스펠트 폐허 - 폐허 어그린트\n[마족 7시 섬] 불멸의 섬 - 섬 어그린트\n[어비스 하층 10시] 유황 나무 섬 - 유황 어그린트\n[어비스 하층 중앙] 에레슈란타의 뿌리 - 뿌리의 어그린트' },
  { name: '오드 돌 정령', tribe: 'nature', locations: '[마족 1시 섬] 정령의 섬 - 빛바랜 오드 정령\n[바크론의 공중섬] 오드 바위 정령' },
  { name: '잿빛 디오나에', tribe: 'nature', locations: '[마족 중앙 6시] 모슬란 숲 - 잿빛 디오나에' },
  { name: '잿빛 어그린트', tribe: 'nature', locations: '[마족 1시 섬] 정령의 섬 - 불안정한 어그린트' },
  { name: '정령왕의 호위 전사', tribe: 'nature', locations: '[어비스 하층 4시] 시엘의 날개 군도 - 고목의 정령 전사' },
  { name: '정예 독 포자 펑거스', tribe: 'nature', locations: '' },
  { name: '제르피', tribe: 'nature', locations: '[천족 7시 섬] 영원의 섬 - 영원의 제르피\n[마족 7시 섬] 불멸의 섬 - 제르피\n[어비스 하층 4시] 시엘의 날개 군도 - 어비스 순수한 정령' },
  { name: '중급 땅의 정령', tribe: 'nature', locations: '[천족 5시] 환영신의 정원 - 방황하는 땅 정령\n[천족 7시 섬] 영원의 섬 - 포악한 땅의 정령\n[마족 7시 섬] 불멸의 섬 - 불멸의 땅의 정령\n[바크론의 공중섬] 대지 정령' },
  { name: '중급 물의 정령', tribe: 'nature', locations: '[천족 5시] 환영신의 정원 - 방황하는 물 정령\n[천족 7시 섬] 영원의 섬 - 포악한 물의 정령\n[마족 1시 섬] 정령의 섬 - 불안정한 물의 정령\n[마족 7시 섬] 불멸의 섬 - 불멸의 물의 정령' },
  { name: '중급 바람의 정령', tribe: 'nature', locations: '[천족 5시] 환영신의 정원 - 방황하는 바람 정령\n[천족 7시 섬] 영원의 섬 - 포악한 바람의 정령\n[마족 7시 섬] 불멸의 섬 - 불멸의 바람의 정령' },
  { name: '중급 불의 정령', tribe: 'nature', locations: '[천족 7시 섬] 영원의 섬 - 포악한 불의 정령\n[마족 1시 섬] 정령의 섬 - 불안정한 불의 정령\n[마족 7시 섬] 불멸의 섬 - 불멸의 불의 정령\n[불의 신전] 화염의 정령' },
  { name: '최상급 땅의 정령', tribe: 'nature', locations: '[바크론의 공중섬] 분노한 대지 정령' },
  { name: '최상급 물의 정령', tribe: 'nature', locations: '' },
  { name: '최상급 바람의 정령', tribe: 'nature', locations: '' },
  { name: '최상급 불의 정령', tribe: 'nature', locations: '[불의 신전] 무자비한 화염의 정령' },
  { name: '코누티 일꾼', tribe: 'nature', locations: '[천족 8시] 톨바스 숲 북부 - 톨바스 코누티 일꾼\n[우루구구 협곡] 세뇌된 코누티' },
  { name: '큰 잎사귀 그라비', tribe: 'nature', locations: '[천족 10시] 엘룬강 중류 - 엘룬강 언덕 그라비\n[천족 5시] 환영신의 정원 - 큰 잎사귀 그라비\n[마족 중앙 2시] 정화의 숲 - 큰 잎사귀 그라비' },
  { name: '펑거스', tribe: 'nature', locations: '[천족 10시] 칸타스 계곡 동부 - 붉은 갓 펑거스' },
  { name: '펑기', tribe: 'nature', locations: '[천족 10시] 칸타스 계곡 동부 - 붉은 갓 펑기' },
  { name: '하급 땅의 정령', tribe: 'nature', locations: '[천족 7시 섬] 영원의 섬 - 영원의 땅의 정령\n[바크론의 공중섬] 바위 정령' },
  { name: '하급 물의 정령', tribe: 'nature', locations: '[천족 7시 섬] 영원의 섬 - 영원의 물의 정령' },
  { name: '하급 바람의 정령', tribe: 'nature', locations: '[천족 중앙 5시] 아르타미아 협곡 - 공기의 정령\n[천족 7시 섬] 영원의 섬 - 영원의 바람의 정령\n[마족 중앙 2시] 정화의 숲 - 미풍의 정령' },
  { name: '하급 불의 정령', tribe: 'nature', locations: '[천족 7시 섬] 영원의 섬 - 영원의 불의 정령\n[마족 중앙 2시] 정화의 숲 - 타오르는 불씨의 정령\n[불의 신전] 불꽃 정령' },

  // 변형족
  { name: '가디트', tribe: 'transform', locations: '[천족 3시] 오염된 성소 - 통제를 잃은 가디트' },
  { name: '감시 가디트', tribe: 'transform', locations: '[천족 3시] 오염된 성소 - 오염된 가디트' },
  { name: '감시의 오큘라젠', tribe: 'transform', locations: '[마족 1시] 드라낙투스 - 감시의 오큘라젠' },
  { name: '기생 스웜', tribe: 'transform', locations: '[마족 3시] 파프나이트 매장지 - 거대 광석 벌레 성체\n[드라웁니르] 굶주린 공허 벌레' },
  { name: '늪 괴물', tribe: 'transform', locations: '' },
  { name: '늪지 타르곤', tribe: 'transform', locations: '' },
  { name: '독혈', tribe: 'transform', locations: '[마족 중앙 2시] 정화의 숲 - 저주받은 독혈\n[마족 1시 섬] 정령의 섬 - 불안정한 독혈' },
  { name: '두두카 일꾼', tribe: 'transform', locations: '[마족 5시] 검은발톱 부락 - 두두카 일꾼' },
  { name: '두두카 투석병', tribe: 'transform', locations: '[마족 5시] 검은발톱 부락 - 두두카 투석병' },
  { name: '드라나 변이체', tribe: 'transform', locations: '[마족 중앙 11시] 드레드기온 추락지 - 뒤틀린 변이체' },
  { name: '드라나 변이체 덩치', tribe: 'transform', locations: '[천족 7시 섬] 영원의 섬 - 영원의 드라나 변이체\n[천족 1시 섬] 홍옥의 섬 - 홍옥의 드라나 변이체\n[마족 7시 섬] 불멸의 섬 - 드라나 변이체' },
  { name: '드라나 스웜', tribe: 'transform', locations: '[천족 1시 섬] 홍옥의 섬 - 홍옥의 드라나 스웜' },
  { name: '드라나 슬라임', tribe: 'transform', locations: '[마족 중앙 11시] 드레드기온 추락지 - 드라나 슬라임' },
  { name: '드라나 오염체', tribe: 'transform', locations: '' },
  { name: '드라나 포식자', tribe: 'transform', locations: '[천족 1시 섬] 홍옥의 섬 - 홍옥의 드라나 포식자\n[마족 중앙 11시] 드레드기온 추락지 - 드라나 포식자' },
  { name: '드라카나 칼크겔름', tribe: 'transform', locations: '[마족 중앙 11시] 드레드기온 추락지 - 추락지 칼크겔름' },
  { name: '드라칸 탐사기', tribe: 'transform', locations: '[천족 1시] 드라나 가공구역 - 드라나 가공 관리기\n[천족 1시] 나히드 군단 요새 - 침입자 탐색기\n[마족 9시] 성소 감시초소 - 감시 초소 탐사기\n[마족 중앙 9시] 트라네인 구릉지 - 드라칸 탐사기\n[마족 1시] 드라낙투스 - 드라나 가공 관리기\n[마족 6시] 라그타 요새 - 라그타 군단 탐색기' },
  { name: '문지기 피노피', tribe: 'transform', locations: '' },
  { name: '바이올란트', tribe: 'transform', locations: '[마족 3시] 파프나이트 매장지 - 중독된 바이올란트\n[마족 5시] 임페투시움 광장 - 아공간의 잔재' },
  { name: '빛바랜 드라나', tribe: 'transform', locations: '[마족 3시] 파프나이트 매장지 - 빛바랜 덩어리' },
  { name: '빛바랜 변이체', tribe: 'transform', locations: '[마족 3시] 파프나이트 매장지 - 퇴색한 변이체' },
  { name: '빛바랜 변이체 덩치', tribe: 'transform', locations: '[마족 3시] 파프나이트 매장지 - 빛바랜 변이체 덩치' },
  { name: '빛바랜 부유체', tribe: 'transform', locations: '[마족 3시] 파프나이트 매장지 - 빛바랜 부유체' },
  { name: '빛바랜 포식자', tribe: 'transform', locations: '[마족 3시] 파프나이트 매장지 - 빛바랜 포식자' },
  { name: '숲 괴물', tribe: 'transform', locations: '[천족 8시] 톨바스 숲 북부 - 톨바스 숲 타르곤\n[마족 중앙 6시] 모슬란 숲 - 불탄 숲지기' },
  { name: '스웜', tribe: 'transform', locations: '[마족 중앙 10시] 칼바리아 협곡 - 오염된 스웜\n[마족 3시] 파프나이트 매장지 - 거대 광석 벌레\n[어비스 하층 1시] 검은 파편 지대 - 어비스 스웜 변종\n[어비스 하층 10시] 유황 나무 섬 - 어비스 스웜 변이체\n[어비스 하층 7시] 파괴된 잔해 - 어비스 스웜\n[드라웁니르] 오드먹는 심연벌레' },
  { name: '슬라임', tribe: 'transform', locations: '[마족 중앙 2시] 정화의 숲 - 난폭한 슬라임' },
  { name: '시체 청소부', tribe: 'transform', locations: '[마족 중앙 3시] 우르툼헤임 - 유적 시체 청소부\n[마족 2시] 바스펠트 폐허 - 사나운 시체 청소부' },
  { name: '어둠의 정령', tribe: 'transform', locations: '[천족 중앙 5시] 아르타미아 협곡 - 타락한 정령\n[천족 5시] 환영신의 정원 - 방황하는 어둠 정령' },
  { name: '영혼 없는 송장 각다귀', tribe: 'transform', locations: '[마족 2시] 바스펠트 폐허 - 영혼없는 송장 각다귀' },
  { name: '오염된 슬라임', tribe: 'transform', locations: '[천족 3시] 오염된 성소 - 오염된 독 슬라임\n[어비스 하층 10시] 유황 나무 섬 - 어비스 유황 슬라임' },
  { name: '오큘라젠', tribe: 'transform', locations: '[천족 1시] 드라나 재배구역 - 노역 관리 오큘라젠\n[천족 1시] 드라나 가공구역 - 노역 관리 오큘라젠\n[마족 5시] 임페투시움 광장 - 감시의 오큘라젠' },
  { name: '은빛칼날 로탄', tribe: 'transform', locations: '[어비스 하층 1시] 검은 파편 지대 - 어비스 낡은 칼날 로탄\n[어비스 하층 7시] 파괴된 잔해 - 어비스 낡은 로탄\n[불의 신전] 은빛칼날 로탄' },
  { name: '응고된 드라나', tribe: 'transform', locations: '[마족 중앙 11시] 드레드기온 추락지 - 응고된 드라나' },
  { name: '일그러진 변이체', tribe: 'transform', locations: '[마족 중앙 2시] 정화의 숲 - 잠식된 정령 수호자' },
  { name: '정예 가디트', tribe: 'transform', locations: '[천족 3시] 오염된 성소 - 신성한 안사스 (영웅)' },
  { name: '정예 영혼 없는 송장 각다귀', tribe: 'transform', locations: '' },
  { name: '칼크겔름', tribe: 'transform', locations: '[천족 10시] 칸타스 계곡 서부 - 단단한 칼크겔름\n[천족 3시] 파괴된 신전 터 - 잿빛 칼크겔름\n[마족 중앙 2시] 정화의 숲 - 성난 칼크겔름\n[어비스 하층 중앙] 에레슈란타의 뿌리 - 뿌리의 칼크겔름' },
  { name: '크라오 변이체', tribe: 'transform', locations: '[크라오 동굴] 크라오 변이체' },
  { name: '크라오 봉인 수호자', tribe: 'transform', locations: '[크라오 동굴] 크라오 봉인 수호자' },
  { name: '크라오 실험체', tribe: 'transform', locations: '[크라오 동굴] 강화된 크라오 실험체' },
  { name: '푸른 칼크겔름', tribe: 'transform', locations: '[천족 10시] 칸타스 계곡 동부 - 빛나는 칼크겔름\n[마족 3시] 파프나이트 매장지 - 푸른 칼크겔름\n[어비스 하층 4시] 시엘의 날개 군도 - 심연의 칼크겔름' },
  { name: '피노', tribe: 'transform', locations: '[천족 7시] 아울라우 부락 - 피노 일꾼, 피노 노역꾼' },
  { name: '피노 일꾼', tribe: 'transform', locations: '[천족 7시] 아울라우 부락 - 매서운 피노 일꾼' },
  { name: '하르콘', tribe: 'transform', locations: '[크라오 동굴] 강화된 하르콘' },
  { name: '화염석 수호상', tribe: 'transform', locations: '[불의 신전] 화염석 수호상' },
];

export default function PetsPage() {
  const [activeTribe, setActiveTribe] = useState<Tribe>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTribe, setExpandedTribe] = useState<Tribe | null>(null);

  const filteredPets = PETS.filter((pet) => {
    const matchesTribe = activeTribe === 'all' || pet.tribe === activeTribe;
    const matchesSearch = !searchQuery ||
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.locations.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTribe && matchesSearch;
  });

  const tribeCount = {
    all: PETS.length,
    intellect: PETS.filter(p => p.tribe === 'intellect').length,
    wild: PETS.filter(p => p.tribe === 'wild').length,
    nature: PETS.filter(p => p.tribe === 'nature').length,
    transform: PETS.filter(p => p.tribe === 'transform').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300">
            사계 레기온
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/members" className="text-zinc-400 hover:text-white">레기온원</Link>
            <Link href="/schedule" className="text-zinc-400 hover:text-white">일정</Link>
            <Link href="/tips/appearance" className="text-zinc-400 hover:text-white">외형</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm">홈</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 text-sm">펫 DB</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span>🐾</span> 펫 영혼 DB
        </h1>
        <p className="text-zinc-400 text-sm mb-6">종족별 펫 영혼 획득처 정보 · 총 {PETS.length}종</p>

        {/* 종족별 레벨 효과 안내 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {(['intellect', 'wild', 'nature', 'transform'] as const).map((tribe) => (
            <div
              key={tribe}
              className={`${TRIBE_INFO[tribe].bgColor} border border-zinc-700 rounded-lg p-4 cursor-pointer transition-all hover:border-zinc-500`}
              onClick={() => setExpandedTribe(expandedTribe === tribe ? null : tribe)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{TRIBE_INFO[tribe].icon}</span>
                  <span className={`font-bold ${TRIBE_INFO[tribe].color}`}>{TRIBE_INFO[tribe].name}</span>
                  <span className="text-zinc-500 text-xs">({tribeCount[tribe]}종)</span>
                </div>
                <span className="text-zinc-500 text-xs">{expandedTribe === tribe ? '▲' : '▼'}</span>
              </div>
              {expandedTribe === tribe && (
                <div className="mt-3 pt-3 border-t border-zinc-700 space-y-1">
                  {TRIBE_INFO[tribe].levelEffects.map((effect, idx) => (
                    <p key={idx} className={`text-xs ${idx === 4 ? 'text-amber-400 font-medium' : 'text-zinc-300'}`}>
                      {effect}
                    </p>
                  ))}
                </div>
              )}
              {expandedTribe !== tribe && (
                <p className="text-xs text-amber-400">{TRIBE_INFO[tribe].levelEffects[4]?.split(', ').pop()}</p>
              )}
            </div>
          ))}
        </div>

        {/* 검색 */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="펫 이름, 위치 검색..."
            className="w-full max-w-md bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 종족 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(TRIBE_INFO) as Tribe[]).map((tribe) => (
            <button
              key={tribe}
              onClick={() => setActiveTribe(tribe)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                activeTribe === tribe
                  ? 'bg-amber-500 text-zinc-900'
                  : `${TRIBE_INFO[tribe].bgColor} ${TRIBE_INFO[tribe].color} hover:opacity-80 border border-zinc-700`
              }`}
            >
              {tribe !== 'all' && <span>{TRIBE_INFO[tribe].icon}</span>}
              {TRIBE_INFO[tribe].name} ({tribeCount[tribe]})
            </button>
          ))}
        </div>

        {/* 펫 목록 */}
        <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
          <div className="p-4 border-b border-zinc-700">
            <h2 className="text-lg font-semibold text-white">
              {activeTribe === 'all' ? '전체' : TRIBE_INFO[activeTribe].name} 펫 ({filteredPets.length}종)
            </h2>
          </div>

          {/* 모바일 카드 */}
          <div className="md:hidden divide-y divide-zinc-700">
            {filteredPets.map((pet, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{TRIBE_INFO[pet.tribe].icon}</span>
                  <span className={`font-bold ${TRIBE_INFO[pet.tribe].color}`}>{pet.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${TRIBE_INFO[pet.tribe].bgColor} ${TRIBE_INFO[pet.tribe].color}`}>
                    {TRIBE_INFO[pet.tribe].name}
                  </span>
                </div>
                {pet.locations ? (
                  <div className="text-sm text-zinc-300 whitespace-pre-line pl-2 border-l-2 border-zinc-700">
                    {pet.locations}
                  </div>
                ) : (
                  <div className="text-sm text-zinc-500 italic">획득처 정보 없음</div>
                )}
              </div>
            ))}
          </div>

          {/* 데스크탑 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900">
                <tr className="text-zinc-400">
                  <th className="text-left p-3 font-medium w-20">종족</th>
                  <th className="text-left p-3 font-medium w-48">펫 이름</th>
                  <th className="text-left p-3 font-medium">획득 위치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {filteredPets.map((pet, idx) => (
                  <tr key={idx} className="hover:bg-zinc-700/50">
                    <td className="p-3 align-top">
                      <span className={`text-xs px-2 py-1 rounded ${TRIBE_INFO[pet.tribe].bgColor} ${TRIBE_INFO[pet.tribe].color} flex items-center gap-1 w-fit`}>
                        {TRIBE_INFO[pet.tribe].icon} {TRIBE_INFO[pet.tribe].name}
                      </span>
                    </td>
                    <td className="p-3 align-top">
                      <span className={`font-medium ${TRIBE_INFO[pet.tribe].color}`}>{pet.name}</span>
                    </td>
                    <td className="p-3 align-top">
                      {pet.locations ? (
                        <div className="text-zinc-300 whitespace-pre-line text-xs leading-relaxed">
                          {pet.locations}
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic text-xs">획득처 정보 없음</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-zinc-500">
          출처: <a href="https://www.inven.co.kr/board/aion2/6444/689" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">인벤</a> | 데이터 업데이트: 2025.01
        </div>
      </main>
    </div>
  );
}
