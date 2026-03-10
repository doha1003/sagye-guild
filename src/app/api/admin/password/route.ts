import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, hashPassword, setFirebaseData, getStoredPassword } from '@/lib/firebase-server';

export async function GET() {
  try {
    const [site, admin] = await Promise.all([
      getStoredPassword('site'),
      getStoredPassword('admin'),
    ]);
    return NextResponse.json({
      sitePasswordSet: !!(site && site.hash),
      adminPasswordSet: !!(admin && admin.hash),
    });
  } catch {
    return NextResponse.json({ sitePasswordSet: false, adminPasswordSet: false });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { adminPassword, type, newPassword } = await request.json();

    if (!adminPassword || !type || !newPassword) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }

    if (type !== 'site' && type !== 'admin') {
      return NextResponse.json({ error: '잘못된 타입입니다.' }, { status: 400 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: '비밀번호는 4자 이상이어야 합니다.' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(adminPassword);
    if (!isValid) {
      return NextResponse.json({ error: '관리자 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const hashed = hashPassword(newPassword);
    const key = type === 'site' ? 'sitePassword' : 'adminPassword';
    await setFirebaseData(`config/${key}`, hashed);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}
