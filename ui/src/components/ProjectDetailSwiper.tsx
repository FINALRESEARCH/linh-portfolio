'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url'
import {SanityImage} from '@/components/SanityImage'
import {CustomCursor} from '@/components/CustomCursor'
import {PortableText} from '@/components/PortableText'
import {cn} from '@/lib/cn'

const finePrint =
  'text-[0.7rem] leading-[0.9rem] tracking-[-0.005rem] max-md:text-[0.6rem] max-md:leading-[0.7rem]'

type ProjectDetailSwiperProps = {
  images: SanityImageSource[]
  title: string
  description?: PortableTextBlock[]
}

export function ProjectDetailSwiper({
  images,
  title,
  description,
}: ProjectDetailSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const lockRef = useRef(false)
  const total = images.length
  const activeImage = images[activeIndex]

  const goTo = useCallback(
    (direction: 'next' | 'prev') => {
      if (!total || lockRef.current) return

      lockRef.current = true
      setActiveIndex((current) =>
        direction === 'next' ? (current + 1) % total : (current - 1 + total) % total,
      )

      window.setTimeout(() => {
        lockRef.current = false
      }, 250)
    },
    [total],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goTo('next')
      if (event.key === 'ArrowLeft') goTo('prev')
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo])

  if (!images.length || !activeImage) {
    return (
      <div
        className={cn(
          'images-wrapper is-project-gallery flex h-full w-[65dvw] max-w-[65dvw] flex-col items-center justify-end',
          'max-md:order-1 max-md:relative max-md:mt-0 max-md:h-auto max-md:min-h-0 max-md:w-full max-md:max-w-full max-md:flex-none max-md:items-stretch max-md:justify-start',
        )}
      >
        <p className={finePrint}>No gallery images.</p>
      </div>
    )
  }

  return (
    <>
      <CustomCursor currentIndex={activeIndex} totalImages={total} />
      <div
        className={cn(
          'images-wrapper is-project-gallery relative flex h-full w-[65dvw] max-w-[65dvw] flex-col items-center justify-end',
          'max-md:order-1 max-md:mt-0 max-md:h-auto max-md:min-h-0 max-md:w-full max-md:max-w-full max-md:flex-none max-md:items-stretch max-md:justify-start',
        )}
      >
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-end max-md:flex-none max-md:justify-center">
          <div className="project-gallery-frame relative flex h-full max-h-full w-full items-center justify-end max-md:h-auto max-md:justify-center">
            <SanityImage
              image={activeImage}
              alt={`${title} — image ${activeIndex + 1}`}
              className="project-gallery-image"
              sizes="(max-width: 767px) 100vw, 65vw"
              priority
              loading="eager"
            />

            {/*
              Stop above the fixed chevrons so one click can't hit both
              the half-page next zone and the next chevron.
            */}
            <div className="absolute inset-x-0 top-0 bottom-12 z-[1] hidden md:flex">
              <button
                type="button"
                className="h-full w-1/2 cursor-none appearance-none border-0 bg-transparent p-0"
                aria-label="Previous image"
                onClick={() => goTo('prev')}
              />
              <button
                type="button"
                className="h-full w-1/2 cursor-none appearance-none border-0 bg-transparent p-0"
                aria-label="Next image"
                onClick={() => goTo('next')}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="swiper-button-prev swiper-arrow fixed right-[30px] bottom-2.5 z-[50] hidden h-[22px] w-7 bg-[length:16px_16px] md:block"
          aria-label="Previous image"
          onClick={() => goTo('prev')}
        />
        <button
          type="button"
          className="swiper-button-next swiper-arrow fixed right-0.5 bottom-2.5 z-[50] hidden h-[22px] w-7 bg-[length:16px_16px] md:block"
          aria-label="Next image"
          onClick={() => goTo('next')}
        />

        <div className="flex w-full items-end justify-between gap-4 px-2 pt-12 md:hidden">
          <div className="min-w-0 flex-1">
            {description?.length ? (
              <PortableText value={description} className={cn(finePrint, 'richtext')} />
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="swiper-button-prev swiper-arrow h-[22px] w-7 bg-[length:16px_16px]"
              aria-label="Previous image"
              onClick={() => goTo('prev')}
            />
            <button
              type="button"
              className="swiper-button-next swiper-arrow h-[22px] w-7 bg-[length:16px_16px]"
              aria-label="Next image"
              onClick={() => goTo('next')}
            />
          </div>
        </div>
      </div>
    </>
  )
}
