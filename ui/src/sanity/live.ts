import {defineLive} from 'next-sanity/live'
import {client} from './client'
import {token} from './env'

const readToken = token || false

export const {sanityFetch, SanityLive} = defineLive({
  client: client.withConfig({
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-01',
  }),
  // Explicit false = published live updates only (no draft preview token).
  serverToken: readToken,
  browserToken: readToken,
})
