import type { GlobalConfig } from 'payload'
import { anyone, loggedIn } from '../access'

const photos = (name: string, label: string, maxRows?: number) => ({
  name,
  label,
  type: 'array' as const,
  maxRows,
  labels: { singular: 'Fotoğraf', plural: 'Fotoğraflar' },
  fields: [{ name: 'image', label: 'Fotoğraf', type: 'upload' as const, relationTo: 'media' as const, required: true }],
})

export const SiteAyarlari: GlobalConfig = {
  slug: 'site-ayarlari',
  label: 'Site Ayarları',
  admin: { group: 'Yönetim' },
  access: { read: anyone, update: loggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Giriş',
          fields: [
            { name: 'slogan', localized: true, label: 'Slogan', type: 'text', required: true },
            { name: 'heroText', localized: true, label: 'Giriş metni', type: 'textarea' },
            {
              ...photos('heroImages', 'Giriş fotoğrafları'),
              admin: { description: 'Ana sayfanın üstünde sırayla değişir. Yatay, yüksek çözünürlüklü fotoğraflar kullanın.' },
            },
            {
              name: 'stats',
              label: 'Sayılarla',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Sayaç', plural: 'Sayaçlar' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', label: 'Sayı', type: 'text', required: true, admin: { description: 'Örn: 25, 3K+, 300+' } },
                    { name: 'label', localized: true, label: 'Açıklama', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Hakkımızda',
          fields: [
            { name: 'aboutTitle', localized: true, label: 'Başlık', type: 'text' },
            { name: 'aboutText', localized: true, label: 'Metin', type: 'textarea', admin: { description: 'Paragrafları boş bir satırla ayırın.', rows: 8 } },
            photos('aboutImages', 'Fotoğraflar', 2),
          ],
        },
        {
          label: 'İletişim',
          fields: [
            { name: 'email', label: 'E-posta', type: 'email' },
            { name: 'address', label: 'Adres', type: 'text' },
            { name: 'volunteerUrl', label: 'Gönüllü ol bağlantısı', type: 'text' },
            {
              name: 'social',
              label: 'Sosyal medya',
              type: 'array',
              labels: { singular: 'Hesap', plural: 'Hesaplar' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      label: 'Platform',
                      type: 'select',
                      required: true,
                      options: ['Instagram', 'X', 'YouTube', 'LinkedIn', 'Facebook', 'TikTok'],
                    },
                    { name: 'url', label: 'Bağlantı', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
