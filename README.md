# gencliginyuzleri.org

| Klasör | Ne |
|---|---|
| `site/` | Web sitesi (Astro, sunucu modunda). Google Cloud Run'da çalışır. |
| `studio/` | Yönetim paneli (Sanity Studio). `gencliginyuzleri.sanity.studio` adresinde yayınlanır. |
| `seed/` | sosyaliklim.org'dan taşınan ilk içeriği Sanity'ye aktaran betik. |

Site içeriği her istekte Sanity'den okunur (60 sn önbellek). Panelden yayınlanan bir değişiklik
en geç bir dakika içinde sitede görünür; yeniden derleme gerekmez.
`SANITY_PROJECT_ID` tanımlı değilse site `site/src/data/seed.json` içeriğiyle çalışır.

Node 24 gerekir (`.nvmrc`).

## Yerelde çalıştırma

```bash
cd site && npm install && npm run dev      # http://localhost:4321
cd studio && npm install && npm run dev    # http://localhost:3333
```

## İlk kurulum (bir kez)

1. **Sanity projesi:** `cd studio && npx sanity login`, sonra `npx sanity projects create "Gençliğin Yüzleri"`.
   Çıkan proje kimliğini `studio/.env` dosyasına `SANITY_STUDIO_PROJECT_ID=...` olarak yazın.
   `npx sanity dataset create production --visibility public`
2. **İçeriği aktar:** `cd studio && npm run import-seed` (PDF'ler ve fotoğraflar dahil).
3. **Paneli yayınla:** `cd studio && npm run deploy` → https://gencliginyuzleri.sanity.studio
4. **CORS:** `npx sanity cors add https://gencliginyuzleri.org`
5. **Kullanıcılar:** sanity.io/manage → proje → Members üzerinden davet edilir.
   İçerik ekibine **Editor** rolü yeterli.

## Yayına alma (Google Cloud Run)

```bash
cd site && ./deploy.sh <gcp-proje-id> <sanity-proje-id>
```

Alan adı: Cloud Run → Domain mappings → `gencliginyuzleri.org` ve `www` eklenir;
verilen DNS kayıtları alan adı yöneticisine girilir. SSL sertifikası otomatik gelir.

## Panelde ne var?

- **Site Ayarları:** slogan, giriş fotoğrafları, sayaçlar, hakkımızda metni, iletişim, sosyal medya
- **Duyurular:** başlık, tarih, kategori, kapak görseli, zengin metin
- **Politika Belgeleri:** PDF yükleme, kapak görseli, dönem ve sıra
- **Dönemler:** dönem açıklaması, şehirler, faaliyet kartları, öne çıkan çıktı
