'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { trackNavClick, trackMoreDropdownToggle, trackExternalLinkClick } from '@/lib/posthog';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
  group?: string;
}

interface HeaderNavProps {
  mainItems: NavItem[];
  moreItems: NavItem[];
  siteTitle: string;
}

export function HeaderNav({ mainItems, moreItems, siteTitle }: HeaderNavProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  const handleNavClick = (item: NavItem, location: 'main' | 'more') => {
    trackNavClick(item.name, item.href, location);
    if (item.external) {
      trackExternalLinkClick(item.href, `nav_${location}`);
    }
  };

  const renderNavLink = (item: NavItem, inDropdown = false) => {
    const active = isActive(item.href);
    const location = inDropdown ? 'more' : 'main';

    if (item.external) {
      return (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleNavClick(item, location)}
          className={cn(
            'text-sm font-medium transition-colors flex items-center gap-1',
            inDropdown
              ? 'px-4 py-2 hover:bg-[var(--color-bg-alt)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
              : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
          )}
          data-nav-item={item.name}
        >
          {item.name}
          <ExternalLink size={12} />
        </a>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => handleNavClick(item, location)}
        className={cn(
          'text-sm font-medium transition-colors relative',
          inDropdown
            ? cn(
                'block px-4 py-2 hover:bg-[var(--color-bg-alt)]',
                active ? 'text-[var(--color-fg)] bg-[var(--color-bg-alt)]' : 'text-[var(--color-fg-muted)]'
              )
            : cn(
                'py-1',
                active ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
              )
        )}
        data-nav-item={item.name}
      >
        {item.name}
        {active && !inDropdown && (
          <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[var(--color-secondary)]" />
        )}
      </Link>
    );
  };

  const moreHasActiveItem = moreItems.some((item) => isActive(item.href));

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
      <ul className="flex items-center gap-6">
        {mainItems.map((item) => (
          <li key={item.name}>{renderNavLink(item)}</li>
        ))}

        {/* More dropdown */}
        {moreItems.length > 0 && (
          <li className="relative" ref={moreRef}>
            <button
              onClick={() => {
                const newState = !moreOpen;
                setMoreOpen(newState);
                trackMoreDropdownToggle(newState);
              }}
              className={cn(
                'flex items-center gap-1 text-sm font-medium transition-colors py-1',
                moreHasActiveItem || moreOpen
                  ? 'text-[var(--color-fg)]'
                  : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
              )}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              More
              <ChevronDown
                size={14}
                className={cn('transition-transform', moreOpen && 'rotate-180')}
              />
              {moreHasActiveItem && !moreOpen && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[var(--color-secondary)]" />
              )}
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-50">
                {moreItems.map((item) => renderNavLink(item, true))}
              </div>
            )}
          </li>
        )}
      </ul>
    </>
  );
}
