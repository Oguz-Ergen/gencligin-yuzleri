import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { tr } from '@payloadcms/translations/languages/tr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { OAuth2Client } from 'google-auth-library'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Donemler } from './collections/Donemler'
import { Belgeler } from './collections/Belgeler'
import { Duyurular } from './collections/Duyurular'
import { SiteAyarlari } from './globals/SiteAyarlari'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Üretimde dosyalar Google Cloud Storage'da tutulur; yerelde diske yazılır.
const bucket = process.env.GCS_BUCKET

// Cloud Run'da servis hesabı kullanılır. Yerel makineden üretime aktarım yaparken
// `GCS_ACCESS_TOKEN=$(gcloud auth print-access-token)` ile kısa ömürlü anahtar verilebilir.
const gcsAuth = () => {
  const token = process.env.GCS_ACCESS_TOKEN
  if (!token) return {}
  const authClient = new OAuth2Client()
  authClient.setCredentials({ access_token: token })
  return { authClient }
}

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:3001',
  cors: [process.env.SITE_URL || 'http://localhost:4321'],
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Gençliğin Yüzleri Paneli' },
    dateFormat: 'd MMMM yyyy HH:mm',
  },
  i18n: {
    supportedLanguages: { tr },
    fallbackLanguage: 'tr',
  },
  collections: [Duyurular, Belgeler, Donemler, Media, Users],
  globals: [SiteAyarlari],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Yeni sürüm deploy edildiğinde veritabanı şeması otomatik güncellenir.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    gcsStorage({
      enabled: Boolean(bucket),
      // Şema yerelde ve üretimde aynı kalsın (migration'lar için).
      alwaysInsertFields: true,
      // Dosyalar doğrudan herkese açık bucket adresinden servis edilir (hızlı, önbelleklenebilir).
      collections: {
        media: { disablePayloadAccessControl: true },
        belgeler: { disablePayloadAccessControl: true },
      },
      bucket: bucket ?? '',
      options: gcsAuth(),
    }),
  ],
})
