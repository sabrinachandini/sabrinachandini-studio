import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'View all',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between mb-8', className)}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="accent-square" />
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        {subtitle && (
          <p className="text-[var(--color-fg-muted)] mt-1">{subtitle}</p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors group"
        >
          {viewAllLabel}
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
