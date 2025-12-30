import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  NowSchema,
  ExperimentSchema,
  CollectionItemSchema,
  type Now,
  type Experiment,
  type CollectionItem,
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
