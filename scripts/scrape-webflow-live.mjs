#!/usr/bin/env node
/**
 * Scrapes https://www.linhthinguyen.com and prints a JSON inventory for Sanity import.
 * Reads Webflow's rendered CMS markup and keeps only original image URLs.
 * Usage: node scripts/scrape-webflow-live.mjs > scripts/webflow-inventory.json
 */

const BASE = 'https://www.linhthinguyen.com'

async function fetchHtml(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.text()
}

function decodeEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

/** Rich text paragraphs as inline HTML (`<br>`, `<em>`, `<strong>`, `<a>` kept for the importer). */
function richTextParagraphs(html) {
  if (!html) return []
  return [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim())
}

function scrapeHome(html) {
  const nav = [
    ...html.matchAll(/<div role="listitem" class="w-dyn-item"><a href="\/projects\/([^"#]+)"[^>]*>([^<]*)<\/a>/g),
  ].map((m) => ({slug: m[1], title: decodeEntities(m[2]).trim()}))
  const slides = Object.fromEntries(
    [
      ...html.matchAll(
        /href="\/projects\/([^"#]+)" class="swiper-image-link[^"]*"><img src="([^"]+)"[\s\S]*?<div class="swiper-slide-title[^"]*">([\s\S]*?)<\/div>/g,
      ),
    ].map((m) => [m[1], {coverImage: decodeEntities(m[2]), homeTitle: decodeEntities(m[3]).trim()}]),
  )
  return {nav, slides}
}

async function scrapeProject({slug, title}, slide = {}) {
  const html = await fetchHtml(`/projects/${slug}`)
  const gallery = [
    ...html.matchAll(/<img src="([^"]+)"[^>]*class="swiper-slide-image project"/g),
  ].map((m) => decodeEntities(m[1]))
  const description =
    html.match(/project-description desktop"><div class="fine-print w-richtext">([\s\S]*?)<\/div><\/div>/)?.[1] ||
    ''
  return {
    slug,
    title,
    homeTitle: slide.homeTitle || title,
    coverImage: slide.coverImage || gallery[0] || null,
    gallery,
    description: richTextParagraphs(description),
    pageUrl: `${BASE}/projects/${slug}`,
  }
}

function scrapeSettings(home, project) {
  const meta = (attr) => decodeEntities(home.match(new RegExp(`<meta content="([^"]*)" ${attr}`))?.[1] || '')
  const credit = project.match(/Website by <a href="([^"]+)"[^>]*>([^<]+)<\/a>/)
  return {
    name: decodeEntities(home.match(/class="nav-section bio"><a[^>]*>([^<]+)<\/a>/)?.[1] || ''),
    tagline: decodeEntities(home.match(/class="nav-section bio"><a[^>]*>[^<]+<\/a><div>([^<]+)<\/div>/)?.[1] || ''),
    email: home.match(/href="mailto:([^"?]+)/)?.[1],
    instagramUrl: home.match(/href="(https?:\/\/(?:www\.)?instagram\.com[^"]*)"/)?.[1],
    copyright: decodeEntities(home.match(/<div class="fine-print">(©[^<]+)<\/div>/)?.[1] || ''),
    creditName: credit && decodeEntities(credit[2]),
    creditUrl: credit?.[1],
    seoTitle: meta('property="og:title"'),
    seoDescription: meta('name="description"'),
    ogImage: meta('property="og:image"'),
    favicon: home.match(/href="([^"]+)" rel="shortcut icon"/)?.[1],
    appleTouchIcon: home.match(/href="([^"]+)" rel="apple-touch-icon"/)?.[1],
  }
}

async function main() {
  const homeHtml = await fetchHtml('/')
  const {nav, slides} = scrapeHome(homeHtml)
  const projects = []
  for (const entry of nav) projects.push(await scrapeProject(entry, slides[entry.slug]))
  const settings = scrapeSettings(homeHtml, await fetchHtml(`/projects/${nav[0].slug}`))
  console.log(JSON.stringify({settings, projects, scrapedAt: new Date().toISOString()}, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
