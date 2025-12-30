# Sabrina Chandini — Living Studio

A personal website built with Next.js 14, inspired by Bauhaus design principles and the "collection" feel of craftwithanna.com.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **Animation**: Framer Motion (subtle opacity/translate only)
- **Content**: JSON files with Zod validation

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (Studio)
│   ├── experiments/       # Experiments list + detail
│   ├── collection/        # Collection gallery
│   ├── media/             # Media appearances
│   ├── contact/           # Contact page
│   └── api/               # API routes for client-side data
├── components/
│   ├── layout/            # Header, Footer, SiteLayout
│   ├── ui/                # Reusable UI components
│   └── blocks/            # Page-specific blocks
├── lib/
│   ├── content.ts         # Content loading utilities
│   └── utils.ts           # Helper functions
└── types/
    └── content.ts         # TypeScript types + Zod schemas

content/
├── now/
│   └── now.json           # Current "Now" section content
├── experiments/
│   └── *.json             # Individual experiment files
└── collection/
    └── *.json             # Individual collection items
```

## How to Add Content

### Adding a New Experiment

Create a JSON file in `content/experiments/` with this structure:

```json
{
  "slug": "my-project",
  "title": "My Project",
  "description": "A one-sentence description of what it is.",
  "intention": "Why I started this project.",
  "role": "Founder / Designer / etc.",
  "status": "in-progress",  // or "shipped" or "archived"
  "tags": ["product", "code"],  // options: writing, talks, product, code, design, research
  "featured": true,
  "whatIDid": [
    "First thing I built",
    "Second accomplishment"
  ],
  "whatSurprisedMe": "Something unexpected I learned.",
  "nextIteration": "What's coming next (optional).",
  "artifacts": [
    {
      "type": "live",  // or "github", "doc", "video", "image"
      "url": "https://example.com",
      "label": "Live site"
    }
  ],
  "image": "/images/project.jpg",  // optional
  "year": 2024
}
```

### Adding a Collection Item

Create a JSON file in `content/collection/` with this structure:

```json
{
  "slug": "my-item",
  "title": "Item Name",
  "description": "What this is and why it's interesting.",
  "category": "tools",  // options: ephemera, tools, notes, places, people, ideas
  "year": 2024,
  "image": "/images/item.jpg",  // optional
  "whyItMatters": "A deeper explanation (shown in modal).",
  "links": [
    {
      "url": "https://example.com",
      "label": "Visit"
    }
  ],
  "related": ["other-item-slug"]  // slugs of related items
}
```

### Updating the "Now" Section

Edit `content/now/now.json`:

```json
{
  "making": [
    { "title": "Project name", "description": "Brief context" }
  ],
  "learning": [
    { "title": "Topic", "description": "What I'm learning", "link": "https://..." }
  ],
  "collecting": [
    { "title": "Theme", "description": "Why it interests me" }
  ],
  "updatedAt": "2024-12-30"
}
```

## Design System

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-bg` | #FAFAFA | Page background |
| `--color-fg` | #1A1A1A | Primary text |
| `--color-fg-muted` | #666666 | Secondary text |
| `--color-secondary` | #C45D3A | Accent (terracotta) |
| `--color-accent` | #0A0A0A | Primary accent (black) |

### Typography

- **Font**: Inter (sans-serif)
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px, 60px
- **Line heights**: 1.15 (tight), 1.3 (snug), 1.5 (normal), 1.65 (relaxed)

### Grid

- **Max width**: 1200px
- **Gutter**: 24px
- **Columns**: 12-column grid on desktop

### Components

- `.container` — Centered content container
- `.card` — White card with border
- `.tag-pill` — Small uppercase tag
- `.btn`, `.btn-primary`, `.btn-secondary` — Buttons
- `.accent-square` — Small geometric accent (8x8px)

## Deployment

The site is optimized for Vercel deployment:

```bash
# Deploy to Vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Important Identity Elements

The site's identity statement includes two required ideas:
1. "Always learning new AI tools"
2. "Inspired by people creating something new—startup founders or founding fathers"

These appear in the hero section and metadata.
