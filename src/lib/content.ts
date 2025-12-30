import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  NowSchema,
  ExperimentSchema,
  CollectionItemSchema,
  MediaItemSchema,
  MediaKitSchema,
  type Now,
  type Experiment,
  type CollectionItem,
  type MediaItem,
  type MediaKit,
} from '@/types/content';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// =============================================================================
// NOW
// =============================================================================
export async function getNow(): Promise<Now> {
  const filePath = path.join(CONTENT_DIR, 'now', 'now.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return NowSchema.parse(data);
}

// =============================================================================
// EXPERIMENTS
// =============================================================================
export async function getExperiments(): Promise<Experiment[]> {
  const dir = path.join(CONTENT_DIR, 'experiments');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

  const experiments: Experiment[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const experiment = ExperimentSchema.parse(data);
    experiments.push(experiment);
  }

  // Sort by featured first, then by year descending
  return experiments.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return (b.year ?? 0) - (a.year ?? 0);
  });
}

export async function getExperiment(slug: string): Promise<Experiment | null> {
  const experiments = await getExperiments();
  return experiments.find((e) => e.slug === slug) ?? null;
}

export async function getFeaturedExperiments(): Promise<Experiment[]> {
  const experiments = await getExperiments();
  return experiments.filter((e) => e.featured);
}

export async function getInProgressExperiments(): Promise<Experiment[]> {
  const experiments = await getExperiments();
  return experiments.filter((e) => e.status === 'in-progress');
}

export async function getShippedExperiments(): Promise<Experiment[]> {
  const experiments = await getExperiments();
  return experiments.filter((e) => e.status === 'shipped');
}

// =============================================================================
// COLLECTION
// =============================================================================
export async function getCollection(): Promise<CollectionItem[]> {
  const dir = path.join(CONTENT_DIR, 'collection');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

  const items: CollectionItem[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const item = CollectionItemSchema.parse(data);
    items.push(item);
  }

  // Sort by year descending
  return items.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export async function getCollectionItem(slug: string): Promise<CollectionItem | null> {
  const items = await getCollection();
  return items.find((i) => i.slug === slug) ?? null;
}

export async function getCollectionByCategory(category: string): Promise<CollectionItem[]> {
  const items = await getCollection();
  return items.filter((i) => i.category === category);
}

export async function getRelatedCollectionItems(slug: string): Promise<CollectionItem[]> {
  const item = await getCollectionItem(slug);
  if (!item || !item.related?.length) return [];

  const allItems = await getCollection();
  return allItems.filter((i) => item.related?.includes(i.slug));
}

// =============================================================================
// MEDIA
// =============================================================================
export async function getMedia(): Promise<MediaItem[]> {
  const dir = path.join(CONTENT_DIR, 'media');

  // Return empty array if directory doesn't exist yet
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

  const items: MediaItem[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const item = MediaItemSchema.parse(data);
    items.push(item);
  }

  // Sort by date descending (most recent first), then by updatedAt
  return items.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export async function getMediaByType(type: string): Promise<MediaItem[]> {
  const items = await getMedia();
  return items.filter((i) => i.type === type);
}

export async function getMediaByYear(): Promise<Record<number, MediaItem[]>> {
  const items = await getMedia();
  const byYear: Record<number, MediaItem[]> = {};

  for (const item of items) {
    const year = item.date ? new Date(item.date).getFullYear() : new Date(item.updatedAt).getFullYear();
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(item);
  }

  return byYear;
}

export async function getRecentMediaUpdates(limit = 5): Promise<MediaItem[]> {
  const items = await getMedia();
  return items
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export async function getMediaKit(): Promise<MediaKit | null> {
  const filePath = path.join(CONTENT_DIR, 'site', 'media-kit.json');

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return MediaKitSchema.parse(data);
}
