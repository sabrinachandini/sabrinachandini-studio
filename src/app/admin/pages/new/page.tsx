'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [template, setTemplate] = useState<'default' | 'full-width' | 'narrow'>('default');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          template,
          status: 'draft',
          blocks: [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create page');
      }

      const page = await res.json();
      router.push(`/admin/pages/${page.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft size={14} />
          Back to Pages
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Create New Page</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1.5">
              Page Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent"
              placeholder="My New Page"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
              URL Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-fg-muted)]">/</span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent"
                placeholder="my-new-page"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="template" className="block text-sm font-medium mb-1.5">
              Template
            </label>
            <select
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value as typeof template)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent bg-white"
            >
              <option value="default">Default</option>
              <option value="full-width">Full Width</option>
              <option value="narrow">Narrow</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !slug.trim()}
            className="px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Page'}
          </button>
          <Link
            href="/admin/pages"
            className="px-4 py-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
