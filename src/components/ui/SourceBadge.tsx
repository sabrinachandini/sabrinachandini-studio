'use client';

import { type VerbatimSource } from '@/lib/verbatim';

interface SourceBadgeProps {
  source: VerbatimSource;
  className?: string;
}

/**
 * Dev-only source badge that displays where content came from.
 * Only renders when VERBATIM_DEBUG=1 is set in environment.
 * Shows "Source: repo <files>" or "Source: crawl <url>"
 */
export function SourceBadge({ source, className = '' }: SourceBadgeProps) {
  // Check if debug mode is enabled (passed via prop or hardcoded for now)
  const isDebug = process.env.NEXT_PUBLIC_VERBATIM_DEBUG === '1';

  if (!isDebug) {
    return null;
  }

  const sourceText =
    source.type === 'crawl' && source.url
      ? `crawl ${source.url}`
      : source.type === 'repo' && source.files?.length
        ? `repo ${source.files.join(', ')}`
        : source.type;

  const capturedDate = new Date(source.capturedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`source-badge text-xs font-mono text-neutral-400 border-t border-neutral-200 pt-2 mt-4 ${className}`}
    >
      <span className="text-neutral-500">Source:</span> {sourceText}
      <span className="mx-2">·</span>
      <span className="text-neutral-500">Captured:</span> {capturedDate}
    </div>
  );
}

/**
 * Inline source indicator for smaller contexts
 */
export function SourceIndicator({ source }: { source: VerbatimSource }) {
  const isDebug = process.env.NEXT_PUBLIC_VERBATIM_DEBUG === '1';

  if (!isDebug) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
      {source.type === 'repo' ? '📁' : '🌐'} {source.type}
    </span>
  );
}
