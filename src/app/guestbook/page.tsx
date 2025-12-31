'use client';

import { useState, useEffect } from 'react';
import type { GuestbookEntry } from '@/types/content';

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch('/api/guestbook');
        const data = await res.json();
        setEntries(data.entries);
      } catch (error) {
        console.error('Failed to fetch guestbook entries:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || null,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setMessage('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-2xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Guestbook</h1>
          <p className="text-[var(--color-fg-muted)]">
            Leave a note, say hi, share a thought.
          </p>
        </header>

        {/* Submit Form */}
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 mb-8">
          {submitted ? (
            <div className="text-center py-4">
              <p className="text-[var(--color-fg)] font-medium mb-2">Thanks for your note!</p>
              <p className="text-sm text-[var(--color-fg-muted)]">
                It will appear here after review.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-[var(--color-secondary)] hover:underline mt-3"
              >
                Write another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name <span className="text-[var(--color-fg-subtle)] font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)]"
                  placeholder="Anonymous"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)]"
                  placeholder="Your message..."
                  required
                  disabled={submitting}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--color-fg-subtle)]">
                  Messages are reviewed before publishing.
                </p>
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="btn btn-primary"
                >
                  {submitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <p className="text-center text-[var(--color-fg-muted)] py-8">
              No notes yet. Be the first!
            </p>
          ) : (
            entries.map((entry) => (
              <article
                key={entry.id}
                className="bg-white border border-[var(--color-border)] rounded-lg p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="font-medium">
                    {entry.name || 'Anonymous'}
                  </span>
                  <span className="text-xs text-[var(--color-fg-subtle)]">
                    {new Date(entry.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-[var(--color-fg-muted)]">{entry.message}</p>

                {/* Sabrina's Annotation */}
                {entry.annotation && (
                  <div className="mt-4 pl-4 border-l-2 border-[var(--color-secondary)]">
                    <p className="text-sm text-[var(--color-fg-muted)] italic">
                      {entry.annotation.text}
                    </p>
                    <p className="text-xs text-[var(--color-fg-subtle)] mt-1">
                      — Sabrina
                    </p>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
