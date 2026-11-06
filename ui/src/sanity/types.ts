import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url'
import type {LinkPreview, SiteIcons} from '@/lib/seo'

export type LocalImage = {
  _type: 'localImage'
  src: string
  width: number
  height: number
}

export type PortfolioImage = SanityImageSource | LocalImage

export type SiteSettings = {
  name: string
  tagline: string
  email: string
  instagramUrl: string
  linkPreview?: LinkPreview
  siteIcons?: SiteIcons
}

export type ProjectListItem = {
  _id: string
  title: string
  slug: string
  order: number
  homeTitle?: string
  coverImage: PortfolioImage
  /** Credits — every page renders all of them to reserve the sidebar slot */
  description?: PortableTextBlock[]
}

export type ProjectDetail = ProjectListItem & {
  gallery: PortfolioImage[]
  linkPreview?: LinkPreview
}

export type ProjectSlug = {
  slug: string
}

export function isLocalImage(image: PortfolioImage | null | undefined): image is LocalImage {
  return Boolean(
    image &&
      typeof image === 'object' &&
      '_type' in image &&
      (image as LocalImage)._type === 'localImage',
  )
}
