import crypto from 'crypto';

const FIREBASE_DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

export async function getFirebaseData(path: string) {
  const res = await fetch(`${FIREBASE_DB_URL}/${path}.json`, { cache: 'no-store' });
  return res.json();
}

export async function setFirebaseData(path: string, data: any) {
  await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function hashPassword(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, s, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: s };
}

export function verifyPassword(password: string, stored: { hash: string; salt: string }) {
  const { hash } = hashPassword(password, stored.salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(stored.hash));
}

export async function getStoredPassword(type: 'site' | 'admin') {
  const key = type === 'site' ? 'sitePassword' : 'adminPassword';
  return getFirebaseData(`config/${key}`);
}

export async function verifyAdminPassword(password: string) {
  try {
    const stored = await getStoredPassword('admin');
    if (stored && stored.hash) {
      return verifyPassword(password, stored);
    }
  } catch {
    // Firebase 실패 시 환경변수 폴백
  }
  return password === process.env.ADMIN_PASSWORD;
}

export async function verifySitePassword(password: string) {
  try {
    const stored = await getStoredPassword('site');
    if (stored && stored.hash) {
      return verifyPassword(password, stored);
    }
  } catch {
    // Firebase 실패 시 환경변수 폴백
  }
  return password === process.env.SITE_PASSWORD;
}
