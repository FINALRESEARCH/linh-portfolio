'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import type {PortfolioImage} from '@/sanity/types'
import {SanityImage} from '@/components/SanityImage'
import {useImageReveal} from '@/lib/useImageReveal'
import {cn} from '@/lib/cn'

const AUTOPLAY_DURATION_MS = 5000

const finePrint =
  'text-[0.7rem] leading-[0.9rem] tracking-[-0.005rem] mobile:text-[0.6rem] mobile:leading-[0.7rem]'

type ProjectSlide = {
  _id: string
  title: string
  homeTitle?: string
  slug: string
  coverImage: PortfolioImage
}

type ProjectSwiperProps = {
  projects: ProjectSlide[]
}

export function ProjectSwiper({projects}: ProjectSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const {isRevealed, onImageLoad} = useImageReveal(activeIndex)
  const total = projects.length
  const isFirst = activeIndex === 0
  const isLast = activeIndex === total - 1

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

  // Autoplay loops last → first; manual nav (arrows/keys) stops at the ends
  // like the live Swiper (loop: false + disabled arrows).
  const goTo = useCallback(
    (direction: 'next' | 'prev', loop = false) => {
      if (!total) return
      setActiveIndex((current) => {
        if (direction === 'next') {
          if (current < total - 1) return current + 1
          return loop ? 0 : current
        }
        return current > 0 ? current - 1 : current
      })
    },
    [total],
  )

  // Any slide change resets the progress bar and the 5s autoplay timer
  useEffect(() => {
    if (!total) return
    updateProgressBar()
    autoplayIntervalRef.current = setInterval(() => goTo('next', true), AUTOPLAY_DURATION_MS)
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    }
  }, [total, activeIndex, updateProgressBar, goTo])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goTo('next')
      if (event.key === 'ArrowLeft') goTo('prev')
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo])

  if (!projects.length) {
    return (
      <div className="images-wrapper flex h-full w-[65dvw] max-w-[65dvw] shrink-0 flex-col items-center justify-end mobile:absolute mobile:inset-0 mobile:h-svh mobile:w-full mobile:max-w-full">
        <p className={finePrint}>No projects yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="images-wrapper is-home-carousel flex h-full w-[65dvw] max-w-[65dvw] shrink-0 flex-col items-center justify-end mobile:absolute mobile:inset-0 mobile:h-svh mobile:w-full mobile:max-w-full">
        {/*
          Slides are stacked (Swiper fade, speed 0) so every cover preloads;
          only the active one is visible. Desktop: image box top-left, 94% of
          the column height, title in the 6% left underneath.
        */}
        <div className="swiper relative h-full w-full overflow-hidden">
          {projects.map((project, index) => {
            const label = project.homeTitle || project.title
            const isActive = index === activeIndex

            return (
              <div
                key={project._id}
                className={cn('swiper-slide', isActive && 'is-active')}
                aria-hidden={!isActive}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className={cn('swiper-image-link', isRevealed(index) && 'loaded')}
                  tabIndex={isActive ? undefined : -1}
                >
                  <SanityImage
                    image={project.coverImage}
                    alt={label}
                    className="swiper-slide-image"
                    sizes="(max-width: 479px) 100vw, 65vw"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onLoad={() => onImageLoad(index)}
                  />
                </Link>
                <div className={cn(finePrint, 'swiper-slide-title')}>{label}</div>
              </div>
            )
          })}
        </div>

        <div className="swiper-navigation">
          <button
            type="button"
            className={cn('swiper-button-prev swiper-arrow', isFirst && 'swiper-button-disabled')}
            aria-label="Previous project"
            disabled={isFirst}
            onClick={() => goTo('prev')}
          />
          <button
            type="button"
            className={cn('swiper-button-next swiper-arrow', isLast && 'swiper-button-disabled')}
            aria-label="Next project"
            disabled={isLast}
            onClick={() => goTo('next')}
          />
        </div>
      </div>
      <div className="fixed inset-x-0 top-0 z-[9999] h-0.5 overflow-hidden">
        <div className="swiper-progress-bar-fill" ref={progressBarRef} />
      </div>
    </>
  )
}
