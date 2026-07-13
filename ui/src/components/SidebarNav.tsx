import Link from 'next/link'
import type {PortableTextBlock} from '@portabletext/types'
import {NavProjectLink} from '@/components/NavProjectLink'
import {PortableText} from '@/components/PortableText'

import type {ProjectListItem, SiteSettings} from '@/sanity/types'

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
    <div className={`nav-wrapper${isProject ? ' project' : ''}`}>
      <div className={`nav-top-section${isProject ? ' project' : ''}`}>
        <div className={`nav-section bio${isProject ? ' project' : ''}`}>
          <Link href="/" aria-current={isProject ? undefined : 'page'}>
            {name}
          </Link>
          <div>{tagline}</div>
        </div>
        <div className="nav-section index">
          <div className="text-block">Work</div>
          <div className="nav-index-wrapper">
            <div className={`nav-index-list${isProject ? ' projects' : ''}`}>
              {projects.map((project) => (
                <NavProjectLink
                  key={project._id}
                  title={project.title}
                  slug={project.slug}
                  isCurrent={isProject && project.slug === currentSlug}
                />
              ))}
            </div>
          </div>
        </div>
        {isProject && description?.length ? (
          <div className="nav-section project-description desktop">
            <PortableText value={description} className="fine-print richtext" />
          </div>
        ) : null}
        <div className="nav-section contact">
          <div>CONTACT</div>
          <a href={`mailto:${email}?subject=Inquiry`}>{email}</a>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            INSTAGRAM
          </a>
        </div>
      </div>
      <div className={`nav-section copyright${isProject ? ' project' : ''}`}>
        <div className="fine-print">©{copyrightYear} Linh Nguyen</div>
        <div className="fine-print">
          Website by{' '}
          <a href={creditUrl} target="_blank" rel="noopener noreferrer">
            {creditName}
          </a>
        </div>
      </div>
    </div>
  )
}

export function MobileProjectDescription({
  description,
}: {
  description?: PortableTextBlock[]
}) {
  if (!description?.length) return null

  return (
    <div className="nav-section project-description mobile">
      <PortableText value={description} className="fine-print richtext" />
    </div>
  )
}
