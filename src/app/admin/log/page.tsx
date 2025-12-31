import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLogEntries } from '@/lib/data';
import { LogEditor } from '@/components/admin/LogEditor';

export default async function AdminLogPage() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) redirect('/admin');

  const entries = await getLogEntries();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Build Log</h1>
      <LogEditor entries={entries} />
    </div>
  );
}
