import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url'

export type SiteSettings = {
  name: string
  tagline: string
  email: string
  instagramUrl: string
  copyrightYear: number
  creditName: string
  creditUrl: string
  defaultOgImage?: SanityImageSource
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
}

export type ProjectSlug = {
  slug: string
}
