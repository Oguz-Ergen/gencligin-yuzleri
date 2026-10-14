import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Görsel', plural: 'Görseller' },
  admin: { group: 'Dosyalar', description: 'Sitede kullanılan fotoğraflar ve kapak görselleri.' },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: {
    mimeTypes: ['image/*'],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'kart', width: 720, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'genis', width: 1920, formatOptions: { format: 'webp', options: { quality: 80 } } },
    ],
    adminThumbnail: 'kart',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Görsel açıklaması',
      type: 'text',
      required: true,
      admin: { description: 'Görseli göremeyenler için kısa açıklama. Örn: "İzmir forumunda atölye çalışması"' },
    },
  ],
}
