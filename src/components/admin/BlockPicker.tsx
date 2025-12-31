'use client';

import type { Block } from '@/types/cms';
import { X } from 'lucide-react';

interface BlockPickerProps {
  onSelect: (type: Block['type'], data: unknown) => void;
  onClose: () => void;
}

const blockTypes: Array<{
  type: Block['type'];
  label: string;
  description: string;
  category: 'content' | 'layout' | 'module';
  defaultData: unknown;
}> = [
  // Content blocks
  {
    type: 'heading',
    label: 'Heading',
    description: 'Section title or heading',
    category: 'content',
    defaultData: { text: '', level: 2 },
  },
  {
    type: 'richtext',
    label: 'Rich Text',
    description: 'Paragraph or formatted text',
    category: 'content',
    defaultData: { html: '' },
  },
  {
    type: 'bulletedList',
    label: 'Bulleted List',
    description: 'Simple bullet point list',
    category: 'content',
    defaultData: { items: [''] },
  },
  {
    type: 'linkList',
    label: 'Link List',
    description: 'List of links with labels',
    category: 'content',
    defaultData: { links: [{ label: '', url: '' }] },
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'Blockquote with attribution',
    category: 'content',
    defaultData: { text: '', attribution: '' },
  },
  {
    type: 'callout',
    label: 'Callout',
    description: 'Highlighted info box',
    category: 'content',
    defaultData: { type: 'info', title: '', text: '' },
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Single image with caption',
    category: 'content',
    defaultData: { src: '', alt: '', caption: '' },
  },
  {
    type: 'gallery',
    label: 'Gallery',
    description: 'Multiple images in a grid',
    category: 'content',
    defaultData: { images: [], columns: 3 },
  },
  {
    type: 'cardGrid',
    label: 'Card Grid',
    description: 'Grid of content cards',
    category: 'content',
    defaultData: { cards: [], columns: 3 },
  },
  // Layout blocks
  {
    type: 'divider',
    label: 'Divider',
    description: 'Horizontal line separator',
    category: 'layout',
    defaultData: {},
  },
  // Module blocks
  {
    type: 'experimentsList',
    label: 'Experiments List',
    description: 'List of experiments from database',
    category: 'module',
    defaultData: {},
  },
  {
    type: 'collectionGrid',
    label: 'Collection Grid',
    description: 'Grid of collection items',
    category: 'module',
    defaultData: {},
  },
  {
    type: 'logList',
    label: 'Build Log',
    description: 'Recent build log entries',
    category: 'module',
    defaultData: { limit: 10 },
  },
  {
    type: 'questionNotes',
    label: 'Question Notes',
    description: 'Question notes and answers',
    category: 'module',
    defaultData: {},
  },
  {
    type: 'guestbookForm',
    label: 'Guestbook',
    description: 'Guestbook entries and form',
    category: 'module',
    defaultData: {},
  },
  {
    type: 'portfolioWork',
    label: 'Portfolio Work',
    description: 'Work experience items',
    category: 'module',
    defaultData: {},
  },
  {
    type: 'portfolioPosts',
    label: 'Portfolio Posts',
    description: 'LinkedIn-style posts',
    category: 'module',
    defaultData: {},
  },
  {
    type: 'obsessionModule',
    label: 'Obsession',
    description: 'Current obsession display',
    category: 'module',
    defaultData: {},
  },
  {
    type: 'mediaList',
    label: 'Media Library',
    description: 'Display media items',
    category: 'module',
    defaultData: {},
  },
];

const categories = [
  { key: 'content', label: 'Content' },
  { key: 'layout', label: 'Layout' },
  { key: 'module', label: 'Modules' },
] as const;

export function BlockPicker({ onSelect, onClose }: BlockPickerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold">Add Block</h2>
          <button
            onClick={onClose}
            className="p-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {categories.map((category) => {
            const categoryBlocks = blockTypes.filter((b) => b.category === category.key);
            if (categoryBlocks.length === 0) return null;

            return (
              <div key={category.key} className="mb-6 last:mb-0">
                <h3 className="text-sm font-medium text-[var(--color-fg-muted)] uppercase mb-3">
                  {category.label}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categoryBlocks.map((block) => (
                    <button
                      key={block.type}
                      onClick={() => onSelect(block.type, block.defaultData)}
                      className="p-3 text-left border border-[var(--color-border)] rounded-lg hover:border-[var(--color-secondary)] hover:bg-[var(--color-bg-alt)] transition-colors"
                    >
                      <p className="font-medium text-sm">{block.label}</p>
                      <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                        {block.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
