'use client';

import { useState, useEffect } from 'react';
import type { LogEntry } from '@/types/content';

interface LogListProps {
  limit?: number;
}

export function LogList({ limit = 10 }: LogListProps) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/log');
        const data = await res.json();
        setEntries(data.entries.slice(0, limit));
      } catch (error) {
        console.error('Failed to fetch log entries:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [limit]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-center text-[var(--color-fg-muted)] py-8">
        No log entries yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const date = new Date(entry.dateTime);
        return (
          <article
            key={entry.id}
            className="bg-white border border-[var(--color-border)] rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-[var(--color-fg)]">{entry.text}</p>
              <span className="text-xs text-[var(--color-fg-subtle)] whitespace-nowrap">
                {date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[var(--color-bg-alt)] px-2 py-0.5 rounded text-[var(--color-fg-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {entry.link && (
              <a
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-secondary)] hover:underline mt-2 inline-block"
              >
                View →
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
