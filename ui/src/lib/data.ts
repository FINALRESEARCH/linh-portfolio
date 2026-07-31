import {sanityFetch} from '@/sanity/live'
import {client} from '@/sanity/client'
import {
  PROJECTS_LIST_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'
import {isSanityConfigured} from '@/sanity/env'
import {
  getPlaceholderProjectBySlug,
  getPlaceholderProjects,
  PLACEHOLDER_PROJECTS,
  PLACEHOLDER_SITE_SETTINGS,
} from '@/lib/placeholders'
import type {ProjectDetail, ProjectListItem, ProjectSlug, SiteSettings} from '@/sanity/types'

export async function fetchSanityData<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (process.env.NODE_ENV === 'development') {
    return client.fetch<T>(query, params, {
      perspective: 'published',
      cache: 'no-store',
    })
  }

  const {data} = await sanityFetch({query, params, perspective: 'published'})
  return data as T
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSanityConfigured) return PLACEHOLDER_SITE_SETTINGS

  try {
    const settings = await fetchSanityData<SiteSettings | null>(SITE_SETTINGS_QUERY)
    return settings ?? PLACEHOLDER_SITE_SETTINGS
  } catch {
    return PLACEHOLDER_SITE_SETTINGS
  }
}

export async function getProjects(): Promise<ProjectListItem[]> {
  if (!isSanityConfigured) return getPlaceholderProjects()

  try {
    const projects = await fetchSanityData<ProjectListItem[] | null>(PROJECTS_LIST_QUERY)
    return projects?.length ? projects : getPlaceholderProjects()
  } catch {
    return getPlaceholderProjects()
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  if (!isSanityConfigured) return getPlaceholderProjectBySlug(slug)

  try {
    const project = await fetchSanityData<ProjectDetail | null>(PROJECT_BY_SLUG_QUERY, {slug})
    return project ?? getPlaceholderProjectBySlug(slug)
  } catch {
    return getPlaceholderProjectBySlug(slug)
  }
}

export async function getProjectSlugs(): Promise<ProjectSlug[]> {
  if (!isSanityConfigured) {
    return PLACEHOLDER_PROJECTS.map(({slug}) => ({slug}))
  }

  try {
    const slugs = await fetchSanityData<ProjectSlug[] | null>(PROJECT_SLUGS_QUERY)
    return slugs?.length
      ? slugs
      : PLACEHOLDER_PROJECTS.map(({slug}) => ({slug}))
  } catch {
    return PLACEHOLDER_PROJECTS.map(({slug}) => ({slug}))
  }
}
