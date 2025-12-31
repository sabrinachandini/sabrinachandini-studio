'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, FileText, Film, File } from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  url: string;
  size: number;
}

export function MediaList() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/media');
        const data = await res.json();
        setItems(data || []);
      } catch (error) {
        console.error('Failed to fetch media:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    if (mimeType.startsWith('video/')) return Film;
    if (mimeType === 'application/pdf') return FileText;
    return File;
  };

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-[var(--color-fg-muted)] py-8">
        No media items yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item) => {
        const Icon = getFileIcon(item.mimeType);
        const isImage = item.mimeType.startsWith('image/');

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-[var(--color-bg-alt)] rounded-lg overflow-hidden"
          >
            {isImage ? (
              <img
                src={item.url}
                alt={item.originalFilename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <Icon size={32} className="text-[var(--color-fg-muted)]" />
                <p className="text-xs text-[var(--color-fg-muted)] mt-2 truncate w-full text-center">
                  {item.originalFilename}
                </p>
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}
