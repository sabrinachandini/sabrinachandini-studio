/**
 * Migration script to seed CMS pages from existing hardcoded content.
 * Run with: npx tsx scripts/seed-cms-pages.ts
 */

import fs from 'fs';
import path from 'path';

const CMS_DIR = path.join(process.cwd(), 'data', 'cms');

interface Block {
  id: string;
  type: string;
  data: unknown;
  order: number;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  template: 'default' | 'full-width' | 'narrow';
  status: 'draft' | 'published';
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createBlock(type: string, data: unknown, order: number): Block {
  return {
    id: generateId('block'),
    type,
    data,
    order,
  };
}

const now = new Date().toISOString();

// Define default pages based on existing content
const defaultPages: Page[] = [
  // Studio (Home) page
  {
    id: generateId('page'),
    slug: '',
    title: 'Studio',
    seoTitle: 'Sabrina Chandini - Builder, Storyteller, Entrepreneur',
    seoDescription: 'Building products, telling stories, and learning in public.',
    template: 'default',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'Builder, Storyteller, Entrepreneur', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>I build products, tell stories, and learn in public. This is my living studio — a space where ideas take shape, experiments run wild, and everything is perpetually in progress.</p>'
      }, 1),
      createBlock('obsessionModule', {}, 2),
      createBlock('heading', { text: 'What I\'m Working On', level: 2 }, 3),
      createBlock('experimentsList', {}, 4),
      createBlock('heading', { text: 'From the Collection', level: 2 }, 5),
      createBlock('collectionGrid', {}, 6),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },

  // Experiments page
  {
    id: generateId('page'),
    slug: 'experiments',
    title: 'Experiments',
    seoTitle: 'Experiments - Things I\'m Building',
    seoDescription: 'Products, projects, writing, and talks. Each experiment is an opportunity to learn something new.',
    template: 'default',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'Things I\'m building', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>Products, projects, writing, and talks. Each experiment is an opportunity to learn something new.</p>'
      }, 1),
      createBlock('experimentsList', {}, 2),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },

  // Collection page
  {
    id: generateId('page'),
    slug: 'collection',
    title: 'Collection',
    seoTitle: 'Collection - Things That Matter',
    seoDescription: 'Tools, ideas, people, and places that shape how I work and think.',
    template: 'default',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'Things that matter', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>Tools, ideas, people, and places that shape how I work and think. A curated cabinet of curiosities.</p>'
      }, 1),
      createBlock('collectionGrid', {}, 2),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },

  // Portfolio page
  {
    id: generateId('page'),
    slug: 'portfolio',
    title: 'Portfolio',
    seoTitle: 'Portfolio - Work & Experience',
    seoDescription: 'My professional journey, work experience, and selected posts.',
    template: 'default',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'Portfolio', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>My professional journey and selected thoughts.</p>'
      }, 1),
      createBlock('heading', { text: 'Experience', level: 2 }, 2),
      createBlock('portfolioWork', {}, 3),
      createBlock('heading', { text: 'Posts', level: 2 }, 4),
      createBlock('portfolioPosts', {}, 5),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },

  // Media page
  {
    id: generateId('page'),
    slug: 'media',
    title: 'Media',
    seoTitle: 'Media Library',
    seoDescription: 'Photos, videos, and files from my creative journey.',
    template: 'full-width',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'Media', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>Photos, videos, and files from my creative journey.</p>'
      }, 1),
      createBlock('mediaList', {}, 2),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },

  // Contact page
  {
    id: generateId('page'),
    slug: 'contact',
    title: 'Contact',
    seoTitle: 'Get in Touch',
    seoDescription: 'I\'d love to hear from you. Whether it\'s a question, collaboration, or just to say hi.',
    template: 'narrow',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'Get in Touch', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>I\'d love to hear from you. Whether it\'s a question, a collaboration opportunity, or just to say hi, feel free to reach out.</p>'
      }, 1),
      createBlock('heading', { text: 'Ways to Connect', level: 2 }, 2),
      createBlock('linkList', {
        links: [
          { label: 'Email', url: 'mailto:hello@sabrinachandini.com', description: 'Best for longer conversations' },
          { label: 'Twitter/X', url: 'https://twitter.com/sabrinachandini', description: 'Quick thoughts and updates' },
          { label: 'LinkedIn', url: 'https://linkedin.com/in/sabrinachandini', description: 'Professional connections' },
        ]
      }, 3),
      createBlock('callout', {
        type: 'info',
        title: 'Response Time',
        text: 'I typically respond within 24-48 hours. For urgent matters, Twitter DMs work best.'
      }, 4),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },

  // Build Log page
  {
    id: generateId('page'),
    slug: 'log',
    title: 'Build Log',
    seoTitle: 'Build Log - What I\'m Shipping',
    seoDescription: 'What I\'m shipping, learning, and changing my mind about.',
    template: 'narrow',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'Build Log', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>What I\'m shipping, learning, and changing my mind about.</p>'
      }, 1),
      createBlock('logList', { limit: 50 }, 2),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },

  // Question page
  {
    id: generateId('page'),
    slug: 'question',
    title: 'Question',
    seoTitle: 'The Daily Question',
    seoDescription: 'One question, asked every day. A practice in curiosity.',
    template: 'narrow',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'The Daily Question', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>One question, asked every day. A practice in curiosity and reflection.</p>'
      }, 1),
      createBlock('questionNotes', {}, 2),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },

  // Guestbook page
  {
    id: generateId('page'),
    slug: 'guestbook',
    title: 'Guestbook',
    seoTitle: 'Sign the Guestbook',
    seoDescription: 'Leave a message, say hello, or share what brought you here.',
    template: 'narrow',
    status: 'published',
    blocks: [
      createBlock('heading', { text: 'Guestbook', level: 1 }, 0),
      createBlock('richtext', {
        html: '<p>Leave a message, say hello, or share what brought you here. I read every entry.</p>'
      }, 1),
      createBlock('guestbookForm', {}, 2),
    ],
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
];

async function seedPages() {
  console.log('🌱 Seeding CMS pages...\n');

  // Ensure CMS directory exists
  if (!fs.existsSync(CMS_DIR)) {
    fs.mkdirSync(CMS_DIR, { recursive: true });
  }

  // Read existing pages
  const pagesPath = path.join(CMS_DIR, 'pages.json');
  let existingPages: Page[] = [];

  if (fs.existsSync(pagesPath)) {
    const raw = fs.readFileSync(pagesPath, 'utf-8');
    existingPages = JSON.parse(raw);
  }

  // Check which pages need to be seeded
  const existingSlugs = new Set(existingPages.map((p) => p.slug));
  const pagesToSeed = defaultPages.filter((p) => !existingSlugs.has(p.slug));

  if (pagesToSeed.length === 0) {
    console.log('✅ All default pages already exist. Nothing to seed.\n');
    return;
  }

  console.log(`📝 Seeding ${pagesToSeed.length} pages:\n`);

  for (const page of pagesToSeed) {
    console.log(`  - ${page.title} (/${page.slug || 'home'})`);
    existingPages.push(page);
  }

  // Write updated pages
  fs.writeFileSync(pagesPath, JSON.stringify(existingPages, null, 2));

  console.log('\n✅ Seeding complete!\n');
  console.log('You can now edit these pages in the admin panel at /admin/pages\n');
}

seedPages().catch(console.error);
