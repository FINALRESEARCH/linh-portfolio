import type {MetadataRoute} from 'next'
import {getProjectSlugs} from '@/lib/data'
import {isSanityConfigured} from '@/sanity/env'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!isSanityConfigured) {
    return [{url: baseUrl, lastModified: new Date()}]
  }

  const slugs = await getProjectSlugs()

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...slugs.map(({slug}) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
