import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'copyrightYear',
      title: 'Copyright Year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'creditName',
      title: 'Credit Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'creditUrl',
      title: 'Credit URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Open Graph Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'name'},
    prepare({title}) {
      return {title: title || 'Site Settings'}
    },
  },
})
