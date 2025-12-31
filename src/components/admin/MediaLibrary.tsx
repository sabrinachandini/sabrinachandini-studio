'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { MediaItem } from '@/types/cms';
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Film,
  File,
  X,
} from 'lucide-react';

interface MediaLibraryProps {
  initialItems: MediaItem[];
  onSelect?: (item: MediaItem) => void;
  selectable?: boolean;
}

export function MediaLibrary({ initialItems, onSelect, selectable = false }: MediaLibraryProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'pdf' | 'other'>('all');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(search.toLowerCase()) ||
      item.originalFilename.toLowerCase().includes(search.toLowerCase()) ||
      item.altText?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'image') return item.mimeType.startsWith('image/');
    if (filter === 'video') return item.mimeType.startsWith('video/');
    if (filter === 'pdf') return item.mimeType === 'application/pdf';
    return !item.mimeType.startsWith('image/') && !item.mimeType.startsWith('video/') && item.mimeType !== 'application/pdf';
  });

  const handleUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const newItems = await res.json();
      setItems((prev) => [...newItems, ...prev]);
      router.refresh();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  }, [router]);

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Delete failed');
      }

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Film;
    if (mimeType === 'application/pdf') return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Upload */}
        <label className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Upload size={16} />
          {isUploading ? 'Uploading...' : 'Upload Files'}
          <input
            type="file"
            multiple
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            className="hidden"
            disabled={isUploading}
          />
        </label>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-white"
        >
          <option value="all">All Files</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="pdf">PDFs</option>
          <option value="other">Other</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--color-bg-alt)]' : ''}`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-[var(--color-bg-alt)]' : ''}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('border-[var(--color-secondary)]');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('border-[var(--color-secondary)]');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-[var(--color-secondary)]');
          if (e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
          }
        }}
        className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center transition-colors"
      >
        <Upload size={32} className="mx-auto text-[var(--color-fg-muted)] mb-2" />
        <p className="text-[var(--color-fg-muted)]">Drag and drop files here</p>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-fg-muted)]">
          {search || filter !== 'all' ? 'No files match your search' : 'No files uploaded yet'}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => {
            const Icon = getFileIcon(item.mimeType);
            const isImage = item.mimeType.startsWith('image/');

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (selectable && onSelect) {
                    onSelect(item);
                  } else {
                    setSelectedItem(item);
                  }
                }}
                className={`group relative aspect-square bg-[var(--color-bg-alt)] rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                  selectedItem?.id === item.id ? 'border-[var(--color-secondary)]' : 'border-transparent hover:border-[var(--color-border)]'
                }`}
              >
                {isImage ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.originalFilename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <Icon size={32} className="text-[var(--color-fg-muted)]" />
                    <p className="text-xs text-[var(--color-fg-muted)] mt-2 truncate w-full text-center">
                      {item.originalFilename}
                    </p>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="p-2 bg-white rounded-full text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-alt)]">
              <tr>
                <th className="text-left px-4 py-2 text-sm font-medium">File</th>
                <th className="text-left px-4 py-2 text-sm font-medium">Type</th>
                <th className="text-left px-4 py-2 text-sm font-medium">Size</th>
                <th className="text-left px-4 py-2 text-sm font-medium">Date</th>
                <th className="text-right px-4 py-2 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredItems.map((item) => {
                const Icon = getFileIcon(item.mimeType);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--color-bg-alt)] cursor-pointer"
                    onClick={() => {
                      if (selectable && onSelect) {
                        onSelect(item);
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        {item.mimeType.startsWith('image/') ? (
                          <img
                            src={item.url}
                            alt=""
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[var(--color-bg-alt)] rounded flex items-center justify-center">
                            <Icon size={20} className="text-[var(--color-fg-muted)]" />
                          </div>
                        )}
                        <span className="text-sm truncate max-w-[200px]">
                          {item.originalFilename}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-fg-muted)]">
                      {item.mimeType}
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-fg-muted)]">
                      {formatFileSize(item.size)}
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-fg-muted)]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(item.url);
                          }}
                          className="p-1.5 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                          title="Copy URL"
                        >
                          {copiedUrl === item.url ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Panel */}
      {selectedItem && !selectable && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-[var(--color-border)] shadow-lg p-6 overflow-auto z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">File Details</h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="p-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              <X size={18} />
            </button>
          </div>

          {selectedItem.mimeType.startsWith('image/') ? (
            <img
              src={selectedItem.url}
              alt={selectedItem.altText || ''}
              className="w-full rounded-lg mb-4"
            />
          ) : (
            <div className="w-full aspect-square bg-[var(--color-bg-alt)] rounded-lg flex items-center justify-center mb-4">
              {(() => {
                const Icon = getFileIcon(selectedItem.mimeType);
                return <Icon size={48} className="text-[var(--color-fg-muted)]" />;
              })()}
            </div>
          )}

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-[var(--color-fg-muted)]">Filename</dt>
              <dd className="break-all">{selectedItem.originalFilename}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-fg-muted)]">Type</dt>
              <dd>{selectedItem.mimeType}</dd>
            </div>
            <div>
              <dt className="font-medium text-[var(--color-fg-muted)]">Size</dt>
              <dd>{formatFileSize(selectedItem.size)}</dd>
            </div>
            {selectedItem.width && selectedItem.height && (
              <div>
                <dt className="font-medium text-[var(--color-fg-muted)]">Dimensions</dt>
                <dd>{selectedItem.width} x {selectedItem.height}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-[var(--color-fg-muted)]">URL</dt>
              <dd className="flex items-center gap-2">
                <code className="text-xs bg-[var(--color-bg-alt)] px-2 py-1 rounded break-all flex-1">
                  {selectedItem.url}
                </code>
                <button
                  onClick={() => handleCopyUrl(selectedItem.url)}
                  className="p-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  {copiedUrl === selectedItem.url ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </dd>
            </div>
          </dl>

          <button
            onClick={() => handleDelete(selectedItem)}
            className="w-full mt-6 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete File
          </button>
        </div>
      )}
    </div>
  );
}
