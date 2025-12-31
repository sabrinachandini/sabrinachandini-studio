import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getActiveObsession, getArchivedObsessions } from '@/lib/data';
import { ObsessionEditor } from '@/components/admin/ObsessionEditor';

export default async function AdminObsessionPage() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) redirect('/admin');

  const [active, archived] = await Promise.all([
    getActiveObsession(),
    getArchivedObsessions(),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Monthly Obsession</h1>

      <section className="mb-12">
        <h2 className="text-lg font-medium mb-4">Current Obsession</h2>
        <ObsessionEditor obsession={active} isActive />
      </section>

      {archived.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-4">Archive</h2>
          <div className="space-y-4">
            {archived.map((obs) => (
              <div
                key={obs.id}
                className="bg-white border border-[var(--color-border)] rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{obs.title}</span>
                  <span className="text-sm text-[var(--color-fg-subtle)]">
                    {obs.month}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  {obs.oneLiner}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
