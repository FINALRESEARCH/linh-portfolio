import type {PortableTextBlock} from '@portabletext/types'
import type {LocalImage, ProjectDetail, ProjectListItem, SiteSettings} from '@/sanity/types'

function localImage(src: string, width: number, height: number): LocalImage {
  return {_type: 'localImage', src, width, height}
}

function paragraph(text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key: text.slice(0, 12),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: 's', text, marks: []}],
  }
}

/** Static demo content from `ui/public/images` for clones without Sanity. */
export const PLACEHOLDER_SITE_SETTINGS: SiteSettings = {
  name: 'LINH THỊ NGUYỄN',
  tagline: 'Styling & Creative direction',
  email: 'l.tn@outlook.com',
  instagramUrl: 'http://instagram.com/liemgiaycuatoi/',
}

export const PLACEHOLDER_PROJECTS: ProjectDetail[] = [
  {
    _id: 'placeholder-shop-king-lis',
    title: 'SHOP KING LIS',
    slug: 'shop-king-lis',
    order: 1,
    coverImage: localImage('/images/shop-king-lis-1.png', 1888, 1242),
    gallery: [
      localImage('/images/shop-king-lis-1.png', 1888, 1242),
      localImage('/images/shop-king-lis-2.png', 1886, 1236),
      localImage('/images/shop-king-lis-3.png', 948, 1414),
    ],
    description: [
      paragraph('Photography Deion Squires'),
      paragraph('Styling Linh Nguyen & Lis'),
      paragraph('Talents Lisa, Olivia & Abby'),
    ],
  },
  {
    _id: 'placeholder-fanci-club',
    title: 'FANCI CLUB',
    slug: 'fanci-club',
    order: 2,
    coverImage: localImage('/images/fanci-club-1.png', 1876, 1402),
    gallery: [
      localImage('/images/fanci-club-1.png', 1876, 1402),
      localImage('/images/fanci-club-2.png', 1058, 1408),
      localImage('/images/fanci-club-3.png', 1874, 1404),
    ],
    description: [
      paragraph('Martina for Fancì Club'),
    ],
  },
]

export function getPlaceholderProjects(): ProjectListItem[] {
  return PLACEHOLDER_PROJECTS.map(({gallery: _gallery, ...project}) => project)
}

export function getPlaceholderProjectBySlug(slug: string): ProjectDetail | null {
  return PLACEHOLDER_PROJECTS.find((project) => project.slug === slug) ?? null
}
