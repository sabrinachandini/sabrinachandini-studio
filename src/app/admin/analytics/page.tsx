import Link from 'next/link';
import { ExternalLink, Check, X, Activity, MousePointer, Search, Eye, Users, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | Admin',
  description: 'Analytics dashboard and PostHog integration status.',
};

// Event instrumentation status
const EVENT_INSTRUMENTATION = [
  { event: 'nav_click', description: 'Navigation link clicks', location: 'HeaderNav.tsx', implemented: true },
  { event: 'more_dropdown_toggle', description: 'More dropdown open/close', location: 'HeaderNav.tsx', implemented: true },
  { event: 'index_search', description: 'Index page search queries', location: 'index/page.tsx', implemented: true },
  { event: 'index_filter', description: 'Index type/status filter changes', location: 'index/page.tsx', implemented: true },
  { event: 'index_click', description: 'Index item clicks', location: 'index/page.tsx', implemented: true },
  { event: '$pageview', description: 'Page view tracking', location: 'PostHogProvider.tsx', implemented: true },
  { event: 'external_link_click', description: 'External link clicks', location: 'HeaderNav.tsx', implemented: true },
  { event: 'scroll_depth', description: 'Scroll depth (25/50/75/100%)', location: 'lib/posthog.ts', implemented: false },
  { event: 'card_open', description: 'Card/experiment opens', location: 'lib/posthog.ts', implemented: false },
  { event: 'portfolio_tab_change', description: 'Portfolio tab switches', location: 'lib/posthog.ts', implemented: false },
  { event: 'contact_form_submit', description: 'Contact form submissions', location: 'lib/posthog.ts', implemented: false },
  { event: 'guestbook_submit', description: 'Guestbook submissions', location: 'lib/posthog.ts', implemented: false },
  { event: 'experiment_view', description: 'Experiment page views', location: 'lib/posthog.ts', implemented: false },
  { event: 'question_answer_submit', description: 'Question answer submissions', location: 'lib/posthog.ts', implemented: false },
];

// Check if PostHog is configured
function getPostHogStatus() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  return {
    configured: !!key,
    host,
    keyPreview: key ? `${key.slice(0, 8)}...` : 'Not configured',
  };
}

export default function AnalyticsPage() {
  const posthogStatus = getPostHogStatus();
  const implementedCount = EVENT_INSTRUMENTATION.filter((e) => e.implemented).length;
  const totalEvents = EVENT_INSTRUMENTATION.length;

  return (
    <div className="container py-12">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] mb-2 inline-block">
            &larr; Back to Admin
          </Link>
          <h1 className="text-3xl font-semibold mb-2">Analytics</h1>
          <p className="text-[var(--color-fg-muted)]">
            PostHog integration status and event tracking overview.
          </p>
        </div>

        {/* PostHog Status Card */}
        <section className="mb-8">
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity size={24} className="text-[var(--color-secondary)]" />
                <h2 className="text-xl font-semibold">PostHog Cloud</h2>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${
                posthogStatus.configured
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {posthogStatus.configured ? 'Connected' : 'Not Configured'}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-fg-muted)]">API Key</span>
                <code className="bg-[var(--color-bg-alt)] px-2 py-1 rounded text-xs">
                  {posthogStatus.keyPreview}
                </code>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-fg-muted)]">Host</span>
                <code className="bg-[var(--color-bg-alt)] px-2 py-1 rounded text-xs">
                  {posthogStatus.host}
                </code>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--color-fg-muted)]">Instrumentation</span>
                <span className="font-medium">{implementedCount}/{totalEvents} events</span>
              </div>
            </div>

            {posthogStatus.configured ? (
              <div className="mt-4 flex gap-3">
                <a
                  href="https://us.posthog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg text-sm hover:opacity-90"
                >
                  Open Dashboard
                  <ExternalLink size={14} />
                </a>
                <a
                  href="https://us.posthog.com/replay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-bg-alt)]"
                >
                  Session Replays
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 mb-2">
                  PostHog is not configured. Add these environment variables:
                </p>
                <pre className="text-xs bg-amber-100 p-2 rounded overflow-x-auto">
{`NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`}
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Page Views', icon: Eye, href: 'https://us.posthog.com/insights' },
              { label: 'User Activity', icon: Users, href: 'https://us.posthog.com/persons' },
              { label: 'Events', icon: MousePointer, href: 'https://us.posthog.com/events' },
              { label: 'Trends', icon: Activity, href: 'https://us.posthog.com/insights/new' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-secondary)] transition-colors"
              >
                <item.icon size={20} className="text-[var(--color-fg-muted)]" />
                <span className="text-sm font-medium">{item.label}</span>
                <ExternalLink size={12} className="ml-auto text-[var(--color-fg-subtle)]" />
              </a>
            ))}
          </div>
        </section>

        {/* Event Instrumentation */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Event Instrumentation</h2>
          <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
                  <th className="text-left px-4 py-3 font-medium">Event</th>
                  <th className="text-left px-4 py-3 font-medium">Description</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Location</th>
                  <th className="text-center px-4 py-3 font-medium w-20">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {EVENT_INSTRUMENTATION.map((event) => (
                  <tr key={event.event} className="hover:bg-[var(--color-bg-alt)]">
                    <td className="px-4 py-3">
                      <code className="bg-[var(--color-bg-alt)] px-1.5 py-0.5 rounded text-xs">
                        {event.event}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-fg-muted)]">
                      {event.description}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-fg-subtle)] hidden md:table-cell">
                      <code className="text-xs">{event.location}</code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {event.implemented ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                          <Check size={14} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-400 rounded-full">
                          <X size={14} />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[var(--color-fg-muted)] mt-4">
            Events marked as implemented are actively tracked. Add more tracking by using functions from{' '}
            <code className="bg-[var(--color-bg-alt)] px-1 py-0.5 rounded">lib/posthog.ts</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
