import Link from 'next/link';
import { ExternalLink, Briefcase, ArrowRight } from 'lucide-react';
import type { LinkedInWorkItem, LinkedInPost, LinkedInProfile } from '@/types/content';
import { AdminEditLink } from '@/components/ui/AdminEditLink';

interface PortfolioModuleProps {
  profile: LinkedInProfile | null;
  workItems: LinkedInWorkItem[];
  posts: LinkedInPost[];
}

export function PortfolioModule({ profile, workItems, posts }: PortfolioModuleProps) {
  // Only show the module if there's work experience
  if (workItems.length === 0) {
    return null;
  }

  const lastUpdated = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-[var(--color-fg-muted)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Portfolio
          </span>
          <AdminEditLink href="/admin/linkedin" />
        </div>
        {lastUpdated && (
          <span className="text-xs text-[var(--color-fg-subtle)]">
            Updated {lastUpdated}
          </span>
        )}
      </div>

      {/* Work Experience */}
      <div className="space-y-3 mb-4">
        {workItems.slice(0, 2).map((item) => (
          <div key={item.id}>
            <p className="font-medium text-sm">{item.title}</p>
            <p className="text-sm text-[var(--color-fg-muted)]">
              {item.companyName}
              <span className="mx-1">•</span>
              <span className="text-[var(--color-fg-subtle)]">
                {item.startDate} — {item.endDate || 'Present'}
              </span>
            </p>
            {item.description && (
              <p className="text-sm text-[var(--color-fg-muted)] mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Posts (only if they exist) */}
      {posts.length > 0 && (
        <>
          <div className="border-t border-[var(--color-border)] pt-4 mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-3">
              Recent Posts
            </p>
            <div className="space-y-3">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="group">
                  <p className="text-sm text-[var(--color-fg-muted)] line-clamp-2">
                    {post.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--color-fg-subtle)]">
                      {new Date(post.postedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {post.postUrl && (
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1"
                      >
                        Open
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* View All Link */}
      <Link
        href="/portfolio"
        className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline mt-4 pt-4 border-t border-[var(--color-border)]"
      >
        View full portfolio
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
