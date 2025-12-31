'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

interface AdminEditLinkProps {
  href: string;
  className?: string;
}

export function AdminEditLink({ href, className = '' }: AdminEditLinkProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin cookie exists
    const hasAdminCookie = document.cookie.includes('admin_session=');
    setIsAdmin(hasAdminCookie);
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-xs text-[var(--color-fg-subtle)] hover:text-[var(--color-secondary)] ${className}`}
      title="Edit in admin"
    >
      <Pencil size={12} />
      <span className="sr-only">Edit</span>
    </Link>
  );
}
