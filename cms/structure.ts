import {CogIcon} from '@sanity/icons/Cog'
import {DocumentsIcon} from '@sanity/icons/Documents'
import type {StructureResolver} from 'sanity/structure'

const SINGLETONS = ['siteSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings'),
        ),
      S.divider(),
      S.listItem()
        .title('Projects')
        .icon(DocumentsIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() || ''),
      ),
    ])
