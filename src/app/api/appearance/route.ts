import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { readSheetData, appendSheetData, APPEARANCE_SHEET_ID } from '@/lib/googleSheets';

export interface AppearanceData {
  id?: number;
  name: string;
  equipment: string;
  source: string;
  grade: 'rare' | 'hero' | 'legend' | 'myth';
}

// 외형 데이터 조회
export async function GET() {
  try {
    if (!APPEARANCE_SHEET_ID) {
      return NextResponse.json({
        items: [],
        source: 'hardcoded',
        message: 'Google Sheet not configured'
      });
    }

    const rows = await readSheetData(APPEARANCE_SHEET_ID, '시트1!A:D');

    // 첫 번째 행은 헤더
    const items: AppearanceData[] = rows.slice(1).map((row, index) => ({
      id: index + 2,
      name: row[0] || '',
      equipment: row[1] || '',
      source: row[2] || '',
      grade: row[3] as AppearanceData['grade'] || 'rare',
    })).filter(item => item.name);

    return NextResponse.json({ items, source: 'sheet' });
  } catch (error) {
    console.error('Appearance API GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch appearance data' }, { status: 500 });
  }
}

// 외형 데이터 추가
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!APPEARANCE_SHEET_ID) {
      return NextResponse.json({ error: 'Google Sheet not configured' }, { status: 500 });
    }

    const body: AppearanceData = await request.json();
    const { name, equipment, source, grade } = body;

    if (!name || !grade) {
      return NextResponse.json({ error: 'Name and grade are required' }, { status: 400 });
    }

    await appendSheetData(APPEARANCE_SHEET_ID, '시트1!A:D', [[name, equipment, source, grade]]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Appearance API POST error:', error);
    return NextResponse.json({ error: 'Failed to add appearance' }, { status: 500 });
  }
}
