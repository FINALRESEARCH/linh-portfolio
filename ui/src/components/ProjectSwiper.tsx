'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {EffectFade, Keyboard} from 'swiper/modules'
import {Swiper, SwiperSlide} from 'swiper/react'
import type {Swiper as SwiperType} from 'swiper'
import {SanityImage} from '@/components/SanityImage'
import {cn} from '@/lib/cn'
import 'swiper/css'
import 'swiper/css/effect-fade'

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
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentSlideIndexRef = useRef(0)

  const updateProgressBar = useCallback(() => {
    const progressBar = progressBarRef.current
    if (!progressBar) return

    progressBar.style.transition = 'none'
    progressBar.style.width = '0%'
    void progressBar.offsetHeight
    setTimeout(() => {
      progressBar.style.transition = `width ${AUTOPLAY_DURATION_MS}ms linear`
      progressBar.style.width = '100%'
    }, 10)
  }, [])

  const handleImageLoad = useCallback(() => {
    const allImageLinks = document.querySelectorAll('.swiper-image-link')
    allImageLinks.forEach((link) => link.classList.remove('loaded'))

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

  const goToSlide = useCallback(
    (index: number) => {
      if (!swiper || !projects.length) return
      const totalSlides = projects.length
      const normalized = ((index % totalSlides) + totalSlides) % totalSlides
      currentSlideIndexRef.current = normalized
      setActiveIndex(normalized)
      swiper.slideTo(normalized)
      updateProgressBar()
      handleImageLoad()
    },
    [swiper, projects.length, updateProgressBar, handleImageLoad],
  )

  const goToNextSlide = useCallback(() => {
    goToSlide(currentSlideIndexRef.current + 1)
  }, [goToSlide])

  const goToPrevSlide = useCallback(() => {
    goToSlide(currentSlideIndexRef.current - 1)
  }, [goToSlide])

  const startAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    autoplayIntervalRef.current = setInterval(goToNextSlide, AUTOPLAY_DURATION_MS)
  }, [goToNextSlide])

  useEffect(() => {
    if (!swiper) return

    updateProgressBar()
    handleImageLoad()
    startAutoplay()

    const onSlideChange = () => {
      currentSlideIndexRef.current = swiper.realIndex
      setActiveIndex(swiper.activeIndex)
      updateProgressBar()
      handleImageLoad()
    }

    swiper.on('slideChange', onSlideChange)

    return () => {
      swiper.off('slideChange', onSlideChange)
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    }
  }, [swiper, updateProgressBar, handleImageLoad, startAutoplay])

  const handleNavClick = (direction: 'next' | 'prev') => {
    if (direction === 'next') goToNextSlide()
    else goToPrevSlide()
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current)
    startAutoplay()
  }

  if (!projects.length) {
    return (
      <div className="images-wrapper flex h-full w-[65dvw] max-w-[65dvw] flex-col items-center justify-end max-md:order-2 max-md:mt-6 max-md:h-auto max-md:min-h-0 max-md:w-full max-md:max-w-full max-md:flex-none max-md:items-stretch max-md:justify-start">
        <p className={finePrint}>No projects yet.</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'images-wrapper flex h-full w-[65dvw] max-w-[65dvw] flex-col items-center justify-end',
          'max-md:order-2 max-md:relative max-md:mt-6 max-md:h-auto max-md:min-h-0 max-md:w-full max-md:max-w-full max-md:flex-none max-md:items-stretch max-md:justify-start',
        )}
      >
        <Swiper
          className="swiper swiper-projects"
          modules={[EffectFade, Keyboard]}
          centeredSlides
          slidesPerView={1}
          effect="fade"
          fadeEffect={{crossFade: true}}
          speed={0}
          loop={false}
          keyboard={{enabled: true}}
          allowTouchMove={false}
          onSwiper={setSwiper}
        >
          {projects.map((project) => (
            <SwiperSlide key={project._id} className="swiper-slide">
              <Link href={`/projects/${project.slug}`} className="swiper-image-link">
                <SanityImage
                  image={project.coverImage}
                  alt={project.title}
                  className="swiper-slide-image"
                  sizes="(max-width: 767px) 100vw, 65vw"
                />
              </Link>
              <div
                className={cn(
                  finePrint,
                  'absolute inset-x-0 bottom-0 mb-0 inline-flex font-sans max-md:hidden',
                )}
              >
                {project.title}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-navigation is-projects is-desktop absolute right-2.5 bottom-2.5 z-[1] flex items-center gap-2 max-md:hidden">
          <button
            type="button"
            className="swiper-button-prev swiper-arrow fixed right-[30px] bottom-2.5 h-[22px] w-7 bg-[length:16px_16px] max-md:static"
            aria-label="Previous project"
            onClick={() => handleNavClick('prev')}
          />
          <button
            type="button"
            className="swiper-button-next swiper-arrow fixed right-0.5 bottom-2.5 h-[22px] w-7 bg-[length:16px_16px] max-md:static"
            aria-label="Next project"
            onClick={() => handleNavClick('next')}
          />
        </div>
        <div className="swiper-mobile-footer hidden w-full items-center justify-between gap-4 pt-2 max-md:flex">
          <div className={cn(finePrint, 'swiper-mobile-title min-w-0 flex-1')}>
            {projects[activeIndex]?.title}
          </div>
          <div className="swiper-navigation is-projects static flex shrink-0 items-center gap-2 p-0">
            <button
              type="button"
              className="swiper-button-prev swiper-arrow static h-[22px] w-7 bg-[length:16px_16px]"
              aria-label="Previous project"
              onClick={() => handleNavClick('prev')}
            />
            <button
              type="button"
              className="swiper-button-next swiper-arrow static h-[22px] w-7 bg-[length:16px_16px]"
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
