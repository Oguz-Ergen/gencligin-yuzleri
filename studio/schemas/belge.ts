import { defineField, defineType } from 'sanity';
import { DocumentPdfIcon } from '@sanity/icons/DocumentPdf';
import { imageWithAlt } from './fields';

export const belge = defineType({
  name: 'belge',
  title: 'Politika Belgesi',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({ name: 'title', title: 'Başlık', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Üst etiket', type: 'string', description: 'Şehir ya da seri adı. Örn: İzmir, Politika Önerisi II' }),
    defineField({ name: 'donem', title: 'Dönem', type: 'reference', to: [{ type: 'donem' }] }),
    defineField({ name: 'file', title: 'PDF dosyası', type: 'file', options: { accept: 'application/pdf' }, validation: (r) => r.required() }),
    imageWithAlt('cover', 'Kapak görseli', { description: 'PDF\'in ilk sayfasının görseli. Boş bırakılırsa kartta "PDF" yazar.' }),
    defineField({ name: 'order', title: 'Sıra', type: 'number', description: 'Aynı dönem içinde küçük sayı önce gösterilir.' }),
  ],
  orderings: [{ title: 'Sıra', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', label: 'label', donem: 'donem.number', media: 'cover' },
    prepare: ({ title, label, donem, media }) => ({
      title,
      subtitle: [donem && `${donem}. Dönem`, label].filter(Boolean).join(' · '),
      media,
    }),
  },
});
