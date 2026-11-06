import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {resolve} from './presentation/resolve'
import {studioTheme} from './sanity/studioTheme'
import './sanity/studioStyles.css'

type StudioOptions = {
  projectId?: string
  dataset?: string
  /** Where the Studio is mounted — `/studio` when embedded in the Next.js site. */
  basePath?: string
  /** Site origin for Presentation. Omit when the Studio runs on the site itself. */
  previewOrigin?: string
}

/** Shared by the standalone Studio (`sanity dev`) and the one embedded at `/studio`. */
export function createStudioConfig({
  projectId = 'o97pp4zy',
  dataset = 'production',
  basePath = '/',
  previewOrigin,
}: StudioOptions = {}) {
  return defineConfig({
    name: 'default',
    title: 'Linh Portfolio',
    projectId,
    dataset,
    basePath,
    plugins: [
      structureTool({structure}),
      presentationTool({
        resolve,
        previewUrl: {
          ...(previewOrigin ? {origin: previewOrigin} : {}),
          previewMode: {
            enable: '/api/draft-mode/enable',
          },
        },
      }),
      visionTool(),
    ],
    schema: {
      types: schemaTypes,
    },
    theme: studioTheme,
    studio: {
      components: {
        logo: () => null,
      },
    },
  })
}
