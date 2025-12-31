'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Page, PageRevision, Block } from '@/types/cms';
import { BlockEditor } from './BlockEditor';
import { BlockPicker } from './BlockPicker';
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  AlertCircle,
  History,
  Settings,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';

interface PageEditorProps {
  page: Page;
  revisions: PageRevision[];
}

export function PageEditor({ page: initialPage, revisions }: PageEditorProps) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [blocks, setBlocks] = useState<Block[]>(initialPage.blocks);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showRevisions, setShowRevisions] = useState(false);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async (publish = false) => {
    if (publish) {
      setIsPublishing(true);
    } else {
      setIsSaving(true);
    }
    setError(null);

    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...page,
          blocks,
          status: publish ? 'published' : page.status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save page');
      }

      const updated = await res.json();
      setPage(updated);
      setHasChanges(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  const handleBlockChange = useCallback((index: number, updatedBlock: Block) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks[index] = updatedBlock;
      return newBlocks;
    });
    setHasChanges(true);
  }, []);

  const handleDeleteBlock = useCallback((index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  }, []);

  const handleMoveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const [moved] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, moved);
      return newBlocks;
    });
    setHasChanges(true);
  }, []);

  const handleAddBlock = useCallback((type: Block['type'], data: unknown) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      data,
      order: insertIndex !== null ? insertIndex : blocks.length,
    };

    if (insertIndex !== null) {
      setBlocks((prev) => {
        const newBlocks = [...prev];
        newBlocks.splice(insertIndex, 0, newBlock);
        return newBlocks;
      });
    } else {
      setBlocks((prev) => [...prev, newBlock]);
    }

    setShowBlockPicker(false);
    setInsertIndex(null);
    setHasChanges(true);
  }, [blocks.length, insertIndex]);

  const handleRestoreRevision = async (revision: PageRevision) => {
    setBlocks(revision.blocks);
    setPage((prev) => ({ ...prev, title: revision.title }));
    setShowRevisions(false);
    setHasChanges(true);
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{page.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <code className="text-sm text-[var(--color-fg-muted)]">/{page.slug}</code>
              {page.status === 'published' ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-700">
                  <Globe size={12} />
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                  <AlertCircle size={12} />
                  Draft
                </span>
              )}
              {hasChanges && (
                <span className="text-xs text-[var(--color-fg-muted)]">• Unsaved changes</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRevisions(true)}
            className="p-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
            title="Revisions"
          >
            <History size={18} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
            title="Page Settings"
          >
            <Settings size={18} />
          </button>
          <Link
            href={`/${page.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors"
          >
            <Eye size={14} />
            Preview
          </Link>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Globe size={14} />
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Page Title */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-4 mb-4">
        <input
          type="text"
          value={page.title}
          onChange={(e) => {
            setPage((prev) => ({ ...prev, title: e.target.value }));
            setHasChanges(true);
          }}
          className="w-full text-2xl font-semibold border-none focus:outline-none"
          placeholder="Page Title"
        />
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={block.id} className="group relative">
            {/* Insert button above */}
            <button
              onClick={() => {
                setInsertIndex(index);
                setShowBlockPicker(true);
              }}
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-secondary)] text-white rounded-full p-1"
            >
              <Plus size={14} />
            </button>

            <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
              {/* Block header */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
                <button
                  className="cursor-grab text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                  title="Drag to reorder"
                >
                  <GripVertical size={16} />
                </button>
                <span className="text-xs font-medium text-[var(--color-fg-muted)] uppercase">
                  {block.type}
                </span>
                <div className="flex-1" />
                {index > 0 && (
                  <button
                    onClick={() => handleMoveBlock(index, index - 1)}
                    className="p-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                {index < blocks.length - 1 && (
                  <button
                    onClick={() => handleMoveBlock(index, index + 1)}
                    className="p-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={() => handleDeleteBlock(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Delete block"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Block editor */}
              <div className="p-4">
                <BlockEditor
                  block={block}
                  onChange={(updated) => handleBlockChange(index, updated)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add block button */}
      <button
        onClick={() => {
          setInsertIndex(null);
          setShowBlockPicker(true);
        }}
        className="w-full mt-4 p-4 border-2 border-dashed border-[var(--color-border)] rounded-lg text-[var(--color-fg-muted)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add Block
      </button>

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <BlockPicker
          onSelect={handleAddBlock}
          onClose={() => {
            setShowBlockPicker(false);
            setInsertIndex(null);
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Page Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-fg-muted)]">/</span>
                  <input
                    type="text"
                    value={page.slug}
                    onChange={(e) => {
                      setPage((prev) => ({ ...prev, slug: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Template</label>
                <select
                  value={page.template}
                  onChange={(e) => {
                    setPage((prev) => ({
                      ...prev,
                      template: e.target.value as Page['template'],
                    }));
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-white"
                >
                  <option value="default">Default</option>
                  <option value="full-width">Full Width</option>
                  <option value="narrow">Narrow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">SEO Title</label>
                <input
                  type="text"
                  value={page.seoTitle || ''}
                  onChange={(e) => {
                    setPage((prev) => ({ ...prev, seoTitle: e.target.value }));
                    setHasChanges(true);
                  }}
                  placeholder={page.title}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">SEO Description</label>
                <textarea
                  value={page.seoDescription || ''}
                  onChange={(e) => {
                    setPage((prev) => ({ ...prev, seoDescription: e.target.value }));
                    setHasChanges(true);
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revisions Modal */}
      {showRevisions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Revision History</h2>

            {revisions.length === 0 ? (
              <p className="text-[var(--color-fg-muted)]">No revisions yet.</p>
            ) : (
              <ul className="space-y-2">
                {revisions.map((revision) => (
                  <li
                    key={revision.id}
                    className="flex items-center justify-between p-3 bg-[var(--color-bg-alt)] rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{revision.title}</p>
                      <p className="text-xs text-[var(--color-fg-muted)]">
                        {new Date(revision.createdAt).toLocaleString()}
                      </p>
                      {revision.editorNote && (
                        <p className="text-xs text-[var(--color-fg-muted)] mt-1">
                          {revision.editorNote}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRestoreRevision(revision)}
                      className="text-sm text-[var(--color-secondary)] hover:underline"
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowRevisions(false)}
                className="px-4 py-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
