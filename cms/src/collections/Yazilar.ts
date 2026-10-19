import type { CollectionConfig } from 'payload'
import { loggedIn, publishedOrLoggedIn } from '../access'
import { bodyHtmlField } from '../richText'
import { slugifyTr } from '../slugify'

/** Lexical içeriğindeki düz metni toplar (okuma süresi için). */
const plainText = (node: unknown): string => {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  if (n.root) return plainText(n.root)
  return (n.text ?? '') + ' ' + (n.children ?? []).map(plainText).join(' ')
}

export const Yazilar: CollectionConfig = {
  slug: 'yazilar',
  labels: { singular: 'Blog Yazısı', plural: 'Blog Yazıları' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', 'category', '_status'],
    group: 'İçerik',
    description: 'Gençlerin ve ekibin yazıları, saha notları, röportajlar. "Yayınla" demeden sitede görünmez.',
  },
  defaultSort: '-publishedAt',
  versions: { drafts: true, maxPerDoc: 30 },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', localized: true, label: 'Başlık', type: 'text', required: true, maxLength: 140 },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          label: 'Yazar',
          type: 'text',
          admin: { description: 'Örn: Ayşe Yılmaz, İzmir gönüllüsü' },
        },
        {
          name: 'publishedAt',
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
          options: ['Görüş', 'Saha Notları', 'Röportaj', 'Gençlik Gündemi', 'Politika'],
        },
      ],
    },
    {
      name: 'excerpt',
      localized: true,
      label: 'Kısa özet',
      type: 'textarea',
      maxLength: 280,
      admin: { description: 'Blog listesinde ve sosyal medya paylaşımlarında görünür.' },
    },
    { name: 'image', label: 'Kapak görseli', type: 'upload', relationTo: 'media' },
    { name: 'body', localized: true, label: 'Metin', type: 'richText', required: true },
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
    {
      // Dakika cinsinden tahmini okuma süresi (dakikada ~200 kelime).
      name: 'readingMinutes',
      type: 'number',
      virtual: true,
      admin: { hidden: true },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            const words = plainText(siblingData?.body).split(/\s+/).filter(Boolean).length
            return Math.max(1, Math.round(words / 200))
          },
        ],
      },
    },
  ],
}
