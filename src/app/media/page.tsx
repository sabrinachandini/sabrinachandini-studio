import Link from 'next/link';
import { ExternalLink, Mail, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getMedia, getMediaByYear, getRecentMediaUpdates, getMediaKit } from '@/lib/content';
import type { MediaItem, MediaType } from '@/types/content';

export const metadata: Metadata = {
  title: 'Media',
  description: 'Press, podcasts, talks, and media appearances.',
};

const typeLabels: Record<MediaType, string> = {
  press: 'Press',
  podcast: 'Podcast',
  talk: 'Talk',
  interview: 'Interview',
  feature: 'Feature',
  other: 'Other',
};

const typeActions: Record<MediaType, string> = {
  press: 'Read',
  podcast: 'Listen',
  talk: 'Watch',
  interview: 'Read',
  feature: 'Read',
  other: 'View',
};

function MediaCard({ item }: { item: MediaItem }) {
  const hasExternalLink = !!item.url;
  const hasInternalLink = !!item.internalPath;

  return (
    <article className="group border-b border-[var(--color-border)] pb-6 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
              {typeLabels[item.type]}
            </span>
            <span className="text-sm font-medium text-[var(--color-fg)]">
              {item.outlet}
            </span>
            {item.date && (
              <span className="text-xs text-[var(--color-fg-subtle)]">
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-secondary)] transition-colors">
            {item.title}
          </h2>

          {/* Description */}
          <p className="text-[var(--color-fg-muted)] mb-3">{item.description}</p>

          {/* Why it mattered (hover reveal) */}
          {item.whyItMattered && (
            <p className="text-sm text-[var(--color-fg-subtle)] opacity-0 group-hover:opacity-100 transition-opacity mb-3 italic">
              {item.whyItMattered}
            </p>
          )}

          {/* Links */}
          <div className="flex items-center gap-4">
            {hasExternalLink && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)] hover:text-[var(--color-secondary)] transition-colors"
              >
                {typeActions[item.type]}
                <ExternalLink size={14} />
              </a>
            )}
            {hasInternalLink && (
              <Link
                href={item.internalPath!}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)] hover:text-[var(--color-secondary)] transition-colors"
              >
                More
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function YearSection({ year, items }: { year: number; items: MediaItem[] }) {
  return (
    <section id={`year-${year}`} className="mb-12">
      <h3 className="text-sm font-semibold text-[var(--color-fg-subtle)] uppercase tracking-wide mb-6 sticky top-20 bg-[var(--color-bg)] py-2">
        {year}
      </h3>
      <div className="space-y-6">
        {items.map((item) => (
          <MediaCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[var(--color-bg-alt)] rounded-full">
        <span className="w-4 h-4 bg-[var(--color-secondary)]" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No media items yet</h2>
      <p className="text-[var(--color-fg-muted)] max-w-md mx-auto mb-6">
        Media appearances, press features, podcast interviews, and talks will appear here once added.
      </p>
      <p className="text-sm text-[var(--color-fg-subtle)]">
        To add media items, create JSON files in <code className="bg-[var(--color-bg-alt)] px-1.5 py-0.5 rounded text-xs">/content/media/</code>
      </p>
    </div>
  );
}

export default async function MediaPage() {
  const [allMedia, mediaByYear, recentUpdates, mediaKit] = await Promise.all([
    getMedia(),
    getMediaByYear(),
    getRecentMediaUpdates(5),
    getMediaKit(),
  ]);

  const years = Object.keys(mediaByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const hasMedia = allMedia.length > 0;

  // Get unique types that have at least one item
  const availableTypes = [...new Set(allMedia.map((item) => item.type))];

  // Find most recent update
  const lastUpdated = hasMedia
    ? new Date(
        Math.max(...allMedia.map((item) => new Date(item.updatedAt).getTime()))
      ).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="accent-square" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Media
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            In the press
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)] mb-4">
            Interviews, features, and talks.
          </p>
          {hasMedia && lastUpdated && (
            <p className="text-sm text-[var(--color-fg-subtle)]">
              Last updated {lastUpdated} &bull; {allMedia.length} item{allMedia.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {hasMedia ? (
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar - Year navigation */}
            <aside className="col-span-12 md:col-span-3 lg:col-span-2">
              <div className="sticky top-24">
                {/* Year links */}
                <nav className="mb-8">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-3">
                    Years
                  </h4>
                  <ul className="space-y-1">
                    {years.map((year) => (
                      <li key={year}>
                        <a
                          href={`#year-${year}`}
                          className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
                        >
                          {year}
                          <span className="text-[var(--color-fg-subtle)] ml-1">
                            ({mediaByYear[year].length})
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Type filters info */}
                {availableTypes.length > 1 && (
                  <div className="mb-8">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-3">
                      Types
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {availableTypes.map((type) => (
                        <span
                          key={type}
                          className="text-xs px-2 py-1 bg-[var(--color-bg-alt)] text-[var(--color-fg-muted)] rounded"
                        >
                          {typeLabels[type]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent updates */}
                {recentUpdates.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-3">
                      Recent Updates
                    </h4>
                    <ul className="space-y-2">
                      {recentUpdates.slice(0, 3).map((item) => (
                        <li key={item.slug} className="text-xs text-[var(--color-fg-subtle)]">
                          <span className="text-[var(--color-fg-muted)]">{item.title.slice(0, 25)}...</span>
                          <br />
                          {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            {/* Main content */}
            <main className="col-span-12 md:col-span-9 lg:col-span-10">
              {years.map((year) => (
                <YearSection key={year} year={year} items={mediaByYear[year]} />
              ))}
            </main>
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Media Kit */}
        {mediaKit && (
          <section className="mt-16 pt-16 border-t border-[var(--color-border)]">
            <div className="max-w-2xl">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-6">
                Media Kit
              </h2>

              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Bio</h3>
                  <p className="text-[var(--color-fg-muted)]">{mediaKit.bio}</p>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Contact</h3>
                  <a
                    href={`mailto:${mediaKit.contactEmail}`}
                    className="inline-flex items-center gap-2 text-[var(--color-fg)] hover:text-[var(--color-secondary)] transition-colors"
                  >
                    <Mail size={16} />
                    {mediaKit.contactEmail}
                  </a>
                </div>

                {/* Social links */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Connect</h3>
                  <div className="flex gap-4">
                    {mediaKit.socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Suggest an update CTA */}
        <section className="mt-12 bg-[var(--color-bg-alt)] rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Have a media opportunity?</h3>
              <p className="text-sm text-[var(--color-fg-muted)]">
                Open to interviews, podcasts, speaking engagements, and features.
              </p>
            </div>
            <Link
              href="/contact?subject=Media%20Inquiry"
              className="btn btn-secondary text-sm"
            >
              Get in touch
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
