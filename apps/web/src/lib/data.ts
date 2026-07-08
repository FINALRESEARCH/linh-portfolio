import {sanityFetch} from '@/sanity/live'
import {
  PROJECTS_LIST_QUERY,
  PROJECT_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'
import {isSanityConfigured} from '@/sanity/env'
import type {ProjectListItem, ProjectSlug, SiteSettings} from '@/sanity/types'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSanityConfigured) return null

  try {
    const {data} = await sanityFetch({query: SITE_SETTINGS_QUERY})
    return data as SiteSettings | null
  } catch {
    return null
  }
}

export async function getProjects(): Promise<ProjectListItem[]> {
  if (!isSanityConfigured) return []

  try {
    const {data} = await sanityFetch({query: PROJECTS_LIST_QUERY})
    return (data as ProjectListItem[] | null) ?? []
  } catch {
    return []
  }
}

export async function getProjectSlugs(): Promise<ProjectSlug[]> {
  if (!isSanityConfigured) return []

  try {
    const {data} = await sanityFetch({
      query: PROJECT_SLUGS_QUERY,
      perspective: 'published',
    })
    return (data as ProjectSlug[] | null) ?? []
  } catch {
    return []
  }
}
