import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getQuestionAnswers } from '@/lib/data';
import { AnswersAdmin } from '@/components/admin/AnswersAdmin';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminAnswersPage() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    redirect('/admin');
  }

  const allAnswers = await getQuestionAnswers();
  const pending = allAnswers.filter((a) => a.status === 'pending');
  const published = allAnswers.filter((a) => a.status === 'published');

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] mb-6"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-semibold mb-6">Question Answers</h1>
      <p className="text-[var(--color-fg-muted)] mb-8">
        Moderate visitor answers to your question and add annotations.
      </p>

      <AnswersAdmin pending={pending} published={published} />
    </div>
  );
}
