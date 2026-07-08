import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {SanityLive} from '@/sanity/live'
import {getSiteSettings} from '@/lib/data'
import {urlFor} from '@/sanity/lib/image'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.name || 'LINH THỊ NGUYỄN'
  const description = settings?.tagline || 'STYLIST'
  const ogImage = settings?.defaultOgImage
    ? urlFor(settings.defaultOgImage).width(1200).height(630).url()
    : '/images/opengraph.jpg'
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    icons: {
      icon: '/images/favicon.png',
      apple: '/images/webclip.png',
    },
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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
