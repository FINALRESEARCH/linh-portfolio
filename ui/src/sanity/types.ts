import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url'
import type {LinkPreview} from '@/lib/seo'

export type SiteSettings = {
  name: string
  tagline: string
  email: string
  instagramUrl: string
  copyrightYear: number
  creditName: string
  creditUrl: string
  linkPreview?: LinkPreview
}

export type ProjectListItem = {
  _id: string
  title: string
  slug: string
  order: number
  coverImage: SanityImageSource
}

export type ProjectDetail = ProjectListItem & {
  gallery: SanityImageSource[]
  description?: PortableTextBlock[]
  linkPreview?: LinkPreview
}

export type ProjectSlug = {
  slug: string
}
