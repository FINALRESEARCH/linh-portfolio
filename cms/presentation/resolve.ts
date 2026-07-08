import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    siteSettings: defineLocations({
      select: {name: 'name'},
      resolve: (doc) => ({
        locations: [{title: doc?.name || 'Site Settings', href: '/'}],
      }),
    }),
    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: doc?.slug ? `/projects/${doc.slug}` : '/',
          },
          {title: 'Home', href: '/'},
        ],
      }),
    }),
  },
}
