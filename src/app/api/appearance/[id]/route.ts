import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { updateSheetRow, clearSheetRow, APPEARANCE_SHEET_ID } from '@/lib/googleSheets';

// 외형 데이터 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!APPEARANCE_SHEET_ID) {
      return NextResponse.json({ error: 'Google Sheet not configured' }, { status: 500 });
    }

    const { id } = await params;
    const rowNumber = parseInt(id);
    const body = await request.json();
    const { name, equipment, source, grade } = body;

    if (!name || !grade) {
      return NextResponse.json({ error: 'Name and grade are required' }, { status: 400 });
    }

    await updateSheetRow(APPEARANCE_SHEET_ID, `시트1!A${rowNumber}:D${rowNumber}`, [name, equipment, source, grade]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Appearance API PUT error:', error);
    return NextResponse.json({ error: 'Failed to update appearance' }, { status: 500 });
  }
}

// 외형 데이터 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!APPEARANCE_SHEET_ID) {
      return NextResponse.json({ error: 'Google Sheet not configured' }, { status: 500 });
    }

    const { id } = await params;
    const rowNumber = parseInt(id);

    await clearSheetRow(APPEARANCE_SHEET_ID, `시트1!A${rowNumber}:D${rowNumber}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Appearance API DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete appearance' }, { status: 500 });
  }
}
