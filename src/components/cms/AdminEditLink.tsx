import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { Pencil } from 'lucide-react';

interface AdminEditLinkProps {
  href: string;
  label?: string;
  className?: string;
}

export async function AdminEditLink({ href, label = 'Edit', className = '' }: AdminEditLinkProps) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return null;
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-secondary)] ${className}`}
    >
      <Pencil size={12} />
      <span>{label}</span>
    </Link>
  );
}
