import { defineArrayMember, defineField, defineType } from 'sanity';
import { BellIcon } from '@sanity/icons/Bell';
import { imageWithAlt, slugifyTr } from './fields';

export const duyuru = defineType({
  name: 'duyuru',
  title: 'Duyuru',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({ name: 'title', title: 'Başlık', type: 'string', validation: (r) => r.required().max(120) }),
    defineField({
      name: 'slug',
      title: 'Bağlantı adresi',
      description: '"Oluştur" düğmesine basın; başlıktan otomatik üretilir.',
      type: 'slug',
      options: { source: 'title', slugify: slugifyTr },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Tarih',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: { list: ['Etkinlik', 'Çağrı', 'Haber', 'Basın'], layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'summary',
      title: 'Kısa özet',
      description: 'Kartlarda ve sosyal medya paylaşımlarında görünür.',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(240),
    }),
    imageWithAlt('image', 'Kapak görseli'),
    defineField({
      name: 'body',
      title: 'Metin',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Paragraf', value: 'normal' },
            { title: 'Ara başlık', value: 'h2' },
            { title: 'Küçük başlık', value: 'h3' },
            { title: 'Alıntı', value: 'blockquote' },
          ],
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Görsel açıklaması', type: 'string' }),
            defineField({ name: 'caption', title: 'Alt yazı', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  orderings: [{ title: 'Tarih (yeni → eski)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', date: 'date', category: 'category', media: 'image' },
    prepare: ({ title, date, category, media }) => ({ title, subtitle: [date, category].filter(Boolean).join(' · '), media }),
  },
});
