import { NextRequest, NextResponse } from 'next/server';
import { createQuestionAnswer } from '@/lib/data';
import { moderateMessage } from '@/lib/moderation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionSlug, name, answer } = body;

    // Validate required fields
    if (!questionSlug || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate answer length
    if (answer.length < 10) {
      return NextResponse.json(
        { error: 'Answer must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (answer.length > 2000) {
      return NextResponse.json(
        { error: 'Answer must be less than 2000 characters' },
        { status: 400 }
      );
    }

    // Moderate the answer
    const moderation = await moderateMessage(answer);

    // Create the answer
    const newAnswer = await createQuestionAnswer({
      questionSlug,
      name: name || null,
      answer: answer.trim(),
      status: 'pending',
      moderation,
    });

    return NextResponse.json({ success: true, id: newAnswer.id });
  } catch (error) {
    console.error('Failed to submit answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
