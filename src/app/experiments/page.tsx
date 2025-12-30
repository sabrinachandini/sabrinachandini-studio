'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { TileCard } from '@/components/ui/TileCard';
import { MotionFade } from '@/components/ui/MotionFade';
import type { Experiment } from '@/types/content';

function ExperimentsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [activeTab, setActiveTab] = useState(initialStatus);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experiments')
      .then((res) => res.json())
      .then((data) => {
        setExperiments(data);
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: 'all', label: 'All', count: experiments.length },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: experiments.filter((e) => e.status === 'in-progress').length,
    },
    {
      id: 'shipped',
      label: 'Shipped',
      count: experiments.filter((e) => e.status === 'shipped').length,
    },
    {
      id: 'writing',
      label: 'Writing',
      count: experiments.filter((e) => e.tags.includes('writing')).length,
    },
    {
      id: 'talks',
      label: 'Talks',
      count: experiments.filter((e) => e.tags.includes('talks')).length,
    },
  ];

  const filteredExperiments = experiments.filter((e) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return e.status === 'in-progress';
    if (activeTab === 'shipped') return e.status === 'shipped';
    if (activeTab === 'writing') return e.tags.includes('writing');
    if (activeTab === 'talks') return e.tags.includes('talks');
    return true;
  });

  return (
    <>
      {/* Filters */}
      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="text-center py-12 text-[var(--color-fg-muted)]">
            Loading experiments...
          </div>
        ) : filteredExperiments.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-fg-muted)]">
            No experiments found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((experiment, index) => (
              <MotionFade key={experiment.slug} delay={index * 0.05}>
                <TileCard
                  title={experiment.title}
                  description={experiment.description}
                  href={`/experiments/${experiment.slug}`}
                  image={experiment.image}
                  tags={experiment.tags}
                  status={experiment.status}
                  year={experiment.year}
                  hoverContent={
                    experiment.intention ||
                    experiment.whatSurprisedMe ||
                    experiment.nextIteration
                      ? {
                          intention: experiment.intention,
                          surprise: experiment.whatSurprisedMe,
                          next: experiment.nextIteration,
                        }
                      : undefined
                  }
                />
              </MotionFade>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function ExperimentsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="accent-square" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Experiments
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Things I'm building
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)] max-w-2xl">
            Products, projects, writing, and talks. Each experiment is an opportunity to learn something new.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-[var(--color-fg-muted)]">Loading...</div>}>
          <ExperimentsContent />
        </Suspense>
      </div>
    </div>
  );
}
