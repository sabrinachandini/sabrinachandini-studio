import { TileCard } from '@/components/ui/TileCard';
import type { Experiment } from '@/types/content';

interface ExperimentStripProps {
  experiments: Experiment[];
  columns?: 2 | 3 | 4;
}

export function ExperimentStrip({
  experiments,
  columns = 3,
}: ExperimentStripProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-5`}>
      {experiments.map((experiment) => (
        <TileCard
          key={experiment.slug}
          title={experiment.title}
          description={experiment.description}
          href={`/experiments/${experiment.slug}`}
          image={experiment.image}
          tags={experiment.tags}
          status={experiment.status}
          year={experiment.year}
          hoverContent={
            experiment.intention || experiment.whatChangedMyMind || experiment.whatSurprisedMe || experiment.nextIteration
              ? {
                  intention: experiment.intention,
                  changedMyMind: experiment.whatChangedMyMind,
                  surprise: experiment.whatSurprisedMe,
                  next: experiment.nextIteration,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
