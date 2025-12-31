import { NextResponse } from 'next/server';
import { getPages } from '@/lib/cms';
import { getExperiments, getCollection, getMedia } from '@/lib/content';
import {
  getQuestionNotes,
  getLogEntries,
  getGuestbookEntries,
  getLinkedInWorkExperience,
} from '@/lib/data';

// GET /api/index - Aggregate all content for the Index page
export async function GET() {
  try {
    // Fetch all content in parallel
    const [
      pages,
      experiments,
      collection,
      media,
      questionNotes,
      logEntries,
      guestbookEntries,
      workExperience,
    ] = await Promise.all([
      getPages(),
      getExperiments(),
      getCollection(),
      getMedia(),
      getQuestionNotes(),
      getLogEntries(),
      getGuestbookEntries(),
      getLinkedInWorkExperience(),
    ]);

    // Transform to IndexItem format
    const indexData = {
      pages: pages.map((p) => ({
        id: p.id,
        title: p.title,
        type: 'pages' as const,
        status: p.status,
        href: `/${p.slug}`,
        updatedAt: p.updatedAt,
        description: p.seoDescription || undefined,
      })),

      experiments: experiments.map((e) => ({
        id: e.slug,
        title: e.title,
        type: 'experiments' as const,
        status: e.status === 'shipped' ? 'published' : (e.status === 'in-progress' ? 'draft' : 'pending'),
        href: `/experiments/${e.slug}`,
        updatedAt: e.publishedAt || new Date().toISOString(),
        description: e.description,
      })),

      collection: collection.map((c) => ({
        id: c.slug,
        title: c.title,
        type: 'collection' as const,
        status: 'published' as const,
        href: `/collection/${c.slug}`,
        updatedAt: c.year ? `${c.year}-01-01T00:00:00.000Z` : new Date().toISOString(),
        description: c.description,
      })),

      media: media.map((m) => ({
        id: m.slug,
        title: m.title,
        type: 'media' as const,
        status: 'published' as const,
        href: `/media#${m.slug}`,
        updatedAt: m.updatedAt,
        description: m.outlet ? `${m.outlet}${m.type ? ` - ${m.type}` : ''}` : m.type,
      })),

      questionNotes: questionNotes.map((n) => ({
        id: n.id,
        title: n.title,
        type: 'question' as const,
        status: 'published' as const,
        href: `/question/${n.questionSlug}#${n.id}`,
        updatedAt: n.updatedAt || n.date,
        description: n.type ? `${n.type} note` : undefined,
      })),

      log: logEntries.map((l) => ({
        id: l.id,
        title: l.text.slice(0, 60) + (l.text.length > 60 ? '...' : ''),
        type: 'log' as const,
        status: l.publishStatus === 'published' ? 'published' : 'draft',
        href: `/log#${l.id}`,
        updatedAt: l.updatedAt,
        description: l.tags?.join(', '),
      })),

      guestbook: guestbookEntries.map((g) => ({
        id: g.id,
        title: g.name ? `${g.name}'s entry` : 'Anonymous entry',
        type: 'guestbook' as const,
        status: g.status,
        href: `/guestbook#${g.id}`,
        updatedAt: g.updatedAt,
        description: g.message.slice(0, 100),
      })),

      work: workExperience.map((w) => ({
        id: w.id,
        title: `${w.title} at ${w.companyName}`,
        type: 'work' as const,
        status: w.endDate === null ? 'active' : ('archived' as const),
        href: `/portfolio#work-${w.id}`,
        updatedAt: w.updatedAt,
        description: w.description,
      })),
    };

    return NextResponse.json(indexData);
  } catch (error) {
    console.error('Error fetching index data:', error);
    return NextResponse.json({ error: 'Failed to fetch index data' }, { status: 500 });
  }
}
