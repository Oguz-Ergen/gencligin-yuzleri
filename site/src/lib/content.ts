// Site içeriği: CMS_URL tanımlıysa kendi panelimizden (Payload REST API), değilse yerel seed.json'dan okunur.
import seed from '../data/seed.json';
import { t, type Lang } from '../i18n';

export type Img = { alt: string; url: (width: number) => string };
export type Stat = { value: string; label: string };
export type Social = { platform: string; url: string };

export type Settings = {
  slogan: string;
  heroText: string;
  heroImages: Img[];
  aboutTitle: string;
  aboutText: string[];
  aboutImages: Img[];
  stats: Stat[];
  volunteerUrl?: string;
  email?: string;
  address?: string;
  social: Social[];
};

export type Donem = {
  number: number;
  years?: string;
  title: string;
  intro: string[];
  cities: string[];
  highlight: { title: string; text: string } | null;
  activities: { title: string; text: string }[];
};

export type Belge = {
  title: string;
  label?: string;
  donem?: number;
  fileUrl: string;
  cover: Img | null;
};

export type Duyuru = {
  title: string;
  slug: string;
  date: string;
  category?: string;
  summary?: string;
  image: Img | null;
  bodyHtml: string;
};

export type Yazi = {
  title: string;
  slug: string;
  date: string;
  author?: string;
  category?: string;
  excerpt?: string;
  image: Img | null;
  bodyHtml: string;
  readingMinutes: number;
};

const cmsUrl = (process.env.CMS_URL ?? import.meta.env.CMS_URL ?? '').replace(/\/$/, '');

// Aynı isteği 60 sn boyunca tekrar göndermeyelim.
const TTL = 60_000;
const cache = new Map<string, { at: number; value: Promise<any> }>();

function api<T = any>(path: string): Promise<T> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < TTL) return hit.value;
  const value = fetch(cmsUrl + path).then((r) => {
    if (!r.ok) throw new Error(`CMS ${r.status}: ${path}`);
    return r.json();
  });
  value.catch(() => cache.delete(path));
  cache.set(path, { at: Date.now(), value });
  return value;
}

// --- yardımcılar ---

const abs = (u?: string) => (!u ? '' : /^https?:/.test(u) ? u : cmsUrl + u);

/** Payload'ın ürettiği boyutlardan istenen genişliğe en uygun olanı seçer. */
function cmsImg(media: any, fallbackAlt = ''): Img | null {
  if (!media || typeof media !== 'object' || !media.url) return null;
  const s = media.sizes ?? {};
  return {
    alt: media.alt ?? fallbackAlt,
    url: (w) => abs((w <= 720 ? s.kart?.url : s.genis?.url) || media.url),
  };
}

function localImg(i: { path: string; alt: string }): Img {
  return { alt: i.alt, url: () => i.path };
}

const paragraphs = (text?: string) =>
  (text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

// --- sorgular ---

export async function getSettings(lang: Lang = 'tr'): Promise<Settings> {
  if (!cmsUrl) {
    const s = seed.settings;
    return { ...s, heroImages: s.heroImages.map(localImg), aboutImages: s.aboutImages.map(localImg) };
  }
  const s = await api(`/api/globals/site-ayarlari?depth=1&locale=${lang}`);
  const imgs = (list: any[] = []) => list.map((i) => cmsImg(i.image)).filter((i): i is Img => Boolean(i));
  return {
    slogan: s.slogan ?? '',
    heroText: s.heroText ?? '',
    heroImages: imgs(s.heroImages),
    aboutTitle: s.aboutTitle ?? '',
    aboutText: paragraphs(s.aboutText),
    aboutImages: imgs(s.aboutImages),
    stats: (s.stats ?? []).map(({ value, label }: Stat) => ({ value, label })),
    volunteerUrl: s.volunteerUrl || undefined,
    email: s.email || undefined,
    address: s.address || undefined,
    social: (s.social ?? []).map(({ platform, url }: Social) => ({ platform, url })),
  };
}

export async function getDonemler(lang: Lang = 'tr'): Promise<Donem[]> {
  if (!cmsUrl) return seed.donemler as Donem[];
  const { docs } = await api(`/api/donemler?sort=number&limit=100&depth=0&locale=${lang}`);
  return docs.map((d: any) => ({
    number: d.number,
    years: d.years || undefined,
    title: d.title,
    intro: paragraphs(d.intro),
    cities: (d.cities ?? []).map((c: any) => c.name),
    highlight: d.highlightTitle ? { title: d.highlightTitle, text: d.highlightText ?? '' } : null,
    activities: (d.activities ?? []).map(({ title, text }: any) => ({ title, text: text ?? '' })),
  }));
}

export async function getBelgeler(lang: Lang = 'tr'): Promise<Belge[]> {
  if (!cmsUrl) {
    return seed.belgeler.map((b) => ({
      title: b.title,
      label: b.label,
      donem: b.donem,
      fileUrl: b.file,
      cover: localImg({ path: b.cover, alt: `${b.label}: ${b.title} kapağı` }),
    }));
  }
  const { docs } = await api(`/api/belgeler?sort=order&limit=500&depth=1&locale=${lang}`);
  return docs
    .filter((b: any) => b.url)
    .map((b: any) => ({
      title: b.title,
      label: b.label || undefined,
      donem: b.donem?.number,
      fileUrl: abs(b.url),
      cover: cmsImg(b.cover, `${b.title} kapağı`),
    }))
    .sort((a: Belge, b: Belge) => (a.donem ?? 99) - (b.donem ?? 99));
}

function toDuyuru(d: any): Duyuru {
  return {
    title: d.title,
    slug: d.slug,
    date: d.date,
    category: d.category || undefined,
    summary: d.summary || undefined,
    image: cmsImg(d.image, d.title),
    bodyHtml: d.bodyHtml ?? '',
  };
}

// Ziyaretçiler API'den yalnızca yayınlanmış duyuruları alır (panel erişim kuralı).
export async function getDuyurular(lang: Lang = 'tr', limit = 100): Promise<Duyuru[]> {
  if (!cmsUrl) return [];
  const { docs } = await api(`/api/duyurular?sort=-date&limit=${limit}&depth=1&locale=${lang}`);
  return docs.filter((d: any) => d.slug).map(toDuyuru);
}

export async function getDuyuru(slug: string, lang: Lang = 'tr'): Promise<Duyuru | null> {
  if (!cmsUrl) return null;
  const { docs } = await api(`/api/duyurular?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1&locale=${lang}`);
  return docs[0] ? toDuyuru(docs[0]) : null;
}

function toYazi(d: any): Yazi {
  return {
    title: d.title,
    slug: d.slug,
    date: d.publishedAt,
    author: d.author || undefined,
    category: d.category || undefined,
    excerpt: d.excerpt || undefined,
    image: cmsImg(d.image, d.title),
    bodyHtml: d.bodyHtml ?? '',
    readingMinutes: d.readingMinutes ?? 1,
  };
}

// Ziyaretçiler API'den yalnızca yayınlanmış yazıları alır (panel erişim kuralı).
export async function getYazilar(lang: Lang = 'tr', limit = 100): Promise<Yazi[]> {
  if (!cmsUrl) return [];
  const { docs } = await api(`/api/yazilar?sort=-publishedAt&limit=${limit}&depth=1&locale=${lang}`);
  return docs.filter((d: any) => d.slug).map(toYazi);
}

export async function getYazi(slug: string, lang: Lang = 'tr'): Promise<Yazi | null> {
  if (!cmsUrl) return null;
  const { docs } = await api(`/api/yazilar?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1&locale=${lang}`);
  return docs[0] ? toYazi(docs[0]) : null;
}

export const formatDate = (iso: string, lang: Lang = 'tr') =>
  new Date(iso).toLocaleDateString(t[lang].locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
