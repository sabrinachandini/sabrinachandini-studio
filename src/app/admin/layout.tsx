import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await isAdminAuthenticated();

  // Check if we're on the login page
  // This is a workaround since we can't access pathname directly in layout
  // The login page will handle its own auth check

  return (
    <div className="min-h-screen bg-[var(--color-bg-alt)]">
      {/* Admin Header */}
      <header className="bg-white border-b border-[var(--color-border)]">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold text-lg">
              Admin
            </Link>
            {isAuthenticated && (
              <nav className="flex items-center gap-4 text-sm">
                <Link
                  href="/admin/obsession"
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  Obsession
                </Link>
                <Link
                  href="/admin/question"
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  Question
                </Link>
                <Link
                  href="/admin/log"
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  Log
                </Link>
                <Link
                  href="/admin/guestbook"
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  Guestbook
                </Link>
                <Link
                  href="/admin/linkedin"
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  LinkedIn
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              View Site
            </Link>
            {isAuthenticated && (
              <form action="/api/admin/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  Logout
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container py-8">{children}</main>
    </div>
  );
}
