'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { CollectionGrid as CollectionGridComponent } from '@/components/blocks/CollectionGrid';
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

  const categories = ['all', 'tools', 'ideas', 'people', 'places', 'ephemera', 'notes'];

  const tabs = categories.map((cat) => ({
    id: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: cat === 'all' ? items.length : items.filter((i) => i.category === cat).length,
  }));

  const filteredItems =
    activeTab === 'all' ? items : items.filter((i) => i.category === activeTab);

  return (
    <>
      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {loading ? (
          <div className="text-center py-8 text-[var(--color-fg-muted)]">
            Loading collection...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-fg-muted)]">
            No items found.
          </div>
        ) : (
          <CollectionGridComponent items={filteredItems} relatedItems={relatedItems} />
        )}
      </div>
    </>
  );
}

export function CollectionGrid() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-[var(--color-fg-muted)]">Loading...</div>}>
      <CollectionContent />
    </Suspense>
  );
}
