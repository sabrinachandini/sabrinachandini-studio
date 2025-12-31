'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Menu, MenuItem } from '@/types/cms';
import { GripVertical, Plus, Trash2, Eye, EyeOff, Save, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

interface MenuEditorProps {
  menus: Menu[];
  availablePages?: Array<{ slug: string; title: string }>;
}

// Internal routes for quick-add
const INTERNAL_ROUTES = [
  { href: '/', label: 'Studio (Home)' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/experiments', label: 'Experiments' },
  { href: '/collection', label: 'Collection' },
  { href: '/media', label: 'Media' },
  { href: '/question', label: 'Question' },
  { href: '/log', label: 'Build Log' },
  { href: '/guestbook', label: 'Guestbook' },
  { href: '/contact', label: 'Contact' },
  { href: '/index', label: 'Index (All)' },
];

export function MenuEditor({ menus: initialMenus, availablePages = [] }: MenuEditorProps) {
  const router = useRouter();
  const [menus, setMenus] = useState(initialMenus);
  const [activeMenuId, setActiveMenuId] = useState(initialMenus[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddLabel, setQuickAddLabel] = useState('');
  const [quickAddHref, setQuickAddHref] = useState('');
  const [quickAddGroup, setQuickAddGroup] = useState<'main' | 'more'>('main');

  const activeMenu = menus.find((m) => m.id === activeMenuId);

  const mainItems = activeMenu?.items.filter((i) => i.group !== 'more') || [];
  const moreItems = activeMenu?.items.filter((i) => i.group === 'more') || [];

  const handleSave = async () => {
    if (!activeMenu) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/menus/${activeMenu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: activeMenu.items }),
      });

      if (!res.ok) {
        throw new Error('Failed to save menu');
      }

      setHasChanges(false);
      router.refresh();
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Failed to save menu');
    } finally {
      setIsSaving(false);
    }
  };

  const updateItems = (items: MenuItem[]) => {
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === activeMenuId ? { ...menu, items } : menu
      )
    );
    setHasChanges(true);
  };

  const addItem = (label: string, href: string, group: 'main' | 'more' = 'main') => {
    if (!activeMenu || !label.trim() || !href.trim()) return;

    const groupItems = group === 'more' ? moreItems : mainItems;
    const maxOrder = Math.max(...activeMenu.items.map((i) => i.order), -1);

    const newItem: MenuItem = {
      id: `nav-${Date.now()}`,
      label: label.trim(),
      href: href.trim(),
      order: maxOrder + 1,
      visible: true,
      group,
    };

    updateItems([...activeMenu.items, newItem]);
    setQuickAddLabel('');
    setQuickAddHref('');
    setShowQuickAdd(false);
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    if (!activeMenu) return;

    const newItems = activeMenu.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateItems(newItems);
  };

  const removeItem = (id: string) => {
    if (!activeMenu) return;
    updateItems(activeMenu.items.filter((i) => i.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    if (!activeMenu) return;

    const item = activeMenu.items.find((i) => i.id === id);
    if (!item) return;

    const groupItems = item.group === 'more' ? moreItems : mainItems;
    const sortedGroup = [...groupItems].sort((a, b) => a.order - b.order);
    const currentIndex = sortedGroup.findIndex((i) => i.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sortedGroup.length) return;

    // Swap orders
    const targetItem = sortedGroup[newIndex];
    const newItems = activeMenu.items.map((i) => {
      if (i.id === id) return { ...i, order: targetItem.order };
      if (i.id === targetItem.id) return { ...i, order: item.order };
      return i;
    });

    updateItems(newItems);
  };

  const moveToGroup = (id: string, newGroup: 'main' | 'more') => {
    if (!activeMenu) return;

    const targetGroupItems = newGroup === 'more' ? moreItems : mainItems;
    const maxOrder = Math.max(...targetGroupItems.map((i) => i.order), -1);

    updateItem(id, { group: newGroup, order: maxOrder + 1 });
  };

  const renderItemRow = (item: MenuItem, groupItems: MenuItem[]) => {
    const sortedGroup = [...groupItems].sort((a, b) => a.order - b.order);
    const index = sortedGroup.findIndex((i) => i.id === item.id);

    return (
      <li key={item.id} className="flex items-center gap-2 p-3 hover:bg-[var(--color-bg-alt)]">
        {/* Reorder */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => moveItem(item.id, 'up')}
            disabled={index === 0}
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] disabled:opacity-30 text-xs"
          >
            ↑
          </button>
          <button
            onClick={() => moveItem(item.id, 'down')}
            disabled={index === sortedGroup.length - 1}
            className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] disabled:opacity-30 text-xs"
          >
            ↓
          </button>
        </div>

        <GripVertical size={14} className="text-[var(--color-fg-muted)]" />

        {/* Label */}
        <input
          type="text"
          value={item.label}
          onChange={(e) => updateItem(item.id, { label: e.target.value })}
          className="w-28 px-2 py-1 border border-[var(--color-border)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          placeholder="Label"
        />

        {/* URL */}
        <input
          type="text"
          value={item.href}
          onChange={(e) => updateItem(item.id, { href: e.target.value })}
          className="flex-1 px-2 py-1 border border-[var(--color-border)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          placeholder="/path"
        />

        {/* Group toggle */}
        <button
          onClick={() => moveToGroup(item.id, item.group === 'more' ? 'main' : 'more')}
          className="px-2 py-1 text-xs border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-alt)]"
          title={item.group === 'more' ? 'Move to main nav' : 'Move to More dropdown'}
        >
          {item.group === 'more' ? '← Main' : 'More →'}
        </button>

        {/* External */}
        <button
          onClick={() => updateItem(item.id, { external: !item.external })}
          className={`p-1.5 rounded ${
            item.external
              ? 'bg-blue-100 text-blue-600'
              : 'text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-alt)]'
          }`}
          title={item.external ? 'Opens in new tab' : 'Same tab'}
        >
          <ExternalLink size={12} />
        </button>

        {/* Visibility */}
        <button
          onClick={() => updateItem(item.id, { visible: !item.visible })}
          className={`p-1.5 rounded ${
            item.visible
              ? 'text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-alt)]'
              : 'bg-amber-100 text-amber-600'
          }`}
          title={item.visible ? 'Visible' : 'Hidden'}
        >
          {item.visible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>

        {/* Delete */}
        <button
          onClick={() => removeItem(item.id)}
          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
        >
          <Trash2 size={12} />
        </button>
      </li>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <select
          value={activeMenuId}
          onChange={(e) => setActiveMenuId(e.target.value)}
          className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-white text-sm"
        >
          {menus.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.name.charAt(0).toUpperCase() + menu.name.slice(1)} Menu
            </option>
          ))}
        </select>

        {hasChanges && (
          <span className="text-sm text-amber-600">Unsaved changes</span>
        )}

        <div className="flex-1" />

        <button
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="flex items-center gap-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-alt)]"
        >
          <Plus size={14} />
          Add Item
        </button>

        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
        >
          <Save size={14} />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Quick Add Form */}
      {showQuickAdd && (
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-sm">Quick Add Nav Item</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--color-fg-muted)] mb-1">Label</label>
              <input
                type="text"
                value={quickAddLabel}
                onChange={(e) => setQuickAddLabel(e.target.value)}
                placeholder="e.g., About"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--color-fg-muted)] mb-1">URL</label>
              <input
                type="text"
                value={quickAddHref}
                onChange={(e) => setQuickAddHref(e.target.value)}
                placeholder="/about or https://..."
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm"
                list="route-suggestions"
              />
              <datalist id="route-suggestions">
                {INTERNAL_ROUTES.map((route) => (
                  <option key={route.href} value={route.href}>
                    {route.label}
                  </option>
                ))}
                {availablePages.map((page) => (
                  <option key={page.slug} value={`/${page.slug}`}>
                    {page.title}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="group"
                checked={quickAddGroup === 'main'}
                onChange={() => setQuickAddGroup('main')}
              />
              Main Nav
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="group"
                checked={quickAddGroup === 'more'}
                onChange={() => setQuickAddGroup('more')}
              />
              More Dropdown
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addItem(quickAddLabel, quickAddHref, quickAddGroup)}
              disabled={!quickAddLabel.trim() || !quickAddHref.trim()}
              className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg text-sm disabled:opacity-50"
            >
              Add
            </button>
            <button
              onClick={() => setShowQuickAdd(false)}
              className="px-4 py-2 text-[var(--color-fg-muted)] text-sm"
            >
              Cancel
            </button>
          </div>

          {/* Quick add from existing pages */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <p className="text-xs text-[var(--color-fg-muted)] mb-2">Or quick-add from routes:</p>
            <div className="flex flex-wrap gap-2">
              {INTERNAL_ROUTES.filter(
                (route) => !activeMenu?.items.some((i) => i.href === route.href)
              ).slice(0, 6).map((route) => (
                <button
                  key={route.href}
                  onClick={() => addItem(route.label.split(' (')[0], route.href, quickAddGroup)}
                  className="px-2 py-1 text-xs border border-[var(--color-border)] rounded hover:bg-[var(--color-bg-alt)]"
                >
                  + {route.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      {activeMenu && (
        <div className="space-y-4">
          {/* Main Nav */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-[var(--color-bg-alt)] border-b border-[var(--color-border)] flex items-center gap-2">
              <ChevronRight size={14} />
              <span className="text-sm font-medium">Main Navigation</span>
              <span className="text-xs text-[var(--color-fg-muted)]">({mainItems.length})</span>
            </div>
            {mainItems.length === 0 ? (
              <div className="p-4 text-sm text-[var(--color-fg-muted)]">No main nav items</div>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {mainItems
                  .sort((a, b) => a.order - b.order)
                  .map((item) => renderItemRow(item, mainItems))}
              </ul>
            )}
          </div>

          {/* More Dropdown */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-[var(--color-bg-alt)] border-b border-[var(--color-border)] flex items-center gap-2">
              <ChevronDown size={14} />
              <span className="text-sm font-medium">More Dropdown</span>
              <span className="text-xs text-[var(--color-fg-muted)]">({moreItems.length})</span>
            </div>
            {moreItems.length === 0 ? (
              <div className="p-4 text-sm text-[var(--color-fg-muted)]">No dropdown items</div>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {moreItems
                  .sort((a, b) => a.order - b.order)
                  .map((item) => renderItemRow(item, moreItems))}
              </ul>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-[var(--color-fg-muted)]">
        Tip: Keep main nav tidy (5-7 items). Move less-used links to "More" dropdown.
      </p>
    </div>
  );
}
