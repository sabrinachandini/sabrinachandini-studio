'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { TagPill } from '@/components/ui/TagPill';
import { ExternalLink } from 'lucide-react';
import type { CollectionItem } from '@/types/content';
import { cn } from '@/lib/utils';

interface CollectionGridProps {
  items: CollectionItem[];
  relatedItems?: Record<string, CollectionItem[]>;
}

// Category icons (simple geometric shapes for Bauhaus feel)
const categoryIcons: Record<string, React.ReactNode> = {
  ephemera: <span className="w-4 h-4 rounded-full bg-[var(--color-secondary)]" />,
  tools: <span className="w-4 h-4 bg-[var(--color-accent)]" />,
  notes: <span className="w-4 h-1 bg-[var(--color-fg-muted)]" />,
  places: <span className="w-4 h-4 border-2 border-[var(--color-secondary)] rounded" />,
  people: <span className="w-4 h-4 border-2 border-[var(--color-accent)] rounded-full" />,
  ideas: (
    <span className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-[var(--color-secondary)]" />
  ),
};

export function CollectionGrid({ items, relatedItems = {} }: CollectionGridProps) {
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.button
            key={item.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            onClick={() => setSelectedItem(item)}
            className={cn(
              'text-left bg-white border border-[var(--color-border)] rounded p-4',
              'transition-all duration-200',
              'hover:border-[var(--color-border-strong)] hover:shadow-md',
              'group'
            )}
          >
            {/* Image or Icon */}
            {item.image ? (
              <div className="relative aspect-square mb-3 overflow-hidden rounded bg-[var(--color-bg-alt)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-square mb-3 flex items-center justify-center bg-[var(--color-bg-alt)] rounded">
                <div className="scale-[2]">
                  {categoryIcons[item.category] || categoryIcons.ideas}
                </div>
              </div>
            )}

            {/* Category + Year */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-fg-subtle)]">
                {item.category}
              </span>
              {item.year && (
                <span className="text-xs text-[var(--color-fg-subtle)]">
                  {item.year}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2">
              {item.title}
            </h3>
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title}
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Image */}
            {selectedItem.image && (
              <div className="relative aspect-video overflow-hidden rounded bg-[var(--color-bg-alt)]">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-2">
              <TagPill label={selectedItem.category} />
              {selectedItem.year && (
                <span className="text-sm text-[var(--color-fg-subtle)]">
                  {selectedItem.year}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[var(--color-fg-muted)] leading-relaxed">
              {selectedItem.description}
            </p>

            {/* Why it matters */}
            {selectedItem.whyItMatters && (
              <div className="bg-[var(--color-bg-alt)] rounded p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)] mb-2">
                  Why it matters
                </h4>
                <p className="text-sm text-[var(--color-fg)]">
                  {selectedItem.whyItMatters}
                </p>
              </div>
            )}

            {/* Links */}
            {selectedItem.links && selectedItem.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedItem.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--color-fg)] hover:text-[var(--color-secondary)] transition-colors"
                  >
                    {link.label}
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            )}

            {/* Related items */}
            {relatedItems[selectedItem.slug]?.length > 0 && (
              <div className="pt-4 border-t border-[var(--color-border)]">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)] mb-3">
                  Related
                </h4>
                <div className="flex flex-wrap gap-2">
                  {relatedItems[selectedItem.slug].map((related) => (
                    <button
                      key={related.slug}
                      onClick={() => setSelectedItem(related)}
                      className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-secondary)] transition-colors"
                    >
                      {related.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
