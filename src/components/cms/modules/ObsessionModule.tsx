'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface Obsession {
  id: string;
  title: string;
  description: string;
  url?: string;
  image?: string;
  active: boolean;
  createdAt: string;
}

export function ObsessionModule() {
  const [obsession, setObsession] = useState<Obsession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/obsession');
        const data = await res.json();
        setObsession(data.current || null);
      } catch (error) {
        console.error('Failed to fetch obsession:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!obsession) {
    return (
      <p className="text-center text-[var(--color-fg-muted)] py-8">
        No current obsession set.
      </p>
    );
  }

  return (
    <div className="p-6 bg-[var(--color-bg-alt)] rounded-lg border border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="accent-square" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
          Current Obsession
        </span>
      </div>

      {obsession.image && (
        <img
          src={obsession.image}
          alt={obsession.title}
          className="w-full aspect-video object-cover rounded-lg mb-4"
        />
      )}

      <h3 className="text-xl font-semibold mb-2">{obsession.title}</h3>
      <p className="text-[var(--color-fg-muted)]">{obsession.description}</p>

      {obsession.url && (
        <a
          href={obsession.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-4 text-[var(--color-secondary)] hover:underline"
        >
          Learn more <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}
