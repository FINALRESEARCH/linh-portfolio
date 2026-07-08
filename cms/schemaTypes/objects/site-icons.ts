import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'
import {SiteIconsInput} from '../../components/SiteIconsInput'

export const siteIcons = defineType({
  name: 'siteIcons',
  title: 'Site Icons',
  type: 'object',
  icon: ImageIcon,
  description:
    'Browser tab favicon and Apple touch icon. Defaults to favicon.png and webclip.png generated from webclip.png.',
  components: {
    input: SiteIconsInput,
  },
  fields: [
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Square image for browser tabs. Recommended 32×32 or 48×48. Falls back to favicon.png.',
    }),
    defineField({
      name: 'appleTouchIcon',
      title: 'Apple Touch Icon',
      type: 'image',
      description: 'Icon for iOS home screen bookmarks. Recommended 180×180 or 256×256. Falls back to webclip.png.',
    }),
  ],
})
