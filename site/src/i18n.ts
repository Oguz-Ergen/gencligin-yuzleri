// Arayüz metinleri ve dil başına adresler. İçerik metinleri panelden (Payload) dil başına gelir.
export type Lang = 'tr' | 'en';
export const langs: Lang[] = ['tr', 'en'];

/** Sayfaların dil başına adresleri. */
export const routes = {
  home: { tr: '/', en: '/en' },
  belgeler: { tr: '/belgeler', en: '/en/documents' },
  duyurular: { tr: '/duyurular', en: '/en/news' },
  blog: { tr: '/blog', en: '/en/blog' },
} as const;

export const duyuruPath = (lang: Lang, slug: string) => `${routes.duyurular[lang]}/${slug}`;
export const yaziPath = (lang: Lang, slug: string) => `${routes.blog[lang]}/${slug}`;
/** Ana sayfadaki bir bölüme bağlantı, örn. /#iletisim ya da /en#contact */
export const anchor = (lang: Lang, id: 'about' | 'periods' | 'contact') => `${routes.home[lang]}#${t[lang].ids[id]}`;

export const t = {
  tr: {
    locale: 'tr-TR',
    ogLocale: 'tr_TR',
    ids: { about: 'hakkimizda', periods: 'donemler', contact: 'iletisim' },
    hashtag: '#ŞimdiSözGençlikte',
    skip: 'İçeriğe geç',
    homeLabel: 'Gençliğin Yüzleri ana sayfa',
    nav: { about: 'Hakkımızda', periods: 'Dönemler', belgeler: 'Politika Belgeleri', blog: 'Blog', duyurular: 'Duyurular', contact: 'İletişim' },
    mainMenu: 'Ana menü',
    openMenu: 'Menüyü aç',
    volunteer: 'Gönüllü ol',
    switchTo: 'English',
    switchShort: 'EN',
    hero: { primary: 'Neler yaptık?', secondary: 'Politika belgeleri', chat: 'Forumlarda konuşulanlar' },
    since: "2022'den bu yana",
    photos: 'Forumlardan fotoğraflar',
    periods: 'Dönemler',
    period: (n: number) => `${n}. dönem`,
    cities: 'Forum yapılan şehirler',
    periodDocs: 'Bu dönemin politika önerileri',
    news: 'Duyurular',
    allNews: 'Tüm duyurular',
    join: {
      chant: 'Sen de söz al',
      text: 'Şehrindeki forumlara katılmak, gönüllü olmak ya da birlikte çalışmak için bize yaz.',
    },
    pdf: '(PDF, yeni sekmede açılır)',
    belgelerPage: {
      title: 'Politika belgeleri',
      description: 'Gençliğin Yüzleri forumlarında gençlerle birlikte geliştirilen politika önerileri ve raporlar.',
      intro: 'Forumlarda gençlerle birlikte geliştirdiğimiz politika önerileri. Belgeler PDF olarak yeni sekmede açılır.',
      other: 'Diğer belgeler',
    },
    duyurularPage: {
      title: 'Duyurular',
      description: 'Gençliğin Yüzleri etkinlik, çağrı ve haberleri.',
      intro: 'Forumlar, etkinlikler, çağrılar ve gençleri ilgilendiren haberler.',
      empty: 'Şu an yayında duyuru yok. Yeni forum ve etkinliklerden haberdar olmak için',
      emptyLink: 'bizi takip et',
    },
    blog: {
      title: 'Blog',
      description: 'Gençliğin Yüzleri blogu: gençlerin yazıları, saha notları ve röportajlar.',
      intro: 'Gençlerin kaleminden yazılar, forumlardan saha notları ve röportajlar.',
      empty: 'Henüz yazı yok. İlk yazılar çok yakında burada. Yazmak istersen',
      emptyLink: 'bize yaz',
      latest: 'Blogdan',
      all: 'Tüm yazılar',
      by: 'Yazan',
      readMin: (n: number) => `${n} dk okuma`,
      more: 'Diğer yazılar',
      back: 'Tüm yazılar',
    },
    notFound: { title: 'Bu sayfa bulunamadı.', text: 'Bağlantı değişmiş ya da sayfa kaldırılmış olabilir.', back: 'Ana sayfaya dön' },
    footer: {
      before: 'Gençliğin Yüzleri, ',
      after: ' tarafından yürütülen bir gençlik programıdır.',
      contact: 'İletişim',
      explore: 'Keşfet',
    },
  },
  en: {
    locale: 'en-GB',
    ogLocale: 'en_GB',
    ids: { about: 'about', periods: 'our-work', contact: 'contact' },
    hashtag: '#NowYouthSpeaks',
    skip: 'Skip to content',
    homeLabel: 'Gençliğin Yüzleri home',
    nav: { about: 'About', periods: 'Our work', belgeler: 'Policy papers', blog: 'Blog', duyurular: 'News', contact: 'Contact' },
    mainMenu: 'Main menu',
    openMenu: 'Open menu',
    volunteer: 'Volunteer',
    switchTo: 'Türkçe',
    switchShort: 'TR',
    hero: { primary: "See what we've done", secondary: 'Policy papers', chat: 'Raised at our forums' },
    since: 'Since 2022:',
    photos: 'Photos from the forums',
    periods: 'Our work',
    period: (n: number) => `Period ${n}`,
    cities: 'Forum cities',
    periodDocs: 'Policy proposals from this period',
    news: 'News',
    allNews: 'All news',
    join: {
      chant: 'Have your say',
      text: 'Want to join a forum in your city, volunteer or work with us? Write to us.',
    },
    pdf: '(PDF in Turkish, opens in a new tab)',
    belgelerPage: {
      title: 'Policy papers',
      description: 'Policy proposals and reports developed with young people at Gençliğin Yüzleri forums.',
      intro: 'Policy proposals we developed with young people at our forums. The papers are in Turkish and open as PDFs in a new tab.',
      other: 'Other papers',
    },
    duyurularPage: {
      title: 'News',
      description: 'Events, calls and news from Gençliğin Yüzleri.',
      intro: 'Forums, events, open calls and news that matter to young people.',
      empty: 'There is no news right now. To hear about new forums and events,',
      emptyLink: 'follow us on Instagram',
    },
    blog: {
      title: 'Blog',
      description: 'The Gençliğin Yüzleri blog: writing by young people, field notes and interviews.',
      intro: 'Writing by young people, field notes from our forums and interviews.',
      empty: 'No posts yet. The first ones are coming soon. If you would like to write for us,',
      emptyLink: 'get in touch',
      latest: 'From the blog',
      all: 'All posts',
      by: 'By',
      readMin: (n: number) => `${n} min read`,
      more: 'More posts',
      back: 'All posts',
    },
    notFound: { title: 'Page not found.', text: 'The link may have changed or the page may have been removed.', back: 'Back to the home page' },
    footer: {
      before: 'Gençliğin Yüzleri is a youth programme run by ',
      after: '.',
      contact: 'Contact',
      explore: 'Explore',
    },
  },
};

/** Panelde Türkçe sabit değer olarak tutulan duyuru ve blog kategorilerinin görünen adı. */
const categoriesEn: Record<string, string> = {
  Görüş: 'Opinion',
  'Saha Notları': 'Field notes',
  Röportaj: 'Interview',
  Politika: 'Policy',
  Etkinlik: 'Event',
  Çağrı: 'Open call',
  Haber: 'News',
  'Gençlik Gündemi': 'Youth agenda',
  Basın: 'Press',
};
export const categoryLabel = (lang: Lang, c?: string) => (c && lang === 'en' ? categoriesEn[c] ?? c : c);

/** Panelde Instagram adresi girilmemişse kullanılan hesap. */
export const defaultInstagram = 'https://www.instagram.com/gencliginyuzleri/';

export const langFromPath = (path: string): Lang => (path === '/en' || path.startsWith('/en/') ? 'en' : 'tr');
