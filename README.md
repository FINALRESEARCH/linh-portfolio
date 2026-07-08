# Linh Portfolio

Rebuild of the Linh Thị Nguyễn stylist portfolio — migrated from Webflow to **Next.js** + **Sanity CMS**.

## Workspace layout

```
linh-portfolio/
├── ui/               # Next.js frontend (localhost:3000)
├── cms/              # Sanity Studio (localhost:3333)
├── reference/        # Non-runtime reference material
│   └── webflow/      # Original Webflow HTML/CSS/JS export
├── turbo.json        # Turbo task pipeline
└── package.json      # npm workspaces root
```

## Prerequisites

- Node.js 22.12+
- npm 12+
- A Sanity project ([sanity.io/manage](https://www.sanity.io/manage))

## Environment variables

### `cms/.env.local`

```bash
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000
```

### `ui/.env.local`

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
npm run dev          # runs ui + cms through turbo
```

### CORS

Allow the Next.js app to fetch from Sanity:

```bash
cd cms
npx sanity cors add http://localhost:3000 --credentials
```

Repeat for your production URL after deploy.

## Build

```bash
npm run build
npm run typegen      # regenerate TypeScript types from schemas + GROQ queries
```

## Client content entry

1. Open Studio (`npm run dev` then go to localhost:3333, or use deployed `*.sanity.studio` URL)
2. Edit **Site Settings** — name, tagline, contact, social, copyright, link preview
3. Create **Projects** — for each project:
   - Title, slug, order (sort position)
   - Cover image (home carousel slide)
   - Gallery images (detail page carousel, min 1)
   - Description (rich text)
   - Link Preview (optional social sharing title, description, and image)

The `order` field controls both the Work index and home Swiper sequence. Link previews fall back to the cover image, then the site default `opengraph.jpg`.

## Visual Editing (optional)

When `SANITY_API_READ_TOKEN` is set:

1. Open a document in Studio
2. Click **Presentation** in the top bar
3. Preview opens the Next.js site in draft mode with click-to-edit overlays

## Deployment

### Next.js (`ui`) — Vercel

- Set **Root Directory** to `ui`
- `ui/vercel.json` runs install/build from the monorepo root with `cd ..` (one level up from `ui`)
- Do **not** use `cd ../..` — that escapes the repo on Vercel and fails with `ENOENT` for `/vercel/package.json`
- Add all `ui/.env.local` variables in Vercel project settings
- Set `NEXT_PUBLIC_SITE_URL` to your production domain

### Sanity Studio (`cms`)

```bash
cd cms
npx sanity deploy
```

Add your production URL to CORS origins after deploy.

## Reference

The original Webflow export lives in `reference/webflow/` for HTML, CSS, and markup reference. Static assets used by the site live in `ui/public/`.
