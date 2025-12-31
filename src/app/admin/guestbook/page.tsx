import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getPendingGuestbookEntries, getPublishedGuestbookEntries } from '@/lib/data';
import { GuestbookAdmin } from '@/components/admin/GuestbookAdmin';

export default async function AdminGuestbookPage() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) redirect('/admin');

  const [pending, published] = await Promise.all([
    getPendingGuestbookEntries(),
    getPublishedGuestbookEntries(),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Guestbook</h1>
      <GuestbookAdmin pending={pending} published={published} />
    </div>
  );
}
