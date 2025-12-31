'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

interface HeaderNavProps {
  navItems: NavItem[];
  siteTitle: string;
}

export function HeaderNav({ navItems, siteTitle }: HeaderNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Logo / Name */}
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold text-lg tracking-tight"
      >
        <span className="accent-square" />
        <span>{siteTitle}</span>
      </Link>

      {/* Navigation */}
      <ul className="flex items-center gap-8">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          if (item.external) {
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] flex items-center gap-1"
                >
                  {item.name}
                  <ExternalLink size={12} />
                </a>
              </li>
            );
          }

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
    </>
  );
}
