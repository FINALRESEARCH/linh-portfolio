'use client'

import {useEffect} from 'react'
import type {Swiper as SwiperType} from 'swiper'

type CustomCursorProps = {
  swiper: SwiperType | null
}

function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth >= 1024
}

export function CustomCursor({swiper}: CustomCursorProps) {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement | null
    if (!cursor) return

    if (!isDesktop()) {
      cursor.style.display = 'none'
      return
    }

    const slides = document.querySelectorAll('.swiper-image-link.project')

    const updateCursorPosition = (event: MouseEvent) => {
      cursor.style.left = `${event.clientX + 10}px`
      cursor.style.top = `${event.clientY + 10}px`
    }

    const updateCursorText = (slide: Element) => {
      const parentSlide = slide.closest('.swiper-slide')
      const ariaLabel = parentSlide?.getAttribute('aria-label')
      if (ariaLabel) cursor.textContent = ariaLabel
    }

    const onMouseEnter = (event: Event) => {
      const slide = event.currentTarget as Element
      updateCursorText(slide)
      cursor.style.opacity = '1'
    }

    const onMouseLeave = () => {
      cursor.style.opacity = '0'
    }

    const onMouseMove = (event: Event) => {
      updateCursorPosition(event as MouseEvent)
    }

    slides.forEach((slide) => {
      slide.addEventListener('mouseenter', onMouseEnter)
      slide.addEventListener('mouseleave', onMouseLeave)
      slide.addEventListener('mousemove', onMouseMove)
    })

    document.addEventListener('mousemove', updateCursorPosition)

    const onSlideChange = () => {
      const activeSlide = document.querySelector('.swiper-slide-active .swiper-image-link')
      if (activeSlide) updateCursorText(activeSlide)
    }

    swiper?.on('slideChangeTransitionStart', onSlideChange)

    return () => {
      slides.forEach((slide) => {
        slide.removeEventListener('mouseenter', onMouseEnter)
        slide.removeEventListener('mouseleave', onMouseLeave)
        slide.removeEventListener('mousemove', onMouseMove)
      })
      document.removeEventListener('mousemove', updateCursorPosition)
      swiper?.off('slideChangeTransitionStart', onSlideChange)
    }
  }, [swiper])

  return <div className="custom-cursor" />
}
