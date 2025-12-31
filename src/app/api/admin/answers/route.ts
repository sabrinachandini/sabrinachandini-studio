import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { saveQuestionAnswer, getQuestionAnswers } from '@/lib/data';
import { QuestionAnswerSchema } from '@/types/content';

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const answers = await getQuestionAnswers();
    const existing = answers.find((a) => a.id === body.id);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await saveQuestionAnswer(QuestionAnswerSchema.parse(updated));
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update answer:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
