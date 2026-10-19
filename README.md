# gencliginyuzleri.org

| Klasör | Ne |
|---|---|
| `site/` | Web sitesi (Astro). Cloud Run servisi `gencligin-yuzleri`. |
| `cms/` | Yönetim paneli (Payload CMS, açık kaynak). Cloud Run servisi `gencligin-yuzleri-panel`. |

Her şey Google Cloud projesi `gencligin-yuzleri` içinde, bölge `europe-west1`:

- **Veritabanı:** Cloud SQL Postgres 16, instance `gy-db`, veritabanı `payload` (günlük yedek 03:00)
- **Dosyalar:** Cloud Storage bucket `gencligin-yuzleri-dosyalar` (herkese açık okuma)
- **Gizli bilgiler:** Secret Manager → `cms-database-url`, `cms-payload-secret`
- **Panel servis hesabı:** `gy-cms@gencligin-yuzleri.iam.gserviceaccount.com`

Geçici adresler:
- Site: https://gencligin-yuzleri-145244747694.europe-west1.run.app
- Panel: https://gencligin-yuzleri-panel-145244747694.europe-west1.run.app/admin

Site içeriği panelin REST API'sinden okur (60 sn önbellek). Panelde "Yayınla" denen
içerik en geç bir dakikada sitede görünür. `CMS_URL` tanımlı değilse site
`site/src/data/seed.json` ile çalışır.

## Diller

Site Türkçe (`/`) ve İngilizce (`/en`, `/en/documents`, `/en/news`, `/en/blog`) yayınlanır.
- **İçerik:** paneldeki her kaydın üstünde Türkçe / English seçici var. İngilizcesi girilmemiş alanlarda Türkçe metin gösterilir.
- **Arayüz metinleri** (menü, düğmeler, sabit başlıklar): `site/src/i18n.ts`.
- Duyuru ve blog yazılarında bağlantı adresi (slug) iki dilde aynıdır: `/duyurular/x` ↔ `/en/news/x`, `/blog/x` ↔ `/en/blog/x`.
- İlk İngilizce içerik `cms/src/seed-en.ts` ile girildi (bir kez çalıştırılır).

## Panel

- **Duyurular:** taslak / yayın akışı, kapak görseli, zengin metin
- **Blog Yazıları:** yazar, kategori, özet, kapak, zengin metin; okuma süresi otomatik. Sitede `/blog` ve `/en/blog`
- **Politika Belgeleri:** PDF yükleme, kapak, dönem, sıra
- **Dönemler:** açıklama, şehirler, faaliyet kartları, öne çıkan çıktı
- **Görseller:** tüm fotoğraflar (otomatik webp ve boyutlandırma)
- **Site Ayarları:** slogan, giriş fotoğrafları, sayaçlar, hakkımızda, iletişim
- **Kullanıcılar:** yalnızca Yönetici rolü görür; kullanıcı ekler/siler. Editör sadece içerik girer.

## Yerelde çalıştırma (Node 24)

```bash
# Postgres: createdb gencligin_yuzleri
cd cms && cp .env.example .env && npm install && npm run dev   # http://localhost:3001/admin
npm run seed                                                    # ilk içerik
cd site && CMS_URL=http://localhost:3001 npm run dev            # http://localhost:4321
```

## Şema değişikliği (alan ekleme vb.)

```bash
cd cms && npm run migrate:create -- kisa_aciklama   # migration'ı her zaman bu komutla üretin
```
Oluşan dosyayı commit'leyin; panel deploy edildiğinde açılışta otomatik uygulanır.

## Deploy

```bash
cd cms && gcloud run deploy gencligin-yuzleri-panel --project gencligin-yuzleri --region europe-west1 --source .
cd site && ./deploy.sh gencligin-yuzleri https://<panel-adresi>
```

## Üretim veritabanına yerelden bağlanma

```bash
cloud-sql-proxy --token "$(gcloud auth print-access-token)" --port 5545 gencligin-yuzleri:europe-west1:gy-db
```
