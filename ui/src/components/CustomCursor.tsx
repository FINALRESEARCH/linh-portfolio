'use client'

import {useEffect, useRef} from 'react'
import {cn} from '@/lib/cn'

type CustomCursorProps = {
  currentIndex: number
  totalImages: number
}

// Live site checks this once on load (no resize handling)
function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth >= 1024
}

function formatSlideLabel(index: number, total: number) {
  return `${index + 1} / ${total}`
}

// Only the active slide's image box shows the counter (not the empty column
// beside portrait images, nor the strip below the image)
const IMAGE_BOX_SELECTOR = '.images-wrapper.is-project-gallery .swiper-slide.is-active .swiper-image-link'

export function CustomCursor({currentIndex, totalImages}: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (cursor) cursor.textContent = formatSlideLabel(currentIndex, totalImages)
  }, [currentIndex, totalImages])

  useEffect(() => {
    if (!isDesktop()) return

    const cursor = cursorRef.current
    if (!cursor) return

    cursor.style.willChange = 'transform'
    cursor.style.opacity = '0'
    cursor.style.transform = 'translate3d(-9999px, -9999px, 0)'

    // transform (not left/top) stays on the compositor — feels instant.
    // Hit-testing on every move also covers a pointer that is already over
    // the image on load (shows on the first mousemove).
    const onMove = (event: MouseEvent) => {
      const {clientX, clientY, target} = event
      cursor.style.transform = `translate3d(${clientX + 10}px, ${clientY + 10}px, 0)`
      const overImage = target instanceof Element && target.closest(IMAGE_BOX_SELECTOR)
      cursor.style.opacity = overImage ? '1' : '0'
    }
    const onLeave = () => {
      cursor.style.opacity = '0'
    }

    document.addEventListener('mousemove', onMove, {passive: true})
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={cn(
        'custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] whitespace-nowrap font-sans text-2xl leading-8 font-medium tracking-[-0.015rem] text-white mix-blend-difference opacity-0 max-lg:hidden',
      )}
      aria-hidden="true"
    >
      {formatSlideLabel(currentIndex, totalImages)}
    </div>
  )
}
