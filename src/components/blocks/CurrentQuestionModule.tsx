import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Question, QuestionNote } from '@/types/content';
import { AdminEditLink } from '@/components/ui/AdminEditLink';

interface CurrentQuestionModuleProps {
  question: Question;
  notes: QuestionNote[];
}

export function CurrentQuestionModule({ question, notes }: CurrentQuestionModuleProps) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Current Question
          </span>
          <AdminEditLink href="/admin/question" />
        </div>
        <Link href="/question" className="group">
          <h3 className="text-lg font-semibold group-hover:text-[var(--color-secondary)] transition-colors">
            {question.questionText}
          </h3>
        </Link>
        <p className="text-xs text-[var(--color-fg-subtle)] mt-2">
          Updated{' '}
          {new Date(question.updatedAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Recent Notes */}
      {notes.length > 0 && (
        <div className="divide-y divide-[var(--color-border)]">
          {notes.slice(0, 3).map((note) => (
            <div key={note.id} className="px-5 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium uppercase text-[var(--color-fg-subtle)] bg-[var(--color-bg-alt)] px-2 py-0.5 rounded">
                  {note.type}
                </span>
                <span className="text-xs text-[var(--color-fg-subtle)]">
                  {new Date(note.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm font-medium">{note.title}</p>
              <p className="text-xs text-[var(--color-secondary)] mt-1 italic">
                Changed my mind: {note.whatChangedMyMind.slice(0, 60)}
                {note.whatChangedMyMind.length > 60 && '...'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <Link
          href="/question"
          className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] inline-flex items-center gap-1"
        >
          See all {notes.length} notes <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
