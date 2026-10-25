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

Adresler:
- Site: https://gencliginyuzleri.org (www de açılır)
- Panel: https://panel.gencliginyuzleri.org/admin
- Cloud Run'ın kendi adresleri de çalışmaya devam eder (site, panele bu adresten bağlanır):
  - https://gencligin-yuzleri-145244747694.europe-west1.run.app
  - https://gencligin-yuzleri-panel-145244747694.europe-west1.run.app

DNS hosting.com.tr'de. Kök alan adı Google'ın A/AAAA adreslerine, `www` ve `panel` CNAME ile
`ghs.googlehosted.com`'a gider. E-posta kayıtları (`mail`, MX, SPF, DKIM, DMARC) eski sunucuda kalır.

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
  - **Gönüllülük** sekmesi: "Başvurular açık" kutucuğu, başvuru formu bağlantısı, kısa not. Kapalıyken `/gonullu-ol` sayfası Instagram'a yönlendirir.
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
