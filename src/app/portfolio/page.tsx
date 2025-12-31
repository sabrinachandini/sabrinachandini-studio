import { getLinkedInWorkExperience, getLinkedInPosts } from '@/lib/data';
import { PortfolioTabs } from '@/components/blocks/PortfolioTabs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Sabrina Chandini',
  description: 'Work experience and professional updates.',
};

export default async function PortfolioPage() {
  const [work, posts] = await Promise.all([
    getLinkedInWorkExperience(),
    getLinkedInPosts(),
  ]);

  return (
    <div className="container py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold mb-2">Portfolio</h1>
        <p className="text-[var(--color-fg-muted)] mb-8">
          Work experience and professional updates.
        </p>

        <PortfolioTabs work={work} posts={posts} />
      </div>
    </div>
  );
}
