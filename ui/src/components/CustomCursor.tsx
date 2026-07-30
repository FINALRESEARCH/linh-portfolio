'use client'

import {useEffect, useRef} from 'react'
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

  useEffect(() => {
    const cursor = cursorRef.current
    if (cursor) cursor.textContent = formatSlideLabel(currentIndex, totalImages)
  }, [currentIndex, totalImages])

  useEffect(() => {
    if (!isDesktop()) return

    const target = document.querySelector('.images-wrapper.is-project-gallery')
    const cursor = cursorRef.current
    if (!target || !cursor) return

    cursor.style.willChange = 'transform'
    cursor.style.opacity = '0'
    cursor.style.transform = 'translate3d(-9999px, -9999px, 0)'

    const onEnter = () => {
      cursor.style.opacity = '1'
    }
    const onLeave = () => {
      cursor.style.opacity = '0'
    }

    // transform (not left/top) stays on the compositor — feels instant
    const onMove = (event: Event) => {
      const {clientX, clientY} = event as MouseEvent
      cursor.style.transform = `translate3d(${clientX + 10}px, ${clientY + 10}px, 0)`
    }

    target.addEventListener('mouseenter', onEnter)
    target.addEventListener('mouseleave', onLeave)
    target.addEventListener('mousemove', onMove, {passive: true})

    return () => {
      target.removeEventListener('mouseenter', onEnter)
      target.removeEventListener('mouseleave', onLeave)
      target.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={cn(
        'custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] whitespace-nowrap font-sans text-2xl leading-8 font-medium tracking-[-0.015rem] text-white mix-blend-difference normal-case opacity-0 max-lg:hidden',
      )}
      aria-hidden="true"
    >
      {formatSlideLabel(currentIndex, totalImages)}
    </div>
  )
}
