'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { CollectionGrid } from '@/components/blocks/CollectionGrid';
import type { CollectionItem } from '@/types/content';

function CollectionContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [items, setItems] = useState<CollectionItem[]>([]);
  const [relatedItems, setRelatedItems] = useState<Record<string, CollectionItem[]>>({});
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collection')
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items);
        setRelatedItems(data.related);
        setLoading(false);
      });
  }, []);

  const categories = [
    'all',
    'tools',
    'ideas',
    'people',
    'places',
    'ephemera',
    'notes',
  ];

  const tabs = categories.map((cat) => ({
    id: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: cat === 'all' ? items.length : items.filter((i) => i.category === cat).length,
  }));

  const filteredItems =
    activeTab === 'all' ? items : items.filter((i) => i.category === activeTab);

  return (
    <>
      {/* Filters */}
      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="text-center py-12 text-[var(--color-fg-muted)]">
            Loading collection...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-fg-muted)]">
            No items found.
          </div>
        ) : (
          <CollectionGrid items={filteredItems} relatedItems={relatedItems} />
        )}
      </div>
    </>
  );
}

export default function CollectionPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="accent-square" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Collection
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Things that matter
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)] max-w-2xl">
            Tools, ideas, people, and places that shape how I work and think. A curated cabinet of curiosities.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-[var(--color-fg-muted)]">Loading...</div>}>
          <CollectionContent />
        </Suspense>
      </div>
    </div>
  );
}
