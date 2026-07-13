import type {NextConfig} from 'next'
import path from 'path'
import {fileURLToPath} from 'url'

const uiRoot = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.resolve(uiRoot, '..')

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon.png',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
