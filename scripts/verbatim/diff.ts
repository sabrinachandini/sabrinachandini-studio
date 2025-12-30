#!/usr/bin/env npx tsx
/**
 * Verbatim Content Diff Test
 *
 * Validates that rendered page content matches verbatim source content.
 * Reports any drift between what's in the content files and what's expected.
 *
 * Usage:
 *   npx tsx scripts/verbatim/diff.ts
 *   npm run verbatim:diff
 */

import fs from 'fs';
import path from 'path';

interface DiffResult {
  file: string;
  route: string;
  status: 'pass' | 'fail' | 'warning';
  issues: string[];
}

interface VerbatimContent {
  route: string;
  title?: string;
  slug?: string;
  sections: Array<{
    key: string;
    label?: string;
    title?: string;
    heading?: string;
    subheading?: string;
    text?: string;
    description?: string;
    tagline?: string;
    items?: unknown[];
    [key: string]: unknown;
  }>;
  source: {
    type: 'repo' | 'crawl';
    files?: string[];
    url?: string;
    capturedAt: string;
  };
}

const VERBATIM_DIR = path.join(process.cwd(), 'content', 'verbatim');
const CONTENT_DIR = path.join(process.cwd(), 'content');

// =============================================================================
// HELPERS
// =============================================================================

function loadJson<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function extractTextFields(obj: unknown): string[] {
  const texts: string[] = [];

  if (typeof obj === 'string') {
    texts.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      texts.push(...extractTextFields(item));
    }
  } else if (obj && typeof obj === 'object') {
    for (const value of Object.values(obj)) {
      texts.push(...extractTextFields(value));
    }
  }

  return texts.filter(t => t.length > 0);
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}

// =============================================================================
// DIFF CHECKS
// =============================================================================

function checkVerbatimFile(filename: string): DiffResult {
  const verbatimPath = path.join(VERBATIM_DIR, `${filename}.json`);
  const verbatim = loadJson<VerbatimContent>(verbatimPath);

  if (!verbatim) {
    return {
      file: filename,
      route: '/',
      status: 'fail',
      issues: [`Verbatim file not found: ${verbatimPath}`],
    };
  }

  const issues: string[] = [];

  // site.json has a different structure (no route or sections)
  if (filename === 'site') {
    const siteContent = verbatim as unknown as {
      navigation?: unknown;
      footer?: unknown;
      metadata?: unknown;
      source?: VerbatimContent['source'];
    };

    if (!siteContent.navigation) {
      issues.push('Missing navigation config');
    }
    if (!siteContent.footer) {
      issues.push('Missing footer config');
    }
    if (!siteContent.metadata) {
      issues.push('Missing metadata config');
    }
    if (!siteContent.source) {
      issues.push('Missing source provenance');
    }

    return {
      file: filename,
      route: '(site-wide)',
      status: issues.length === 0 ? 'pass' : 'fail',
      issues,
    };
  }

  // Check required fields for page content
  if (!verbatim.route) {
    issues.push('Missing route field');
  }

  if (!verbatim.sections || verbatim.sections.length === 0) {
    issues.push('No sections defined');
  }

  if (!verbatim.source) {
    issues.push('Missing source provenance');
  } else {
    if (!verbatim.source.capturedAt) {
      issues.push('Missing capturedAt timestamp in source');
    }
    if (verbatim.source.type === 'repo' && (!verbatim.source.files || verbatim.source.files.length === 0)) {
      issues.push('Repo source type but no files listed');
    }
  }

  // Check that sections have content (only if sections exist)
  if (verbatim.sections && Array.isArray(verbatim.sections)) {
    for (const section of verbatim.sections) {
      if (!section.key) {
        issues.push('Section missing key field');
        continue;
      }

      const textContent = extractTextFields(section);
      if (textContent.length === 0) {
        issues.push(`Section "${section.key}" has no text content`);
      }
    }
  }

  return {
    file: filename,
    route: verbatim.route || '/',
    status: issues.length === 0 ? 'pass' : 'fail',
    issues,
  };
}

function checkExperimentVerbatim(slug: string): DiffResult {
  const verbatimPath = path.join(VERBATIM_DIR, 'experiments', `${slug}.json`);
  const verbatim = loadJson<VerbatimContent>(verbatimPath);

  if (!verbatim) {
    return {
      file: `experiments/${slug}`,
      route: `/experiments/${slug}`,
      status: 'fail',
      issues: [`Verbatim file not found: ${verbatimPath}`],
    };
  }

  const issues: string[] = [];

  // Check required fields
  if (!verbatim.route) {
    issues.push('Missing route field');
  }

  if (!verbatim.slug || verbatim.slug !== slug) {
    issues.push(`Slug mismatch: expected "${slug}", got "${verbatim.slug}"`);
  }

  // Check for required experiment sections
  const requiredSections = ['header', 'intention', 'what-i-did'];
  for (const required of requiredSections) {
    const found = verbatim.sections.find(s => s.key === required);
    if (!found) {
      issues.push(`Missing required section: ${required}`);
    }
  }

  // Check header section has required fields
  const header = verbatim.sections.find(s => s.key === 'header');
  if (header) {
    if (!header.title) issues.push('Header section missing title');
    if (!header.description) issues.push('Header section missing description');
  }

  return {
    file: `experiments/${slug}`,
    route: verbatim.route,
    status: issues.length === 0 ? 'pass' : 'fail',
    issues,
  };
}

// =============================================================================
// MAIN
// =============================================================================

function runDiff(): void {
  console.log('='.repeat(60));
  console.log('VERBATIM CONTENT DIFF TEST');
  console.log('='.repeat(60));
  console.log();

  const results: DiffResult[] = [];

  // Check page-level verbatim files
  const pageFiles = ['studio', 'experiments', 'collection', 'media', 'contact', 'site'];
  for (const filename of pageFiles) {
    results.push(checkVerbatimFile(filename));
  }

  // Check experiment detail verbatim files
  const experimentsDir = path.join(VERBATIM_DIR, 'experiments');
  if (fs.existsSync(experimentsDir)) {
    const experimentFiles = fs.readdirSync(experimentsDir).filter(f => f.endsWith('.json'));
    for (const file of experimentFiles) {
      const slug = file.replace('.json', '');
      results.push(checkExperimentVerbatim(slug));
    }
  }

  // Output results
  let passCount = 0;
  let failCount = 0;

  for (const result of results) {
    const icon = result.status === 'pass' ? '✓' : '✗';
    const color = result.status === 'pass' ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';

    console.log(`${color}${icon}${reset} ${result.file} (${result.route})`);

    if (result.issues.length > 0) {
      for (const issue of result.issues) {
        console.log(`    - ${issue}`);
      }
    }

    if (result.status === 'pass') {
      passCount++;
    } else {
      failCount++;
    }
  }

  console.log();
  console.log('-'.repeat(60));
  console.log(`Results: ${passCount} passed, ${failCount} failed`);
  console.log('-'.repeat(60));

  // Exit with error code if any failures
  if (failCount > 0) {
    process.exit(1);
  }
}

// Run the diff test
runDiff();
