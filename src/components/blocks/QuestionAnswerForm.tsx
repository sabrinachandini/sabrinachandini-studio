'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuestionAnswerFormProps {
  questionSlug: string;
  questionText: string;
}

export function QuestionAnswerForm({ questionSlug, questionText }: QuestionAnswerFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/question/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionSlug,
          name: name.trim() || null,
          answer: answer.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setAnswer('');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit answer');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-lg p-6 text-center">
        <p className="font-medium mb-2">Thank you for your answer!</p>
        <p className="text-sm text-[var(--color-fg-muted)]">
          It will appear after moderation.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-[var(--color-secondary)] hover:underline mt-3"
        >
          Submit another answer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border)] rounded-lg p-6">
      <h3 className="font-semibold mb-2">Share your answer</h3>
      <p className="text-sm text-[var(--color-fg-muted)] mb-4 italic">
        "{questionText}"
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="answer" className="block text-sm font-medium mb-1">
            Your answer <span className="text-red-500">*</span>
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)] text-sm resize-none"
            rows={4}
            placeholder="What's your perspective on this question?"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name <span className="text-[var(--color-fg-subtle)]">(optional)</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-border-strong)] text-sm"
            placeholder="Anonymous"
            disabled={loading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !answer.trim()}
          className="btn btn-primary w-full"
        >
          {loading ? 'Submitting...' : 'Submit Answer'}
        </button>
      </div>
    </form>
  );
}
