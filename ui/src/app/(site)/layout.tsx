import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {SanityLive} from '@/sanity/live'
import {getSiteSettings} from '@/lib/data'
import {getMetadataBase, getSiteTitle, resolveLinkPreview, resolveSiteIcons} from '@/lib/seo'
import '../globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const metadataBase = getMetadataBase()
  const siteTitle = getSiteTitle(settings)
  const siteTagline = settings?.tagline || 'STYLIST'
  const preview = resolveLinkPreview({
    linkPreview: settings?.linkPreview,
    fallbackTitle: siteTitle,
    fallbackDescription: siteTagline,
    metadataBase,
  })
  const customIcons = resolveSiteIcons({siteIcons: settings?.siteIcons})

  return {
    metadataBase,
    title: {
      default: siteTitle,
      template: `%s / ${siteTitle}`,
    },
    description: preview.description,
    icons: {
      icon: customIcons.favicon ?? '/icon.png',
      apple: customIcons.appleTouchIcon ?? '/apple-icon.png',
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

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDraftMode = (await draftMode()).isEnabled

  return (
    <>
      {children}
      <div className="balinhciaga pointer-events-none fixed inset-0 z-[999] hidden h-svh w-svw bg-[url('/images/BALINHCIAGA_WATERMARK_DESKTOP.svg')] bg-cover bg-center bg-no-repeat mobile:h-screen mobile:bg-[url('/images/BALINHCIAGA_WATERMARK_MOBILE.svg')]" />
      <SanityLive onReconnect={false} />
      {isDraftMode ? <VisualEditing /> : null}
    </>
  )
}
