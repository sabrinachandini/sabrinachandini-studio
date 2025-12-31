'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { Obsession } from '@/types/content';
import { AdminEditLink } from '@/components/ui/AdminEditLink';

interface ObsessionModuleProps {
  obsession: Obsession;
}

export function ObsessionModule({ obsession }: ObsessionModuleProps) {
  const [expanded, setExpanded] = useState(false);

  const monthYear = new Date(obsession.month + '-01').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
              {obsession.type}
            </span>
            <span className="text-xs text-[var(--color-fg-subtle)]">•</span>
            <span className="text-xs text-[var(--color-fg-subtle)]">{monthYear}</span>
          </div>
          <AdminEditLink href="/admin/obsession" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{obsession.title}</h3>
        <p className="text-[var(--color-fg-muted)]">{obsession.oneLiner}</p>
      </div>

      {/* Expandable Why Now */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between text-sm text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-alt)] transition-colors"
      >
        <span>Why now?</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-2 bg-[var(--color-bg-alt)]">
          <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
            {obsession.whyNow}
          </p>
          {obsession.links && obsession.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {obsession.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-secondary)] hover:underline"
                >
                  {link.label}
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
