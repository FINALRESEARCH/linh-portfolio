import Link from 'next/link'
import type {PortableTextBlock} from '@portabletext/types'
import {NavProjectLink} from '@/components/NavProjectLink'
import {PortableText} from '@/components/PortableText'
import {CurrentYear} from '@/components/CurrentYear'
import {FinalResearchCredit} from '@/components/FinalResearchCredit'
import {cn} from '@/lib/cn'

import type {ProjectListItem, SiteSettings} from '@/sanity/types'

const finePrint =
  'text-[0.7rem] leading-[0.9rem] tracking-[-0.005rem] mobile:text-[0.6rem] mobile:leading-[0.7rem]'

// Webflow `.nav-section`
const navSection = 'flex flex-col items-start'

type SidebarNavProps = {
  settings: SiteSettings | null
  projects: ProjectListItem[]
  variant?: 'home' | 'project'
  currentSlug?: string
}

export function SidebarNav({
  settings,
  projects,
  variant = 'home',
  currentSlug,
}: SidebarNavProps) {
  const isProject = variant === 'project'
  const name = settings?.name || 'LINH THỊ NGUYỄN'
  const tagline = settings?.tagline || 'Styling & Creative direction'
  const email = settings?.email || 'l.tn@outlook.com'
  const instagramUrl = settings?.instagramUrl || 'http://instagram.com/liemgiaycuatoi/'

  const bio = (
    <div
      className={cn(
        navSection,
        // Home (mobile): pinned to the top, under the full-screen image layer
        isProject ? 'mobile:order-3' : 'mobile:fixed mobile:inset-x-0 mobile:top-0 mobile:pt-2 mobile:pl-2',
      )}
    >
      <Link href="/" aria-current={isProject ? undefined : 'page'}>
        {name}
      </Link>
      <div>{tagline}</div>
    </div>
  )

  const index = (
    <div className={cn(navSection, 'gap-4 mobile:order-2')}>
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
  )

  const contact = (
    <div className={cn(navSection, 'mobile:order-4')}>
      <div>CONTACT</div>
      <a href={`mailto:${email}?subject=Inquiry`}>{email}</a>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
        INSTAGRAM
      </a>
    </div>
  )

  const copyright = (
    <div className={cn(navSection, 'mobile:order-5')}>
      <div className={finePrint}>©<CurrentYear /> Linh Nguyen</div>
      <FinalResearchCredit className={finePrint} />
    </div>
  )

  /*
   * Credits slot: every project's credits share one grid cell, so the slot is
   * always as tall as the longest set. Only the current project's is visible,
   * which keeps CONTACT and everything else fixed in place across home and
   * every project page.
   */
  const credits = (
    <div className="mt-8 grid self-stretch mobile:hidden">
      {projects.map((project) =>
        project.description?.length ? (
          <div
            key={project._id}
            className={cn('col-start-1 row-start-1', project.slug !== currentSlug && 'invisible')}
            aria-hidden={project.slug !== currentSlug}
          >
            <PortableText value={project.description} className={cn(finePrint, 'richtext')} />
          </div>
        ) : null,
      )}
    </div>
  )

  /*
   * One layout for home and project pages (Webflow `.nav-wrapper` spacing:
   * 8rem below the bio, copyright in flow at the bottom so short viewports
   * scroll instead of overlapping). Mobile (<=479): the nav starts below the
   * full-screen image, and the group flattens so `order` can rearrange it.
   */
  return (
    <div
      className={cn(
        'nav-wrapper flex min-w-[25dvw] flex-col items-start justify-between gap-8 pr-[5dvw] mobile:absolute mobile:top-[100svh] mobile:min-w-0 mobile:items-stretch mobile:pb-2',
        isProject ? 'mobile:gap-[6svh] mobile:pt-[6svh]' : 'mobile:gap-24 mobile:pt-[4svh]',
      )}
    >
      <div className="flex flex-col items-start mobile:contents">
        {bio}
        <div className="mt-32 mobile:mt-0 mobile:contents">{index}</div>
        {credits}
        <div className="mt-16 mobile:mt-0 mobile:contents">{contact}</div>
      </div>
      {copyright}
    </div>
  )
}

/** Mobile-only credits pinned to the bottom of the first screen (project pages) */
export function MobileProjectDescription({description}: {description?: PortableTextBlock[]}) {
  if (!description?.length) return null

  return (
    <div className="hidden mobile:absolute mobile:right-0 mobile:bottom-0 mobile:left-2 mobile:flex mobile:flex-col mobile:items-start">
      <PortableText value={description} className={cn(finePrint, 'richtext')} />
    </div>
  )
}
