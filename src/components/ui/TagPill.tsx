import { cn } from '@/lib/utils';

interface TagPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function TagPill({
  label,
  active = false,
  onClick,
  size = 'sm',
  className,
}: TagPillProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center font-medium uppercase tracking-wide rounded transition-all',
        size === 'sm' && 'px-2 py-1 text-xs',
        size === 'md' && 'px-3 py-1.5 text-xs',
        active
          ? 'bg-[var(--color-accent)] text-white'
          : 'bg-[var(--color-bg-alt)] text-[var(--color-fg-muted)] hover:bg-[var(--color-accent)] hover:text-white',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {label}
    </Component>
  );
}
