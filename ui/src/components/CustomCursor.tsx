'use client'

import {useEffect, useRef, useState} from 'react'
import type {Swiper as SwiperType} from 'swiper'

type CustomCursorProps = {
  swiper: SwiperType | null
  totalImages: number
}

function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth >= 1024
}

function formatSlideLabel(index: number, total: number) {
  return `${index + 1} / ${total}`
}

export function CustomCursor({swiper, totalImages}: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!swiper) return

    const onSlideChange = () => {
      setSlideIndex(swiper.realIndex)
    }

    swiper.on('slideChange', onSlideChange)

    return () => {
      swiper.off('slideChange', onSlideChange)
    }
  }, [swiper])

  useEffect(() => {
    if (!isDesktop()) return

    const slides = document.querySelectorAll(
      '.images-wrapper.is-project-gallery .swiper-image-link',
    )

    const onEnter = () => {
      if (swiper) setSlideIndex(swiper.realIndex)
      setVisible(true)
    }

    const onLeave = () => setVisible(false)

    const onMove = (event: Event) => {
      const cursor = cursorRef.current
      if (!cursor) return
      const {clientX, clientY} = event as MouseEvent
      cursor.style.left = `${clientX + 10}px`
      cursor.style.top = `${clientY + 10}px`
    }

    slides.forEach((slide) => {
      slide.addEventListener('mouseenter', onEnter)
      slide.addEventListener('mouseleave', onLeave)
      slide.addEventListener('mousemove', onMove)
    })

    document.addEventListener('mousemove', onMove)

    return () => {
      slides.forEach((slide) => {
        slide.removeEventListener('mouseenter', onEnter)
        slide.removeEventListener('mouseleave', onLeave)
        slide.removeEventListener('mousemove', onMove)
      })
      document.removeEventListener('mousemove', onMove)
    }
  }, [swiper])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    >
      {formatSlideLabel(slideIndex, totalImages)}
    </div>
  )
}
