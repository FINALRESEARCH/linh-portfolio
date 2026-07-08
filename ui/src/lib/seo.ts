import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/lib/image'

export const DEFAULT_OG_IMAGE_PATH = '/images/opengraph.jpg'

export type LinkPreview = {
  title?: string
  description?: string
  image?: SanityImageSource
}

export function getMetadataBase(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
}

export function getOgImageUrl(image?: SanityImageSource | null): string | undefined {
  if (!image) return undefined

  return urlFor(image).width(1200).height(630).fit('crop').url()
}

export function resolveOgImageUrl(
  image?: SanityImageSource | null,
  metadataBase: URL = getMetadataBase(),
): string {
  return getOgImageUrl(image) ?? new URL(DEFAULT_OG_IMAGE_PATH, metadataBase).toString()
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
  fallbackImage?: SanityImageSource | null
  metadataBase?: URL
}) {
  return {
    title: linkPreview?.title?.trim() || fallbackTitle,
    description: linkPreview?.description?.trim() || fallbackDescription,
    image: resolveOgImageUrl(linkPreview?.image ?? fallbackImage, metadataBase),
  }
}
