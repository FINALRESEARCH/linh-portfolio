#!/usr/bin/env node
/**
 * Import the scraped Webflow inventory into Sanity.
 *
 * Downloads every original image from the Webflow CDN and uploads it as a
 * Sanity asset. Documents are published (not drafts) with deterministic IDs,
 * so re-running is idempotent.
 *
 * Requires SANITY_API_WRITE_TOKEN (Editor or higher), read from the env or
 * the repo-root .env.local.
 * Usage: npm run import:sanity
 */

import {createRequire} from 'node:module'
import {createHash} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(__dirname, '../ui/package.json'))
const {createClient} = require('@sanity/client')

const envFile = join(__dirname, '../.env.local')
if (existsSync(envFile)) process.loadEnvFile(envFile)

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'o97pp4zy'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-02-01',
  token,
  useCdn: false,
})

const inventory = JSON.parse(readFileSync(join(__dirname, 'webflow-inventory.json'), 'utf8'))

const hash = (value) => createHash('md5').update(value).digest('hex').slice(0, 12)

function decodeEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

/**
 * Convert a Webflow rich-text paragraph (HTML) into a Portable Text block.
 * Supports the marks the project schema defines: strong, em, link.
 */
function paragraphToBlock(html, index) {
  const markDefs = []
  const children = []
  const stack = []
  for (const token of html.split(/(<[^>]+>)/g)) {
    if (!token) continue
    const tag = token.match(/^<(\/?)(\w+)([^>]*)>$/)
    if (tag) {
      const [, closing, name, attrs] = tag
      if (name === 'br') {
        children.push({text: '\n', marks: stack.filter(Boolean)})
      } else if (closing) {
        stack.pop()
      } else if (name === 'a') {
        const key = `l${markDefs.length}`
        markDefs.push({_type: 'link', _key: key, href: decodeEntities(attrs.match(/href="([^"]*)"/)?.[1] || '')})
        stack.push(key)
      } else if (name === 'strong' || name === 'b') {
        stack.push('strong')
      } else if (name === 'em' || name === 'i') {
        stack.push('em')
      } else {
        stack.push(null)
      }
      continue
    }
    const text = decodeEntities(token)
    if (text) children.push({text, marks: stack.filter(Boolean)})
  }
  // Merge adjacent spans with identical marks so `<br>` stays inside one span.
  const spans = []
  for (const child of children) {
    const prev = spans.at(-1)
    if (prev && prev.marks.join() === child.marks.join()) prev.text += child.text
    else spans.push({...child})
  }
  return {
    _type: 'block',
    _key: `b${index}${hash(html)}`,
    style: 'normal',
    markDefs,
    children: spans.map((span, i) => ({_type: 'span', _key: `s${i}`, ...span})),
  }
}

/** Webflow pads rich text with zero-width-joiner paragraphs; drop the trailing ones. */
function toBlocks(paragraphs) {
  const list = [...(paragraphs || [])]
  while (list.length && !list.at(-1).replace(/[​-‍\s]|<br\s*\/?>/g, '')) list.pop()
  return list.length ? list.map(paragraphToBlock) : undefined
}

const assetCache = new Map()

async function uploadImage(url, {alt} = {}) {
  if (!url) return null
  if (!assetCache.has(url)) {
    assetCache.set(
      url,
      (async () => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed download ${url}: ${res.status}`)
        const buffer = Buffer.from(await res.arrayBuffer())
        const filename = decodeURIComponent(url.split('/').pop() || 'image.jpg')
          // Strip Webflow's 24-char asset ID prefix
          .replace(/^[0-9a-f]{24}_/, '')
        const asset = await client.assets.upload('image', buffer, {
          filename,
          source: {name: 'webflow', id: url, url},
        })
        return asset._id
      })(),
    )
  }
  const ref = await assetCache.get(url)
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: ref},
    ...(alt ? {alt} : {}),
  }
}

async function uploadList(urls, alt) {
  // Sequential: Sanity caps in-flight requests at 25 per project.
  const images = []
  for (const url of urls) images.push(await uploadImage(url, {alt}))
  return images.map((image, i) => ({...image, _key: `i${i}${hash(image.asset._ref)}`}))
}

async function upsertProject(project, index) {
  const coverImage = await uploadImage(project.coverImage, {alt: project.homeTitle})
  const gallery = await uploadList(project.gallery, project.title)

  await client.createOrReplace({
    _id: `project-${project.slug}`,
    _type: 'project',
    title: project.title,
    slug: {_type: 'slug', current: project.slug},
    order: index + 1,
    homeTitle: project.homeTitle,
    coverImage,
    gallery,
    description: toBlocks(project.description),
  })
  console.log(`✓ project ${project.slug} (${gallery.length} gallery)`)
}

async function upsertSiteSettings(settings) {
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: settings.name,
    tagline: settings.tagline,
    email: settings.email,
    instagramUrl: settings.instagramUrl,
    linkPreview: {
      _type: 'linkPreview',
      title: settings.seoTitle,
      description: settings.seoDescription,
      image: await uploadImage(settings.ogImage),
    },
    siteIcons: {
      _type: 'siteIcons',
      favicon: await uploadImage(settings.favicon),
      appleTouchIcon: await uploadImage(settings.appleTouchIcon),
    },
  })
  console.log('✓ siteSettings')
}

async function main() {
  console.log(`Importing into ${projectId}/${dataset}`)
  await upsertSiteSettings(inventory.settings)
  for (const [index, project] of inventory.projects.entries()) {
    await upsertProject(project, index)
  }
  console.log(`Done. ${assetCache.size} images.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
