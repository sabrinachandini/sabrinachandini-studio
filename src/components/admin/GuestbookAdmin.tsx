'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GuestbookEntry } from '@/types/content';
import { Check, X, MessageSquare } from 'lucide-react';

interface GuestbookAdminProps {
  pending: GuestbookEntry[];
  published: GuestbookEntry[];
}

export function GuestbookAdmin({ pending, published }: GuestbookAdminProps) {
  const router = useRouter();
  const [annotatingId, setAnnotatingId] = useState<string | null>(null);
  const [annotationText, setAnnotationText] = useState('');

  async function handleModerate(id: string, action: 'publish' | 'reject') {
    try {
      const res = await fetch('/api/admin/guestbook', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action === 'publish' ? 'published' : 'rejected' }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to moderate:', error);
    }
  }

  async function handleAnnotate(id: string) {
    if (!annotationText.trim()) return;

    try {
      const res = await fetch('/api/admin/guestbook', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          annotation: {
            text: annotationText.trim(),
            annotatedAt: new Date().toISOString(),
          },
        }),
      });

      if (res.ok) {
        setAnnotatingId(null);
        setAnnotationText('');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to annotate:', error);
    }
  }

  function formatModerationLabel(label: string) {
    const colors: Record<string, string> = {
      ok: 'text-green-600 bg-green-50',
      spam: 'text-red-600 bg-red-50',
      promo: 'text-orange-600 bg-orange-50',
      toxic: 'text-red-600 bg-red-50',
      unknown: 'text-gray-600 bg-gray-50',
    };
    return colors[label] || colors.unknown;
  }

  return (
    <div className="space-y-8">
      {/* Pending Queue */}
      <section>
        <h2 className="text-lg font-medium mb-4">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-[var(--color-fg-muted)] bg-white border border-[var(--color-border)] rounded-lg p-4">
            No pending entries.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((entry) => (
              <div
                key={entry.id}
                className="bg-white border border-[var(--color-border)] rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {entry.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-[var(--color-fg-subtle)]">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${formatModerationLabel(entry.moderation.label)}`}>
                        {entry.moderation.label} ({Math.round(entry.moderation.score * 100)}%)
                      </span>
                    </div>
                    <p className="text-[var(--color-fg)]">{entry.message}</p>
                    {entry.moderation.reasons.length > 0 && (
                      <p className="text-xs text-[var(--color-fg-subtle)] mt-2">
                        Reasons: {entry.moderation.reasons.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleModerate(entry.id, 'publish')}
                      className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100"
                      title="Publish"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleModerate(entry.id, 'reject')}
                      className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                      title="Reject"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Published */}
      <section>
        <h2 className="text-lg font-medium mb-4">
          Published ({published.length})
        </h2>
        {published.length === 0 ? (
          <p className="text-[var(--color-fg-muted)] bg-white border border-[var(--color-border)] rounded-lg p-4">
            No published entries yet.
          </p>
        ) : (
          <div className="space-y-3">
            {published.map((entry) => (
              <div
                key={entry.id}
                className="bg-white border border-[var(--color-border)] rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {entry.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-[var(--color-fg-subtle)]">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[var(--color-fg)]">{entry.message}</p>
                    {entry.annotation && (
                      <div className="mt-3 pl-3 border-l-2 border-[var(--color-secondary)]">
                        <p className="text-sm text-[var(--color-fg-muted)] italic">
                          {entry.annotation.text}
                        </p>
                        <p className="text-xs text-[var(--color-fg-subtle)] mt-1">
                          — Sabrina
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setAnnotatingId(entry.id);
                      setAnnotationText(entry.annotation?.text || '');
                    }}
                    className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                    title="Annotate"
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>

                {annotatingId === entry.id && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <textarea
                      value={annotationText}
                      onChange={(e) => setAnnotationText(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded mb-2"
                      placeholder="Add your annotation..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAnnotate(entry.id)}
                        className="btn btn-primary text-sm py-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setAnnotatingId(null);
                          setAnnotationText('');
                        }}
                        className="btn btn-secondary text-sm py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
