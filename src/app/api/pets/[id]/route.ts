import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { updateSheetRow, clearSheetRow, PETS_SHEET_ID } from '@/lib/googleSheets';

// 펫 데이터 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!PETS_SHEET_ID) {
      return NextResponse.json({ error: 'Google Sheet not configured' }, { status: 500 });
    }

    const { id } = await params;
    const rowNumber = parseInt(id);
    const body = await request.json();
    const { name, tribe, locations } = body;

    if (!name || !tribe) {
      return NextResponse.json({ error: 'Name and tribe are required' }, { status: 400 });
    }

    await updateSheetRow(PETS_SHEET_ID, `시트1!A${rowNumber}:C${rowNumber}`, [name, tribe, locations]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pets API PUT error:', error);
    return NextResponse.json({ error: 'Failed to update pet' }, { status: 500 });
  }
}

// 펫 데이터 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!PETS_SHEET_ID) {
      return NextResponse.json({ error: 'Google Sheet not configured' }, { status: 500 });
    }

    const { id } = await params;
    const rowNumber = parseInt(id);

    await clearSheetRow(PETS_SHEET_ID, `시트1!A${rowNumber}:C${rowNumber}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pets API DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete pet' }, { status: 500 });
  }
}
