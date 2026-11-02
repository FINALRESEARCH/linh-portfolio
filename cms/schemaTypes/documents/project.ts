import {DocumentsIcon} from '@sanity/icons/Documents'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Controls sort order in the Work index and home carousel.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'homeTitle',
      title: 'Home Caption',
      type: 'string',
      description: 'Caption under the cover image in the home carousel. Falls back to the title.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) =>
                      rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']}),
                  }),
                ],
              },
            ],
          },
          lists: [],
        }),
      ],
    }),
    defineField({
      name: 'linkPreview',
      title: 'Link Preview',
      type: 'linkPreview',
      description: 'Optional override for social sharing. Falls back to the cover image, then opengraph.jpg.',
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      order: 'order',
    },
    prepare({title, media, order}) {
      return {
        title: order != null ? `${order}. ${title}` : title,
        media,
      }
    },
  },
})
