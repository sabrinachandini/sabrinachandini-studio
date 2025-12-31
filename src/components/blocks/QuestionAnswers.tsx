import type { QuestionAnswer } from '@/types/content';

interface QuestionAnswersProps {
  answers: QuestionAnswer[];
}

export function QuestionAnswers({ answers }: QuestionAnswersProps) {
  if (answers.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-fg-muted)]">
        <p>No answers yet. Be the first to share your perspective!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        What others think ({answers.length})
      </h3>
      {answers.map((answer) => (
        <div
          key={answer.id}
          className="bg-white border border-[var(--color-border)] rounded-lg p-5"
        >
          <p className="text-[var(--color-fg)] whitespace-pre-wrap mb-3">
            {answer.answer}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {answer.name || 'Anonymous'}
            </span>
            <span className="text-xs text-[var(--color-fg-subtle)]">
              {new Date(answer.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          {answer.annotation && (
            <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-fg-muted)] italic">
                <span className="font-medium text-[var(--color-secondary)]">Sabrina:</span>{' '}
                {answer.annotation.text}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
