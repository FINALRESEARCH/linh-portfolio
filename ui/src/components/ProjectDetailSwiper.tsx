'use client'

import {useCallback, useEffect, useState} from 'react'
import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url'
import {EffectFade} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import type {Swiper as SwiperType} from 'swiper'
import {SanityImage} from '@/components/SanityImage'
import {CustomCursor} from '@/components/CustomCursor'
import {PortableText} from '@/components/PortableText'
import {cn} from '@/lib/cn'
import 'swiper/css'
import 'swiper/css/effect-fade'

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
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleImageLoad = useCallback(() => {
    document.querySelectorAll('.swiper-image-link').forEach((link) => link.classList.remove('loaded'))

    const activeSlide = document.querySelector('.swiper-slide-active .swiper-image-link')
    if (!activeSlide) return

    const img = activeSlide.querySelector('img')
    const loaded = () => {
      setTimeout(() => activeSlide.classList.add('loaded'), 350)
    }

    activeSlide.classList.remove('loaded')
    if (img?.complete) {
      loaded()
    } else if (img) {
      img.addEventListener('load', loaded, {once: true})
    }
  }, [])

  useEffect(() => {
    if (!swiper) return

    handleImageLoad()

    const onSlideChange = () => {
      setActiveIndex(swiper.activeIndex)
      handleImageLoad()
    }

    swiper.on('slideChange', onSlideChange)

    return () => {
      swiper.off('slideChange', onSlideChange)
    }
  }, [swiper, handleImageLoad])

  const handleNavClick = useCallback(
    (direction: 'next' | 'prev') => {
      if (!swiper || !images.length) return

      const total = images.length
      const nextIndex =
        direction === 'next'
          ? (swiper.activeIndex + 1) % total
          : (swiper.activeIndex - 1 + total) % total

      swiper.slideTo(nextIndex)
      setActiveIndex(nextIndex)
      handleImageLoad()
    },
    [swiper, images.length, handleImageLoad],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') handleNavClick('next')
      if (event.key === 'ArrowLeft') handleNavClick('prev')
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleNavClick])

  if (!images.length) {
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
      <CustomCursor currentIndex={activeIndex} totalImages={images.length} />
      <div
        className={cn(
          'images-wrapper is-project-gallery flex h-full w-[65dvw] max-w-[65dvw] flex-col items-center justify-end',
          'max-md:order-1 max-md:relative max-md:mt-0 max-md:h-auto max-md:min-h-0 max-md:w-full max-md:max-w-full max-md:flex-none max-md:items-stretch max-md:justify-start',
        )}
      >
        <Swiper
          className="swiper swiper-projects"
          modules={[EffectFade]}
          centeredSlides
          slidesPerView={1}
          effect="fade"
          fadeEffect={{crossFade: true}}
          speed={0}
          loop={false}
          allowTouchMove={false}
          onSwiper={setSwiper}
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${title}-${index}`} className="swiper-slide">
              <div className="swiper-image-link relative cursor-none max-md:cursor-auto">
                <SanityImage
                  image={image}
                  alt={`${title} — image ${index + 1}`}
                  className="swiper-slide-image"
                  sizes="(max-width: 767px) 100vw, 65vw"
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="swiper-project-image-nav absolute inset-0 z-[1] flex justify-between">
                  <button
                    type="button"
                    className="swiper-project-image-nav-prev h-full w-1/2 cursor-none border-0 bg-transparent p-0 max-md:cursor-auto"
                    aria-label="Previous image"
                    onClick={() => handleNavClick('prev')}
                  />
                  <button
                    type="button"
                    className="swiper-project-image-nav-next h-full w-1/2 cursor-none border-0 bg-transparent p-0 max-md:cursor-auto"
                    aria-label="Next image"
                    onClick={() => handleNavClick('next')}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-navigation is-projects absolute right-2.5 bottom-2.5 z-[1] hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="swiper-button-prev swiper-arrow fixed right-[30px] bottom-2.5 h-[22px] w-7 bg-[length:16px_16px]"
            aria-label="Previous image"
            onClick={() => handleNavClick('prev')}
          />
          <button
            type="button"
            className="swiper-button-next swiper-arrow fixed right-0.5 bottom-2.5 h-[22px] w-7 bg-[length:16px_16px]"
            aria-label="Next image"
            onClick={() => handleNavClick('next')}
          />
        </div>
        <div className="hidden w-full items-end justify-between gap-4 px-2 pt-2 max-md:flex">
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
              onClick={() => handleNavClick('prev')}
            />
            <button
              type="button"
              className="swiper-button-next swiper-arrow h-[22px] w-7 bg-[length:16px_16px]"
              aria-label="Next image"
              onClick={() => handleNavClick('next')}
            />
          </div>
        </div>
      </div>
    </>
  )
}
