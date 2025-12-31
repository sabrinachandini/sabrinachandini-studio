'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Obsession } from '@/types/content';

interface ObsessionEditorProps {
  obsession: Obsession | null;
  isActive?: boolean;
}

export function ObsessionEditor({ obsession, isActive }: ObsessionEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: obsession?.title || '',
    type: obsession?.type || 'tool',
    oneLiner: obsession?.oneLiner || '',
    whyNow: obsession?.whyNow || '',
    month: obsession?.month || new Date().toISOString().slice(0, 7),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/obsession', {
        method: obsession ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: obsession?.id,
          ...formData,
          status: isActive ? 'active' : 'archived',
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save obsession:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border)] rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)]"
            placeholder="Claude Code"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Month</label>
          <input
            type="month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)]"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as Obsession['type'] })}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)]"
        >
          <option value="tool">Tool</option>
          <option value="concept">Concept</option>
          <option value="project">Project</option>
          <option value="book">Book</option>
          <option value="person">Person</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">One-liner</label>
        <input
          type="text"
          value={formData.oneLiner}
          onChange={(e) => setFormData({ ...formData, oneLiner: e.target.value })}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)]"
          placeholder="Empowering people who never had access to building to create."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Why now?</label>
        <textarea
          value={formData.whyNow}
          onChange={(e) => setFormData({ ...formData, whyNow: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)]"
          placeholder="Right now it's all about speed..."
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? 'Saving...' : obsession ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
