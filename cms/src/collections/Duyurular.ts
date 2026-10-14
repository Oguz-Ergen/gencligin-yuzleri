import type { CollectionConfig } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { slugifyTr } from '../slugify'

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

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
    { name: 'title', label: 'Başlık', type: 'text', required: true, maxLength: 120 },
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
      label: 'Kısa özet',
      type: 'textarea',
      maxLength: 240,
      admin: { description: 'Kartlarda ve sosyal medya paylaşımlarında görünür.' },
    },
    { name: 'image', label: 'Kapak görseli', type: 'upload', relationTo: 'media' },
    { name: 'body', label: 'Metin', type: 'richText' },
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
    {
      // Site için hazır HTML; veritabanına kaydedilmez, okunurken üretilir.
      name: 'bodyHtml',
      type: 'text',
      virtual: true,
      admin: { hidden: true },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            if (!siblingData?.body) return ''
            return convertLexicalToHTML({
              data: siblingData.body,
              converters: ({ defaultConverters }) => ({
                ...defaultConverters,
                upload: ({ node }) => {
                  const doc = node.value as { url?: string; alt?: string; sizes?: { genis?: { url?: string } } }
                  if (typeof doc !== 'object' || !doc?.url) return ''
                  const src = doc.sizes?.genis?.url || doc.url
                  return `<figure><img src="${escape(src)}" alt="${escape(doc.alt ?? '')}" loading="lazy"></figure>`
                },
              }),
            })
          },
        ],
      },
    },
  ],
}

