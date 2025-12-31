'use client';

import { useState, useEffect } from 'react';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export function GuestbookModule() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/guestbook');
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Failed to fetch guestbook entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      if (res.ok) {
        setName('');
        setMessage('');
        fetchEntries();
      }
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg resize-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Signing...' : 'Sign Guestbook'}
        </button>
      </form>

      {/* Entries */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-center text-[var(--color-fg-muted)] py-8">
          Be the first to sign the guestbook!
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 bg-white border border-[var(--color-border)] rounded-lg"
            >
              <p className="text-[var(--color-fg)]">{entry.message}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-medium">{entry.name}</p>
                <p className="text-xs text-[var(--color-fg-muted)]">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
