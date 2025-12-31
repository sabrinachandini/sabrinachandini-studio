'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import type { Question, QuestionNote, QuestionAnswer, NoteType, QuestionTrack } from '@/types/content';
import { QuestionAnswerForm } from '@/components/blocks/QuestionAnswerForm';
import { QuestionAnswers } from '@/components/blocks/QuestionAnswers';

const NOTE_TYPES: NoteType[] = ['principle', 'tool', 'pattern', 'example', 'counterexample', 'question', 'whos-doing-it-well'];
const TRACKS: QuestionTrack[] = ['startups', 'history', 'both'];

export default function QuestionPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [notes, setNotes] = useState<QuestionNote[]>([]);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<QuestionNote[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/question');
        const data = await res.json();
        setQuestion(data.question);
        setNotes(data.notes);
        setFilteredNotes(data.notes);
        setAnswers(data.answers || []);
      } catch (error) {
        console.error('Failed to fetch question data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = notes;

    if (typeFilter !== 'all') {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    if (trackFilter !== 'all') {
      filtered = filtered.filter((n) =>
        n.tracks.includes(trackFilter as QuestionTrack) || n.tracks.includes('both')
      );
    }

    setFilteredNotes(filtered);
  }, [notes, typeFilter, trackFilter]);

  if (loading) {
    return (
      <div className="py-16 md:py-24 container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="py-16 md:py-24 container">
        <p className="text-[var(--color-fg-muted)]">No question found.</p>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <header className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)] mb-4 block">
            Current Question
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {question.questionText}
          </h1>
          <div className="space-y-2 text-[var(--color-fg-muted)]">
            {question.rationaleBullets.map((bullet, i) => (
              <p key={i} className="text-sm">• {bullet}</p>
            ))}
          </div>
          <p className="text-xs text-[var(--color-fg-subtle)] mt-4">
            Updated{' '}
            {new Date(question.updatedAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--color-fg-muted)]" />
            <span className="text-sm text-[var(--color-fg-muted)]">Filter:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm px-3 py-1.5 border border-[var(--color-border)] rounded bg-white focus:outline-none focus:border-[var(--color-border-strong)]"
          >
            <option value="all">All types</option>
            {NOTE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="text-sm px-3 py-1.5 border border-[var(--color-border)] rounded bg-white focus:outline-none focus:border-[var(--color-border-strong)]"
          >
            <option value="all">All tracks</option>
            {TRACKS.map((track) => (
              <option key={track} value={track}>{track}</option>
            ))}
          </select>

          <span className="text-sm text-[var(--color-fg-subtle)]">
            {filteredNotes.length} of {notes.length} notes
          </span>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="bg-white border border-[var(--color-border)] rounded-lg p-5 hover:border-[var(--color-border-strong)] transition-colors"
            >
              {/* Meta */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium uppercase bg-[var(--color-bg-alt)] px-2 py-0.5 rounded">
                  {note.type}
                </span>
                <span className="text-xs text-[var(--color-fg-subtle)]">
                  {new Date(note.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold mb-2">{note.title}</h3>

              {/* Body */}
              <p className="text-sm text-[var(--color-fg-muted)] mb-3">
                {note.body}
              </p>

              {/* What Changed My Mind */}
              <div className="pt-3 border-t border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-secondary)] italic">
                  <span className="font-medium not-italic">Changed my mind:</span>{' '}
                  {note.whatChangedMyMind}
                </p>
              </div>

              {/* Links */}
              {note.links && note.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-secondary)] underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <p className="text-center text-[var(--color-fg-muted)] py-12">
            No notes match the current filters.
          </p>
        )}

        {/* Answers Section */}
        <section className="mt-16 pt-16 border-t border-[var(--color-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Answer Form */}
            <div>
              <QuestionAnswerForm
                questionSlug={question.slug}
                questionText={question.questionText}
              />
            </div>

            {/* Published Answers */}
            <div>
              <QuestionAnswers answers={answers} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
