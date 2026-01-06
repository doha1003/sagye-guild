import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { readSheetData, appendSheetData, PETS_SHEET_ID } from '@/lib/googleSheets';

export interface PetData {
  id?: number;
  name: string;
  tribe: 'intellect' | 'wild' | 'nature' | 'transform';
  locations: string;
}

// 펫 데이터 조회
export async function GET() {
  try {
    // 시트 ID가 없으면 하드코딩된 데이터 사용
    if (!PETS_SHEET_ID) {
      return NextResponse.json({
        pets: [],
        source: 'hardcoded',
        message: 'Google Sheet not configured'
      });
    }

    const rows = await readSheetData(PETS_SHEET_ID, '시트1!A:C');

    // 첫 번째 행은 헤더
    const pets: PetData[] = rows.slice(1).map((row, index) => ({
      id: index + 2, // 행 번호 (헤더 제외)
      name: row[0] || '',
      tribe: row[1] as PetData['tribe'] || 'intellect',
      locations: row[2] || '',
    })).filter(pet => pet.name);

    return NextResponse.json({ pets, source: 'sheet' });
  } catch (error) {
    console.error('Pets API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
  }
}

// 펫 데이터 추가
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!PETS_SHEET_ID) {
      return NextResponse.json({ error: 'Google Sheet not configured' }, { status: 500 });
    }

    const body: PetData = await request.json();
    const { name, tribe, locations } = body;

    if (!name || !tribe) {
      return NextResponse.json({ error: 'Name and tribe are required' }, { status: 400 });
    }

    await appendSheetData(PETS_SHEET_ID, '시트1!A:C', [[name, tribe, locations]]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pets API POST error:', error);
    return NextResponse.json({ error: 'Failed to add pet' }, { status: 500 });
  }
}
