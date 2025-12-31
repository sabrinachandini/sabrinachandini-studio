import { NextRequest, NextResponse } from 'next/server';
import { getPublishedGuestbookEntries, createGuestbookEntry } from '@/lib/data';
import { moderateMessage } from '@/lib/moderation';

export async function GET() {
  try {
    const entries = await getPublishedGuestbookEntries();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Failed to fetch guestbook entries:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Run moderation
    const moderation = await moderateMessage(message);

    // Create entry with pending status
    const entry = await createGuestbookEntry({
      name: name?.trim() || null,
      message: message.trim(),
      status: 'pending',
      moderation,
    });

    return NextResponse.json({ success: true, entryId: entry.id });
  } catch (error) {
    console.error('Failed to create guestbook entry:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
