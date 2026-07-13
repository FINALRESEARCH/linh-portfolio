'use client'

import {useEffect, useRef, useState} from 'react'
import {cn} from '@/lib/cn'

type CustomCursorProps = {
  currentIndex: number
  totalImages: number
}

function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth >= 1024
}

function formatSlideLabel(index: number, total: number) {
  return `${index + 1} / ${total}`
}

export function CustomCursor({currentIndex, totalImages}: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isDesktop()) return

    const slides = document.querySelectorAll(
      '.images-wrapper.is-project-gallery .swiper-image-link',
    )

    const onEnter = () => setVisible(true)
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
  }, [])

  return (
    <div
      ref={cursorRef}
      className={cn(
        'custom-cursor pointer-events-none fixed z-[9999] whitespace-nowrap font-sans text-2xl leading-8 font-medium tracking-[-0.015rem] text-white mix-blend-difference normal-case opacity-0 max-lg:hidden',
        visible && 'opacity-100',
      )}
      aria-hidden="true"
    >
      {formatSlideLabel(currentIndex, totalImages)}
    </div>
  )
}
