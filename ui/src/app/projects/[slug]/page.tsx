import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {SidebarNav} from '@/components/SidebarNav'
import {ProjectDetailSwiper} from '@/components/ProjectDetailSwiper'
import {getProjects, getSiteSettings, fetchSanityData} from '@/lib/data'
import {getMetadataBase, resolveLinkPreview} from '@/lib/seo'
import {PROJECT_BY_SLUG_QUERY, PROJECT_SLUGS_QUERY} from '@/sanity/queries'
import type {ProjectDetail} from '@/sanity/types'
import {client} from '@/sanity/client'
import {isSanityConfigured} from '@/sanity/env'

type PageProps = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return []

  try {
    const slugs = await client
      .withConfig({useCdn: false})
      .fetch<{slug: string}[]>(PROJECT_SLUGS_QUERY)

    return slugs.map(({slug}) => ({slug}))
  } catch {
    return []
  }
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const project = await fetchSanityData<ProjectDetail | null>(PROJECT_BY_SLUG_QUERY, {slug})
  const typedProject = project

  if (!typedProject) {
    return {title: 'Project not found'}
  }

  const settings = await getSiteSettings()
  const siteName = settings?.name || 'LINH THỊ NGUYỄN'
  const metadataBase = getMetadataBase()
  const preview = resolveLinkPreview({
    linkPreview: typedProject.linkPreview,
    fallbackTitle: typedProject.title,
    fallbackDescription: `${typedProject.title} — ${siteName}`,
    fallbackImage: typedProject.coverImage ?? settings?.linkPreview?.image,
    metadataBase,
  })

  return {
    title: preview.title,
    description: preview.description,
    openGraph: {
      title: preview.title,
      description: preview.description,
      images: [preview.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: preview.title,
      description: preview.description,
      images: [preview.image],
    },
  }
}

export default async function ProjectPage({params}: PageProps) {
  const {slug} = await params
  const [project, settings, projects] = await Promise.all([
    fetchSanityData<ProjectDetail | null>(PROJECT_BY_SLUG_QUERY, {slug}),
    getSiteSettings(),
    getProjects(),
  ])

  const typedProject = project

  if (!typedProject) notFound()

  return (
    <div className="relative flex h-svh justify-between pt-3 pr-2.5 pb-2.5 pl-2.5 max-md:min-h-svh max-md:flex-col max-md:items-stretch max-md:justify-start max-md:gap-0 max-md:p-2 max-md:pt-2">
      <SidebarNav
        settings={settings}
        projects={projects}
        variant="project"
        currentSlug={slug}
        description={typedProject.description}
      />
      <ProjectDetailSwiper
        images={typedProject.gallery ?? []}
        title={typedProject.title}
        description={typedProject.description}
      />
    </div>
  )
}
