import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const VERBATIM_DIR = path.join(process.cwd(), 'content', 'verbatim');

// =============================================================================
// SCHEMAS
// =============================================================================

const SourceSchema = z.object({
  type: z.enum(['repo', 'crawl']),
  files: z.array(z.string()).optional(),
  url: z.string().optional(),
  capturedAt: z.string(),
});

const SectionSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  title: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  text: z.string().optional(),
  description: z.string().optional(),
  tagline: z.string().optional(),
  status: z.string().optional(),
  year: z.number().optional(),
  tags: z.array(z.string()).optional(),
  role: z.string().optional(),
  items: z.array(z.any()).optional(),
  buttonText: z.string().optional(),
});

const VerbatimContentSchema = z.object({
  route: z.string(),
  title: z.string().optional(),
  slug: z.string().optional(),
  sections: z.array(SectionSchema),
  source: SourceSchema,
});

export type VerbatimContent = z.infer<typeof VerbatimContentSchema>;
export type VerbatimSection = z.infer<typeof SectionSchema>;
export type VerbatimSource = z.infer<typeof SourceSchema>;

// =============================================================================
// LOADERS
// =============================================================================

export function getVerbatimContent(filename: string): VerbatimContent | null {
  const filePath = path.join(VERBATIM_DIR, `${filename}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return VerbatimContentSchema.parse(data);
}

export function getVerbatimExperiment(slug: string): VerbatimContent | null {
  const filePath = path.join(VERBATIM_DIR, 'experiments', `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return VerbatimContentSchema.parse(data);
}

export function getAllVerbatimExperiments(): VerbatimContent[] {
  const dir = path.join(VERBATIM_DIR, 'experiments');

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  const experiments: VerbatimContent[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    experiments.push(VerbatimContentSchema.parse(data));
  }

  return experiments;
}

export function getSection(content: VerbatimContent, key: string): VerbatimSection | undefined {
  return content.sections.find((s) => s.key === key);
}

// =============================================================================
// SOURCE BADGE HELPERS
// =============================================================================

export function isVerbatimDebugEnabled(): boolean {
  return process.env.VERBATIM_DEBUG === '1';
}

export function formatSourceInfo(source: VerbatimSource): string {
  if (source.type === 'crawl' && source.url) {
    return `Source: crawl ${source.url}`;
  }
  if (source.type === 'repo' && source.files?.length) {
    return `Source: repo ${source.files.join(', ')}`;
  }
  return `Source: ${source.type}`;
}

// =============================================================================
// CONTENT MANIFEST
// =============================================================================

export interface VerbatimManifest {
  pages: {
    route: string;
    filename: string;
    source: VerbatimSource;
  }[];
  experiments: {
    route: string;
    slug: string;
    source: VerbatimSource;
  }[];
}

export function getVerbatimManifest(): VerbatimManifest {
  const manifest: VerbatimManifest = {
    pages: [],
    experiments: [],
  };

  // Load page content files
  const pageFiles = ['studio', 'experiments', 'collection', 'media', 'contact', 'site'];
  for (const filename of pageFiles) {
    const content = getVerbatimContent(filename);
    if (content) {
      manifest.pages.push({
        route: content.route,
        filename,
        source: content.source,
      });
    }
  }

  // Load experiment detail files
  const experiments = getAllVerbatimExperiments();
  for (const exp of experiments) {
    manifest.experiments.push({
      route: exp.route,
      slug: exp.slug || '',
      source: exp.source,
    });
  }

  return manifest;
}
