import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media',
  description: 'Press, podcasts, talks, and media appearances.',
};

// Since there's no existing media content on sabrinachandini.com,
// we provide a placeholder that can be filled in
const mediaItems = [
  {
    id: '1',
    outlet: 'Coming Soon',
    title: 'Media appearances will be listed here',
    type: 'press' as const,
    blurb:
      'This section will feature press coverage, podcast appearances, talks, and other media. Check back soon!',
    url: '#',
  },
];

const typeLabels = {
  press: 'Press',
  podcast: 'Podcast',
  radio: 'Radio',
  tv: 'TV',
  talks: 'Talk',
};

export default function MediaPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="accent-square" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Media
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            In the press
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)]">
            Interviews, features, and talks.
          </p>
        </div>

        {/* Media list */}
        <div className="space-y-6">
          {mediaItems.map((item) => (
            <article
              key={item.id}
              className="group border-b border-[var(--color-border)] pb-6 last:border-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                      {typeLabels[item.type]}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-fg)]">
                      {item.outlet}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-secondary)] transition-colors">
                    {item.url !== '#' ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        {item.title}
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      item.title
                    )}
                  </h2>
                  {item.blurb && (
                    <p className="text-[var(--color-fg-muted)]">{item.blurb}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state message */}
        <div className="mt-12 bg-[var(--color-bg-alt)] rounded-lg p-8 text-center">
          <p className="text-[var(--color-fg-muted)]">
            Have a media opportunity?{' '}
            <a href="/contact" className="font-medium text-[var(--color-fg)] hover:text-[var(--color-secondary)]">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
