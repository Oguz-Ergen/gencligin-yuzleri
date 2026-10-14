import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { trTRLocale } from '@sanity/locale-tr-tr';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const SINGLETON = 'siteSettings';

export default defineConfig({
  name: 'gencligin-yuzleri',
  title: 'Gençliğin Yüzleri',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('İçerik')
          .items([
            S.listItem()
              .title('Site Ayarları')
              .id(SINGLETON)
              .child(S.document().schemaType(SINGLETON).documentId(SINGLETON).title('Site Ayarları')),
            S.divider(),
            S.documentTypeListItem('duyuru').title('Duyurular'),
            S.documentTypeListItem('belge').title('Politika Belgeleri'),
            S.documentTypeListItem('donem').title('Dönemler'),
          ]),
    }),
    trTRLocale(),
  ],
  schema: {
    types: schemaTypes,
    // Site Ayarları tek bir belge: "yeni oluştur" listesinde görünmesin.
    templates: (templates) => templates.filter((t) => t.schemaType !== SINGLETON),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === SINGLETON
        ? actions.filter((a) => a.action && ['publish', 'discardChanges', 'restore'].includes(a.action))
        : actions,
  },
});
