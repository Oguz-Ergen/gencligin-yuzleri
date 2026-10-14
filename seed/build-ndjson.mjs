// site/src/data/seed.json içeriğini Sanity'ye aktarılabilir NDJSON dosyasına çevirir.
// Kullanım (studio klasöründen): npm run import-seed
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, '..', 'site');
const seed = JSON.parse(readFileSync(join(site, 'src/data/seed.json'), 'utf8'));

const asset = (kind, publicPath) => `${kind}@${pathToFileURL(join(site, 'public', publicPath)).href}`;
const key = (i) => `k${i}`;
const image = (i, idx) => ({ _type: 'image', _key: key(idx), _sanityAsset: asset('image', i.path), alt: i.alt });

const s = seed.settings;
const docs = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    slogan: s.slogan,
    heroText: s.heroText,
    heroImages: s.heroImages.map(image),
    aboutTitle: s.aboutTitle,
    aboutText: s.aboutText.join('\n\n'),
    aboutImages: s.aboutImages.map(image),
    stats: s.stats.map((st, i) => ({ _type: 'stat', _key: key(i), ...st })),
    email: s.email,
    address: s.address,
    volunteerUrl: s.volunteerUrl,
    social: [],
  },
  ...seed.donemler.map((d) => ({
    _id: `donem-${d.number}`,
    _type: 'donem',
    number: d.number,
    years: d.years || undefined,
    title: d.title,
    intro: d.intro.join('\n\n'),
    cities: d.cities,
    activities: d.activities.map((a, i) => ({ _type: 'activity', _key: key(i), ...a })),
    highlightTitle: d.highlight?.title,
    highlightText: d.highlight?.text,
  })),
  ...seed.belgeler.map((b) => ({
    _id: `belge-${b.file.split('/').pop().replace(/\.pdf$/, '')}`,
    _type: 'belge',
    title: b.title,
    label: b.label,
    order: b.order,
    donem: { _type: 'reference', _ref: `donem-${b.donem}` },
    file: { _type: 'file', _sanityAsset: asset('file', b.file) },
    cover: { _type: 'image', _sanityAsset: asset('image', b.cover), alt: `${b.label}: ${b.title} kapağı` },
  })),
];

const out = join(here, 'data.ndjson');
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`${docs.length} belge yazıldı → ${out}`);
