import {sanityFetch} from '@/sanity/live'
import {client} from '@/sanity/client'
import {
  PROJECTS_LIST_QUERY,
  PROJECT_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'
import {isSanityConfigured} from '@/sanity/env'
import type {ProjectListItem, ProjectSlug, SiteSettings} from '@/sanity/types'

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
  if (!isSanityConfigured) return null

  try {
    return await fetchSanityData<SiteSettings | null>(SITE_SETTINGS_QUERY)
  } catch {
    return null
  }
}

export async function getProjects(): Promise<ProjectListItem[]> {
  if (!isSanityConfigured) return []

  try {
    const projects = await fetchSanityData<ProjectListItem[] | null>(PROJECTS_LIST_QUERY)
    return projects ?? []
  } catch {
    return []
  }
}

export async function getProjectSlugs(): Promise<ProjectSlug[]> {
  if (!isSanityConfigured) return []

  try {
    const slugs = await fetchSanityData<ProjectSlug[] | null>(PROJECT_SLUGS_QUERY)
    return slugs ?? []
  } catch {
    return []
  }
}
