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
├── collection/
│   └── *.json             # Individual collection items
├── media/
│   └── *.json             # Media appearances (press, podcasts, talks)
└── site/
    └── media-kit.json     # Bio, contact, and social links for media kit
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

### Adding a Media Item

Create a JSON file in `content/media/` with this structure:

```json
{
  "slug": "my-interview",
  "title": "Interview Title",
  "outlet": "Publication Name",
  "type": "interview",
  "date": "2024-06-15",
  "url": "https://example.com/article",
  "internalPath": "/experiments/related-project",
  "description": "A 1-2 sentence blurb about this media appearance.",
  "whyItMattered": "Optional deeper context shown on hover.",
  "updatedAt": "2024-12-30"
}
```

**Media types**: `press`, `podcast`, `talk`, `interview`, `feature`, `other`

**Fields**:
- `slug` (required): Unique identifier for the file
- `title` (required): Title of the appearance
- `outlet` (required): Publication/show/event name
- `type` (required): One of the types listed above
- `description` (required): Short blurb
- `updatedAt` (required): Date for changelog tracking
- `date` (optional): When it was published (ISO format)
- `url` (optional): External link to the content
- `internalPath` (optional): Link to related internal page
- `image` (optional): Local image path
- `whyItMattered` (optional): Shows on hover

### Updating the Media Kit

Edit `content/site/media-kit.json`:

```json
{
  "bio": "Your short bio for media use.",
  "contactEmail": "hello@example.com",
  "socialLinks": [
    { "name": "LinkedIn", "url": "https://linkedin.com/in/..." },
    { "name": "Twitter", "url": "https://twitter.com/..." }
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

## Admin Dashboard

Access the admin dashboard at `/admin` to manage content daily.

### Setup

1. Copy `.env.example` to `.env.local`
2. Set `ADMIN_PASSWORD` to a secure password
3. Optionally set `ADMIN_USERNAME` (defaults to "admin")

### Daily Content Updates

#### Update Monthly Obsession
1. Go to `/admin/obsession`
2. Edit the current obsession's title, type, one-liner, and "why now"
3. Archive old obsessions to keep history

#### Add a Question Note
1. Go to `/admin/question`
2. Click "Add Note"
3. Fill in: title, type, track, body
4. **Required**: "What changed my mind" (this is enforced)
5. Save

#### Add a Build Log Entry
1. Go to `/admin/log`
2. Type your entry in the quick-add field
3. Add optional tags (comma-separated)
4. Hit "Add Entry"

Quick log entries should be energetic one-liners about what you shipped, learned, or changed.

#### Moderate Guestbook
1. Go to `/admin/guestbook`
2. Review pending entries (shows AI moderation flags)
3. Click ✓ to publish or ✗ to reject
4. Add annotations to published entries

#### Manage LinkedIn Content
1. Go to `/admin/linkedin`
2. Add/edit work experience items
3. Add/edit post snippets (text-only)
4. This populates the "From LinkedIn" module on the homepage

### LinkedIn Provider System

Two providers are available:

**Provider 1: Manual (default)**
- Data stored in `data/linkedin/` JSON files
- Edit via `/admin/linkedin`
- Works immediately

**Provider 2: Official API (future)**
- Set `LINKEDIN_USE_OFFICIAL_API=true` in env
- Requires LinkedIn API credentials (not yet implemented)
- Falls back to Manual provider if not configured

### AI-Assisted Moderation

Guestbook entries are automatically moderated:

- **With OpenAI API key**: Uses GPT-4o-mini for classification
- **Without API key**: Falls back to heuristic rules (URLs, spam patterns, toxicity patterns)

Set `OPENAI_API_KEY` in environment for AI moderation.

## Environment Variables

```bash
# Required for admin
ADMIN_PASSWORD=your-secure-password

# Optional
ADMIN_USERNAME=admin
NEXT_PUBLIC_SITE_URL=https://sabrinachandini.com
OPENAI_API_KEY=sk-...
LINKEDIN_USE_OFFICIAL_API=false
```

## New Features (Launch V1)

### Obsession Module
Monthly obsession with expandable "why now" drawer. Shows tool/concept/project/book/person types.

### One Question Project
Explore a central question through typed notes (principle, tool, pattern, example, etc.) with required "what changed my mind" reflections.

### Build Log
Daily changelog of what you're shipping. Timeline view with tag filters.

### Guestbook
Anonymous-allowed guestbook with AI-assisted moderation and owner annotations.

### "What Changed My Mind"
Required on:
- Every question note
- Every experiment (for featured items)
- Encouraged on log entries

This constraint ensures every piece of content includes learning and reflection.

## Deployment

The site is optimized for Vercel deployment:

```bash
# Deploy to Vercel
vercel
```

Set environment variables in Vercel dashboard:
- `ADMIN_PASSWORD` (required)
- `OPENAI_API_KEY` (optional, for AI moderation)

## Important Identity Elements

The site's identity statement includes two required ideas:
1. "Always learning new AI tools"
2. "Inspired by people creating something new—startup founders or founding fathers"

These appear in the hero section and metadata.
