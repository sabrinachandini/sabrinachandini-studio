import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getPageById, updatePage, deletePage, createRevision, getPage } from '@/lib/cms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const page = await getPageById(id);

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { title, slug, template, status, blocks, seoTitle, seoDescription } = body;

    const existingPage = await getPageById(id);
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if slug changed and if new slug already exists
    if (slug && slug !== existingPage.slug) {
      const slugExists = await getPage(slug);
      if (slugExists && slugExists.id !== id) {
        return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 400 });
      }
    }

    // Create a revision before updating
    if (existingPage.blocks.length > 0) {
      await createRevision(id, existingPage.blocks, existingPage.title, 'Auto-saved before update');
    }

    const updated = await updatePage(id, {
      title,
      slug,
      template,
      status,
      blocks,
      seoTitle,
      seoDescription,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existingPage = await getPageById(id);
  if (!existingPage) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  await deletePage(id);

  return NextResponse.json({ success: true });
}
