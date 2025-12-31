import { getPages } from '@/lib/cms';
import Link from 'next/link';
import { Plus, Edit, Eye, Globe, FileText, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function PagesListPage() {
  const pages = await getPages();

  const sortedPages = [...pages].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-12 text-center">
          <FileText size={48} className="mx-auto text-[var(--color-fg-muted)] mb-4" />
          <h2 className="text-lg font-medium mb-2">No pages yet</h2>
          <p className="text-[var(--color-fg-muted)] mb-6">
            Create your first page to get started.
          </p>
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Create Page
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-alt)] border-b border-[var(--color-border)]">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--color-fg-muted)]">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--color-fg-muted)]">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--color-fg-muted)]">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[var(--color-fg-muted)]">
                  Updated
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-[var(--color-fg-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {sortedPages.map((page) => (
                <tr key={page.id} className="hover:bg-[var(--color-bg-alt)] transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="font-medium hover:text-[var(--color-secondary)]"
                    >
                      {page.title}
                    </Link>
                    {page.template !== 'default' && (
                      <span className="ml-2 text-xs text-[var(--color-fg-muted)] bg-[var(--color-bg-alt)] px-1.5 py-0.5 rounded">
                        {page.template}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm text-[var(--color-fg-muted)]">/{page.slug}</code>
                  </td>
                  <td className="px-4 py-3">
                    {page.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        <Globe size={12} />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
                        <AlertCircle size={12} />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-fg-muted)]">
                    {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="p-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="p-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-alt)] rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
