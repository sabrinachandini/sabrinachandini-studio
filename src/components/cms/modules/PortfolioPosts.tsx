'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ThumbsUp, MessageSquare } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  url?: string;
  likes?: number;
  comments?: number;
  createdAt: string;
}

export function PortfolioPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/linkedin/posts');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-[var(--color-fg-muted)] py-8">
        No posts yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 bg-white border border-[var(--color-border)] rounded-lg"
        >
          <p className="text-[var(--color-fg)] whitespace-pre-wrap">
            {post.content.length > 300
              ? `${post.content.slice(0, 300)}...`
              : post.content}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-4 text-sm text-[var(--color-fg-muted)]">
              {post.likes !== undefined && (
                <span className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  {post.likes}
                </span>
              )}
              {post.comments !== undefined && (
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {post.comments}
                </span>
              )}
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            {post.url && (
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline"
              >
                View <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
