import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/live'
import {MobileProjectDescription, SidebarNav} from '@/components/SidebarNav'
import {ProjectDetailSwiper} from '@/components/ProjectDetailSwiper'
import {getProjects, getSiteSettings} from '@/lib/data'
import {PROJECT_BY_SLUG_QUERY, PROJECT_SLUGS_QUERY} from '@/sanity/queries'
import type {ProjectDetail} from '@/sanity/types'
import {urlFor} from '@/sanity/lib/image'
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
  const {data: project} = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: {slug},
  })
  const typedProject = project as ProjectDetail | null

  if (!typedProject) {
    return {title: 'Project not found'}
  }

  const settings = await getSiteSettings()
  const siteName = settings?.name || 'LINH THỊ NGUYỄN'
  const ogImage = typedProject.coverImage
    ? urlFor(typedProject.coverImage).width(1200).height(630).url()
    : undefined

  return {
    title: typedProject.title,
    description: `${typedProject.title} — ${siteName}`,
    openGraph: {
      title: typedProject.title,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: typedProject.title,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function ProjectPage({params}: PageProps) {
  const {slug} = await params
  const [{data: project}, settings, projects] = await Promise.all([
    sanityFetch({query: PROJECT_BY_SLUG_QUERY, params: {slug}}),
    getSiteSettings(),
    getProjects(),
  ])

  const typedProject = project as ProjectDetail | null

  if (!typedProject) notFound()

  return (
    <>
      <MobileProjectDescription description={typedProject.description} />
      <div className="outer-wrapper project">
        <SidebarNav
          settings={settings}
          projects={projects}
          variant="project"
          currentSlug={slug}
          description={typedProject.description}
        />
        <ProjectDetailSwiper images={typedProject.gallery ?? []} title={typedProject.title} />
      </div>
    </>
  )
}
