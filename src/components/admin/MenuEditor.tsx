'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Menu, MenuItem } from '@/types/cms';
import { GripVertical, Plus, Trash2, Eye, EyeOff, Save, ExternalLink } from 'lucide-react';

interface MenuEditorProps {
  menus: Menu[];
}

export function MenuEditor({ menus: initialMenus }: MenuEditorProps) {
  const router = useRouter();
  const [menus, setMenus] = useState(initialMenus);
  const [activeMenuId, setActiveMenuId] = useState(initialMenus[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const activeMenu = menus.find((m) => m.id === activeMenuId);

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

  const addItem = () => {
    if (!activeMenu) return;

    const newItem: MenuItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      href: '/',
      order: activeMenu.items.length,
      visible: true,
    };

    updateItems([...activeMenu.items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<MenuItem>) => {
    if (!activeMenu) return;

    const newItems = [...activeMenu.items];
    newItems[index] = { ...newItems[index], ...updates };
    updateItems(newItems);
  };

  const removeItem = (index: number) => {
    if (!activeMenu) return;
    updateItems(activeMenu.items.filter((_, i) => i !== index));
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (!activeMenu || toIndex < 0 || toIndex >= activeMenu.items.length) return;

    const newItems = [...activeMenu.items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);

    // Update order values
    const reordered = newItems.map((item, i) => ({ ...item, order: i }));
    updateItems(reordered);
  };

  return (
    <div className="space-y-6">
      {/* Menu Selector */}
      <div className="flex items-center gap-4">
        <select
          value={activeMenuId}
          onChange={(e) => setActiveMenuId(e.target.value)}
          className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-white"
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
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Menu'}
        </button>
      </div>

      {/* Menu Items */}
      {activeMenu && (
        <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
          {activeMenu.items.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-fg-muted)]">
              No menu items yet. Add your first link below.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {activeMenu.items
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <li key={item.id} className="flex items-center gap-3 p-4">
                    {/* Drag handle */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveItem(index, index - 1)}
                        disabled={index === 0}
                        className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItem(index, index + 1)}
                        disabled={index === activeMenu.items.length - 1}
                        className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>

                    <GripVertical size={16} className="text-[var(--color-fg-muted)]" />

                    {/* Label */}
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(index, { label: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                      placeholder="Label"
                    />

                    {/* URL */}
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateItem(index, { href: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-[var(--color-border)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                      placeholder="/path or https://..."
                    />

                    {/* External link toggle */}
                    <button
                      onClick={() => updateItem(index, { external: !item.external })}
                      className={`p-2 rounded ${
                        item.external
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-alt)]'
                      }`}
                      title={item.external ? 'Opens in new tab' : 'Opens in same tab'}
                    >
                      <ExternalLink size={14} />
                    </button>

                    {/* Visibility toggle */}
                    <button
                      onClick={() => updateItem(index, { visible: !item.visible })}
                      className={`p-2 rounded ${
                        item.visible
                          ? 'text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-alt)]'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                      title={item.visible ? 'Visible' : 'Hidden'}
                    >
                      {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
            </ul>
          )}

          {/* Add item */}
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
            <button
              onClick={addItem}
              className="flex items-center gap-2 text-sm text-[var(--color-secondary)] hover:underline"
            >
              <Plus size={14} />
              Add Menu Item
            </button>
          </div>
        </div>
      )}

      <p className="text-sm text-[var(--color-fg-muted)]">
        Tip: Use external links for full URLs (https://...) and internal paths for site pages (/about, /contact).
      </p>
    </div>
  );
}
