import { defineArrayMember, defineField, defineType } from 'sanity';
import { CalendarIcon } from '@sanity/icons/Calendar';

export const donem = defineType({
  name: 'donem',
  title: 'Dönem',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({ name: 'number', title: 'Dönem numarası', type: 'number', validation: (r) => r.required().integer().min(1) }),
    defineField({ name: 'years', title: 'Yıllar', type: 'string', description: 'İsteğe bağlı. Örn: 2024-2025' }),
    defineField({ name: 'title', title: 'Başlık', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'intro', title: 'Açıklama', type: 'text', rows: 6, description: 'Paragrafları boş bir satırla ayırın.' }),
    defineField({ name: 'cities', title: 'Şehirler', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({
      name: 'activities',
      title: 'Faaliyetler',
      description: 'Numaralı kartlar olarak gösterilir (01, 02, …).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'activity',
          fields: [
            defineField({ name: 'title', title: 'Başlık', type: 'string' }),
            defineField({ name: 'text', title: 'Açıklama', type: 'text', rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({ name: 'highlightTitle', title: 'Öne çıkan çıktı: başlık', type: 'string', description: 'Örn: 67 Belediye Başkanı Adayı ile İyi Niyet Sözleşmesi İmzalandı' }),
    defineField({ name: 'highlightText', title: 'Öne çıkan çıktı: açıklama', type: 'text', rows: 3 }),
  ],
  orderings: [{ title: 'Dönem numarası', name: 'numberAsc', by: [{ field: 'number', direction: 'asc' }] }],
  preview: {
    select: { number: 'number', title: 'title' },
    prepare: ({ number, title }) => ({ title: `${number}. Dönem`, subtitle: title }),
  },
});
