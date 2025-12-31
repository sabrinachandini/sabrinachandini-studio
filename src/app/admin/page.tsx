import { isAdminAuthenticated, getAdminCredentials } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { QuickLogAdd } from '@/components/admin/QuickLogAdd';
import Link from 'next/link';

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();
  const credentials = getAdminCredentials();

  // If no password is configured, show setup message
  if (!credentials) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-8">
          <h1 className="text-xl font-semibold mb-4">Admin Not Configured</h1>
          <p className="text-[var(--color-fg-muted)] mb-4">
            Set the <code className="bg-[var(--color-bg-alt)] px-1 py-0.5 rounded text-sm">ADMIN_PASSWORD</code> environment variable to enable admin access.
          </p>
          <p className="text-sm text-[var(--color-fg-subtle)]">
            Optionally set <code className="bg-[var(--color-bg-alt)] px-1 py-0.5 rounded text-sm">ADMIN_USERNAME</code> (defaults to &quot;admin&quot;).
          </p>
        </div>
      </div>
    );
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Quick Add Section */}
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-4 mb-8">
          <h2 className="text-sm font-medium text-[var(--color-fg-muted)] mb-3">Quick Add</h2>
          <QuickLogAdd />
        </div>

        {/* Content Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/obsession"
            className="bg-white border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-border-strong)] transition-colors"
          >
            <h2 className="font-semibold mb-2">Monthly Obsession</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Edit your current obsession and archive past ones.
            </p>
          </Link>
          <Link
            href="/admin/question"
            className="bg-white border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-border-strong)] transition-colors"
          >
            <h2 className="font-semibold mb-2">Question Project</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Manage your question and add notes.
            </p>
          </Link>
          <Link
            href="/admin/log"
            className="bg-white border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-border-strong)] transition-colors"
          >
            <h2 className="font-semibold mb-2">Build Log</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Add daily log entries about what you&apos;re building.
            </p>
          </Link>
          <Link
            href="/admin/guestbook"
            className="bg-white border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-border-strong)] transition-colors"
          >
            <h2 className="font-semibold mb-2">Guestbook</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Moderate entries and add annotations.
            </p>
          </Link>
          <Link
            href="/admin/answers"
            className="bg-white border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-border-strong)] transition-colors"
          >
            <h2 className="font-semibold mb-2">Question Answers</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Moderate visitor answers to your question.
            </p>
          </Link>
          <Link
            href="/admin/linkedin"
            className="bg-white border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-border-strong)] transition-colors"
          >
            <h2 className="font-semibold mb-2">Portfolio</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Manage work experience and posts.
            </p>
          </Link>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-8">
        <h1 className="text-xl font-semibold mb-6">Admin Login</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
