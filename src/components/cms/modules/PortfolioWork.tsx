'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface WorkItem {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  url?: string;
  skills?: string[];
}

export function PortfolioWork() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/linkedin/work');
        const data = await res.json();
        setItems(data.items || []);
      } catch (error) {
        console.error('Failed to fetch work items:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-[var(--color-fg-muted)] py-8">
        No work experience added yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-white border border-[var(--color-border)] rounded-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{item.role}</h3>
              <p className="text-[var(--color-fg-muted)]">{item.company}</p>
            </div>
            <span className="text-sm text-[var(--color-fg-subtle)] whitespace-nowrap">
              {item.startDate} — {item.current ? 'Present' : item.endDate}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-[var(--color-fg-muted)] mt-2">
              {item.description}
            </p>
          )}

          {item.skills && item.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-[var(--color-bg-alt)] px-2 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:underline mt-2"
            >
              Visit <ExternalLink size={12} />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
