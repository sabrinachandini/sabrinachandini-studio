'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Question, QuestionNote, NoteType, QuestionTrack } from '@/types/content';
import { Trash2, Edit2, Plus, X, Check } from 'lucide-react';

interface QuestionEditorProps {
  question: Question | null;
  notes: QuestionNote[];
}

const NOTE_TYPES: NoteType[] = ['principle', 'tool', 'pattern', 'example', 'counterexample', 'question', 'whos-doing-it-well'];
const TRACKS: QuestionTrack[] = ['startups', 'history', 'both'];

export function QuestionEditor({ question, notes }: QuestionEditorProps) {
  const router = useRouter();
  const [showAddNote, setShowAddNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    type: 'principle' as NoteType,
    tracks: ['both'] as QuestionTrack[],
    body: '',
    whatChangedMyMind: '',
  });

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.whatChangedMyMind.trim()) {
      alert('"What changed my mind" is required for every note.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/question/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newNote,
          questionSlug: 'starting-something-new',
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (res.ok) {
        setNewNote({
          title: '',
          type: 'principle',
          tracks: ['both'],
          body: '',
          whatChangedMyMind: '',
        });
        setShowAddNote(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNote(id: string) {
    if (!confirm('Delete this note?')) return;

    try {
      const res = await fetch(`/api/admin/question/note?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  return (
    <div className="space-y-8">
      {/* Question Info */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-lg font-medium mb-2">
          {question?.questionText || 'No question defined'}
        </h2>
        <p className="text-sm text-[var(--color-fg-muted)] mb-4">
          Tracks: {question?.tracks.join(', ')}
        </p>
        {question?.rationaleBullets && (
          <ul className="list-disc list-inside text-sm text-[var(--color-fg-muted)] space-y-1">
            {question.rationaleBullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Note Form */}
      {showAddNote ? (
        <form onSubmit={handleAddNote} className="bg-white border border-[var(--color-border)] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Add New Note</h3>
            <button type="button" onClick={() => setShowAddNote(false)} className="text-[var(--color-fg-muted)]">
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded"
              placeholder="Start with what it will look like"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={newNote.type}
                onChange={(e) => setNewNote({ ...newNote, type: e.target.value as NoteType })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded"
              >
                {NOTE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Track</label>
              <select
                value={newNote.tracks[0]}
                onChange={(e) => setNewNote({ ...newNote, tracks: [e.target.value as QuestionTrack] })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded"
              >
                {TRACKS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Body (short, markdown ok)</label>
            <textarea
              value={newNote.body}
              onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              What changed my mind <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newNote.whatChangedMyMind}
              onChange={(e) => setNewNote({ ...newNote, whatChangedMyMind: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded"
              placeholder="I used to think... Now I see that..."
              required
            />
            <p className="text-xs text-[var(--color-fg-subtle)] mt-1">Required for every note</p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Adding...' : 'Add Note'}
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowAddNote(true)}
          className="w-full py-4 border-2 border-dashed border-[var(--color-border)] rounded-lg text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add Note
        </button>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        <h3 className="font-medium">Notes ({notes.length})</h3>
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white border border-[var(--color-border)] rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium uppercase bg-[var(--color-bg-alt)] px-2 py-0.5 rounded">
                    {note.type}
                  </span>
                  <span className="text-xs text-[var(--color-fg-subtle)]">
                    {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="font-medium mb-1">{note.title}</h4>
                <p className="text-sm text-[var(--color-fg-muted)] mb-2">{note.body}</p>
                <p className="text-sm italic text-[var(--color-secondary)]">
                  Changed my mind: {note.whatChangedMyMind}
                </p>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
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
