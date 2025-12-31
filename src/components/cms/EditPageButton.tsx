import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { Pencil } from 'lucide-react';

interface EditPageButtonProps {
  pageId: string;
  className?: string;
}

export async function EditPageButton({ pageId, className = '' }: EditPageButtonProps) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return null;
  }

  return (
    <Link
      href={`/admin/pages/${pageId}`}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-[var(--color-fg)] text-[var(--color-bg)] rounded-full shadow-lg hover:opacity-90 transition-opacity ${className}`}
    >
      <Pencil size={16} />
      <span className="text-sm font-medium">Edit Page</span>
    </Link>
  );
}
