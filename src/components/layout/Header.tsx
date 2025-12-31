'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Studio', href: '/' },
  { name: 'Experiments', href: '/experiments' },
  { name: 'Collection', href: '/collection' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Media', href: '/media' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <nav className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Name */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg tracking-tight"
          >
            <span className="accent-square" />
            <span>Sabrina Chandini</span>
          </Link>

          {/* Navigation */}
          <ul className="flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors relative py-1',
                      isActive
                        ? 'text-[var(--color-fg)]'
                        : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[var(--color-secondary)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
