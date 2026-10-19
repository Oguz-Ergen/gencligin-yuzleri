import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { bodyHtmlField } from '../richText'
import { slugifyTr } from '../slugify'

export const Duyurular: CollectionConfig = {
  slug: 'duyurular',
  labels: { singular: 'Duyuru', plural: 'Duyurular' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'category', '_status'],
    group: 'İçerik',
    description: 'Etkinlik, çağrı ve haberler. "Yayınla" demeden sitede görünmez.',
  },
  defaultSort: '-date',
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', localized: true, label: 'Başlık', type: 'text', required: true, maxLength: 120 },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          label: 'Tarih',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
        },
        {
          name: 'category',
          label: 'Kategori',
          type: 'select',
          options: ['Etkinlik', 'Çağrı', 'Haber', 'Gençlik Gündemi', 'Basın'],
        },
      ],
    },
    {
      name: 'summary',
      localized: true,
      label: 'Kısa özet',
      type: 'textarea',
      maxLength: 240,
      admin: { description: 'Kartlarda ve sosyal medya paylaşımlarında görünür.' },
    },
    { name: 'image', label: 'Kapak görseli', type: 'upload', relationTo: 'media' },
    { name: 'body', localized: true, label: 'Metin', type: 'richText' },
    {
      name: 'slug',
      label: 'Bağlantı adresi',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Boş bırakılırsa başlıktan otomatik üretilir.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => (value ? slugifyTr(value) : data?.title ? slugifyTr(data.title) : value),
        ],
      },
    },
    bodyHtmlField,
  ],
}

