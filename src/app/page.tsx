import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getNow, getInProgressExperiments, getShippedExperiments, getCollection } from '@/lib/content';
import { NowModule } from '@/components/blocks/NowModule';
import { ExperimentStrip } from '@/components/blocks/ExperimentStrip';
import { SectionHeader } from '@/components/ui/SectionHeader';

export default async function HomePage() {
  const [now, inProgress, shipped, collection] = await Promise.all([
    getNow(),
    getInProgressExperiments(),
    getShippedExperiments(),
    getCollection(),
  ]);

  const collectionTeaser = collection.slice(0, 6);

  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <section className="container mb-16 md:mb-24">
        <div className="max-w-3xl">
          {/* Geometric accent */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-3 h-3 bg-[var(--color-secondary)]" />
            <span className="w-3 h-3 bg-[var(--color-accent)]" />
            <span className="w-3 h-3 border border-[var(--color-border-strong)]" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Builder <span className="text-[var(--color-fg-subtle)]">&bull;</span> Storyteller{' '}
            <span className="text-[var(--color-fg-subtle)]">&bull;</span> Entrepreneur
          </h1>

          {/* Identity statement */}
          <p className="text-lg md:text-xl text-[var(--color-fg-muted)] leading-relaxed max-w-2xl">
            Always learning new AI tools. Inspired by people creating something new—startup founders or founding fathers.
          </p>
        </div>
      </section>

      {/* Now Section */}
      <section className="container mb-16 md:mb-24">
        <SectionHeader
          title="Now"
          subtitle={`What I'm focused on right now. Updated ${new Date(now.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`}
        />
        <NowModule now={now} />
      </section>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section className="container mb-16 md:mb-24">
          <SectionHeader
            title="In Progress"
            subtitle="Experiments I'm actively working on."
            viewAllHref="/experiments?status=in-progress"
          />
          <ExperimentStrip experiments={inProgress.slice(0, 3)} columns={3} />
        </section>
      )}

      {/* Recently Shipped */}
      {shipped.length > 0 && (
        <section className="container mb-16 md:mb-24">
          <SectionHeader
            title="Recently Shipped"
            subtitle="Things I've completed and released."
            viewAllHref="/experiments?status=shipped"
          />
          <ExperimentStrip experiments={shipped.slice(0, 4)} columns={4} />
        </section>
      )}

      {/* Collection Teaser */}
      <section className="container mb-16 md:mb-24">
        <SectionHeader
          title="Collection"
          subtitle="Tools, ideas, people, and places that shape how I work and think."
          viewAllHref="/collection"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {collectionTeaser.map((item) => (
            <Link
              key={item.slug}
              href={`/collection?item=${item.slug}`}
              className="group bg-white border border-[var(--color-border)] rounded p-4 transition-all hover:border-[var(--color-border-strong)] hover:shadow-md"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-fg-subtle)]">
                {item.category}
              </span>
              <h3 className="text-sm font-semibold mt-1 group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container">
        <div className="bg-[var(--color-bg-alt)] rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Let's build something together</h2>
            <p className="text-[var(--color-fg-muted)]">
              Open to collaborations, speaking, and new projects.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            Get in touch
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
