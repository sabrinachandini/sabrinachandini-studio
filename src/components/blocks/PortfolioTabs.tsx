'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { LinkedInWorkItem, LinkedInPost } from '@/types/content';

interface PortfolioTabsProps {
  work: LinkedInWorkItem[];
  posts: LinkedInPost[];
}

export function PortfolioTabs({ work, posts }: PortfolioTabsProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'posts'>('work');

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex gap-1 border-b border-[var(--color-border)] mb-6">
        <button
          onClick={() => setActiveTab('work')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors relative',
            activeTab === 'work'
              ? 'text-[var(--color-fg)]'
              : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
          )}
        >
          Work Experience
          {activeTab === 'work' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-secondary)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors relative',
            activeTab === 'posts'
              ? 'text-[var(--color-fg)]'
              : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
          )}
        >
          Posts
          {activeTab === 'posts' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-secondary)]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'work' && (
        <div className="space-y-6">
          {work.length === 0 ? (
            <p className="text-[var(--color-fg-muted)]">No work experience added yet.</p>
          ) : (
            work.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[var(--color-border)] rounded-lg p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-[var(--color-secondary)] font-medium">
                      {item.companyName}
                    </p>
                  </div>
                  <span className="text-sm text-[var(--color-fg-muted)] whitespace-nowrap">
                    {item.startDate} — {item.endDate || 'Present'}
                  </span>
                </div>
                {item.description && (
                  <p className="text-[var(--color-fg-muted)] mt-3">{item.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-[var(--color-fg-muted)]">No posts added yet.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-[var(--color-border)] rounded-lg p-5"
              >
                <p className="text-[var(--color-fg)] whitespace-pre-wrap">{post.text}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-fg-subtle)]">
                    {new Date(post.postedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  {post.postUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--color-secondary)] hover:underline"
                    >
                      View on LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
