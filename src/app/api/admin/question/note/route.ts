import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createQuestionNote, saveQuestionNote, deleteQuestionNote, getQuestionNotes } from '@/lib/data';
import { QuestionNoteSchema } from '@/types/content';

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Enforce required whatChangedMyMind
    if (!body.whatChangedMyMind || !body.whatChangedMyMind.trim()) {
      return NextResponse.json(
        { error: '"What changed my mind" is required' },
        { status: 400 }
      );
    }

    const note = await createQuestionNote(body);
    return NextResponse.json(note);
  } catch (error) {
    console.error('Failed to create question note:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Enforce required whatChangedMyMind
    if (!body.whatChangedMyMind || !body.whatChangedMyMind.trim()) {
      return NextResponse.json(
        { error: '"What changed my mind" is required' },
        { status: 400 }
      );
    }

    const notes = await getQuestionNotes();
    const existing = notes.find((n) => n.id === body.id);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await saveQuestionNote(QuestionNoteSchema.parse(updated));
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update question note:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await deleteQuestionNote(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete question note:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
