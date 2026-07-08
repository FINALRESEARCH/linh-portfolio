import {defineQuery} from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    name,
    tagline,
    email,
    instagramUrl,
    copyrightYear,
    creditName,
    creditUrl,
    linkPreview {
      title,
      description,
      "image": coalesce(image, ^.defaultOgImage)
    },
    siteIcons {
      favicon,
      appleTouchIcon
    }
  }
`)

export const PROJECTS_LIST_QUERY = defineQuery(`
  *[_type == "project"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order,
    coverImage
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{
    "slug": slug.current
  }
`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    order,
    coverImage,
    gallery,
    description,
    linkPreview {
      title,
      description,
      image
    }
  }
`)
