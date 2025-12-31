import { isAdminAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLinkedInProfile, getLinkedInWorkExperience, getLinkedInPosts } from '@/lib/data';
import { LinkedInAdmin } from '@/components/admin/LinkedInAdmin';

export default async function AdminLinkedInPage() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) redirect('/admin');

  const [profile, work, posts] = await Promise.all([
    getLinkedInProfile(),
    getLinkedInWorkExperience(),
    getLinkedInPosts(),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">LinkedIn</h1>
      <LinkedInAdmin profile={profile} workItems={work} posts={posts} />
    </div>
  );
}
