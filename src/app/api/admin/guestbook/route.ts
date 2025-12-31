import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { saveGuestbookEntry, getGuestbookEntries } from '@/lib/data';
import { GuestbookEntrySchema } from '@/types/content';

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const entries = await getGuestbookEntries();
    const existing = entries.find((e) => e.id === body.id);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await saveGuestbookEntry(GuestbookEntrySchema.parse(updated));
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update guestbook entry:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
