import fs from 'fs';
import path from 'path';
import {
  PageSchema,
  PageRevisionSchema,
  MenuSchema,
  MediaItemSchema,
  SiteSettingsSchema,
  type Page,
  type PageRevision,
  type Menu,
  type MenuItem,
  type MediaItem,
  type SiteSettings,
  type Block,
} from '@/types/cms';

const CMS_DIR = path.join(process.cwd(), 'data', 'cms');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// =============================================================================
// HELPERS
// =============================================================================

function readJsonFile<T>(filename: string): T {
  const filePath = path.join(CMS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return (filename.endsWith('.json') && !filename.includes('settings') ? [] : {}) as T;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(CMS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// =============================================================================
// PAGES
// =============================================================================

export async function getPages(): Promise<Page[]> {
  const raw = readJsonFile<unknown[]>('pages.json');
  return raw.map((item) => PageSchema.parse(item));
}

export async function getPublishedPages(): Promise<Page[]> {
  const pages = await getPages();
  return pages.filter((p) => p.status === 'published');
}

export async function getPage(slug: string): Promise<Page | null> {
  const pages = await getPages();
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function getPageById(id: string): Promise<Page | null> {
  const pages = await getPages();
  return pages.find((p) => p.id === id) ?? null;
}

export async function savePage(page: Page): Promise<void> {
  const pages = await getPages();
  const index = pages.findIndex((p) => p.id === page.id);
  if (index >= 0) {
    pages[index] = page;
  } else {
    pages.push(page);
  }
  writeJsonFile('pages.json', pages);
}

export async function createPage(
  data: Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>
): Promise<Page> {
  const now = new Date().toISOString();
  const page: Page = {
    ...data,
    id: generateId('page'),
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === 'published' ? now : null,
  };
  await savePage(page);
  return page;
}

export async function updatePage(
  id: string,
  updates: Partial<Omit<Page, 'id' | 'createdAt'>>
): Promise<Page | null> {
  const page = await getPageById(id);
  if (!page) return null;

  const now = new Date().toISOString();
  const updated: Page = {
    ...page,
    ...updates,
    updatedAt: now,
    publishedAt: updates.status === 'published' && !page.publishedAt ? now : page.publishedAt,
  };

  await savePage(updated);
  return updated;
}

export async function deletePage(id: string): Promise<void> {
  const pages = await getPages();
  const filtered = pages.filter((p) => p.id !== id);
  writeJsonFile('pages.json', filtered);
}

export async function publishPage(id: string): Promise<Page | null> {
  return updatePage(id, {
    status: 'published',
  });
}

export async function unpublishPage(id: string): Promise<Page | null> {
  const page = await getPageById(id);
  if (!page) return null;

  return updatePage(id, {
    status: 'draft',
  });
}

// =============================================================================
// PAGE REVISIONS
// =============================================================================

const MAX_REVISIONS = 10;

export async function getPageRevisions(pageId: string): Promise<PageRevision[]> {
  const raw = readJsonFile<unknown[]>('revisions.json');
  const revisions = raw.map((item) => PageRevisionSchema.parse(item));
  return revisions
    .filter((r) => r.pageId === pageId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createRevision(
  pageId: string,
  blocks: Block[],
  title: string,
  editorNote?: string
): Promise<PageRevision> {
  const raw = readJsonFile<unknown[]>('revisions.json');
  const revisions = raw.map((item) => PageRevisionSchema.parse(item));

  const revision: PageRevision = {
    id: generateId('rev'),
    pageId,
    blocks,
    title,
    editorNote,
    createdAt: new Date().toISOString(),
  };

  // Add new revision
  revisions.push(revision);

  // Keep only last N revisions per page
  const pageRevisions = revisions.filter((r) => r.pageId === pageId);
  if (pageRevisions.length > MAX_REVISIONS) {
    const toRemove = pageRevisions.slice(0, pageRevisions.length - MAX_REVISIONS);
    const toRemoveIds = new Set(toRemove.map((r) => r.id));
    const filtered = revisions.filter((r) => !toRemoveIds.has(r.id));
    writeJsonFile('revisions.json', filtered);
  } else {
    writeJsonFile('revisions.json', revisions);
  }

  return revision;
}

export async function getRevision(id: string): Promise<PageRevision | null> {
  const raw = readJsonFile<unknown[]>('revisions.json');
  const revisions = raw.map((item) => PageRevisionSchema.parse(item));
  return revisions.find((r) => r.id === id) ?? null;
}

// =============================================================================
// MENUS
// =============================================================================

export async function getMenus(): Promise<Menu[]> {
  const raw = readJsonFile<unknown[]>('menus.json');
  return raw.map((item) => MenuSchema.parse(item));
}

export async function getMenu(name: string): Promise<Menu | null> {
  const menus = await getMenus();
  return menus.find((m) => m.name === name) ?? null;
}

export async function getPrimaryMenu(): Promise<Menu | null> {
  return getMenu('primary');
}

export async function saveMenu(menu: Menu): Promise<void> {
  const menus = await getMenus();
  const index = menus.findIndex((m) => m.id === menu.id);
  if (index >= 0) {
    menus[index] = menu;
  } else {
    menus.push(menu);
  }
  writeJsonFile('menus.json', menus);
}

export async function updateMenuItems(
  menuId: string,
  items: MenuItem[]
): Promise<Menu | null> {
  const menus = await getMenus();
  const menu = menus.find((m) => m.id === menuId);
  if (!menu) return null;

  const updated: Menu = {
    ...menu,
    items,
    updatedAt: new Date().toISOString(),
  };

  await saveMenu(updated);
  return updated;
}

// =============================================================================
// MEDIA LIBRARY
// =============================================================================

export async function getMediaItems(): Promise<MediaItem[]> {
  const raw = readJsonFile<unknown[]>('media.json');
  return raw
    .map((item) => MediaItemSchema.parse(item))
    .filter((m) => m.status === 'active')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAllMediaItems(): Promise<MediaItem[]> {
  const raw = readJsonFile<unknown[]>('media.json');
  return raw
    .map((item) => MediaItemSchema.parse(item))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getMediaItem(id: string): Promise<MediaItem | null> {
  const items = await getAllMediaItems();
  return items.find((m) => m.id === id) ?? null;
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  const items = await getAllMediaItems();
  const index = items.findIndex((m) => m.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  writeJsonFile('media.json', items);
}

export async function createMediaItem(
  data: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<MediaItem> {
  const now = new Date().toISOString();
  const item: MediaItem = {
    ...data,
    id: generateId('media'),
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
  await saveMediaItem(item);
  return item;
}

export async function updateMediaItem(
  id: string,
  updates: Partial<Omit<MediaItem, 'id' | 'createdAt'>>
): Promise<MediaItem | null> {
  const item = await getMediaItem(id);
  if (!item) return null;

  const updated: MediaItem = {
    ...item,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await saveMediaItem(updated);
  return updated;
}

export async function deleteMediaItem(id: string): Promise<void> {
  // Soft delete
  await updateMediaItem(id, { status: 'deleted' });
}

export async function searchMediaItems(query: string): Promise<MediaItem[]> {
  const items = await getMediaItems();
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (m) =>
      m.filename.toLowerCase().includes(lowerQuery) ||
      m.originalFilename.toLowerCase().includes(lowerQuery) ||
      m.altText?.toLowerCase().includes(lowerQuery) ||
      m.tags?.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

export async function getMediaByType(type: 'image' | 'video' | 'pdf' | 'other'): Promise<MediaItem[]> {
  const items = await getMediaItems();
  const mimePatterns: Record<string, RegExp> = {
    image: /^image\//,
    video: /^video\//,
    pdf: /application\/pdf/,
    other: /^(?!image\/|video\/|application\/pdf)/,
  };
  return items.filter((m) => mimePatterns[type].test(m.mimeType));
}

// File upload helper
export function getUploadPath(filename: string): string {
  return path.join(UPLOADS_DIR, filename);
}

export function getUploadUrl(filename: string): string {
  return `/uploads/${filename}`;
}

// =============================================================================
// SITE SETTINGS
// =============================================================================

export async function getSettings(): Promise<SiteSettings> {
  const raw = readJsonFile<unknown>('settings.json');
  return SiteSettingsSchema.parse(raw);
}

export async function updateSettings(
  updates: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await getSettings();
  const updated: SiteSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile('settings.json', updated);
  return updated;
}

// =============================================================================
// BLOCK HELPERS
// =============================================================================

export function createBlock(type: Block['type'], data: unknown): Block {
  return {
    id: generateId('block'),
    type,
    data,
    order: 0,
  };
}

export function reorderBlocks(blocks: Block[]): Block[] {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
  }));
}
