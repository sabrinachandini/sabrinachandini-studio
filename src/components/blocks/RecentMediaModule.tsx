'use client';

import Link from 'next/link';
import { ExternalLink, Mic, ArrowRight } from 'lucide-react';
import type { MediaItem, MediaType } from '@/types/content';

interface RecentMediaModuleProps {
  items: MediaItem[];
}

const typeLabels: Record<MediaType, string> = {
  press: 'Press',
  podcast: 'Podcast',
  talk: 'Talk',
  interview: 'Interview',
  feature: 'Feature',
  other: 'Other',
};

const typeColors: Record<MediaType, string> = {
  press: 'bg-blue-100 text-blue-700',
  podcast: 'bg-purple-100 text-purple-700',
  talk: 'bg-orange-100 text-orange-700',
  interview: 'bg-cyan-100 text-cyan-700',
  feature: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-600',
};

export function RecentMediaModule({ items }: RecentMediaModuleProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic size={16} className="text-[var(--color-secondary)]" />
          <h3 className="font-semibold text-sm">In the Press</h3>
        </div>
        <Link
          href="/media"
          className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] flex items-center gap-1"
        >
          View all
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Items */}
      <ul className="divide-y divide-[var(--color-border)]">
        {items.slice(0, 4).map((item) => (
          <li key={item.slug} className="px-4 py-3 hover:bg-[var(--color-bg-alt)] transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${typeColors[item.type]}`}>
                    {typeLabels[item.type]}
                  </span>
                  {item.outlet && (
                    <span className="text-xs text-[var(--color-fg-muted)]">{item.outlet}</span>
                  )}
                </div>
                <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                {item.date && (
                  <p className="text-xs text-[var(--color-fg-subtle)] mt-0.5">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-[var(--color-fg-muted)] hover:text-[var(--color-secondary)] transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      {items.length === 0 && (
        <div className="px-4 py-6 text-center text-sm text-[var(--color-fg-muted)]">
          Media appearances will appear here once added.
        </div>
      )}
    </div>
  );
}
