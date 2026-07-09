import Image from 'next/image'
import type {SanityImageSource} from '@sanity/image-url'
import {urlFor} from '@/sanity/lib/image'

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
  sizes = '(max-width: 479px) 100vw, 65vw',
}: SanityImageProps) {
  const imageBuilder = urlFor(image).auto('format')
  const src = imageBuilder.url()

  if (!src) return null

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={2000}
      height={2000}
      sizes={sizes}
      priority={priority}
      loading={loading}
      style={{width: 'auto', height: '100%', objectFit: 'contain'}}
    />
  )
}
