'use client'

import {useCallback, useEffect, useRef, useState} from 'react'

// Webflow adds `.loaded` 350ms after the active slide's image is complete
const REVEAL_DELAY_MS = 350

/**
 * Mirrors the live site's image appear timing: on every slide change the
 * active image is hidden, then revealed ~350ms after it has loaded (the
 * 50ms opacity fade lives on `.swiper-image-link > img` in globals.css).
 */
export function useImageReveal(activeIndex: number) {
  const loadedRef = useRef(new Set<number>())
  const activeRef = useRef(activeIndex)
  const timerRef = useRef<number | undefined>(undefined)
  const [revealedIndex, setRevealedIndex] = useState(-1)

  const reveal = useCallback((index: number) => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (activeRef.current === index) setRevealedIndex(index)
    }, REVEAL_DELAY_MS)
  }, [])

  useEffect(() => {
    activeRef.current = activeIndex
    if (loadedRef.current.has(activeIndex)) reveal(activeIndex)
    return () => window.clearTimeout(timerRef.current)
  }, [activeIndex, reveal])

  const onImageLoad = useCallback(
    (index: number) => {
      loadedRef.current.add(index)
      if (activeRef.current === index) reveal(index)
    },
    [reveal],
  )

  const isRevealed = (index: number) => index === activeIndex && revealedIndex === index

  return {isRevealed, onImageLoad}
}
