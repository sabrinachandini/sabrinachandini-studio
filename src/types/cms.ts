import { z } from 'zod';

// =============================================================================
// BLOCK TYPES - Small set of enforceable block types
// =============================================================================

export const BlockTypeSchema = z.enum([
  'heading',
  'richtext',
  'bulletedList',
  'linkList',
  'quote',
  'callout',
  'image',
  'gallery',
  'cardGrid',
  'divider',
  // Special blocks that embed existing modules
  'experimentsList',
  'collectionGrid',
  'logList',
  'questionNotes',
  'guestbookForm',
  'portfolioWork',
  'portfolioPosts',
  'obsessionModule',
  'mediaList',
]);

export type BlockType = z.infer<typeof BlockTypeSchema>;

// Block data schemas for each type
export const HeadingBlockDataSchema = z.object({
  text: z.string(),
  level: z.enum(['h1', 'h2', 'h3', 'h4']).default('h2'),
});

export const RichTextBlockDataSchema = z.object({
  content: z.string(), // Markdown content
});

export const BulletedListBlockDataSchema = z.object({
  items: z.array(z.string()),
});

export const LinkListBlockDataSchema = z.object({
  links: z.array(z.object({
    label: z.string(),
    href: z.string(),
    description: z.string().optional(),
  })),
});

export const QuoteBlockDataSchema = z.object({
  text: z.string(),
  attribution: z.string().optional(),
});

export const CalloutBlockDataSchema = z.object({
  text: z.string(),
  type: z.enum(['info', 'warning', 'success', 'note']).default('note'),
});

export const ImageBlockDataSchema = z.object({
  mediaId: z.string(), // Reference to MediaItem
  alt: z.string().optional(),
  caption: z.string().optional(),
  size: z.enum(['small', 'medium', 'large', 'full']).default('medium'),
});

export const GalleryBlockDataSchema = z.object({
  mediaIds: z.array(z.string()), // References to MediaItems
  columns: z.number().min(2).max(4).default(3),
});

export const CardGridBlockDataSchema = z.object({
  source: z.enum(['experiments', 'collection', 'work', 'custom']),
  filter: z.object({
    status: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    limit: z.number().optional(),
  }).optional(),
  customItems: z.array(z.object({
    title: z.string(),
    description: z.string(),
    href: z.string().optional(),
    image: z.string().optional(),
  })).optional(),
});

export const DividerBlockDataSchema = z.object({
  style: z.enum(['line', 'space', 'dots']).default('line'),
});

// Module blocks (thin wrappers around existing modules)
export const ModuleBlockDataSchema = z.object({
  config: z.record(z.string(), z.unknown()).optional(),
});

// Union block schema
export const BlockSchema = z.object({
  id: z.string(),
  type: BlockTypeSchema,
  data: z.unknown(), // Type-checked at runtime based on block type
  order: z.number(),
});

export type Block = z.infer<typeof BlockSchema>;

// =============================================================================
// PAGE SCHEMA
// =============================================================================

export const PageStatusSchema = z.enum(['draft', 'published']);
export const PageTemplateSchema = z.enum([
  'default',
  'full-width',
  'narrow',
]);

export const PageRevisionSchema = z.object({
  id: z.string(),
  pageId: z.string(),
  blocks: z.array(BlockSchema),
  title: z.string(),
  editorNote: z.string().optional(),
  createdAt: z.string(),
  createdBy: z.string().optional(),
});

export const PageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  template: PageTemplateSchema,
  status: PageStatusSchema,
  blocks: z.array(BlockSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().nullable(),
});

export type PageStatus = z.infer<typeof PageStatusSchema>;
export type PageTemplate = z.infer<typeof PageTemplateSchema>;
export type PageRevision = z.infer<typeof PageRevisionSchema>;
export type Page = z.infer<typeof PageSchema>;

// =============================================================================
// MENU SCHEMA
// =============================================================================

export const MenuItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  order: z.number(),
  visible: z.boolean().default(true),
  external: z.boolean().optional(),
});

export const MenuSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g., "primary", "footer"
  items: z.array(MenuItemSchema),
  updatedAt: z.string(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Menu = z.infer<typeof MenuSchema>;

// =============================================================================
// MEDIA ITEM SCHEMA
// =============================================================================

export const MediaStatusSchema = z.enum(['active', 'deleted']);
export const MediaTypeSchema = z.enum(['image', 'video', 'pdf', 'other']);

export const MediaItemSchema = z.object({
  id: z.string(),
  filename: z.string(),
  originalFilename: z.string(),
  url: z.string(),
  mimeType: z.string(),
  size: z.number(), // bytes
  width: z.number().optional(), // for images
  height: z.number().optional(), // for images
  altText: z.string().optional(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: MediaStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MediaStatus = z.infer<typeof MediaStatusSchema>;
export type MediaItemType = z.infer<typeof MediaTypeSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;

// =============================================================================
// SITE SETTINGS SCHEMA
// =============================================================================

export const SiteSettingsSchema = z.object({
  siteTitle: z.string(),
  siteDescription: z.string().optional(),
  contactEmail: z.string().optional(),
  footerLinks: z.array(z.object({
    label: z.string(),
    href: z.string(),
  })).optional(),
  socialLinks: z.array(z.object({
    name: z.string(),
    url: z.string(),
    icon: z.string().optional(),
  })).optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
  homeModules: z.array(z.object({
    id: z.string(),
    type: z.string(),
    enabled: z.boolean(),
    order: z.number(),
  })).optional(),
  updatedAt: z.string(),
});

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
