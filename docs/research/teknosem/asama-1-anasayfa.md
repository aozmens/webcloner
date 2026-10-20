# Teknosem — Aşama 1: Ana sayfa

Kaynak içerik: `docs/teknosem-icerik` (salt okunur). Veri ve görseller `node scripts/teknosem/build-content.mjs` ile üretilir:
`src/components/sites/teknosem/content/{products,media}.json` ve `public/sites/teknosem/`.

## Bölüm eşleşmesi
| Referans bölüm | Teknosem bileşeni | İçerik |
|---|---|---|
| Hero carousel | `HeroSection` | TY-1000, TRU-13 (KATALOG görseli TRU-13 hücresiyle görsel olarak eşleşti), iLC-Cell, TK-5; metin = kısa açıklamanın ilk cümlesi |
| Advanced Autonomy | `ReasonsSection` | Neden TEKNOSEM? (4 madde; "Etkili Kurumsal Çözümler" metni garantiyle aynı olduğu için çıkarıldı) |
| Redefining Robotics | `StrengthsSection` | "Teknosem – Yüksek Teknoloji…" + Hakkımızda girişi + 3 kart |
| Targeted Inspections | `ProductsSection` | Ürünlerimiz: 3 kategori adımı, her birinde bir ürün |
| (yeni) | `ReferencesStrip` | İlk 12 referans logosu, kayan şerit |
| Step into the Future | `ExpertSection` | Doğru Çözümler için Uzman Dokunuşu |

## Uygulanan düzeltmeler (`content.ts` → `corrections`)
- TY-700 Multi Axis / TY-700 / TY-2000 kısa açıklamalarında "TY-1000, her döküm" → doğru model
- TGM-2000 "TGM-1000 modeli" → "TGM-2000 modeli"; TPM-1000 "TGM-1000 Polisaj Makinesi" → "TPM-1000 Polisaj Makinesi"
- Uzman bölümü: "yada" → "ya da"

## Teknik notlar
- `teknosem-adaptation.css` → `@import "./teknosem.css"` ile temeli içeri alır; layout yalnızca adaptation dosyasını yükler (iki ayrı import'ta sıra garanti değildi).
- Turbopack, `@import` zincirindeki CSS değişikliklerini her zaman canlı yansıtmıyor; CSS düzenledikten sonra geliştirme sunucusunu yeniden başlatın.
- Ürün ve kurumsal linkler şimdilik teknosem.com.tr'ye gider (`productHref`, `pages`); aşama 2-3'te yerel rotalara çevrilecek.
