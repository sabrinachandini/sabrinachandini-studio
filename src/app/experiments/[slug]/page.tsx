import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, FileText, Play, Image as ImageIcon } from 'lucide-react';
import { getExperiment, getExperiments } from '@/lib/content';
import { TagPill } from '@/components/ui/TagPill';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static paths
export async function generateStaticParams() {
  const experiments = await getExperiments();
  return experiments.map((e) => ({ slug: e.slug }));
}

// Generate metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const experiment = await getExperiment(slug);
  if (!experiment) return {};

  return {
    title: experiment.title,
    description: experiment.description,
  };
}

const artifactIcons = {
  live: ExternalLink,
  github: Github,
  doc: FileText,
  video: Play,
  image: ImageIcon,
};

export default async function ExperimentPage({ params }: Props) {
  const { slug } = await params;
  const experiment = await getExperiment(slug);

  if (!experiment) {
    notFound();
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        {/* Back link */}
        <Link
          href="/experiments"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to experiments
        </Link>

        {/* Header */}
        <header className="mb-12">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${
                experiment.status === 'in-progress'
                  ? 'text-[var(--color-secondary)]'
                  : experiment.status === 'shipped'
                  ? 'text-green-600'
                  : 'text-[var(--color-fg-subtle)]'
              }`}
            >
              {experiment.status === 'in-progress' ? 'In Progress' : experiment.status}
            </span>
            {experiment.year && (
              <span className="text-sm text-[var(--color-fg-subtle)]">
                {experiment.year}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {experiment.title}
          </h1>

          <p className="text-xl text-[var(--color-fg-muted)] leading-relaxed mb-6">
            {experiment.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {experiment.tags.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>

          {/* Role */}
          {experiment.role && (
            <div className="text-sm text-[var(--color-fg-muted)]">
              <span className="font-medium text-[var(--color-fg)]">Role:</span>{' '}
              {experiment.role}
            </div>
          )}
        </header>

        {/* Intention */}
        {experiment.intention && (
          <section className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-3">
              Intention
            </h2>
            <p className="text-lg">{experiment.intention}</p>
          </section>
        )}

        {/* What I did */}
        {experiment.whatIDid && experiment.whatIDid.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-3">
              What I did
            </h2>
            <ul className="space-y-2">
              {experiment.whatIDid.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[var(--color-fg-muted)]"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--color-secondary)] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* What surprised me */}
        {experiment.whatSurprisedMe && (
          <section className="mb-10 bg-[var(--color-bg-alt)] rounded-lg p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-3">
              What surprised me
            </h2>
            <p className="text-[var(--color-fg)]">{experiment.whatSurprisedMe}</p>
          </section>
        )}

        {/* Artifacts */}
        {experiment.artifacts && experiment.artifacts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-4">
              Artifacts
            </h2>
            <div className="flex flex-wrap gap-3">
              {experiment.artifacts.map((artifact, index) => {
                const Icon = artifactIcons[artifact.type];
                return (
                  <a
                    key={index}
                    href={artifact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-border)] rounded hover:border-[var(--color-border-strong)] transition-colors"
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">
                      {artifact.label || artifact.type}
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Next iteration */}
        {experiment.nextIteration && (
          <section className="border-t border-[var(--color-border)] pt-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-3">
              Next iteration
            </h2>
            <p className="text-[var(--color-fg-muted)]">{experiment.nextIteration}</p>
          </section>
        )}
      </div>
    </div>
  );
}
