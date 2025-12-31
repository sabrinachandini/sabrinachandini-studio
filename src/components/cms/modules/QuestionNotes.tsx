'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export function QuestionNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/question/notes');
        const data = await res.json();
        setNotes(data.notes || []);
      } catch (error) {
        console.error('Failed to fetch question notes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <p className="text-center text-[var(--color-fg-muted)] py-8">
        No notes yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-4 bg-white border border-[var(--color-border)] rounded-lg"
        >
          <p className="text-[var(--color-fg)]">{note.text}</p>
          <p className="text-xs text-[var(--color-fg-muted)] mt-2">
            {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
