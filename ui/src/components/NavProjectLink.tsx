import Link from 'next/link'
import {cn} from '@/lib/cn'

type NavProjectLinkProps = {
  title: string
  slug: string
  variant?: 'home' | 'project'
  isCurrent?: boolean
}

export function NavProjectLink({
  title,
  slug,
  variant = 'home',
  isCurrent = false,
}: NavProjectLinkProps) {
  const isProject = variant === 'project'

  // Wrapped like Webflow's list item so the link stays inline (text width)
  return (
    <div>
      <Link
        href={`/projects/${slug}`}
        className={cn(
          isProject
            ? isCurrent
              ? 'opacity-100 hover:opacity-100'
              : 'opacity-30 hover:opacity-100'
            : 'opacity-100 hover:opacity-30',
        )}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {title}
      </Link>
    </div>
  )
}
