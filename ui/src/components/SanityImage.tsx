import Image from 'next/image'
import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/lib/image'
import {cn} from '@/lib/cn'
import {isLocalImage, type PortfolioImage} from '@/sanity/types'

type SanityImageProps = {
  image: PortfolioImage
  alt: string
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  sizes?: string
  /** Fill a positioned parent — used for full-height gallery frames */
  fill?: boolean
  /** Fires once the image has loaded (including from cache) */
  onLoad?: () => void
}

type AssetRefImage = {
  asset?: {_ref?: string; _id?: string}
}

function getAssetDimensions(image: SanityImageSource): {width: number; height: number} {
  const asset = (image as AssetRefImage | null | undefined)?.asset
  const ref = String(asset?._ref ?? asset?._id ?? '')
  const match = ref.match(/-(\d+)x(\d+)-/)
  if (match) {
    return {width: Number(match[1]), height: Number(match[2])}
  }
  // Landscape fallback so layout doesn't collapse to a tiny square
  return {width: 2400, height: 1600}
}

export function SanityImage({
  image,
  alt,
  className,
  priority = false,
  loading,
  sizes = '(max-width: 479px) 100vw, 65vw',
  fill = false,
  onLoad,
}: SanityImageProps) {
  if (isLocalImage(image)) {
    if (fill) {
      return (
        <Image
          src={image.src}
          alt={alt}
          className={cn('object-contain', className)}
          fill
          sizes={sizes}
          priority={priority}
          loading={loading}
          onLoad={onLoad}
        />
      )
    }

    return (
      <Image
        src={image.src}
        alt={alt}
        className={cn('object-contain', className)}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        loading={loading}
        onLoad={onLoad}
      />
    )
  }

  const {width, height} = getAssetDimensions(image)
  const src = urlFor(image).width(Math.min(width, 2400)).auto('format').url()

  if (!src) return null

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        className={cn('object-contain', className)}
        fill
        sizes={sizes}
        priority={priority}
        loading={loading}
        onLoad={onLoad}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={cn('object-contain', className)}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={loading}
      onLoad={onLoad}
    />
  )
}
