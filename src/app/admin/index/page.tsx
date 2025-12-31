import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { IndexClient } from './IndexClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Index | Admin',
  description: 'All site content including drafts.',
};

export default async function AdminIndexPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect('/admin');
  }

  return (
    <div className="container py-12">
      <div className="mb-4">
        <Link href="/admin" className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          &larr; Back to Admin
        </Link>
      </div>
      <IndexClient />
    </div>
  );
}
