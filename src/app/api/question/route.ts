import { NextResponse } from 'next/server';
import { getQuestion, getQuestionNotes, getPublishedQuestionAnswers } from '@/lib/data';

export async function GET() {
  try {
    const [question, notes, answers] = await Promise.all([
      getQuestion('starting-something-new'),
      getQuestionNotes('starting-something-new'),
      getPublishedQuestionAnswers('starting-something-new'),
    ]);

    return NextResponse.json({ question, notes, answers });
  } catch (error) {
    console.error('Failed to fetch question data:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
