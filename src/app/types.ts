// 직업 정보
export const CLASSES = {
  2: { name: '검성', role: 'dps', icon: '⚔️' },
  3: { name: '수호성', role: 'tank', icon: '🛡️' },
  4: { name: '궁성', role: 'dps', icon: '🏹' },
  5: { name: '살성', role: 'dps', icon: '🗡️' },
  6: { name: '정령성', role: 'dps', icon: '🔮' },
  7: { name: '마도성', role: 'dps', icon: '✨' },
  8: { name: '치유성', role: 'healer', icon: '💚' },
  9: { name: '호법성', role: 'support', icon: '📿' },
} as const;

export type ClassId = keyof typeof CLASSES;
export type Role = 'tank' | 'dps' | 'healer' | 'support';

// 서버 정보 (지켈 = 마족 서버)
// PlayNC API 서버 ID: 2011, aion2tool.com 서버 ID: 2002
export const SERVERS = {
  2011: '지켈',
} as const;

// 길드원 타입
export interface GuildMember {
  id: string;
  nickname: string;
  classId: ClassId;
  level: number;
  combatScore?: number;
  lastUpdated?: string;
  profileImageUrl?: string;
}

// PlayNC 캐릭터 검색 응답
export interface PlayNCCharacter {
  characterId: string;
  name: string;
  race: number;
  pcId: number;
  level: number;
  serverId: number;
  serverName: string;
  profileImageUrl: string;
}

// aion2tool 캐릭터 정보
export interface Aion2ToolCharacter {
  data: {
    combat_stats?: {
      attack_power?: number;
      critical_hit?: number;
      [key: string]: number | undefined;
    };
    equipment?: Record<string, unknown>;
    accessories?: Record<string, unknown>;
  };
  combat_score_power_range?: {
    combat_score?: number;
  };
}

// 역할별 한글 이름
export const ROLE_NAMES: Record<Role, string> = {
  tank: '탱커',
  dps: '딜러',
  healer: '힐러',
  support: '서포터',
};
