# Teknosem Robotik — yayın notları

## Ortam değişkenleri
`.env.example` dosyasını `.env.local` olarak kopyalayıp doldurun (yerel). Vercel'de aynı anahtarları
Project → Settings → Environment Variables altına girin. Gerçek değerler git'e girmez (`.env*` yok sayılıyor).

| Değişken | Deneme (robotik.aoz-tech.com) | Canlı |
|---|---|---|
| `NEXT_PUBLIC_TEKNOSEM_SITE_URL` | `https://robotik.aoz-tech.com` | canlı alan adı |
| `NEXT_PUBLIC_TEKNOSEM_ALLOW_INDEXING` | `false` (Google'a kapalı) | `true` |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | aynı |
| `SUPABASE_SERVICE_ROLE_KEY` | yalnızca sunucu; `src/lib/server-env.ts` dışında okunmaz | aynı |

`NEXT_PUBLIC_*` değerleri build sırasında koda gömülür: değiştirdikten sonra Vercel'de yeniden deploy gerekir.

## Arama motorları
- İndeksleme kapalıyken: `robots.txt` her şeyi engeller, tüm sayfalarda `noindex` meta etiketi ve `X-Robots-Tag` başlığı var, sitemap boş.
- Açıkken: `robots.txt` yalnızca `/yonetim` ve `/api/` yollarını engeller, `sitemap.xml` 43 adres listeler.
- `/yonetim` ve `/api/` her durumda `X-Robots-Tag: noindex, nofollow` döner.

## Eski adresler (teknosem.com.tr/robotik/...)
Site kendi alan adının kökünde çalışır. Eski adresler ana sitenin sunucusuna gider; ana sunucu
`/robotik/*` isteklerini **yolu koruyarak** yeni alan adına yönlendirmelidir (ör. `teknosem.com.tr/robotik/urun/tk-5/`
→ `https://<yeni-alan>/robotik/urun/tk-5/`). Buradaki 301 tablosu (`slugs.ts`) gelen isteği yeni sayfaya çevirir
(`/robotik/urun/tk-5/` → `/urun/tk-5`).

## Vercel
1. Depoyu GitHub'a push edin ve Vercel'de "Import Project" ile seçin (Framework: Next.js, kök dizin: depo kökü).
2. Ortam değişkenlerini girin, deploy edin.
3. Domains → `robotik.aoz-tech.com` ekleyin; DNS'te `robotik` için Vercel'in gösterdiği CNAME kaydını oluşturun.
