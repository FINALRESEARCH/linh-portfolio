import Link from 'next/link'

type NavProjectLinkProps = {
  title: string
  slug: string
  isCurrent?: boolean
}

export function NavProjectLink({title, slug, isCurrent = false}: NavProjectLinkProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={`nav-link-project${isCurrent ? ' is-current' : ''}`}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {title}
    </Link>
  )
}
