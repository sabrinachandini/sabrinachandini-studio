import { NextResponse } from 'next/server';
import { getMedia, getMediaKit } from '@/lib/content';

export async function GET() {
  const [media, mediaKit] = await Promise.all([
    getMedia(),
    getMediaKit(),
  ]);

  return NextResponse.json({ media, mediaKit });
}
