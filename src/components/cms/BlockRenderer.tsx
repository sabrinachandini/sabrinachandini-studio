import type { Block } from '@/types/cms';
import { ExperimentsList } from './modules/ExperimentsList';
import { CollectionGrid } from './modules/CollectionGrid';
import { LogList } from './modules/LogList';
import { QuestionNotes } from './modules/QuestionNotes';
import { GuestbookModule } from './modules/GuestbookModule';
import { PortfolioWork } from './modules/PortfolioWork';
import { PortfolioPosts } from './modules/PortfolioPosts';
import { ObsessionModule } from './modules/ObsessionModule';
import { MediaList } from './modules/MediaList';
import { ExternalLink } from 'lucide-react';

interface BlockRendererProps {
  blocks: Block[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <BlockComponent key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockComponent({ block }: { block: Block }) {
  const data = block.data as Record<string, unknown>;

  switch (block.type) {
    case 'heading': {
      const level = (data.level as number) || 2;
      const text = (data.text as string) || '';
      const sizeClasses: Record<number, string> = {
        1: 'text-4xl font-bold',
        2: 'text-2xl font-semibold',
        3: 'text-xl font-semibold',
        4: 'text-lg font-medium',
      };
      const className = sizeClasses[level] || sizeClasses[2];
      if (level === 1) return <h1 className={className}>{text}</h1>;
      if (level === 3) return <h3 className={className}>{text}</h3>;
      if (level === 4) return <h4 className={className}>{text}</h4>;
      return <h2 className={className}>{text}</h2>;
    }

    case 'richtext': {
      const html = (data.html as string) || '';
      return (
        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    case 'bulletedList': {
      const items = (data.items as string[]) || [];
      return (
        <ul className="list-disc list-inside space-y-1 text-[var(--color-fg-muted)]">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    case 'linkList': {
      const links = (data.links as Array<{ label: string; url: string; description?: string }>) || [];
      return (
        <ul className="space-y-2">
          {links.map((link, i) => (
            <li key={i}>
              <a
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1"
              >
                {link.label}
                {link.url.startsWith('http') && <ExternalLink size={12} />}
              </a>
              {link.description && (
                <span className="text-[var(--color-fg-muted)] ml-2">— {link.description}</span>
              )}
            </li>
          ))}
        </ul>
      );
    }

    case 'quote': {
      const text = (data.text as string) || '';
      const attribution = (data.attribution as string) || '';
      return (
        <blockquote className="border-l-4 border-[var(--color-secondary)] pl-4 py-2 italic text-[var(--color-fg-muted)]">
          <p>{text}</p>
          {attribution && (
            <footer className="mt-2 text-sm not-italic">— {attribution}</footer>
          )}
        </blockquote>
      );
    }

    case 'callout': {
      const type = (data.type as string) || 'info';
      const title = (data.title as string) || '';
      const text = (data.text as string) || '';
      const styles: Record<string, string> = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
      };
      return (
        <div className={`p-4 rounded-lg border ${styles[type] || styles.info}`}>
          {title && <p className="font-medium mb-1">{title}</p>}
          <p className="text-sm">{text}</p>
        </div>
      );
    }

    case 'image': {
      const src = (data.src as string) || '';
      const alt = (data.alt as string) || '';
      const caption = (data.caption as string) || '';
      return (
        <figure>
          <img src={src} alt={alt} className="rounded-lg w-full" />
          {caption && (
            <figcaption className="mt-2 text-sm text-center text-[var(--color-fg-muted)]">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'gallery': {
      const images = (data.images as Array<{ src: string; alt: string; caption?: string }>) || [];
      const columns = (data.columns as number) || 3;
      return (
        <div className={`grid gap-4 grid-cols-${columns}`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {images.map((img, i) => (
            <figure key={i}>
              <img src={img.src} alt={img.alt} className="rounded-lg w-full aspect-square object-cover" />
              {img.caption && (
                <figcaption className="mt-1 text-xs text-center text-[var(--color-fg-muted)]">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      );
    }

    case 'cardGrid': {
      const cards = (data.cards as Array<{ title: string; description: string; link?: string; image?: string }>) || [];
      const columns = (data.columns as number) || 3;
      return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {cards.map((card, i) => (
            <div key={i} className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden">
              {card.image && (
                <img src={card.image} alt={card.title} className="w-full aspect-video object-cover" />
              )}
              <div className="p-4">
                {card.link ? (
                  <a href={card.link} className="font-medium hover:text-[var(--color-secondary)]">
                    {card.title}
                  </a>
                ) : (
                  <p className="font-medium">{card.title}</p>
                )}
                <p className="text-sm text-[var(--color-fg-muted)] mt-1">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    case 'divider':
      return <hr className="border-[var(--color-border)]" />;

    // Module blocks - these render dynamic content from the database
    case 'experimentsList':
      return <ExperimentsList />;

    case 'collectionGrid':
      return <CollectionGrid />;

    case 'logList':
      return <LogList limit={(data.limit as number) || 10} />;

    case 'questionNotes':
      return <QuestionNotes />;

    case 'guestbookForm':
      return <GuestbookModule />;

    case 'portfolioWork':
      return <PortfolioWork />;

    case 'portfolioPosts':
      return <PortfolioPosts />;

    case 'obsessionModule':
      return <ObsessionModule />;

    case 'mediaList':
      return <MediaList />;

    default:
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Unknown block type: {block.type}
        </div>
      );
  }
}
