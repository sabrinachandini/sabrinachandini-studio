import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createLinkedInWorkItem, deleteLinkedInWorkItem } from '@/lib/data';

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const item = await createLinkedInWorkItem(body);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to create work item:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await deleteLinkedInWorkItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete work item:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
