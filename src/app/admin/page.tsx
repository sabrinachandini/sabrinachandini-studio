import { isAdminAuthenticated, getAdminCredentials } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { QuickLogAdd } from '@/components/admin/QuickLogAdd';
import { getPages } from '@/lib/cms';
import { getRecentLogEntries, getPendingGuestbookEntries, getPendingQuestionAnswers } from '@/lib/data';
import Link from 'next/link';
import {
  FileText,
  PenLine,
  Image,
  MessageSquare,
  HelpCircle,
  Menu,
  Settings,
  ArrowRight,
  AlertCircle,
  Activity,
} from 'lucide-react';

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
    const [pages, recentLog, pendingGuestbook, pendingAnswers] = await Promise.all([
      getPages(),
      getRecentLogEntries(5),
      getPendingGuestbookEntries(),
      getPendingQuestionAnswers(),
    ]);

    const draftPages = pages.filter((p) => p.status === 'draft');
    const totalPending = pendingGuestbook.length + pendingAnswers.length;

    return (
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Alerts */}
        {totalPending > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle size={20} className="text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                {totalPending} item{totalPending !== 1 ? 's' : ''} pending review
              </p>
              <p className="text-xs text-amber-600">
                {pendingGuestbook.length > 0 && `${pendingGuestbook.length} guestbook`}
                {pendingGuestbook.length > 0 && pendingAnswers.length > 0 && ', '}
                {pendingAnswers.length > 0 && `${pendingAnswers.length} question answers`}
              </p>
            </div>
            <Link href="/admin/guestbook" className="text-sm text-amber-700 hover:text-amber-900 font-medium">
              Review
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Link
            href="/admin/pages"
            className="bg-white border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-border-strong)] transition-colors group"
          >
            <FileText size={24} className="text-[var(--color-fg-muted)] mb-2 group-hover:text-[var(--color-secondary)]" />
            <h3 className="font-medium text-sm">Edit Pages</h3>
            <p className="text-xs text-[var(--color-fg-muted)]">{pages.length} pages</p>
          </Link>
          <Link
            href="/admin/media"
            className="bg-white border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-border-strong)] transition-colors group"
          >
            <Image size={24} className="text-[var(--color-fg-muted)] mb-2 group-hover:text-[var(--color-secondary)]" />
            <h3 className="font-medium text-sm">Media Library</h3>
            <p className="text-xs text-[var(--color-fg-muted)]">Upload & manage</p>
          </Link>
          <Link
            href="/admin/menus"
            className="bg-white border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-border-strong)] transition-colors group"
          >
            <Menu size={24} className="text-[var(--color-fg-muted)] mb-2 group-hover:text-[var(--color-secondary)]" />
            <h3 className="font-medium text-sm">Menus</h3>
            <p className="text-xs text-[var(--color-fg-muted)]">Edit navigation</p>
          </Link>
          <Link
            href="/admin/analytics"
            className="bg-white border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-border-strong)] transition-colors group"
          >
            <Activity size={24} className="text-[var(--color-fg-muted)] mb-2 group-hover:text-[var(--color-secondary)]" />
            <h3 className="font-medium text-sm">Analytics</h3>
            <p className="text-xs text-[var(--color-fg-muted)]">PostHog stats</p>
          </Link>
          <Link
            href="/admin/settings"
            className="bg-white border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-border-strong)] transition-colors group"
          >
            <Settings size={24} className="text-[var(--color-fg-muted)] mb-2 group-hover:text-[var(--color-secondary)]" />
            <h3 className="font-medium text-sm">Settings</h3>
            <p className="text-xs text-[var(--color-fg-muted)]">Site config</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Log */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <PenLine size={16} />
                Quick Log Entry
              </h2>
              <Link href="/admin/log" className="text-xs text-[var(--color-secondary)] hover:underline">
                View all
              </Link>
            </div>
            <QuickLogAdd />

            {/* Recent Log Entries */}
            {recentLog.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <h3 className="text-xs font-medium text-[var(--color-fg-muted)] mb-3">Recent</h3>
                <ul className="space-y-2">
                  {recentLog.slice(0, 3).map((entry) => (
                    <li key={entry.id} className="text-sm text-[var(--color-fg-muted)] truncate">
                      {entry.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Drafts */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Drafts</h2>
            </div>
            {draftPages.length === 0 ? (
              <p className="text-sm text-[var(--color-fg-muted)]">No draft pages.</p>
            ) : (
              <ul className="space-y-2">
                {draftPages.slice(0, 5).map((page) => (
                  <li key={page.id} className="flex items-center justify-between">
                    <span className="text-sm">{page.title}</span>
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="text-xs text-[var(--color-secondary)] hover:underline"
                    >
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Moderation */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <MessageSquare size={16} />
              Pending Moderation
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/guestbook"
                className="flex items-center justify-between p-3 bg-[var(--color-bg-alt)] rounded hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm">Guestbook</span>
                <span className="text-xs font-medium bg-white px-2 py-0.5 rounded">
                  {pendingGuestbook.length}
                </span>
              </Link>
              <Link
                href="/admin/answers"
                className="flex items-center justify-between p-3 bg-[var(--color-bg-alt)] rounded hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm">Question Answers</span>
                <span className="text-xs font-medium bg-white px-2 py-0.5 rounded">
                  {pendingAnswers.length}
                </span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
            <h2 className="font-semibold mb-4">Content Areas</h2>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/obsession"
                className="flex items-center gap-2 p-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
              >
                <ArrowRight size={12} />
                Obsession
              </Link>
              <Link
                href="/admin/question"
                className="flex items-center gap-2 p-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
              >
                <ArrowRight size={12} />
                Question Notes
              </Link>
              <Link
                href="/admin/linkedin"
                className="flex items-center gap-2 p-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
              >
                <ArrowRight size={12} />
                Portfolio
              </Link>
              <Link
                href="/admin/log"
                className="flex items-center gap-2 p-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
              >
                <ArrowRight size={12} />
                Build Log
              </Link>
            </div>
          </div>
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
