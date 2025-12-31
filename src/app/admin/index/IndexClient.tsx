'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, FileText, Beaker, BookOpen, Mic, MessageSquare, PenTool, Users, Briefcase, Filter } from 'lucide-react';
import { trackIndexSearch, trackIndexFilter, trackIndexClick } from '@/lib/posthog';

// Content types for filtering
type ContentType = 'all' | 'pages' | 'experiments' | 'collection' | 'media' | 'question' | 'log' | 'guestbook' | 'work';
type StatusFilter = 'all' | 'published' | 'draft' | 'pending';

interface IndexItem {
  id: string;
  title: string;
  type: ContentType;
  status: 'published' | 'draft' | 'pending' | 'active' | 'archived';
  href: string;
  updatedAt: string;
  description?: string;
}

interface IndexData {
  pages: IndexItem[];
  experiments: IndexItem[];
  collection: IndexItem[];
  media: IndexItem[];
  questionNotes: IndexItem[];
  log: IndexItem[];
  guestbook: IndexItem[];
  work: IndexItem[];
}

const TYPE_CONFIG: Record<ContentType, { label: string; icon: typeof FileText; color: string }> = {
  all: { label: 'All', icon: Filter, color: 'text-gray-600' },
  pages: { label: 'Pages', icon: FileText, color: 'text-blue-600' },
  experiments: { label: 'Experiments', icon: Beaker, color: 'text-purple-600' },
  collection: { label: 'Collection', icon: BookOpen, color: 'text-green-600' },
  media: { label: 'Media', icon: Mic, color: 'text-orange-600' },
  question: { label: 'Question', icon: MessageSquare, color: 'text-cyan-600' },
  log: { label: 'Log', icon: PenTool, color: 'text-pink-600' },
  guestbook: { label: 'Guestbook', icon: Users, color: 'text-amber-600' },
  work: { label: 'Work', icon: Briefcase, color: 'text-indigo-600' },
};

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-amber-100 text-amber-700',
  pending: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-600',
  shipped: 'bg-green-100 text-green-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  idea: 'bg-purple-100 text-purple-700',
};

export function IndexClient() {
  const [data, setData] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/index');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch index data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Combine all items and filter
  const allItems = useMemo(() => {
    if (!data) return [];

    const items: IndexItem[] = [
      ...data.pages,
      ...data.experiments,
      ...data.collection,
      ...data.media,
      ...data.questionNotes,
      ...data.log,
      ...data.guestbook,
      ...data.work,
    ];

    return items
      .filter((item) => {
        // Type filter
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;

        // Status filter
        if (statusFilter !== 'all') {
          const normalizedStatus = item.status === 'active' ? 'published' : item.status;
          if (normalizedStatus !== statusFilter) return false;
        }

        // Search filter
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            item.title.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower)
          );
        }

        return true;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [data, search, typeFilter, statusFilter]);

  // Group by type for display
  const groupedItems = useMemo(() => {
    const groups: Record<ContentType, IndexItem[]> = {
      all: [],
      pages: [],
      experiments: [],
      collection: [],
      media: [],
      question: [],
      log: [],
      guestbook: [],
      work: [],
    };

    for (const item of allItems) {
      if (groups[item.type]) {
        groups[item.type].push(item);
      }
    }

    return groups;
  }, [allItems]);

  // Counts per type
  const typeCounts = useMemo(() => {
    if (!data) return {};
    return {
      pages: data.pages.length,
      experiments: data.experiments.length,
      collection: data.collection.length,
      media: data.media.length,
      question: data.questionNotes.length,
      log: data.log.length,
      guestbook: data.guestbook.length,
      work: data.work.length,
    };
  }, [data]);

  // Debounced search tracking
  useEffect(() => {
    if (!search) return;
    const timer = setTimeout(() => {
      trackIndexSearch(search, allItems.length);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, allItems.length]);

  const handleTypeFilter = useCallback((type: ContentType) => {
    setTypeFilter(type);
    trackIndexFilter('type', type);
  }, []);

  const handleStatusFilter = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    trackIndexFilter('status', status);
  }, []);

  const handleItemClick = useCallback((item: IndexItem) => {
    trackIndexClick(item.id, item.type, item.title);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-32" />
        <div className="h-10 bg-gray-200 rounded w-full max-w-md" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Index</h1>
        <p className="text-[var(--color-fg-muted)]">
          Everything on this site, including drafts and works-in-progress.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]" />
          <input
            type="text"
            placeholder="Search everything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_CONFIG) as ContentType[]).map((type) => {
            const config = TYPE_CONFIG[type];
            const Icon = config.icon;
            const count = type === 'all' ? allItems.length : (typeCounts[type as keyof typeof typeCounts] || 0);

            return (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  typeFilter === type
                    ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]'
                    : 'border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]'
                }`}
              >
                <Icon size={14} className={typeFilter === type ? 'text-white' : config.color} />
                {config.label}
                <span className={`text-xs ${typeFilter === type ? 'text-white/80' : 'text-[var(--color-fg-muted)]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-fg-muted)]">Status:</span>
          {(['all', 'published', 'draft', 'pending'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                statusFilter === status
                  ? 'bg-[var(--color-fg)] text-white border-[var(--color-fg)]'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--color-fg-muted)] mb-4">
        Showing {allItems.length} item{allItems.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </p>

      {/* Content grouped by type */}
      {typeFilter === 'all' ? (
        // Show grouped sections
        <div className="space-y-8">
          {(Object.keys(TYPE_CONFIG) as ContentType[])
            .filter((type) => type !== 'all' && groupedItems[type].length > 0)
            .map((type) => {
              const config = TYPE_CONFIG[type];
              const Icon = config.icon;
              const items = groupedItems[type];

              return (
                <section key={type}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={18} className={config.color} />
                    <h2 className="font-semibold">{config.label}</h2>
                    <span className="text-xs text-[var(--color-fg-muted)]">({items.length})</span>
                  </div>
                  <div className="border border-[var(--color-border)] rounded-lg divide-y divide-[var(--color-border)]">
                    {items.map((item) => (
                      <IndexItemRow key={item.id} item={item} formatDate={formatDate} onClick={() => handleItemClick(item)} />
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      ) : (
        // Show flat list for filtered type
        <div className="border border-[var(--color-border)] rounded-lg divide-y divide-[var(--color-border)]">
          {allItems.map((item) => (
            <IndexItemRow key={item.id} item={item} formatDate={formatDate} onClick={() => handleItemClick(item)} />
          ))}
        </div>
      )}

      {allItems.length === 0 && (
        <div className="text-center py-12 text-[var(--color-fg-muted)]">
          <p>No items match your filters.</p>
        </div>
      )}
    </div>
  );
}

function IndexItemRow({ item, formatDate, onClick }: { item: IndexItem; formatDate: (d: string) => string; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--color-bg-alt)] transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{item.title}</span>
          <span className={`px-1.5 py-0.5 text-[10px] rounded ${STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'}`}>
            {item.status}
          </span>
        </div>
        {item.description && (
          <p className="text-sm text-[var(--color-fg-muted)] truncate mt-0.5">{item.description}</p>
        )}
      </div>
      <div className="text-xs text-[var(--color-fg-muted)] whitespace-nowrap">
        {formatDate(item.updatedAt)}
      </div>
    </Link>
  );
}
