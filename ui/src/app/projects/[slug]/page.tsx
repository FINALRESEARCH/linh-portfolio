import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {MobileProjectDescription, SidebarNav} from '@/components/SidebarNav'
import {ProjectDetailSwiper} from '@/components/ProjectDetailSwiper'
import {getProjectBySlug, getProjects, getProjectSlugs, getSiteSettings} from '@/lib/data'
import {getMetadataBase, getSiteTitle, resolveLinkPreview} from '@/lib/seo'

type PageProps = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {title: 'Project not found'}
  }

  const settings = await getSiteSettings()
  const metadataBase = getMetadataBase()
  // Title goes through the layout's `%s / SITE` template; og/twitter need it spelled out
  const pageTitle = project.linkPreview?.title?.trim() || project.title.trim()
  const fullTitle = `${pageTitle} / ${getSiteTitle(settings)}`
  // Live has no per-project meta description; only override when one is set
  const description = project.linkPreview?.description?.trim()
  const preview = resolveLinkPreview({
    linkPreview: project.linkPreview,
    fallbackTitle: fullTitle,
    fallbackDescription: settings?.linkPreview?.description?.trim() || settings?.tagline || 'STYLIST',
    fallbackImage: project.coverImage ?? settings?.linkPreview?.image,
    metadataBase,
  })

  return {
    title: pageTitle,
    ...(description ? {description} : {}),
    openGraph: {
      title: fullTitle,
      description: preview.description,
      images: [preview.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: preview.description,
      images: [preview.image],
    },
  }
}

export default async function ProjectPage({params}: PageProps) {
  const {slug} = await params
  const [project, settings, projects] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
    getProjects(),
  ])

  if (!project) notFound()

  return (
    <>
      <MobileProjectDescription description={project.description} />
      <div className="outer-wrapper relative flex h-svh justify-between pt-3 pr-2.5 pb-2.5 pl-2.5 mobile:h-auto mobile:flex-col-reverse mobile:justify-end mobile:p-2 mobile:pt-0">
        <SidebarNav
          settings={settings}
          projects={projects}
          variant="project"
          currentSlug={slug}
          description={project.description}
        />
        <ProjectDetailSwiper images={project.gallery ?? []} title={project.title} />
      </div>
    </>
  )
}
