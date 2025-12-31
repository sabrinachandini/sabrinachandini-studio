import { getPrimaryMenu, getSettings } from '@/lib/cms';
import { HeaderNav } from './HeaderNav';

export async function Header() {
  const [menu, settings] = await Promise.all([
    getPrimaryMenu(),
    getSettings(),
  ]);

  const navItems = menu?.items
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      name: item.label,
      href: item.href,
      external: item.external,
    })) || [];

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <nav className="container">
        <div className="flex items-center justify-between h-16">
          <HeaderNav
            navItems={navItems}
            siteTitle={settings.siteTitle || 'Sabrina Chandini'}
          />
        </div>
      </nav>
    </header>
  );
}
