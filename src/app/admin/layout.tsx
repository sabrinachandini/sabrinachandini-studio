import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { LogOut, User } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await isAdminAuthenticated();

  // If not authenticated, show only children (login page will handle itself)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-alt)]">
        <main className="container py-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-alt)]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-[var(--color-border)] px-6 py-3 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
            <User size={14} />
            <span>Admin</span>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </form>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
