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
   * Webflow `.nav-wrapper`: space-between column, 8rem gaps. Copyright sits
   * in flow at the bottom, so short viewports grow/scroll instead of
   * overlapping. Mobile (<=479): the nav starts below the full-screen image.
   */
  const navWrapper =
    'nav-wrapper flex min-w-[25dvw] flex-col items-start justify-between gap-32 pr-[5dvw] mobile:absolute mobile:top-[100svh] mobile:min-w-0 mobile:items-stretch mobile:pb-2'

  if (isProject) {
    return (
      <div className={cn(navWrapper, 'mobile:gap-[6svh] mobile:pt-[6svh]')}>
        {bio}
        {index}
        {description?.length ? (
          <div className={cn(navSection, 'mobile:hidden')}>
            <PortableText value={description} className={cn(finePrint, 'richtext')} />
          </div>
        ) : null}
        {contact}
        {copyright}
      </div>
    )
  }

  return (
    <div className={cn(navWrapper, 'mobile:gap-24 mobile:pt-[4svh]')}>
      <div className="flex flex-col items-start justify-start gap-32 mobile:items-stretch mobile:gap-24">
        {bio}
        {index}
        {contact}
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
