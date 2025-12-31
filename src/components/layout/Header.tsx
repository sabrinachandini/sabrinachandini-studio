import { getPrimaryMenu, getSettings } from '@/lib/cms';
import { HeaderNav } from './HeaderNav';

export async function Header() {
  const [menu, settings] = await Promise.all([
    getPrimaryMenu(),
    getSettings(),
  ]);

  const allItems = menu?.items
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      name: item.label,
      href: item.href,
      external: item.external,
      group: item.group || 'main',
    })) || [];

  const mainItems = allItems.filter((item) => item.group === 'main');
  const moreItems = allItems.filter((item) => item.group === 'more');

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <nav className="container">
        <div className="flex items-center justify-between h-16">
          <HeaderNav
            mainItems={mainItems}
            moreItems={moreItems}
            siteTitle={settings.siteTitle || 'Sabrina Chandini'}
          />
        </div>
      </nav>
    </header>
  );
}
