import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createLogEntry, saveLogEntry, deleteLogEntry, getLogEntries } from '@/lib/data';
import { LogEntrySchema } from '@/types/content';

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const entry = await createLogEntry(body);
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Failed to create log entry:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const entries = await getLogEntries();
    const existing = entries.find((e) => e.id === body.id);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await saveLogEntry(LogEntrySchema.parse(updated));
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update log entry:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
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

    await deleteLogEntry(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete log entry:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
