'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {SanityImage} from '@/components/SanityImage'
import {cn} from '@/lib/cn'

const AUTOPLAY_DURATION_MS = 10000

const finePrint =
  'text-[0.7rem] leading-[0.9rem] tracking-[-0.005rem] max-md:text-[0.6rem] max-md:leading-[0.7rem]'

type ProjectSlide = {
  _id: string
  title: string
  slug: string
  coverImage: SanityImageSource
}

type ProjectSwiperProps = {
  projects: ProjectSlide[]
}

export function ProjectSwiper({projects}: ProjectSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lockRef = useRef(false)
  const total = projects.length
  const active = projects[activeIndex]

  const updateProgressBar = useCallback(() => {
    const progressBar = progressBarRef.current
    if (!progressBar) return

    progressBar.style.transition = 'none'
    progressBar.style.width = '0%'
    void progressBar.offsetHeight
    window.setTimeout(() => {
      progressBar.style.transition = `width ${AUTOPLAY_DURATION_MS}ms linear`
      progressBar.style.width = '100%'
    }, 10)
  }, [])

  const goTo = useCallback(
    (direction: 'next' | 'prev' | number) => {
      if (!total || lockRef.current) return

      lockRef.current = true
      setActiveIndex((current) => {
        if (typeof direction === 'number') {
          return ((direction % total) + total) % total
        }
        return direction === 'next'
          ? (current + 1) % total
          : (current - 1 + total) % total
      })

      window.setTimeout(() => {
        lockRef.current = false
      }, 250)
    },
    [total],
  )

  const startAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    autoplayIntervalRef.current = setInterval(() => goTo('next'), AUTOPLAY_DURATION_MS)
  }, [goTo])

  useEffect(() => {
    if (!total) return
    updateProgressBar()
    startAutoplay()
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    }
  }, [total, activeIndex, updateProgressBar, startAutoplay])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goTo('next')
        startAutoplay()
      }
      if (event.key === 'ArrowLeft') {
        goTo('prev')
        startAutoplay()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, startAutoplay])

  const handleNavClick = (direction: 'next' | 'prev') => {
    goTo(direction)
    startAutoplay()
  }

  if (!projects.length || !active) {
    return (
      <div className="images-wrapper flex h-full w-[65dvw] max-w-[65dvw] flex-col items-center justify-end max-md:order-2 max-md:h-auto max-md:min-h-0 max-md:w-full max-md:max-w-full max-md:flex-none max-md:items-stretch max-md:justify-start">
        <p className={finePrint}>No projects yet.</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'images-wrapper is-home-carousel flex h-full min-h-0 w-[65dvw] max-w-[65dvw] flex-col items-center justify-center',
          'max-md:order-2 max-md:relative max-md:h-auto max-md:min-h-0 max-md:w-full max-md:max-w-full max-md:flex-none max-md:items-stretch max-md:justify-start',
        )}
      >
        {/*
          Match reference/webflow slide structure:
          image link + title as siblings; title absolute at slide bottom
          (level with fixed chevrons), not overlaid on the image.
        */}
        <div className="home-carousel-frame relative flex h-full min-h-0 w-full flex-1 flex-col items-end justify-center max-md:h-auto max-md:flex-none max-md:items-center max-md:justify-center max-md:py-[clamp(2rem,6svh,4rem)]">
          <Link href={`/projects/${active.slug}`} className="home-carousel-link">
            <SanityImage
              key={active._id}
              image={active.coverImage}
              alt={active.title}
              className="home-carousel-image"
              sizes="(max-width: 767px) 100vw, 65vw"
              priority
              loading="eager"
            />
          </Link>
          <div className={cn(finePrint, 'home-carousel-title max-md:hidden')}>
            {active.title}
          </div>
        </div>

        <button
          type="button"
          className="swiper-button-prev swiper-arrow fixed right-[30px] bottom-2.5 z-[50] hidden h-[22px] w-7 bg-[length:16px_16px] md:block"
          aria-label="Previous project"
          onClick={() => handleNavClick('prev')}
        />
        <button
          type="button"
          className="swiper-button-next swiper-arrow fixed right-0.5 bottom-2.5 z-[50] hidden h-[22px] w-7 bg-[length:16px_16px] md:block"
          aria-label="Next project"
          onClick={() => handleNavClick('next')}
        />

        <div className="swiper-mobile-footer hidden w-full items-center justify-between gap-4 px-2 max-md:flex">
          <div className={cn(finePrint, 'swiper-mobile-title min-w-0 flex-1')}>
            {active.title}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="swiper-button-prev swiper-arrow h-[22px] w-7 bg-[length:16px_16px]"
              aria-label="Previous project"
              onClick={() => handleNavClick('prev')}
            />
            <button
              type="button"
              className="swiper-button-next swiper-arrow h-[22px] w-7 bg-[length:16px_16px]"
              aria-label="Next project"
              onClick={() => handleNavClick('next')}
            />
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 top-0 z-[9999] h-0.5 overflow-hidden">
        <div className="swiper-progress-bar-fill" ref={progressBarRef} />
      </div>
    </>
  )
}
