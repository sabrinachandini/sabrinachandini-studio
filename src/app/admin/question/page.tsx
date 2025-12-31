import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getQuestion, getQuestionNotes } from '@/lib/data';
import { QuestionEditor } from '@/components/admin/QuestionEditor';

export default async function AdminQuestionPage() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) redirect('/admin');

  const [question, notes] = await Promise.all([
    getQuestion('starting-something-new'),
    getQuestionNotes('starting-something-new'),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Question Project</h1>
      <QuestionEditor question={question} notes={notes} />
    </div>
  );
}
