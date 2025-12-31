'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LinkedInProfile, LinkedInWorkItem, LinkedInPost } from '@/types/content';
import { Trash2, Plus, X } from 'lucide-react';

interface LinkedInAdminProps {
  profile: LinkedInProfile | null;
  workItems: LinkedInWorkItem[];
  posts: LinkedInPost[];
}

export function LinkedInAdmin({ profile, workItems, posts }: LinkedInAdminProps) {
  const router = useRouter();
  const [showAddWork, setShowAddWork] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newWork, setNewWork] = useState({
    companyName: '',
    title: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [newPost, setNewPost] = useState({
    text: '',
    postUrl: '',
    postedAt: new Date().toISOString().split('T')[0],
  });

  async function handleAddWork(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/linkedin/work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newWork,
          endDate: newWork.endDate || null,
        }),
      });

      if (res.ok) {
        setNewWork({ companyName: '', title: '', startDate: '', endDate: '', description: '' });
        setShowAddWork(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to add work:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteWork(id: string) {
    if (!confirm('Delete this work item?')) return;

    try {
      const res = await fetch(`/api/admin/linkedin/work?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  async function handleAddPost(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/linkedin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        setNewPost({ text: '', postUrl: '', postedAt: new Date().toISOString().split('T')[0] });
        setShowAddPost(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to add post:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(id: string) {
    if (!confirm('Delete this post?')) return;

    try {
      const res = await fetch(`/api/admin/linkedin/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Info */}
      <section className="bg-white border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Profile</h2>
        <div className="space-y-2 text-sm">
          <p><span className="text-[var(--color-fg-muted)]">Headline:</span> {profile?.headline || 'Not set'}</p>
          <p><span className="text-[var(--color-fg-muted)]">Location:</span> {profile?.location || 'Not set'}</p>
          <p><span className="text-[var(--color-fg-muted)]">Last updated:</span> {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Never'}</p>
        </div>
      </section>

      {/* Work Experience */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Work Experience ({workItems.length})</h2>
          <button
            onClick={() => setShowAddWork(true)}
            className="text-sm text-[var(--color-secondary)] hover:underline flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {showAddWork && (
          <form onSubmit={handleAddWork} className="bg-white border border-[var(--color-border)] rounded-lg p-4 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Add Work Experience</h3>
              <button type="button" onClick={() => setShowAddWork(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={newWork.companyName}
                onChange={(e) => setNewWork({ ...newWork, companyName: e.target.value })}
                placeholder="Company"
                className="px-3 py-2 border border-[var(--color-border)] rounded"
                required
              />
              <input
                type="text"
                value={newWork.title}
                onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                placeholder="Title"
                className="px-3 py-2 border border-[var(--color-border)] rounded"
                required
              />
              <input
                type="month"
                value={newWork.startDate}
                onChange={(e) => setNewWork({ ...newWork, startDate: e.target.value })}
                placeholder="Start date"
                className="px-3 py-2 border border-[var(--color-border)] rounded"
                required
              />
              <input
                type="month"
                value={newWork.endDate}
                onChange={(e) => setNewWork({ ...newWork, endDate: e.target.value })}
                placeholder="End date (blank = current)"
                className="px-3 py-2 border border-[var(--color-border)] rounded"
              />
            </div>
            <textarea
              value={newWork.description}
              onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded"
            />
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Adding...' : 'Add'}
            </button>
          </form>
        )}

        <div className="space-y-2">
          {workItems.map((item) => (
            <div key={item.id} className="bg-white border border-[var(--color-border)] rounded-lg p-4 flex items-start justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-[var(--color-fg-muted)]">{item.companyName}</p>
                <p className="text-xs text-[var(--color-fg-subtle)]">
                  {item.startDate} — {item.endDate || 'Present'}
                </p>
              </div>
              <button onClick={() => handleDeleteWork(item.id)} className="text-[var(--color-fg-muted)] hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Posts ({posts.length})</h2>
          <button
            onClick={() => setShowAddPost(true)}
            className="text-sm text-[var(--color-secondary)] hover:underline flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {showAddPost && (
          <form onSubmit={handleAddPost} className="bg-white border border-[var(--color-border)] rounded-lg p-4 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Add Post</h3>
              <button type="button" onClick={() => setShowAddPost(false)}>
                <X size={18} />
              </button>
            </div>
            <textarea
              value={newPost.text}
              onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
              placeholder="Post text"
              rows={3}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={newPost.postedAt}
                onChange={(e) => setNewPost({ ...newPost, postedAt: e.target.value })}
                className="px-3 py-2 border border-[var(--color-border)] rounded"
                required
              />
              <input
                type="url"
                value={newPost.postUrl}
                onChange={(e) => setNewPost({ ...newPost, postUrl: e.target.value })}
                placeholder="LinkedIn post URL (optional)"
                className="px-3 py-2 border border-[var(--color-border)] rounded"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Adding...' : 'Add'}
            </button>
          </form>
        )}

        <div className="space-y-2">
          {posts.length === 0 ? (
            <p className="text-[var(--color-fg-muted)] bg-white border border-[var(--color-border)] rounded-lg p-4">
              No posts yet. Add your LinkedIn posts to display on the Studio page.
            </p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white border border-[var(--color-border)] rounded-lg p-4 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm line-clamp-2">{post.text}</p>
                  <p className="text-xs text-[var(--color-fg-subtle)] mt-1">
                    {new Date(post.postedAt).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => handleDeletePost(post.id)} className="text-[var(--color-fg-muted)] hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
