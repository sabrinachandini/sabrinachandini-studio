import { NextResponse } from 'next/server';
import { getCollection, getRelatedCollectionItems } from '@/lib/content';

export async function GET() {
  const items = await getCollection();

  // Build related items map
  const related: Record<string, Awaited<ReturnType<typeof getRelatedCollectionItems>>> = {};
  for (const item of items) {
    if (item.related?.length) {
      related[item.slug] = await getRelatedCollectionItems(item.slug);
    }
  }

  return NextResponse.json({ items, related });
}
