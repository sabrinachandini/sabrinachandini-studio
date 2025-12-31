'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LogEntry } from '@/types/content';
import { Trash2, Edit2, X, Check } from 'lucide-react';

interface LogEditorProps {
  entries: LogEntry[];
}

export function LogEditor({ entries }: LogEditorProps) {
  const router = useRouter();
  const [newEntry, setNewEntry] = useState('');
  const [newTags, setNewTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  async function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newEntry.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newEntry.trim(),
          tags: newTags ? newTags.split(',').map((t) => t.trim()) : undefined,
          dateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setNewEntry('');
        setNewTags('');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to add log entry:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return;

    try {
      const res = await fetch(`/api/admin/log?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  async function handleEdit(id: string) {
    if (!editText.trim()) return;

    try {
      const res = await fetch('/api/admin/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, text: editText.trim() }),
      });

      if (res.ok) {
        setEditingId(null);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update:', error);
    }
  }

  return (
    <div className="space-y-8">
      {/* Quick Add */}
      <form onSubmit={handleQuickAdd} className="bg-white border border-[var(--color-border)] rounded-lg p-4 space-y-3">
        <div>
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)] text-base"
            placeholder="What did you ship today?"
            disabled={loading}
          />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)] text-sm"
            placeholder="Tags (comma-separated)"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newEntry.trim()} className="btn btn-primary">
            {loading ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </form>

      {/* Entries List */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium mb-4">Recent Entries ({entries.length})</h2>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white border border-[var(--color-border)] rounded-lg p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              {editingId === entry.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-2 py-1 border border-[var(--color-border)] rounded"
                    autoFocus
                  />
                  <button onClick={() => handleEdit(entry.id)} className="text-green-600 hover:text-green-700">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[var(--color-fg)]">{entry.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-[var(--color-fg-subtle)]">
                      {new Date(entry.dateTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                    {entry.tags?.map((tag) => (
                      <span key={tag} className="text-xs bg-[var(--color-bg-alt)] px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {entry.whatChangedMyMind && (
                    <p className="text-sm text-[var(--color-fg-muted)] mt-2 italic">
                      Changed my mind: {entry.whatChangedMyMind}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(entry.id);
                  setEditText(entry.text);
                }}
                className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-[var(--color-fg-muted)] hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
