// sosyaliklim.org'dan taşınan ilk içeriği panele aktarır (fotoğraflar ve PDF'ler dahil).
// Kullanım: npm run seed   — veritabanında dönem varsa hiçbir şey yapmaz.
import config from '@payload-config'
import { getPayload } from 'payload'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const site = path.resolve(here, '../../site')
const seed = JSON.parse(readFileSync(path.join(site, 'src/data/seed.json'), 'utf8'))
const publicFile = (p: string) => path.join(site, 'public', p)

const payload = await getPayload({ config })

const existing = await payload.count({ collection: 'donemler' })
if (existing.totalDocs > 0) {
  payload.logger.info('Veritabanında içerik var, aktarım atlandı.')
  process.exit(0)
}

const uploadImage = async (p: string, alt: string) =>
  (await payload.create({ collection: 'media', data: { alt }, filePath: publicFile(p) })).id

const s = seed.settings
const heroImages = []
for (const i of s.heroImages) heroImages.push({ image: await uploadImage(i.path, i.alt) })
const aboutImages = []
for (const i of s.aboutImages) aboutImages.push({ image: await uploadImage(i.path, i.alt) })

await payload.updateGlobal({
  slug: 'site-ayarlari',
  data: {
    slogan: s.slogan,
    heroText: s.heroText,
    heroImages,
    stats: s.stats,
    aboutTitle: s.aboutTitle,
    aboutText: s.aboutText.join('\n\n'),
    aboutImages,
    email: s.email,
    address: s.address,
    volunteerUrl: s.volunteerUrl,
    social: [],
  },
})

const donemIds: Record<number, number> = {}
for (const d of seed.donemler) {
  const doc = await payload.create({
    collection: 'donemler',
    data: {
      number: d.number,
      years: d.years || undefined,
      title: d.title,
      intro: d.intro.join('\n\n'),
      cities: d.cities.map((name: string) => ({ name })),
      activities: d.activities,
      highlightTitle: d.highlight?.title,
      highlightText: d.highlight?.text,
    },
  })
  donemIds[d.number] = doc.id
}

for (const b of seed.belgeler) {
  const cover = await uploadImage(b.cover, `${b.label}: ${b.title} kapağı`)
  await payload.create({
    collection: 'belgeler',
    data: { title: b.title, label: b.label, order: b.order, donem: donemIds[b.donem], cover },
    filePath: publicFile(b.file),
  })
}

payload.logger.info(`Aktarıldı: ${seed.donemler.length} dönem, ${seed.belgeler.length} belge, site ayarları.`)
process.exit(0)
