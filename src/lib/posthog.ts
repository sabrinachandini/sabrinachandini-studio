import posthog from 'posthog-js';

// PostHog configuration
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

// Initialize PostHog (call this once on app load)
export function initPostHog() {
  if (typeof window === 'undefined') return;
  if (!POSTHOG_KEY) {
    console.warn('PostHog key not configured. Analytics disabled.');
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We'll capture manually for more control
    capture_pageleave: true,
    persistence: 'localStorage',
    autocapture: false, // We'll use explicit events
  });
}

// ============================================================================
// HIGH-SIGNAL EVENT TRACKING
// ============================================================================

// Navigation events
export function trackNavClick(itemName: string, href: string, location: 'main' | 'more' | 'mobile') {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('nav_click', {
    item_name: itemName,
    href,
    location,
  });
}

// Index page events
export function trackIndexSearch(query: string, resultCount: number) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('index_search', {
    query,
    result_count: resultCount,
  });
}

export function trackIndexFilter(filterType: 'type' | 'status', value: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('index_filter', {
    filter_type: filterType,
    filter_value: value,
  });
}

export function trackIndexClick(itemId: string, itemType: string, itemTitle: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('index_click', {
    item_id: itemId,
    item_type: itemType,
    item_title: itemTitle,
  });
}

// Page view tracking
export function trackPageView(path: string, title: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('$pageview', {
    $current_url: window.location.href,
    $pathname: path,
    title,
  });
}

// Scroll depth tracking
export function trackScrollDepth(depth: number, path: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  // Only track at key thresholds: 25%, 50%, 75%, 100%
  if (depth === 25 || depth === 50 || depth === 75 || depth === 100) {
    posthog.capture('scroll_depth', {
      depth_percent: depth,
      path,
    });
  }
}

// Card/item interactions
export function trackCardOpen(cardId: string, cardType: string, cardTitle: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('card_open', {
    card_id: cardId,
    card_type: cardType,
    card_title: cardTitle,
  });
}

// Contact/form interactions
export function trackContactFormSubmit(subject: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('contact_form_submit', {
    subject,
  });
}

export function trackGuestbookSubmit() {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('guestbook_submit');
}

// External link clicks
export function trackExternalLinkClick(url: string, context: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('external_link_click', {
    url,
    context,
  });
}

// Portfolio interactions
export function trackPortfolioTabChange(tab: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('portfolio_tab_change', {
    tab,
  });
}

// Experiment interactions
export function trackExperimentView(experimentSlug: string, experimentTitle: string, status: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('experiment_view', {
    experiment_slug: experimentSlug,
    experiment_title: experimentTitle,
    status,
  });
}

// Question page interactions
export function trackQuestionAnswerSubmit(questionSlug: string) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('question_answer_submit', {
    question_slug: questionSlug,
  });
}

// More dropdown toggle
export function trackMoreDropdownToggle(opened: boolean) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.capture('more_dropdown_toggle', {
    opened,
  });
}

// ============================================================================
// UTILITY
// ============================================================================

// Identify user (for future use)
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.identify(userId, traits);
}

// Reset user (for logout)
export function resetUser() {
  if (typeof window === 'undefined' || !POSTHOG_KEY) return;
  posthog.reset();
}

// Check if PostHog is configured
export function isPostHogConfigured(): boolean {
  return !!POSTHOG_KEY;
}

export default posthog;
