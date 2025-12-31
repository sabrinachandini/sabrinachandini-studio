import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getMediaItem, updateMediaItem, deleteMediaItem, getUploadPath } from '@/lib/cms';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const item = await getMediaItem(id);

  if (!item) {
    return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { altText, tags } = body;

    const existingItem = await getMediaItem(id);
    if (!existingItem) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    const updated = await updateMediaItem(id, {
      altText,
      tags,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating media item:', error);
    return NextResponse.json({ error: 'Failed to update media item' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existingItem = await getMediaItem(id);
  if (!existingItem) {
    return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
  }

  // Optionally delete the actual file (soft delete in CMS)
  // For now, we'll just soft delete in the database
  // const filePath = getUploadPath(existingItem.filename);
  // if (existsSync(filePath)) {
  //   await unlink(filePath);
  // }

  await deleteMediaItem(id);

  return NextResponse.json({ success: true });
}
