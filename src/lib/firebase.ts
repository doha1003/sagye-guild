import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get, Database, Unsubscribe } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy initialization - only initialize when actually needed (client-side)
let app: FirebaseApp | null = null;
let database: Database | null = null;

function getFirebaseDatabase(): Database | null {
  if (typeof window === 'undefined') return null; // SSR 환경에서는 null 반환
  if (!firebaseConfig.databaseURL) return null; // 설정이 없으면 null 반환

  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }

  if (!database) {
    database = getDatabase(app);
  }

  return database;
}

// Boss timer types
export interface BossTimer {
  bossName: string;
  endTime: number;
  respawnMinutes: number;
  registeredAt: number;
  registeredBy?: string;
}

// Subscribe to boss timers (real-time updates)
export function subscribeToBossTimers(callback: (timers: BossTimer[]) => void): Unsubscribe {
  const db = getFirebaseDatabase();

  if (!db) {
    // Firebase가 초기화되지 않았으면 빈 배열 반환하고 no-op unsubscribe
    callback([]);
    return () => {};
  }

  const bossTimersRef = ref(db, 'bossTimers');

  return onValue(bossTimersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const timers: BossTimer[] = Object.values(data);
      // Filter out expired timers
      const activeTimers = timers.filter(t => t.endTime > Date.now());
      callback(activeTimers);
    } else {
      callback([]);
    }
  });
}

// Set a boss timer (with duplicate prevention)
export async function setBossTimer(timer: Omit<BossTimer, 'registeredAt'>): Promise<boolean> {
  const db = getFirebaseDatabase();

  if (!db) {
    console.error('Firebase not initialized');
    return false;
  }

  const timerRef = ref(db, `bossTimers/${timer.bossName}`);

  // Check for recent registration (within 30 seconds)
  const snapshot = await get(timerRef);
  if (snapshot.exists()) {
    const existing = snapshot.val() as BossTimer;
    const timeSinceRegistration = Date.now() - existing.registeredAt;
    if (timeSinceRegistration < 30000) {
      // Already registered within 30 seconds
      return false;
    }
  }

  // Set new timer
  await set(timerRef, {
    ...timer,
    registeredAt: Date.now(),
  });

  return true;
}

// Remove a boss timer
export async function removeBossTimer(bossName: string): Promise<void> {
  const db = getFirebaseDatabase();

  if (!db) {
    console.error('Firebase not initialized');
    return;
  }

  const timerRef = ref(db, `bossTimers/${bossName}`);
  await set(timerRef, null);
}

// Update boss timer (for time adjustment) - upsert 방식: 없으면 새로 생성
export async function updateBossTimer(bossName: string, newEndTime: number, respawnMinutes?: number): Promise<boolean> {
  const db = getFirebaseDatabase();

  if (!db) {
    console.error('Firebase not initialized');
    return false;
  }

  const timerRef = ref(db, `bossTimers/${bossName}`);
  const snapshot = await get(timerRef);

  if (!snapshot.exists()) {
    // 타이머가 없으면 새로 생성 (자동 재시작용)
    if (respawnMinutes !== undefined) {
      await set(timerRef, {
        bossName,
        endTime: newEndTime,
        respawnMinutes,
        registeredAt: Date.now(),
      });
      return true;
    }
    return false;
  }

  const existing = snapshot.val() as BossTimer;
  await set(timerRef, {
    ...existing,
    endTime: newEndTime,
    // respawnMinutes가 전달되면 업데이트, 아니면 기존 값 유지
    respawnMinutes: respawnMinutes !== undefined ? respawnMinutes : existing.respawnMinutes,
  });

  return true;
}

// Clean up expired timers (can be called periodically)
export async function cleanupExpiredTimers(): Promise<void> {
  const db = getFirebaseDatabase();

  if (!db) return;

  const bossTimersRef = ref(db, 'bossTimers');
  const snapshot = await get(bossTimersRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    const now = Date.now();

    for (const [key, timer] of Object.entries(data)) {
      if ((timer as BossTimer).endTime < now) {
        await set(ref(db, `bossTimers/${key}`), null);
      }
    }
  }
}

export { database };
