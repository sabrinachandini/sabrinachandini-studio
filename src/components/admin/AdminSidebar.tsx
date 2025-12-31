'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Image,
  Menu,
  Settings,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Pages',
    href: '/admin/pages',
    icon: FileText,
  },
  {
    label: 'Posts',
    href: '/admin/posts',
    icon: Newspaper,
    children: [
      { label: 'Build Log', href: '/admin/log' },
      { label: 'Obsession', href: '/admin/obsession' },
    ],
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    label: 'Portfolio',
    href: '/admin/linkedin',
    icon: Briefcase,
  },
  {
    label: 'Question',
    href: '/admin/question',
    icon: HelpCircle,
    children: [
      { label: 'Notes', href: '/admin/question' },
      { label: 'Answers', href: '/admin/answers' },
    ],
  },
  {
    label: 'Guestbook',
    href: '/admin/guestbook',
    icon: MessageSquare,
  },
  {
    label: 'Menus',
    href: '/admin/menus',
    icon: Menu,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#1e1e1e] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2 text-white">
          <Sparkles size={20} className="text-[var(--color-secondary)]" />
          <span className="font-semibold">Studio Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href)) ||
              item.children?.some((child) => pathname === child.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-gray-800 text-white border-l-2 border-[var(--color-secondary)]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>

                {/* Children */}
                {item.children && isActive && (
                  <ul className="ml-9 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            'block py-1.5 text-sm transition-colors',
                            pathname === child.href
                              ? 'text-white'
                              : 'text-gray-500 hover:text-gray-300'
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ExternalLink size={14} />
          View Site
        </Link>
      </div>
    </aside>
  );
}
