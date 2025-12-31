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
  whatChangedMyMind: z.string().optional(), // Required for featured experiments
  nextIteration: z.string().optional(),
  artifacts: z.array(z.object({
    type: z.enum(['live', 'github', 'doc', 'video', 'image']),
    url: z.string(),
    label: z.string().optional(),
  })).optional(),
  image: z.string().optional(),
  year: z.number().optional(),
  publishedAt: z.string().optional(),
  publishStatus: z.enum(['draft', 'published']).default('published'),
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

// =============================================================================
// MONTHLY OBSESSION SCHEMA
// =============================================================================
export const ObsessionStatusSchema = z.enum(['active', 'archived']);
export const ObsessionTypeSchema = z.enum(['tool', 'concept', 'project', 'book', 'person']);

export const ObsessionSchema = z.object({
  id: z.string(),
  month: z.string(), // YYYY-MM
  title: z.string(),
  type: ObsessionTypeSchema,
  oneLiner: z.string(),
  whyNow: z.string(),
  links: z.array(z.object({
    url: z.string(),
    label: z.string(),
  })).optional(),
  status: ObsessionStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ObsessionStatus = z.infer<typeof ObsessionStatusSchema>;
export type ObsessionType = z.infer<typeof ObsessionTypeSchema>;
export type Obsession = z.infer<typeof ObsessionSchema>;

// =============================================================================
// ONE QUESTION PROJECT SCHEMA
// =============================================================================
export const QuestionTrackSchema = z.enum(['startups', 'history', 'both']);
export const NoteTypeSchema = z.enum([
  'principle',
  'tool',
  'pattern',
  'example',
  'counterexample',
  'question',
  'whos-doing-it-well',
]);

export const QuestionSchema = z.object({
  slug: z.string(),
  questionText: z.string(),
  rationaleBullets: z.array(z.string()),
  tracks: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const QuestionNoteSchema = z.object({
  id: z.string(),
  questionSlug: z.string(),
  date: z.string(),
  type: NoteTypeSchema,
  tracks: z.array(QuestionTrackSchema),
  title: z.string(),
  body: z.string(), // markdown, short
  whatChangedMyMind: z.string(), // REQUIRED
  links: z.array(z.object({
    url: z.string(),
    label: z.string(),
  })).optional(),
  publishStatus: z.enum(['draft', 'published']).default('published'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type QuestionTrack = z.infer<typeof QuestionTrackSchema>;
export type NoteType = z.infer<typeof NoteTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionNote = z.infer<typeof QuestionNoteSchema>;

// =============================================================================
// BUILD LOG SCHEMA
// =============================================================================
export const LogEntrySchema = z.object({
  id: z.string(),
  dateTime: z.string(), // ISO
  text: z.string(), // energetic one-liner
  tags: z.array(z.string()).optional(),
  link: z.string().optional(),
  whatChangedMyMind: z.string().optional(), // encouraged but not required
  publishStatus: z.enum(['draft', 'published']).default('published'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

// =============================================================================
// GUESTBOOK SCHEMA
// =============================================================================
export const GuestbookStatusSchema = z.enum(['pending', 'published', 'rejected']);
export const ModerationLabelSchema = z.enum(['ok', 'spam', 'promo', 'toxic', 'unknown']);

export const ModerationResultSchema = z.object({
  label: ModerationLabelSchema,
  score: z.number(),
  reasons: z.array(z.string()),
});

export const GuestbookAnnotationSchema = z.object({
  text: z.string(),
  annotatedAt: z.string(),
});

export const GuestbookEntrySchema = z.object({
  id: z.string(),
  name: z.string().nullable(), // null = Anonymous
  message: z.string(),
  status: GuestbookStatusSchema,
  moderation: ModerationResultSchema,
  annotation: GuestbookAnnotationSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GuestbookStatus = z.infer<typeof GuestbookStatusSchema>;
export type ModerationLabel = z.infer<typeof ModerationLabelSchema>;
export type ModerationResult = z.infer<typeof ModerationResultSchema>;
export type GuestbookAnnotation = z.infer<typeof GuestbookAnnotationSchema>;
export type GuestbookEntry = z.infer<typeof GuestbookEntrySchema>;

// =============================================================================
// LINKEDIN MODULE SCHEMA
// =============================================================================
export const LinkedInWorkItemSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  title: z.string(),
  startDate: z.string(), // YYYY-MM
  endDate: z.string().nullable(), // null = current
  description: z.string().optional(),
  sourceUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LinkedInPostSchema = z.object({
  id: z.string(),
  text: z.string(),
  postUrl: z.string().optional(),
  postedAt: z.string(), // ISO date
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LinkedInProfileSchema = z.object({
  headline: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  updatedAt: z.string(),
});

export type LinkedInWorkItem = z.infer<typeof LinkedInWorkItemSchema>;
export type LinkedInPost = z.infer<typeof LinkedInPostSchema>;
export type LinkedInProfile = z.infer<typeof LinkedInProfileSchema>;

// =============================================================================
// QUESTION ANSWERS SCHEMA
// =============================================================================
export const QuestionAnswerStatusSchema = z.enum(['pending', 'published', 'rejected']);

export const QuestionAnswerSchema = z.object({
  id: z.string(),
  questionSlug: z.string(),
  name: z.string().nullable(), // null = Anonymous
  answer: z.string(), // Their answer to the question
  status: QuestionAnswerStatusSchema,
  moderation: ModerationResultSchema,
  annotation: GuestbookAnnotationSchema.optional(), // Owner can annotate
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type QuestionAnswerStatus = z.infer<typeof QuestionAnswerStatusSchema>;
export type QuestionAnswer = z.infer<typeof QuestionAnswerSchema>;

// =============================================================================
// OBSESSION EDIT LOG SCHEMA
// =============================================================================
export const ObsessionEditLogSchema = z.object({
  id: z.string(),
  obsessionId: z.string(),
  month: z.string(), // YYYY-MM
  fieldChanged: z.string(), // which field was edited
  previousValue: z.string().optional(),
  newValue: z.string(),
  editedAt: z.string(),
});

export type ObsessionEditLog = z.infer<typeof ObsessionEditLogSchema>;

// =============================================================================
// DRAFT STATUS (shared across entities)
// =============================================================================
export const PublishStatusSchema = z.enum(['draft', 'published']);
export type PublishStatus = z.infer<typeof PublishStatusSchema>;
