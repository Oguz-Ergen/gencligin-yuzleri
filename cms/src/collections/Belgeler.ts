import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../access'

/** Politika belgeleri: her kayıt bir PDF dosyasıdır. */
export const Belgeler: CollectionConfig = {
  slug: 'belgeler',
  labels: { singular: 'Politika Belgesi', plural: 'Politika Belgeleri' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'label', 'donem', 'order'], group: 'İçerik' },
  defaultSort: 'order',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: { mimeTypes: ['application/pdf'] },
  fields: [
    { name: 'title', label: 'Başlık', type: 'text', required: true },
    { name: 'label', label: 'Üst etiket', type: 'text', admin: { description: 'Şehir ya da seri adı. Örn: İzmir, Politika Önerisi II' } },
    {
      type: 'row',
      fields: [
        { name: 'donem', label: 'Dönem', type: 'relationship', relationTo: 'donemler' },
        { name: 'order', label: 'Sıra', type: 'number', admin: { description: 'Küçük sayı önce gösterilir.' } },
      ],
    },
    {
      name: 'cover',
      label: 'Kapak görseli',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'PDF\'in ilk sayfasının görseli. Boş bırakılırsa kartta "PDF" yazar.' },
    },
  ],
}
