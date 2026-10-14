import { defineField } from 'sanity';

/** Alternatif metinli görsel alanı (erişilebilirlik ve SEO için). */
export const imageWithAlt = (name: string, title: string, extra: Record<string, unknown> = {}) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Görsel açıklaması',
        type: 'string',
        description: 'Görseli göremeyenler için kısa açıklama. Örn: "İzmir forumunda atölye çalışması"',
      }),
    ],
    ...extra,
  });

/** Türkçe karakterleri sadeleştirerek URL kısaltması üretir. */
export const slugifyTr = (input: string) =>
  input
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (c) => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' })[c]!)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
