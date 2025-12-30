import { ExternalLink } from 'lucide-react';
import type { Now, NowItem } from '@/types/content';

interface NowModuleProps {
  now: Now;
}

function NowColumn({
  title,
  items,
}: {
  title: string;
  items: NowItem[];
}) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)] mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="group">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm hover:text-[var(--color-secondary)] transition-colors"
              >
                <span className="flex-1">
                  <span className="font-medium text-[var(--color-fg)]">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="block text-[var(--color-fg-muted)] mt-0.5">
                      {item.description}
                    </span>
                  )}
                </span>
                <ExternalLink
                  size={12}
                  className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                />
              </a>
            ) : (
              <div className="text-sm">
                <span className="font-medium text-[var(--color-fg)]">
                  {item.title}
                </span>
                {item.description && (
                  <span className="block text-[var(--color-fg-muted)] mt-0.5">
                    {item.description}
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NowModule({ now }: NowModuleProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NowColumn title="Making" items={now.making} />
      <NowColumn title="Learning" items={now.learning} />
      <NowColumn title="Collecting" items={now.collecting} />
    </div>
  );
}
