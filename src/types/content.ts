import { z } from 'zod';

// =============================================================================
// NOW SCHEMA
// =============================================================================
export const NowItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  link: z.string().url().optional(),
});

export const NowSchema = z.object({
  making: z.array(NowItemSchema),
  learning: z.array(NowItemSchema),
  collecting: z.array(NowItemSchema),
  updatedAt: z.string(),
});

export type NowItem = z.infer<typeof NowItemSchema>;
export type Now = z.infer<typeof NowSchema>;

// =============================================================================
// EXPERIMENT SCHEMA
// =============================================================================
export const ExperimentStatusSchema = z.enum(['in-progress', 'shipped', 'archived']);
export const ExperimentTagSchema = z.enum(['writing', 'talks', 'product', 'code', 'design', 'research']);

export const ExperimentSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  intention: z.string().optional(),
  role: z.string().optional(),
  status: ExperimentStatusSchema,
  tags: z.array(ExperimentTagSchema),
  featured: z.boolean().default(false),
  whatIDid: z.array(z.string()).optional(),
  whatSurprisedMe: z.string().optional(),
  nextIteration: z.string().optional(),
  artifacts: z.array(z.object({
    type: z.enum(['live', 'github', 'doc', 'video', 'image']),
    url: z.string(),
    label: z.string().optional(),
  })).optional(),
  image: z.string().optional(),
  year: z.number().optional(),
  publishedAt: z.string().optional(),
});

export type ExperimentStatus = z.infer<typeof ExperimentStatusSchema>;
export type ExperimentTag = z.infer<typeof ExperimentTagSchema>;
export type Experiment = z.infer<typeof ExperimentSchema>;

// =============================================================================
// COLLECTION SCHEMA
// =============================================================================
export const CollectionCategorySchema = z.enum([
  'ephemera',
  'tools',
  'notes',
  'places',
  'people',
  'ideas',
]);

export const CollectionItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: CollectionCategorySchema,
  year: z.number().optional(),
  image: z.string().optional(),
  whyItMatters: z.string().optional(),
  links: z.array(z.object({
    url: z.string(),
    label: z.string(),
  })).optional(),
  related: z.array(z.string()).optional(), // slugs of related items
});

export type CollectionCategory = z.infer<typeof CollectionCategorySchema>;
export type CollectionItem = z.infer<typeof CollectionItemSchema>;

// =============================================================================
// MEDIA SCHEMA
// =============================================================================
export const MediaTypeSchema = z.enum(['press', 'podcast', 'talk', 'interview', 'feature', 'other']);

export const MediaItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  outlet: z.string(),
  type: MediaTypeSchema,
  date: z.string().optional(), // ISO date if available
  url: z.string().url().optional(), // External link to coverage
  internalPath: z.string().optional(), // e.g., /experiments/some-project
  description: z.string(), // 1-2 sentence blurb
  image: z.string().optional(), // Local asset path
  whyItMattered: z.string().optional(), // Optional deeper context
  updatedAt: z.string(), // For changelog tracking
});

export type MediaType = z.infer<typeof MediaTypeSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;

// =============================================================================
// MEDIA KIT SCHEMA
// =============================================================================
export const MediaKitSchema = z.object({
  bio: z.string(),
  contactEmail: z.string(),
  socialLinks: z.array(z.object({
    name: z.string(),
    url: z.string(),
  })),
  updatedAt: z.string(),
});

export type MediaKit = z.infer<typeof MediaKitSchema>;
