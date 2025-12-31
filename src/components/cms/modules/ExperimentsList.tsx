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
  ];

  const filteredExperiments = experiments.filter((e) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return e.status === 'in-progress';
    if (activeTab === 'shipped') return e.status === 'shipped';
    return true;
  });

  return (
    <>
      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {loading ? (
          <div className="text-center py-8 text-[var(--color-fg-muted)]">
            Loading experiments...
          </div>
        ) : filteredExperiments.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-fg-muted)]">
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
                />
              </MotionFade>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function ExperimentsList() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-[var(--color-fg-muted)]">Loading...</div>}>
      <ExperimentsContent />
    </Suspense>
  );
}
