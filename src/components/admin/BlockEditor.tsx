'use client';

import type { Block } from '@/types/cms';
import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
}

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  const updateData = (updates: Partial<typeof block.data>) => {
    onChange({
      ...block,
      data: { ...(block.data as object), ...updates },
    });
  };

  const data = block.data as Record<string, unknown>;

  switch (block.type) {
    case 'heading':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={(data.text as string) || ''}
            onChange={(e) => updateData({ text: e.target.value })}
            className="w-full text-xl font-semibold border-none focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] rounded px-2 py-1"
            placeholder="Heading text..."
          />
          <select
            value={(data.level as number) || 2}
            onChange={(e) => updateData({ level: parseInt(e.target.value) })}
            className="text-sm border border-[var(--color-border)] rounded px-2 py-1"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
          </select>
        </div>
      );

    case 'richtext':
      return (
        <textarea
          value={(data.html as string) || ''}
          onChange={(e) => updateData({ html: e.target.value })}
          rows={6}
          className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] resize-y"
          placeholder="Enter rich text content (HTML supported)..."
        />
      );

    case 'bulletedList':
      return (
        <BulletedListEditor
          items={(data.items as string[]) || []}
          onChange={(items) => updateData({ items })}
        />
      );

    case 'linkList':
      return (
        <LinkListEditor
          links={(data.links as Array<{ label: string; url: string; description?: string }>) || []}
          onChange={(links) => updateData({ links })}
        />
      );

    case 'quote':
      return (
        <div className="space-y-2">
          <textarea
            value={(data.text as string) || ''}
            onChange={(e) => updateData({ text: e.target.value })}
            rows={3}
            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 italic focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            placeholder="Quote text..."
          />
          <input
            type="text"
            value={(data.attribution as string) || ''}
            onChange={(e) => updateData({ attribution: e.target.value })}
            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            placeholder="Attribution (optional)"
          />
        </div>
      );

    case 'callout':
      return (
        <div className="space-y-2">
          <select
            value={(data.type as string) || 'info'}
            onChange={(e) => updateData({ type: e.target.value })}
            className="text-sm border border-[var(--color-border)] rounded px-2 py-1"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <input
            type="text"
            value={(data.title as string) || ''}
            onChange={(e) => updateData({ title: e.target.value })}
            className="w-full font-medium border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            placeholder="Callout title (optional)"
          />
          <textarea
            value={(data.text as string) || ''}
            onChange={(e) => updateData({ text: e.target.value })}
            rows={3}
            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            placeholder="Callout content..."
          />
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={(data.src as string) || ''}
              onChange={(e) => updateData({ src: e.target.value })}
              className="flex-1 border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              placeholder="Image URL or /uploads/filename.jpg"
            />
            <button
              type="button"
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-alt)] transition-colors"
            >
              <ImageIcon size={16} />
            </button>
          </div>
          <input
            type="text"
            value={(data.alt as string) || ''}
            onChange={(e) => updateData({ alt: e.target.value })}
            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            placeholder="Alt text"
          />
          <input
            type="text"
            value={(data.caption as string) || ''}
            onChange={(e) => updateData({ caption: e.target.value })}
            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            placeholder="Caption (optional)"
          />
        </div>
      );

    case 'gallery':
      return (
        <GalleryEditor
          images={(data.images as Array<{ src: string; alt: string; caption?: string }>) || []}
          columns={(data.columns as number) || 3}
          onChange={(images, columns) => updateData({ images, columns })}
        />
      );

    case 'cardGrid':
      return (
        <CardGridEditor
          cards={(data.cards as Array<{ title: string; description: string; link?: string; image?: string }>) || []}
          columns={(data.columns as number) || 3}
          onChange={(cards, columns) => updateData({ cards, columns })}
        />
      );

    case 'divider':
      return (
        <div className="py-4">
          <hr className="border-[var(--color-border)]" />
          <p className="text-xs text-center text-[var(--color-fg-muted)] mt-2">Divider</p>
        </div>
      );

    // Module blocks - these are rendered dynamically
    case 'experimentsList':
    case 'collectionGrid':
    case 'logList':
    case 'questionNotes':
    case 'guestbookForm':
    case 'portfolioWork':
    case 'portfolioPosts':
    case 'obsessionModule':
    case 'mediaList':
      return (
        <div className="py-6 text-center bg-[var(--color-bg-alt)] rounded-lg">
          <p className="text-[var(--color-fg-muted)]">
            <strong className="capitalize">{block.type.replace(/([A-Z])/g, ' $1').trim()}</strong>
          </p>
          <p className="text-xs text-[var(--color-fg-subtle)] mt-1">
            This dynamic module will render content from the database
          </p>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          Unknown block type: {block.type}
        </div>
      );
  }
}

// Helper component for bulleted list editing
function BulletedListEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, '']);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-[var(--color-fg-muted)]">•</span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="flex-1 border border-[var(--color-border)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            placeholder="List item..."
          />
          <button
            onClick={() => removeItem(index)}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline"
      >
        <Plus size={14} />
        Add item
      </button>
    </div>
  );
}

// Helper component for link list editing
function LinkListEditor({
  links,
  onChange,
}: {
  links: Array<{ label: string; url: string; description?: string }>;
  onChange: (links: Array<{ label: string; url: string; description?: string }>) => void;
}) {
  const updateLink = (
    index: number,
    updates: Partial<{ label: string; url: string; description: string }>
  ) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], ...updates };
    onChange(newLinks);
  };

  const addLink = () => {
    onChange([...links, { label: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1 space-y-1">
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(index, { label: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              placeholder="Link text"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(index, { url: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              placeholder="https://..."
            />
          </div>
          <button
            onClick={() => removeLink(index)}
            className="p-1 text-red-500 hover:text-red-700 mt-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={addLink}
        className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline"
      >
        <Plus size={14} />
        Add link
      </button>
    </div>
  );
}

// Helper component for gallery editing
function GalleryEditor({
  images,
  columns,
  onChange,
}: {
  images: Array<{ src: string; alt: string; caption?: string }>;
  columns: number;
  onChange: (images: Array<{ src: string; alt: string; caption?: string }>, columns: number) => void;
}) {
  const updateImage = (
    index: number,
    updates: Partial<{ src: string; alt: string; caption: string }>
  ) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], ...updates };
    onChange(newImages, columns);
  };

  const addImage = () => {
    onChange([...images, { src: '', alt: '' }], columns);
  };

  const removeImage = (index: number) => {
    onChange(
      images.filter((_, i) => i !== index),
      columns
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm">Columns:</label>
        <select
          value={columns}
          onChange={(e) => onChange(images, parseInt(e.target.value))}
          className="border border-[var(--color-border)] rounded px-2 py-1"
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>
      {images.map((img, index) => (
        <div key={index} className="flex gap-2 items-start p-2 bg-[var(--color-bg-alt)] rounded">
          <div className="flex-1 space-y-1">
            <input
              type="text"
              value={img.src}
              onChange={(e) => updateImage(index, { src: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded px-2 py-1"
              placeholder="Image URL"
            />
            <input
              type="text"
              value={img.alt}
              onChange={(e) => updateImage(index, { alt: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded px-2 py-1 text-sm"
              placeholder="Alt text"
            />
          </div>
          <button
            onClick={() => removeImage(index)}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={addImage}
        className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline"
      >
        <Plus size={14} />
        Add image
      </button>
    </div>
  );
}

// Helper component for card grid editing
function CardGridEditor({
  cards,
  columns,
  onChange,
}: {
  cards: Array<{ title: string; description: string; link?: string; image?: string }>;
  columns: number;
  onChange: (cards: Array<{ title: string; description: string; link?: string; image?: string }>, columns: number) => void;
}) {
  const updateCard = (
    index: number,
    updates: Partial<{ title: string; description: string; link: string; image: string }>
  ) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], ...updates };
    onChange(newCards, columns);
  };

  const addCard = () => {
    onChange([...cards, { title: '', description: '' }], columns);
  };

  const removeCard = (index: number) => {
    onChange(
      cards.filter((_, i) => i !== index),
      columns
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm">Columns:</label>
        <select
          value={columns}
          onChange={(e) => onChange(cards, parseInt(e.target.value))}
          className="border border-[var(--color-border)] rounded px-2 py-1"
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>
      {cards.map((card, index) => (
        <div key={index} className="p-3 bg-[var(--color-bg-alt)] rounded space-y-2">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={card.title}
                onChange={(e) => updateCard(index, { title: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded px-2 py-1 font-medium"
                placeholder="Card title"
              />
              <textarea
                value={card.description}
                onChange={(e) => updateCard(index, { description: e.target.value })}
                rows={2}
                className="w-full border border-[var(--color-border)] rounded px-2 py-1 text-sm resize-none"
                placeholder="Description"
              />
              <input
                type="text"
                value={card.link || ''}
                onChange={(e) => updateCard(index, { link: e.target.value })}
                className="w-full border border-[var(--color-border)] rounded px-2 py-1 text-sm"
                placeholder="Link URL (optional)"
              />
            </div>
            <button
              onClick={() => removeCard(index)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addCard}
        className="flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline"
      >
        <Plus size={14} />
        Add card
      </button>
    </div>
  );
}
