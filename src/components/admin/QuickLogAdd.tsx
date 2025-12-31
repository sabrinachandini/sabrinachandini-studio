'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function QuickLogAdd() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          dateTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setText('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to add log entry:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)] text-sm"
        placeholder="Quick log: What did you ship?"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="btn btn-primary text-sm px-4"
      >
        {loading ? '...' : success ? 'Added!' : 'Log'}
      </button>
    </form>
  );
}
