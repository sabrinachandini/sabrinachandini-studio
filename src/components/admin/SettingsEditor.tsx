'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteSettings } from '@/types/cms';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';

interface SettingsEditorProps {
  settings: SiteSettings;
}

export function SettingsEditor({ settings: initialSettings }: SettingsEditorProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'features' | 'modules'>('general');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      setHasChanges(false);
      router.refresh();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateSocialLink = (index: number, updates: { name?: string; url?: string }) => {
    const newLinks = [...(settings.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], ...updates };
    updateSettings({ socialLinks: newLinks });
  };

  const addSocialLink = () => {
    updateSettings({
      socialLinks: [...(settings.socialLinks || []), { name: '', url: '' }],
    });
  };

  const removeSocialLink = (index: number) => {
    updateSettings({
      socialLinks: (settings.socialLinks || []).filter((_, i) => i !== index),
    });
  };

  const toggleFeatureFlag = (key: string) => {
    updateSettings({
      featureFlags: {
        ...settings.featureFlags,
        [key]: !settings.featureFlags?.[key],
      },
    });
  };

  const updateHomeModule = (id: string, updates: Partial<{ enabled: boolean; order: number }>) => {
    const newModules = (settings.homeModules || []).map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    updateSettings({ homeModules: newModules });
  };

  const moveModule = (fromIndex: number, toIndex: number) => {
    const modules = [...(settings.homeModules || [])];
    const [moved] = modules.splice(fromIndex, 1);
    modules.splice(toIndex, 0, moved);
    const reordered = modules.map((m, i) => ({ ...m, order: i }));
    updateSettings({ homeModules: reordered });
  };

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'social', label: 'Social Links' },
    { key: 'features', label: 'Features' },
    { key: 'modules', label: 'Home Modules' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Save button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-white border border-b-white border-[var(--color-border)] -mb-px'
                  : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Site Title</label>
              <input
                type="text"
                value={settings.siteTitle || ''}
                onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Site Description</label>
              <textarea
                value={settings.siteDescription || ''}
                onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-fg-muted)]">
              Add your social media links. These will appear in the site footer.
            </p>

            {(settings.socialLinks || []).map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => updateSocialLink(index, { name: e.target.value })}
                  className="w-32 px-3 py-2 border border-[var(--color-border)] rounded-lg"
                  placeholder="Name"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, { url: e.target.value })}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg"
                  placeholder="https://..."
                />
                <button
                  onClick={() => removeSocialLink(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={addSocialLink}
              className="flex items-center gap-2 text-sm text-[var(--color-secondary)] hover:underline"
            >
              <Plus size={14} />
              Add Social Link
            </button>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-fg-muted)]">
              Enable or disable site features. Disabled features will be hidden from the public site.
            </p>

            <div className="space-y-3">
              {[
                { key: 'showObsession', label: 'Obsession', description: 'Current obsession module on homepage' },
                { key: 'showPortfolio', label: 'Portfolio', description: 'Work experience and projects' },
                { key: 'showLog', label: 'Build Log', description: 'Development notes and updates' },
                { key: 'showQuestion', label: 'Question', description: 'Daily question feature' },
                { key: 'showGuestbook', label: 'Guestbook', description: 'Visitor guestbook' },
              ].map(({ key, label, description }) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-4 bg-[var(--color-bg-alt)] rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-[var(--color-fg-muted)]">{description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(settings.featureFlags?.[key] ?? true)}
                    onChange={() => toggleFeatureFlag(key)}
                    className="w-5 h-5 accent-[var(--color-secondary)]"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-fg-muted)]">
              Drag to reorder homepage modules. Toggle to show or hide.
            </p>

            <div className="space-y-2">
              {(settings.homeModules || [])
                .sort((a, b) => a.order - b.order)
                .map((module, index) => (
                  <div
                    key={module.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      module.enabled
                        ? 'bg-white border-[var(--color-border)]'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveModule(index, index - 1)}
                        disabled={index === 0}
                        className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveModule(index, index + 1)}
                        disabled={index === (settings.homeModules?.length || 0) - 1}
                        className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>

                    <GripVertical size={16} className="text-[var(--color-fg-muted)]" />

                    <div className="flex-1">
                      <p className="font-medium capitalize">
                        {module.type.replace(/-/g, ' ')}
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-[var(--color-fg-muted)]">
                        {module.enabled ? 'Visible' : 'Hidden'}
                      </span>
                      <input
                        type="checkbox"
                        checked={module.enabled}
                        onChange={() => updateHomeModule(module.id, { enabled: !module.enabled })}
                        className="w-5 h-5 accent-[var(--color-secondary)]"
                      />
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
