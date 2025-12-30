'use client';

import { cn } from '@/lib/utils';

interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-[var(--color-border)] overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'text-[var(--color-fg)]'
              : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs text-[var(--color-fg-subtle)]">
              ({tab.count})
            </span>
          )}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-secondary)]" />
          )}
        </button>
      ))}
    </div>
  );
}
