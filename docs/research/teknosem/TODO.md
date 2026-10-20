# Teknosem — bekleyen içerik ve kararlar

Kod tarafındaki karşılıkları: `src/components/sites/teknosem/product-overrides.ts` (ürün istisnaları),
`content.ts` → `corrections` (metin düzeltmeleri), `site-config.ts` (yayın ayarları).

## Gerçek içerik bekleniyor
- [ ] **TY-2000 görselleri** — kaynaktaki 6 görsel TY-1000 dosyalarıydı (üzerinde "TY-1000" yazıyor). Şu an geçici görsel (`public/sites/teknosem/gecici/ty-2000.webp`) gösteriliyor. Gerçek görseller gelince `product-overrides.ts` içindeki `ty-2000.images` kaldırılır.
- [ ] **TK-7 kılavuzu** — TK-7'de PDF butonu yok. TK-7 PDF'i gelince arşivdeki TK-7 klasörüne konur, `build-content.mjs` → `UNPUBLISHED_DOCUMENTS` kaydı ve `tk-7.documents` kaldırılır, `tk-7.manual` (model/sürüm) eklenir.
- [ ] **TRU-50-1 teknik tablosu** — kaynaktaki tablo TY-700 değerlerini içeriyordu; sekme gizli (`tru-50-1.hideSpecs`). Doğru değerler gelince tablo eklenir.
- [ ] **Nozzle başlıkları** (TNH-103, TNH-52, TNH-28, TNH-14, Özel Tasarım) — aynı 4 görseli farklı sırayla ve birebir aynı açıklamayı kullanıyor. Şimdilik olduğu gibi.
- [ ] **TY-1000 kılavuzu** — V1.12 kullanılıyor, güncel sürüm teyit edilecek. İndirmeler listesi ürün verisinden üretildiği için TY-1000_V1.11'e link verilmiyor.
- [ ] **A-1001 V1.12 dosyası bekleniyor** — şu an A-1001_V1.11 listeleniyor (sitede "V1.11" yazıyor). Dosya gelince arşivdeki A-1001 klasörüne konur ve `vakusem-a-1001.manual` güncellenir.

## Belirsiz (PDF içeriğiyle doğrulanamadı — kendiliğinden karar verilmedi)
- [ ] **A-1001 sürüm etiketi — belirsiz** — dosya adı `A-1001_V1.11`, kılavuzun 28 sayfasının hepsinde "V1.1 – 14.03.2025" yazıyor. Sitede dosya adındaki V1.11 gösteriliyor; hangisinin doğru olduğu teyit edilecek.
- [ ] **TK-7 klasöründeki `TK-5_V1.5.pdf` — belirsiz** — TK-5 klasöründeki aynı adlı dosyadan farklı (46 sayfa / 3,7 MB, md5 ea64cf4f6b; TK-5 klasöründeki 50 sayfa / 5,3 MB, md5 e3835b3b4a). Kapakta "TK-5 · V1.5 – 14.03.2025" yazıyor, TK-7 hiç geçmiyor; ilk 17 sayfa aynı, 18. sayfadan sonraki elektrik şemaları farklı (farklı PLC/bağlantı düzeni). PDF oluşturma tarihi 14.03.2025 (TK-5 klasöründeki 08.05.2025). TK-5'in eski hali mi, adı güncellenmemiş TK-7 kılavuzu mu bilinmiyor; **yayınlanmıyor** (`build-content.mjs` → `UNPUBLISHED_DOCUMENTS`).

## Kılavuz doğrulama tablosu (PDF kapak ve alt bilgisinden)
| Dosya (arşiv klasörü) | Tespit edilen model | Sürüm (alt bilgi) | Boyut | Durum |
|---|---|---|---|---|
| TY-700-Multi-Axis_V1.1.pdf (TY-700 Multi Axis) | TY-700 Multi axis | V1.1 · 14.03.2025 | 9,0 MB | yayında |
| TY-700_V1.3.pdf (TY-700) | TY-700 | V1.3 · 06.05.2025 | 13,2 MB | yayında |
| TY-1000_V1.12.pdf (TY-1000) | TY-1000 | V1.12 · 09.05.2025 | 13,0 MB | yayında |
| A-2004_V1.1.pdf (VAKUSEM A-2004) | Vakusem A-2004 | V1.1 · 14.03.2025 | 8,6 MB | yayında |
| A-1001_V1.11.pdf (VAKUSEM A-1001) | Vakusem A-1001 | V1.1 (dosya adı V1.11) | 8,2 MB | yayında — sürüm belirsiz |
| TK-5_V1.5.pdf (TK-5) | TK-5 | V1.5 · 14.03.2025 | 5,3 MB | yayında (yalnızca TK-5) |
| TK-5_V1.5.pdf (TK-7) | TK-5 | V1.5 · 14.03.2025 | 3,7 MB | yayında değil — belirsiz |

Kaynağın İndirmeler sayfasında olup arşivde dosyası olmayanlar listeden çıkarıldı: A-1001_V1.12, TK-5_V1.4, TY-1000_V1.11, TY-700_V1.1, teknosem-001, teknosem-002.

## Karar bekleyen
- [x] **Yıl bilgisi** — 32 yıl (1994'ten beri) olarak karar verildi; `company.ts` → `experienceYears` sabitinden her yere (ana sayfa ×2, Hakkımızda) uygulanıyor. Her yıl elle güncellenmeli.
- [ ] **YouTube** — footer'daki hangi sosyal medyanın yerine geçeceği ve gerçek kanal adresi.
- [ ] **Yayın şekli** — kök / alt alan adı / `/robotik`. `NEXT_PUBLIC_TEKNOSEM_BASE_PATH` ve `NEXT_PUBLIC_TEKNOSEM_SITE_URL` ile ayarlanır; alan adı verilince canonical ve paylaşım görselleri otomatik açılır.
- [ ] **Git geçmişindeki eski klon varlıkları** — WebP öncesi görseller temizlendi (paket ≈69 MB). İlk commit'te silinmiş AI Robots varlıkları (≈20 MB) duruyor; istenirse onlar da temizlenebilir.

## Ortak kullanılan görseller (şimdilik bilinçli olarak bırakıldı)
- `polisaj-2.jpg` → Robotik Polisaj, Robotik Zımpara, TPM-1000
- `zimpara-hucresi` → TGM-1000, TGM-1000 Double Task
- `basik-2.jpg` → iLW-Cell, iLW-Desk
- TK-7'nin 6 görselinden 5'i TK-5 ile aynı (olduğu gibi kalacak)
