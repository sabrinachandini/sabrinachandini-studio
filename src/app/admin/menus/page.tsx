import { getMenus } from '@/lib/cms';
import { MenuEditor } from '@/components/admin/MenuEditor';

export default async function MenusPage() {
  const menus = await getMenus();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Navigation Menus</h1>
      <MenuEditor menus={menus} />
    </div>
  );
}
