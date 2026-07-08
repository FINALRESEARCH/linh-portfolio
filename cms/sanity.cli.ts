import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  typegen: {
    path: '../ui/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../ui/sanity.types.ts',
    overloads: {
      generation: {
        mode: 'replace',
      },
    },
  },
})
