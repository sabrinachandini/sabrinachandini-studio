'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import type { LogEntry } from '@/types/content';

export default function LogPage() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LogEntry[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/log');
        const data = await res.json();
        setEntries(data.entries);
        setFilteredEntries(data.entries);

        // Extract all unique tags
        const tags = new Set<string>();
        data.entries.forEach((entry: LogEntry) => {
          entry.tags?.forEach((tag) => tags.add(tag));
        });
        setAllTags(Array.from(tags).sort());
      } catch (error) {
        console.error('Failed to fetch log entries:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter((e) => e.tags?.includes(selectedTag)));
    }
  }, [entries, selectedTag]);

  if (loading) {
    return (
      <div className="py-16 md:py-24 container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Build Log</h1>
          <p className="text-[var(--color-fg-muted)]">
            What I'm shipping, learning, and changing my mind about.
          </p>
        </header>

        {/* Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[var(--color-fg-muted)]" />
            </div>
            <button
              onClick={() => setSelectedTag('all')}
              className={`text-sm px-3 py-1 rounded transition-colors ${
                selectedTag === 'all'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-bg-alt)] text-[var(--color-fg-muted)] hover:bg-[var(--color-border)]'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  selectedTag === tag
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-alt)] text-[var(--color-fg-muted)] hover:bg-[var(--color-border)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-0">
          {filteredEntries.map((entry, index) => {
            const date = new Date(entry.dateTime);
            const showDateHeader =
              index === 0 ||
              new Date(filteredEntries[index - 1].dateTime).toDateString() !== date.toDateString();

            return (
              <div key={entry.id}>
                {showDateHeader && (
                  <div className="sticky top-0 bg-[var(--color-bg)] py-2 mb-2 mt-6 first:mt-0">
                    <span className="text-sm font-semibold text-[var(--color-fg-subtle)]">
                      {date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                <article className="bg-white border border-[var(--color-border)] rounded-lg p-4 mb-2">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[var(--color-fg)]">{entry.text}</p>
                    <span className="text-xs text-[var(--color-fg-subtle)] whitespace-nowrap">
                      {date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
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

                  {entry.whatChangedMyMind && (
                    <p className="text-sm text-[var(--color-secondary)] mt-3 pt-3 border-t border-[var(--color-border)] italic">
                      <span className="font-medium not-italic">Changed my mind:</span>{' '}
                      {entry.whatChangedMyMind}
                    </p>
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
              </div>
            );
          })}
        </div>

        {filteredEntries.length === 0 && (
          <p className="text-center text-[var(--color-fg-muted)] py-12">
            No log entries yet.
          </p>
        )}
      </div>
    </div>
  );
}
