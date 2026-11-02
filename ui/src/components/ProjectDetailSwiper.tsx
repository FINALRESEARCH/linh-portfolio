'use client'

import {useCallback, useEffect, useState} from 'react'
import type {PortfolioImage} from '@/sanity/types'
import {SanityImage} from '@/components/SanityImage'
import {CustomCursor} from '@/components/CustomCursor'
import {useImageReveal} from '@/lib/useImageReveal'
import {cn} from '@/lib/cn'

const finePrint =
  'text-[0.7rem] leading-[0.9rem] tracking-[-0.005rem] mobile:text-[0.6rem] mobile:leading-[0.7rem]'

type ProjectDetailSwiperProps = {
  images: PortfolioImage[]
  title: string
}

export function ProjectDetailSwiper({images, title}: ProjectDetailSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const {isRevealed, onImageLoad} = useImageReveal(activeIndex)
  const total = images.length

  // Gallery loops in both directions (live Swiper loop: true)
  const goTo = useCallback(
    (direction: 'next' | 'prev') => {
      if (!total) return
      setActiveIndex((current) =>
        direction === 'next' ? (current + 1) % total : (current - 1 + total) % total,
      )
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

  if (!images.length) {
    return (
      <div className="images-wrapper is-project-gallery flex h-full w-[65dvw] max-w-[65dvw] shrink-0 flex-col items-center justify-end mobile:absolute mobile:inset-0 mobile:h-svh mobile:w-full mobile:max-w-full">
        <p className={finePrint}>No gallery images.</p>
      </div>
    )
  }

  return (
    <>
      <CustomCursor currentIndex={activeIndex} totalImages={total} />
      <div className="images-wrapper is-project-gallery flex h-full w-[65dvw] max-w-[65dvw] shrink-0 flex-col items-center justify-end mobile:absolute mobile:inset-0 mobile:h-svh mobile:w-full mobile:max-w-full">
        {/*
          Stacked slides (Swiper fade, speed 0) so the whole gallery preloads.
          Desktop: image box top-left at 94% column height. Mobile: full-width
          image pinned to the top of the first screen.
        */}
        <div className="swiper relative h-full w-full overflow-hidden">
          {images.map((image, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={index}
                className={cn('swiper-slide project', isActive && 'is-active')}
                aria-hidden={!isActive}
              >
                <div className={cn('swiper-image-link project', isRevealed(index) && 'loaded')}>
                  <SanityImage
                    image={image}
                    alt={`${title} — image ${index + 1}`}
                    className="swiper-slide-image"
                    sizes="(max-width: 479px) 100vw, 65vw"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onLoad={() => onImageLoad(index)}
                  />

                  {/* Click halves over the image box only: left = prev, right = next */}
                  <div className="swiper-project-image-nav">
                    <button
                      type="button"
                      className="swiper-project-image-nav-prev"
                      aria-label="Previous image"
                      tabIndex={-1}
                      onClick={() => goTo('prev')}
                    />
                    <button
                      type="button"
                      className="swiper-project-image-nav-next"
                      aria-label="Next image"
                      tabIndex={-1}
                      onClick={() => goTo('next')}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="swiper-navigation">
          <button
            type="button"
            className="swiper-button-prev swiper-arrow"
            aria-label="Previous image"
            onClick={() => goTo('prev')}
          />
          <button
            type="button"
            className="swiper-button-next swiper-arrow"
            aria-label="Next image"
            onClick={() => goTo('next')}
          />
        </div>
      </div>
    </>
  )
}
