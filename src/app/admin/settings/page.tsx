import { getSettings } from '@/lib/cms';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Site Settings</h1>
      <SettingsEditor settings={settings} />
    </div>
  );
}
