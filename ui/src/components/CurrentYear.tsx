'use client'

import {useSyncExternalStore} from 'react'

const BUILD_YEAR = new Date().getFullYear()
const subscribe = () => () => {}

/** Server-renders the build year, then reads the browser's clock so static pages never go stale. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => BUILD_YEAR,
  )

  return <>{year}</>
}
