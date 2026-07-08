# Linh Portfolio

Rebuild of the Linh Thị Nguyễn stylist portfolio — migrated from Webflow to **Next.js** + **Sanity CMS**.

## Workspace layout

```
linh-portfolio/
├── apps/
│   ├── web/          # Next.js frontend (localhost:3000)
│   └── studio/       # Sanity Studio (localhost:3333)
├── webflow-export/   # Original Webflow static export (reference only)
└── package.json      # npm workspaces root
```

## Prerequisites

- Node.js 20+
- npm 10+
- A Sanity project ([sanity.io/manage](https://www.sanity.io/manage))

## Environment variables

### `apps/studio/.env.local`

```bash
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000
```

### `apps/web/.env.local`

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
SANITY_API_READ_TOKEN=your-read-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Copy from root `.env.example` and each app's `.env.local.example`.

## Development

```bash
npm install
npm run dev          # runs web + studio concurrently
npm run dev:web      # Next.js at http://localhost:3000
npm run dev:studio   # Sanity Studio at http://localhost:3333
```

### CORS

Allow the Next.js app to fetch from Sanity:

```bash
cd apps/studio
npx sanity cors add http://localhost:3000 --credentials
```

Repeat for your production URL after deploy.

## Build

```bash
npm run build
npm run typegen      # regenerate TypeScript types from schemas + GROQ queries
```

## Client content entry

1. Open Studio (`npm run dev:studio` or deployed `*.sanity.studio` URL)
2. Edit **Site Settings** — name, tagline, contact, social, copyright, OG image
3. Create **Projects** — for each project:
   - Title, slug, order (sort position)
   - Cover image (home carousel slide)
   - Gallery images (detail page carousel, min 1)
   - Description (rich text)

The `order` field controls both the Work index and home Swiper sequence.

## Visual Editing (optional)

When `SANITY_API_READ_TOKEN` is set:

1. Open a document in Studio
2. Click **Presentation** in the top bar
3. Preview opens the Next.js site in draft mode with click-to-edit overlays

## Deployment

### Next.js (`apps/web`) — Vercel

- Set **Root Directory** to `apps/web` (or use the included `vercel.json`)
- Install command: `cd ../.. && npm install`
- Add all `apps/web/.env.local` variables in Vercel project settings
- Set `NEXT_PUBLIC_SITE_URL` to your production domain

### Sanity Studio (`apps/studio`)

```bash
cd apps/studio
npx sanity deploy
```

Add your production URL to CORS origins after deploy.

## Reference

The original Webflow export lives in `webflow-export/` for visual and markup reference.
