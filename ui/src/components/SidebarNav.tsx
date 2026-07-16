import Link from 'next/link'
import type {PortableTextBlock} from '@portabletext/types'
import {NavProjectLink} from '@/components/NavProjectLink'
import {PortableText} from '@/components/PortableText'
import {cn} from '@/lib/cn'

import type {ProjectListItem, SiteSettings} from '@/sanity/types'

const finePrint =
  'text-[0.7rem] leading-[0.9rem] tracking-[-0.005rem] max-md:text-[0.6rem] max-md:leading-[0.7rem]'

type SidebarNavProps = {
  settings: SiteSettings | null
  projects: ProjectListItem[]
  variant?: 'home' | 'project'
  currentSlug?: string
  description?: PortableTextBlock[]
}

export function SidebarNav({
  settings,
  projects,
  variant = 'home',
  currentSlug,
  description,
}: SidebarNavProps) {
  const isProject = variant === 'project'
  const name = settings?.name || 'LINH THỊ NGUYỄN'
  const tagline = settings?.tagline || 'Styling & Creative direction'
  const email = settings?.email || 'l.tn@outlook.com'
  const instagramUrl = settings?.instagramUrl || 'http://instagram.com/liemgiaycuatoi/'
  const copyrightYear = settings?.copyrightYear || 2024
  const creditName = settings?.creditName || 'LEFT'
  const creditUrl = settings?.creditUrl || 'https://left.systems'

  return (
    <div className="flex min-w-[25dvw] flex-col items-start justify-between gap-32 pr-[5dvw] max-md:contents">
      <div className="flex flex-col items-start justify-start gap-32 max-md:contents">
        <div
          className={cn(
            'flex flex-col items-start',
            isProject
              ? 'max-md:order-4 max-md:static max-md:w-full max-md:px-2 max-md:pt-12'
              : 'max-md:order-1 max-md:static max-md:w-full max-md:px-2 max-md:pt-2',
          )}
        >
          <Link href="/" aria-current={isProject ? undefined : 'page'}>
            {name}
          </Link>
          <div>{tagline}</div>
        </div>
        <div
          className={cn(
            'flex flex-col items-start gap-4',
            isProject ? 'max-md:order-3 max-md:px-2 max-md:pt-12' : 'max-md:order-4 max-md:px-2 max-md:pt-0',
          )}
        >
          <div>Work</div>
          <div className="flex flex-col">
            {projects.map((project) => (
              <NavProjectLink
                key={project._id}
                title={project.title}
                slug={project.slug}
                variant={variant}
                isCurrent={isProject && project.slug === currentSlug}
              />
            ))}
          </div>
        </div>
        {isProject && description?.length ? (
          <div className="max-w-[25dvw] max-md:hidden">
            <PortableText value={description} className={cn(finePrint, 'richtext')} />
          </div>
        ) : null}
        <div
          className={cn(
            'flex flex-col items-start',
            isProject ? 'max-md:order-5 max-md:px-2 max-md:pt-12' : 'max-md:order-5 max-md:px-2 max-md:pt-12',
          )}
        >
          <div>CONTACT</div>
          <a href={`mailto:${email}?subject=Inquiry`}>{email}</a>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            INSTAGRAM
          </a>
        </div>
      </div>
      <div
        className={cn(
          'absolute bottom-2.5 left-2.5',
          isProject
            ? 'max-md:order-6 max-md:static max-md:px-2 max-md:pt-12 max-md:pb-2'
            : 'max-md:order-6 max-md:static max-md:px-2 max-md:pt-12 max-md:pb-2',
        )}
      >
        <div className={finePrint}>©{copyrightYear} Linh Nguyen</div>
        <div className={finePrint}>
          Website by{' '}
          <a href={creditUrl} target="_blank" rel="noopener noreferrer">
            {creditName}
          </a>
        </div>
      </div>
    </div>
  )
}
