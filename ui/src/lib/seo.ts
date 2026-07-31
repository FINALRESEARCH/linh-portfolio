import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/lib/image'
import {isLocalImage, type PortfolioImage} from '@/sanity/types'

export const DEFAULT_OG_IMAGE_PATH = '/images/opengraph.jpg'
export const DEFAULT_FAVICON_PATH = '/images/favicon.png'
export const DEFAULT_APPLE_TOUCH_ICON_PATH = '/images/webclip.png'

export type LinkPreview = {
  title?: string
  description?: string
  image?: PortfolioImage
}

export type SiteIcons = {
  favicon?: SanityImageSource
  appleTouchIcon?: SanityImageSource
}

export function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL)
  }

  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`)
  }

  return new URL('http://localhost:3000')
}

export function getOgImageUrl(
  image?: PortfolioImage | null,
  metadataBase: URL = getMetadataBase(),
): string | undefined {
  if (!image) return undefined

  if (isLocalImage(image)) {
    return new URL(image.src, metadataBase).toString()
  }

  return urlFor(image).width(1200).height(630).fit('crop').url()
}

export function getIconImageUrl(
  image: SanityImageSource | null | undefined,
  size: number,
): string | undefined {
  if (!image) return undefined

  return urlFor(image).width(size).height(size).fit('crop').url()
}

export function resolveOgImageUrl(
  image?: PortfolioImage | null,
  metadataBase: URL = getMetadataBase(),
): string {
  return getOgImageUrl(image, metadataBase) ?? new URL(DEFAULT_OG_IMAGE_PATH, metadataBase).toString()
}

export function resolveLinkPreview({
  linkPreview,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  metadataBase = getMetadataBase(),
}: {
  linkPreview?: LinkPreview | null
  fallbackTitle: string
  fallbackDescription: string
  fallbackImage?: PortfolioImage | null
  metadataBase?: URL
}) {
  return {
    title: linkPreview?.title?.trim() || fallbackTitle,
    description: linkPreview?.description?.trim() || fallbackDescription,
    image: resolveOgImageUrl(linkPreview?.image ?? fallbackImage, metadataBase),
  }
}

export function resolveSiteIcons({
  siteIcons,
}: {
  siteIcons?: SiteIcons | null
}) {
  return {
    favicon: getIconImageUrl(siteIcons?.favicon, 32),
    appleTouchIcon: getIconImageUrl(siteIcons?.appleTouchIcon, 180),
  }
}
