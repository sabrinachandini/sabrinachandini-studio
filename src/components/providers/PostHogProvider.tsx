'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initPostHog, trackPageView, isPostHogConfigured } from '@/lib/posthog';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!isPostHogConfigured()) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    const title = document.title;

    trackPageView(url, title);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
