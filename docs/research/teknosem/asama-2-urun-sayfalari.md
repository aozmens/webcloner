# Teknosem — Aşama 2: Ürün detay sayfaları

- Rota: `src/app/urun/[slug]/page.tsx` → 29 sayfa, `generateStaticParams` ile statik üretilir; bilinmeyen adres 404.
- Şablon: `product-page.tsx` (galeri, özet, sekmeler, SSS, aynı gruptaki ürünler, "Uzmanlarımıza Danışın").
- Sekme metinleri `product-markdown.tsx` ile dönüştürülür (başlık, paragraf, liste, tablo, 4 farklı SSS biçimi).
- Stil: `product.css` (yalnızca ürün rotasında yüklenir).

## 301 yönlendirme tablosu (`slugs.ts` → `next.config.ts`)
Eski adres hem sondaki "/" ile hem onsuz tek adımda 301 verir (`skipTrailingSlashRedirect` + genel "/" temizleme kuralı).

| Eski adres | Yeni adres |
|---|---|
| `/robotik/urun/ilw-cell-hucre-tipi-robotik-lazer-kaynak-sistemi/` | `/urun/ilw-cell` |
| `/robotik/urun/ilw-desk-masa-tipi-lazer-kaynak/` | `/urun/ilw-desk` |
| `/robotik/urun/ilc-cell-hucre-tip-robotik-lazer-sistemi/` | `/urun/ilc-cell` |
| `/robotik/urun/ilc-desk-6-ekseni-robotik-lazer-kesim-sistemi/` | `/urun/ilc-desk` |
| `/robotik/urun/ty-700-multi-axis-spreyleme-unitesi/` | `/urun/ty-700-multi-axis` |
| `/robotik/urun/spreyleme-makinesi-nozzle-basliginizi-siz-olusturun/` | `/urun/nozzle-basliginizi-siz-olusturun` |
| `/robotik/urun/tnd-4-spreyleme-makinesi-doner-govde-nozzle-basligi/` | `/urun/tnd-4` |
| `/robotik/urun/ozel-tasarim-spreyleme-makinesi-nozzle-basligi/` | `/urun/ozel-tasarim-nozzle-basligi` |
| `/robotik/urun/tnh-103-spreyleme-makinesi-nozzle-basligi/` | `/urun/tnh-103` |
| `/robotik/urun/tnh-52-spreyleme-makinesi-nozzle-basligi/` | `/urun/tnh-52` |
| `/robotik/urun/tnh-28-spreyleme-makinesi-nozzle-basligi/` | `/urun/tnh-28` |
| `/robotik/urun/tnh-14-spreyleme-makinesi-nozzle-basligi/` | `/urun/tnh-14` |
| `/robotik/urun/tgm-2000-zimpara-makinesi/` | `/urun/tgm-2000` |
| `/robotik/urun/tgm-1000-double-task-zimpara-makinesi/` | `/urun/tgm-1000-double-task` |
| `/robotik/urun/tru-13-robotik-batarya-askilama-hucresi/` | `/urun/tru-13` |
| `/robotik/urun/vakusem-a-2004/` | `/urun/vakusem-a-2004` |
| `/robotik/urun/ty-700-spreyleme-unitesi/` | `/urun/ty-700` |
| `/robotik/urun/ty-2000-spreyleme-unitesi/` | `/urun/ty-2000` |
| `/robotik/urun/tru-50-3-parca-alma-spreyleme-ve-insert-uygulamasi/` | `/urun/tru-50-3` |
| `/robotik/urun/tru-50-2-parca-alma-ve-spreyleme-uygulamasi/` | `/urun/tru-50-2` |
| `/robotik/urun/teknosem-tk-7-otomatik-kepce-kopya/` | `/urun/tk-7` |
| `/robotik/urun/tpm-1000-polisaj-makinesi/` | `/urun/tpm-1000` |
| `/robotik/urun/tgm-1000-zimpara-makinesi/` | `/urun/tgm-1000` |
| `/robotik/urun/tpu-8-robotik-polisaj-uygulamasi/` | `/urun/robotik-polisaj` |
| `/robotik/urun/robotik-zimpara-sistemi/` | `/urun/robotik-zimpara` |
| `/robotik/urun/tru-50-1-parca-alma-uygulamasity-700/` | `/urun/tru-50-1` |
| `/robotik/urun/tk-5/` | `/urun/tk-5` |
| `/robotik/urun/ty-1000/` | `/urun/ty-1000` |
| `/robotik/urun/a-1001/` | `/urun/vakusem-a-1001` |

## Gövde metninde uygulanan ek düzeltmeler
- TY-700: "TY-1000 Kalıp Yağlama Sistemi" ve "sayesinde, TY-1000 üretim hızını" → TY-700
- TY-2000: "TY-1000, dinamik hatları" ve "TY-1000 Kalıp Yağlama Sistemi" → TY-2000
- Kısa açıklama düzeltmeleri SEO açıklamasına da uygulanır.

## Güncelleme — menü ve yayın ayarları
- Tablo artık `slugs.ts` → `legacyRedirects()` ile üretiliyor ve şunları da kapsıyor: İngilizce ürün adresleri (`/robotik/en/urun/...`, Robotik Zımpara için `/robotik/en/urun-zimpara-sistemi/`), eski kategori adresleri (`/robotik/urun-kategorisi/...` → `/urunler/<kategori>#<grup>`), `?urun-kategorisi=` filtreli liste sayfaları ve `/robotik/urunler-teknosem/`, `/robotik/kurumsal-teknosem-2/`.
- Yayın şekli `NEXT_PUBLIC_TEKNOSEM_BASE_PATH` ile seçilir. `/robotik` altında yayında eski adreslerin öneki düşer; yalnızca sondaki "/" farkı olanlar (TY-1000, TK-5, VAKUSEM A-2004) genel "/" kuralıyla 301 alır.
- Katalog yapısı tek dosyada: `catalog.ts` (menü, mega panel, `/urunler`, footer, arama ve kategori yönlendirmeleri).
