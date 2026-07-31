import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {SidebarNav} from '@/components/SidebarNav'
import {ProjectDetailSwiper} from '@/components/ProjectDetailSwiper'
import {getProjectBySlug, getProjects, getProjectSlugs, getSiteSettings} from '@/lib/data'
import {getMetadataBase, resolveLinkPreview} from '@/lib/seo'

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
  const siteName = settings?.name || 'LINH THỊ NGUYỄN'
  const metadataBase = getMetadataBase()
  const preview = resolveLinkPreview({
    linkPreview: project.linkPreview,
    fallbackTitle: project.title,
    fallbackDescription: `${project.title} — ${siteName}`,
    fallbackImage: project.coverImage ?? settings?.linkPreview?.image,
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
    getProjectBySlug(slug),
    getSiteSettings(),
    getProjects(),
  ])

  if (!project) notFound()

  return (
    <div className="relative flex h-svh justify-between pt-3 pr-2.5 pb-2.5 pl-2.5 max-md:min-h-svh max-md:flex-col max-md:items-stretch max-md:justify-start max-md:gap-0 max-md:p-0">
      <SidebarNav
        settings={settings}
        projects={projects}
        variant="project"
        currentSlug={slug}
        description={project.description}
      />
      <ProjectDetailSwiper
        images={project.gallery ?? []}
        title={project.title}
        description={project.description}
      />
    </div>
  )
}
