import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'

export const Donemler: CollectionConfig = {
  slug: 'donemler',
  labels: { singular: 'Dönem', plural: 'Dönemler' },
  admin: { useAsTitle: 'title', defaultColumns: ['number', 'title', 'years'], group: 'İçerik' },
  defaultSort: 'number',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'number', label: 'Dönem numarası', type: 'number', required: true, unique: true, min: 1 },
        { name: 'years', label: 'Yıllar', type: 'text', admin: { description: 'İsteğe bağlı. Örn: 2024-2025' } },
      ],
    },
    { name: 'title', label: 'Başlık', type: 'text', required: true },
    {
      name: 'intro',
      label: 'Açıklama',
      type: 'textarea',
      admin: { description: 'Paragrafları boş bir satırla ayırın.', rows: 6 },
    },
    {
      name: 'cities',
      label: 'Şehirler',
      type: 'array',
      labels: { singular: 'Şehir', plural: 'Şehirler' },
      fields: [{ name: 'name', label: 'Şehir', type: 'text', required: true }],
    },
    {
      name: 'activities',
      label: 'Faaliyetler',
      type: 'array',
      labels: { singular: 'Faaliyet', plural: 'Faaliyetler' },
      admin: { description: 'Numaralı kartlar olarak gösterilir (01, 02, …).' },
      fields: [
        { name: 'title', label: 'Başlık', type: 'text', required: true },
        { name: 'text', label: 'Açıklama', type: 'textarea' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Öne çıkan çıktı',
      fields: [
        { name: 'highlightTitle', label: 'Başlık', type: 'text', admin: { description: 'Örn: 67 Belediye Başkanı Adayı ile İyi Niyet Sözleşmesi İmzalandı' } },
        { name: 'highlightText', label: 'Açıklama', type: 'textarea' },
      ],
    },
  ],
}
