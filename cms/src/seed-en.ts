// İlk İngilizce içeriği panele girer (Türkçe kayıtların "en" diline çevirisi).
// Kullanım: npm run seed:en   — İngilizce alanların üzerine yazar; yalnızca ilk kurulumda bir kez çalıştırın.
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

const settings = {
  slogan: 'Now Youth Speaks!',
  heroText:
    "A youth movement that makes young people's democratic demands visible and builds solutions to the issues they share.",
  aboutTitle: 'What is Gençliğin Yüzleri?',
  aboutText: [
    'Gençliğin Yüzleri (Faces of Youth) is a youth movement founded in 2022 so that young people aged 18–30 are heard by society and decision-makers. It identifies their most pressing problems and develops sensible solutions.',
    "It works to secure young people's democratic participation, shape youth policy and find solutions to the problems young people face.",
  ].join('\n\n'),
  stats: ['youth and political forums', 'young participants', 'policy proposals', 'youth volunteers'],
}

const donemler: Record<number, { title: string; intro: string[]; highlightTitle?: string; highlightText?: string; activities?: [string, string][] }> = {
  1: {
    title: 'The 2023 General Election and Policy Proposals',
    intro: [
      'In the first period, in partnership with NDI Türkiye and ahead of the 2023 general election, we met young people in Adana-Mersin, Ankara, Denizli, Diyarbakır, Eskişehir, İstanbul, İzmir and Samsun for Youth Forums and Political Forums.',
      'Policy proposals were developed from these forums, followed by an advocacy campaign.',
    ],
    highlightTitle: 'We Took Our Policy Proposals to 56 Decision-Makers',
    highlightText:
      'Through our Political Forums we brought young people together with members of parliament and parliamentary candidates, and presented our policy proposals to decision-makers and candidates from the parties with a group in parliament.',
  },
  2: {
    title: 'The 2024 Local Elections and Policy Proposals',
    intro: [
      'In the second period, in partnership with NDI Türkiye and ahead of the 2024 local elections, we held Youth Forums and Political Forums with young people in Eskişehir, İstanbul, İzmir and Samsun.',
      'Policy proposals were developed from these forums, and good-faith pledges were signed with candidates.',
    ],
    highlightTitle: '67 Mayoral Candidates Signed a Good-Faith Pledge',
    highlightText:
      'Based on our policy proposals, we prepared a Youth Good-Faith Pledge for Mayoral Candidates. 67 candidates signed it, committing to be youth-friendly mayors.',
  },
  3: {
    title: 'After the Elections: Dialogue and Participation',
    intro: [
      "In this period our goal is to strengthen dialogue between young people and decision-makers at national and local level after the elections, so that young people take a stronger part in governance and decision-making through their demands and our policy proposals, and, through the National Youth Network we built, to keep young people's demands in Türkiye visible and strengthen youth participation.",
    ],
    activities: [
      [
        'Youth Workshops for the 2025–2029 Strategic Plans',
        "We supported 8 municipalities in preparing strategic plans that respond to young people's needs and follow the principle of participation.",
      ],
      [
        'National Youth Executive Board',
        "With 2–3 representatives from our volunteers in each of the 8 cities, we formed a National Youth Executive Board to work on our national policy proposals and plan the programme's next period.",
      ],
      [
        'Visits to Political Party Headquarters',
        'After the board met in Ankara, we visited the headquarters of the parties with a group in parliament and presented the policy proposals young people developed.',
      ],
      [
        'Action Plan Workshops',
        'Held in 8 cities, these workshops aim to turn the policy proposals and youth strategies from the second period into concrete actions, aligned with the youth goals in municipal strategic plans.',
      ],
    ],
  },
}

// Dosya adına göre: [başlık, etiket]
const belgeler: Record<string, [string, string]> = {
  'politika-onerisi-1-genc-issizligi.pdf': ['Youth Unemployment', 'Policy Proposal I'],
  'politika-onerisi-2-egitim.pdf': ['Education', 'Policy Proposal II'],
  'politika-onerisi-3-temel-ihtiyaclara-erisim.pdf': ["Young People's Access to Basic Needs", 'Policy Proposal III'],
  'politika-onerisi-4-siyasi-katilim.pdf': ["Young People's Participation in Political Decision-Making", 'Policy Proposal IV'],
  'yerel-secim-eskisehir.pdf': ['Employment Problems Facing Young People', 'Eskişehir'],
  'yerel-secim-istanbul.pdf': ['Gaps in Municipal Earthquake Policy for Places Where Young People Live', 'İstanbul'],
  'yerel-secim-izmir.pdf': ['The Lack of Social Spaces for Young People', 'İzmir'],
  'yerel-secim-samsun.pdf': ["Young People's Access to Basic Needs", 'Samsun'],
}

const photoAlts: Record<string, string> = {
  'forum-atolye-1.webp': 'Young people in a workshop at a Gençliğin Yüzleri forum',
  'forum-toplu.webp': 'Group photo of Gençliğin Yüzleri forum participants',
  'forum-atolye-2.webp': 'A moment from a Gençliğin Yüzleri forum',
  'panel.webp': 'Young people speaking on a Gençliğin Yüzleri panel',
  'atolye-3.webp': 'Group discussion at a youth forum',
}

// Site ayarları (sayaç satırlarının kimlikleri korunarak)
const current = await payload.findGlobal({ slug: 'site-ayarlari', locale: 'tr', depth: 0 })
await payload.updateGlobal({
  slug: 'site-ayarlari',
  locale: 'en',
  data: {
    slogan: settings.slogan,
    heroText: settings.heroText,
    aboutTitle: settings.aboutTitle,
    aboutText: settings.aboutText,
    stats: (current.stats ?? []).map((row, i) => ({ id: row.id, value: row.value, label: settings.stats[i] ?? row.label })),
  },
})

const { docs: periods } = await payload.find({ collection: 'donemler', locale: 'tr', depth: 0, limit: 100 })
for (const d of periods) {
  const en = donemler[d.number]
  if (!en) continue
  await payload.update({
    collection: 'donemler',
    id: d.id,
    locale: 'en',
    data: {
      title: en.title,
      intro: en.intro.join('\n\n'),
      highlightTitle: en.highlightTitle,
      highlightText: en.highlightText,
      activities: (d.activities ?? []).map((row, i) => ({
        id: row.id,
        title: en.activities?.[i]?.[0] ?? row.title,
        text: en.activities?.[i]?.[1] ?? row.text,
      })),
    },
  })
}

const { docs: docs } = await payload.find({ collection: 'belgeler', locale: 'tr', depth: 0, limit: 500 })
for (const b of docs) {
  const en = belgeler[b.filename ?? '']
  if (!en) continue
  await payload.update({ collection: 'belgeler', id: b.id, locale: 'en', data: { title: en[0], label: en[1] } })
  if (typeof b.cover === 'number') {
    await payload.update({ collection: 'media', id: b.cover, locale: 'en', data: { alt: `${en[1]}: ${en[0]} (cover)` } })
  }
}

const { docs: media } = await payload.find({ collection: 'media', locale: 'tr', depth: 0, limit: 500 })
for (const m of media) {
  const alt = photoAlts[m.filename ?? '']
  if (alt) await payload.update({ collection: 'media', id: m.id, locale: 'en', data: { alt } })
}

payload.logger.info('İngilizce içerik girildi.')
process.exit(0)
