import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { saveObsession, createObsession, getObsessions } from '@/lib/data';
import { ObsessionSchema } from '@/types/content';

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const obsession = await createObsession(body);
    return NextResponse.json(obsession);
  } catch (error) {
    console.error('Failed to create obsession:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const obsessions = await getObsessions();
    const existing = obsessions.find((o) => o.id === body.id);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await saveObsession(ObsessionSchema.parse(updated));
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update obsession:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
