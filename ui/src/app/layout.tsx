import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {SanityLive} from '@/sanity/live'
import {getSiteSettings} from '@/lib/data'
import {getMetadataBase, resolveLinkPreview} from '@/lib/seo'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const metadataBase = getMetadataBase()
  const siteName = settings?.name || 'LINH THỊ NGUYỄN'
  const siteTagline = settings?.tagline || 'STYLIST'
  const preview = resolveLinkPreview({
    linkPreview: settings?.linkPreview,
    fallbackTitle: siteName,
    fallbackDescription: siteTagline,
    metadataBase,
  })

  return {
    metadataBase,
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: preview.description,
    icons: {
      icon: '/images/favicon.png',
      apple: '/images/webclip.png',
    },
    openGraph: {
      title: preview.title,
      description: preview.description,
      images: [preview.image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: preview.title,
      description: preview.description,
      images: [preview.image],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDraftMode = (await draftMode()).isEnabled

  return (
    <html lang="en">
      <body>
        {children}
        <div className="balinhciaga" />
        <SanityLive />
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  )
}
