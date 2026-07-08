import type {MetadataRoute} from 'next'
import {getMetadataBase} from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getMetadataBase().toString()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
