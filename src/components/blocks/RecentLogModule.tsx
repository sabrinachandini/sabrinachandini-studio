import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LogEntry } from '@/types/content';
import { isAdminAuthenticated } from '@/lib/auth';

interface RecentLogModuleProps {
  entries: LogEntry[];
}

export async function RecentLogModule({ entries }: RecentLogModuleProps) {
  const isAdmin = await isAdminAuthenticated();

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
          Build Log
        </h3>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin/log"
              className="text-xs text-[var(--color-secondary)] hover:underline"
            >
              + Add
            </Link>
          )}
          <Link
            href="/log"
            className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] inline-flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Entries */}
      <ul className="divide-y divide-[var(--color-border)]">
        {entries.map((entry) => (
          <li key={entry.id} className="px-5 py-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-[var(--color-fg)]">{entry.text}</p>
              <span className="text-xs text-[var(--color-fg-subtle)] whitespace-nowrap">
                {new Date(entry.dateTime).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            {entry.whatChangedMyMind && (
              <p className="text-xs text-[var(--color-secondary)] mt-1 italic">
                Changed my mind: {entry.whatChangedMyMind.slice(0, 80)}
                {entry.whatChangedMyMind.length > 80 && '...'}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
