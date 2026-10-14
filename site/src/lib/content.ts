// Site içeriği: SANITY_PROJECT_ID tanımlıysa Sanity'den, değilse yerel seed.json'dan okunur.
import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { toHTML, uriLooksSafe } from '@portabletext/to-html';
import seed from '../data/seed.json';

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

const env = import.meta.env;
const projectId = process.env.SANITY_PROJECT_ID ?? env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? env.SANITY_DATASET ?? 'production';

export const usingSanity = Boolean(projectId);

const client: SanityClient | null = projectId
  ? createClient({ projectId, dataset, apiVersion: '2025-06-01', useCdn: true, perspective: 'published' })
  : null;
const builder = client ? createImageUrlBuilder(client) : null;

// --- yardımcılar ---

function sanityImg(image: any, fallbackAlt = ''): Img | null {
  if (!image?.asset || !builder) return null;
  return {
    alt: image.alt ?? fallbackAlt,
    url: (w) => builder.image(image).width(w).fit('max').auto('format').url(),
  };
}

function localImg(i: { path: string; alt: string }): Img {
  return { alt: i.alt, url: () => i.path };
}

const paragraphs = (text?: string) =>
  (text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

function bodyToHtml(body: any[] | undefined): string {
  if (!body) return '';
  return toHTML(body, {
    components: {
      types: {
        image: ({ value }) => {
          const img = sanityImg(value);
          if (!img) return '';
          const caption = value.caption ? `<figcaption>${escape(value.caption)}</figcaption>` : '';
          return `<figure><img src="${img.url(1200)}" alt="${escape(img.alt)}" loading="lazy">${caption}</figure>`;
        },
      },
      marks: {
        link: ({ children, value }) => {
          const href = value?.href ?? '';
          if (!uriLooksSafe(href)) return children;
          const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
          return `<a href="${escape(href)}"${ext}>${children}</a>`;
        },
      },
    },
  });
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// --- sorgular ---

export async function getSettings(): Promise<Settings> {
  if (!client) {
    const s = seed.settings;
    return {
      ...s,
      heroImages: s.heroImages.map(localImg),
      aboutImages: s.aboutImages.map(localImg),
    };
  }
  const s = await client.fetch(`*[_id == "siteSettings"][0]`);
  return {
    slogan: s?.slogan ?? '',
    heroText: s?.heroText ?? '',
    heroImages: (s?.heroImages ?? []).map((i: any) => sanityImg(i)).filter(Boolean),
    aboutTitle: s?.aboutTitle ?? '',
    aboutText: paragraphs(s?.aboutText),
    aboutImages: (s?.aboutImages ?? []).map((i: any) => sanityImg(i)).filter(Boolean),
    stats: s?.stats ?? [],
    volunteerUrl: s?.volunteerUrl,
    email: s?.email,
    address: s?.address,
    social: s?.social ?? [],
  };
}

export async function getDonemler(): Promise<Donem[]> {
  if (!client) return seed.donemler as Donem[];
  const list = await client.fetch(`*[_type == "donem"] | order(number asc)`);
  return list.map((d: any) => ({
    number: d.number,
    years: d.years,
    title: d.title,
    intro: paragraphs(d.intro),
    cities: d.cities ?? [],
    highlight: d.highlightTitle ? { title: d.highlightTitle, text: d.highlightText ?? '' } : null,
    activities: d.activities ?? [],
  }));
}

export async function getBelgeler(): Promise<Belge[]> {
  if (!client) {
    return seed.belgeler.map((b) => ({
      title: b.title,
      label: b.label,
      donem: b.donem,
      fileUrl: b.file,
      cover: localImg({ path: b.cover, alt: `${b.label}: ${b.title} kapağı` }),
    }));
  }
  const list = await client.fetch(
    `*[_type == "belge" && defined(file.asset)] | order(donem->number asc, order asc, title asc){
      title, label, "donem": donem->number, "fileUrl": file.asset->url, cover
    }`,
  );
  return list.map((b: any) => ({ ...b, cover: sanityImg(b.cover, `${b.title} kapağı`) }));
}

const duyuruFields = `title, "slug": slug.current, date, category, summary, image, body`;

function toDuyuru(d: any): Duyuru {
  return {
    title: d.title,
    slug: d.slug,
    date: d.date,
    category: d.category,
    summary: d.summary,
    image: sanityImg(d.image, d.title),
    bodyHtml: bodyToHtml(d.body),
  };
}

export async function getDuyurular(limit?: number): Promise<Duyuru[]> {
  if (!client) return [];
  const range = limit ? `[0...${limit}]` : '';
  const list = await client.fetch(
    `*[_type == "duyuru" && defined(slug.current)] | order(date desc)${range}{${duyuruFields}}`,
  );
  return list.map(toDuyuru);
}

export async function getDuyuru(slug: string): Promise<Duyuru | null> {
  if (!client) return null;
  const d = await client.fetch(`*[_type == "duyuru" && slug.current == $slug][0]{${duyuruFields}}`, { slug });
  return d ? toDuyuru(d) : null;
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });
