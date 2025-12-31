import { getPageById, getPageRevisions } from '@/lib/cms';
import { notFound } from 'next/navigation';
import { PageEditor } from '@/components/admin/PageEditor';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await getPageById(id);

  if (!page) {
    notFound();
  }

  const revisions = await getPageRevisions(id);

  return <PageEditor page={page} revisions={revisions} />;
}
