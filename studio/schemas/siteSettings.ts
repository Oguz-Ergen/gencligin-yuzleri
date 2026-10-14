import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';
import { imageWithAlt } from './fields';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'giris', title: 'Giriş', default: true },
    { name: 'hakkimizda', title: 'Hakkımızda' },
    { name: 'iletisim', title: 'İletişim' },
  ],
  fields: [
    defineField({ name: 'slogan', title: 'Slogan', type: 'string', group: 'giris', validation: (r) => r.required() }),
    defineField({ name: 'heroText', title: 'Giriş metni', type: 'text', rows: 3, group: 'giris' }),
    defineField({
      name: 'heroImages',
      title: 'Giriş fotoğrafları',
      description: 'Ana sayfanın üstünde sırayla değişir. Yatay ve yüksek çözünürlüklü fotoğraflar kullanın.',
      type: 'array',
      group: 'giris',
      of: [imageWithAlt('image', 'Fotoğraf')],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'stats',
      title: 'Sayılarla',
      type: 'array',
      group: 'giris',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Sayı', type: 'string', description: 'Örn: 25, 3K+, 300+' }),
            defineField({ name: 'label', title: 'Açıklama', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
      validation: (r) => r.max(4),
    }),
    defineField({ name: 'aboutTitle', title: 'Başlık', type: 'string', group: 'hakkimizda' }),
    defineField({
      name: 'aboutText',
      title: 'Metin',
      description: 'Paragrafları boş bir satırla ayırın.',
      type: 'text',
      rows: 8,
      group: 'hakkimizda',
    }),
    defineField({
      name: 'aboutImages',
      title: 'Fotoğraflar',
      type: 'array',
      group: 'hakkimizda',
      of: [imageWithAlt('image', 'Fotoğraf')],
      options: { layout: 'grid' },
      validation: (r) => r.max(2),
    }),
    defineField({ name: 'email', title: 'E-posta', type: 'string', group: 'iletisim' }),
    defineField({ name: 'address', title: 'Adres', type: 'string', group: 'iletisim' }),
    defineField({ name: 'volunteerUrl', title: 'Gönüllü ol bağlantısı', type: 'url', group: 'iletisim' }),
    defineField({
      name: 'social',
      title: 'Sosyal medya',
      type: 'array',
      group: 'iletisim',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: { list: ['Instagram', 'X', 'YouTube', 'LinkedIn', 'Facebook', 'TikTok'] },
            }),
            defineField({ name: 'url', title: 'Bağlantı', type: 'url' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Ayarları' }) },
});
