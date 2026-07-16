import Image from 'next/image'
import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/lib/image'
import {cn} from '@/lib/cn'

type SanityImageProps = {
  image: SanityImageSource
  alt: string
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  sizes?: string
}

export function SanityImage({
  image,
  alt,
  className,
  priority = false,
  loading,
  sizes = '(max-width: 767px) 100vw, 65vw',
}: SanityImageProps) {
  const imageBuilder = urlFor(image).auto('format')
  const src = imageBuilder.url()

  if (!src) return null

  return (
    <Image
      src={src}
      alt={alt}
      className={cn('object-contain', className)}
      width={2000}
      height={2000}
      sizes={sizes}
      priority={priority}
      loading={loading}
    />
  )
}
