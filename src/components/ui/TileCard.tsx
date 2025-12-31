'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TileCardProps {
  title: string;
  description: string;
  href: string;
  image?: string;
  tags?: string[];
  status?: 'in-progress' | 'shipped' | 'archived';
  year?: number;
  category?: string;
  hoverContent?: {
    intention?: string;
    surprise?: string;
    changedMyMind?: string;
    next?: string;
  };
  onClick?: () => void;
  className?: string;
}

export function TileCard({
  title,
  description,
  href,
  image,
  tags,
  status,
  year,
  category,
  hoverContent,
  onClick,
  className,
}: TileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <motion.div
      className={cn(
        'group relative bg-white border border-[var(--color-border)] rounded p-5',
        'transition-all duration-200',
        'hover:border-[var(--color-border-strong)] hover:shadow-md',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      {image && (
        <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded bg-[var(--color-bg-alt)]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-2 mb-2">
        {status && (
          <span
            className={cn(
              'text-xs font-medium uppercase tracking-wide',
              status === 'in-progress' && 'text-[var(--color-secondary)]',
              status === 'shipped' && 'text-green-600',
              status === 'archived' && 'text-[var(--color-fg-subtle)]'
            )}
          >
            {status === 'in-progress' ? 'In Progress' : status}
          </span>
        )}
        {category && (
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-fg-subtle)]">
            {category}
          </span>
        )}
        {year && (
          <span className="text-xs text-[var(--color-fg-subtle)]">
            {year}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-secondary)] transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--color-fg-muted)] line-clamp-2 mb-3">
        {description}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="tag-pill text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Hover reveal layer */}
      {hoverContent && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded p-5 flex flex-col justify-center pointer-events-none"
        >
          {hoverContent.intention && (
            <div className="mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
                Intent
              </span>
              <p className="text-sm text-[var(--color-fg)] mt-1">
                {hoverContent.intention}
              </p>
            </div>
          )}
          {hoverContent.changedMyMind && (
            <div className="mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                Changed My Mind
              </span>
              <p className="text-sm text-[var(--color-fg)] mt-1">
                {hoverContent.changedMyMind}
              </p>
            </div>
          )}
          {hoverContent.surprise && !hoverContent.changedMyMind && (
            <div className="mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
                Surprise
              </span>
              <p className="text-sm text-[var(--color-fg)] mt-1">
                {hoverContent.surprise}
              </p>
            </div>
          )}
          {hoverContent.next && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
                Next
              </span>
              <p className="text-sm text-[var(--color-fg)] mt-1">
                {hoverContent.next}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Arrow indicator */}
      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-[var(--color-secondary)]"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="text-left w-full">
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
