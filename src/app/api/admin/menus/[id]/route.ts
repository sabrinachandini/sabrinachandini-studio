import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getMenus, updateMenuItems } from '@/lib/cms';
import type { MenuItem } from '@/types/cms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { items } = body as { items: MenuItem[] };

    const updated = await updateMenuItems(id, items);

    if (!updated) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
  }
}
