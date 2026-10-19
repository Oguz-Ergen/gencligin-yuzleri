import type { Field } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Zengin metni site için HTML'e çevirir; metne eklenen görselleri geniş boyutuyla basar. */
export const lexicalToHtml = (data: unknown) =>
  convertLexicalToHTML({
    data: data as Parameters<typeof convertLexicalToHTML>[0]['data'],
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

/** Site için hazır HTML alanı; veritabanına kaydedilmez, okunurken `body` alanından üretilir. */
export const bodyHtmlField: Field = {
  name: 'bodyHtml',
  type: 'text',
  virtual: true,
  admin: { hidden: true },
  hooks: {
    afterRead: [({ siblingData }) => (siblingData?.body ? lexicalToHtml(siblingData.body) : '')],
  },
}
