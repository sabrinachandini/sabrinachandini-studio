import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createPage, getPages, getPage } from '@/lib/cms';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pages = await getPages();
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, template, status, blocks } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await getPage(slug);
    if (existing) {
      return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 400 });
    }

    const page = await createPage({
      title,
      slug,
      template: template || 'default',
      status: status || 'draft',
      blocks: blocks || [],
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
