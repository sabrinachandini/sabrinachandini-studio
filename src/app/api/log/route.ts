import { NextResponse } from 'next/server';
import { getLogEntries } from '@/lib/data';

export async function GET() {
  try {
    const entries = await getLogEntries();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Failed to fetch log entries:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
