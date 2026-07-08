import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {defineField, defineType} from 'sanity'
import {LinkPreviewInput} from '../../components/LinkPreviewInput'

export const linkPreview = defineType({
  name: 'linkPreview',
  title: 'Link Preview',
  type: 'object',
  icon: EarthGlobeIcon,
  description:
    'Controls how this page appears when shared on social media or messaging apps. Falls back to opengraph.jpg when no image is set.',
  components: {
    input: LinkPreviewInput,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Preview Title',
      type: 'string',
      description: 'Optional override for social sharing. Falls back to the page title.',
    }),
    defineField({
      name: 'description',
      title: 'Preview Description',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in link previews and search results.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Preview Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Recommended 1200×630. Falls back to opengraph.jpg when empty.',
    }),
  ],
})
