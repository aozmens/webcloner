# Teknosem — bekleyen içerik ve kararlar

Kod tarafındaki karşılıkları: `src/components/sites/teknosem/product-overrides.ts` (ürün istisnaları),
`content.ts` → `corrections` (metin düzeltmeleri), `site-config.ts` (yayın ayarları).

## Gerçek içerik bekleniyor
- [ ] **TY-2000 görselleri** — kaynaktaki 6 görsel TY-1000 dosyalarıydı (üzerinde "TY-1000" yazıyor). Şu an geçici görsel (`public/sites/teknosem/gecici/ty-2000.webp`) gösteriliyor. Gerçek görseller gelince `product-overrides.ts` içindeki `ty-2000.images` kaldırılır.
- [ ] **TK-7 kılavuzu** — kaynakta TK-7 sayfasında TK-5_V1.5.pdf vardı; buton gizli. TK-7 PDF'i gelince `dokumanlar/` altına eklenip `tk-7.documents` güncellenir.
- [ ] **TRU-50-1 teknik tablosu** — kaynaktaki tablo TY-700 değerlerini içeriyordu; sekme gizli (`tru-50-1.hideSpecs`). Doğru değerler gelince tablo eklenir.
- [ ] **Nozzle başlıkları** (TNH-103, TNH-52, TNH-28, TNH-14, Özel Tasarım) — aynı 4 görseli farklı sırayla ve birebir aynı açıklamayı kullanıyor. Şimdilik olduğu gibi.
- [ ] **TY-1000 kılavuzu** — V1.12 kullanılıyor, güncel sürüm teyit edilecek. İndirmeler listesi ürün verisinden üretildiği için TY-1000_V1.11'e link verilmiyor.
- [ ] **VAKUSEM A-1001 kılavuz sürümü** — yalnızca A-1001_V1.11 dosyası var; kaynağın İndirmeler sayfası V1.12'yi de listeliyordu. Sürüm teyit edilecek.

## Karar bekleyen
- [ ] **Yıl bilgisi (30 / 31)** — ana sayfada "30 Yıllık" (kaynak ana sayfa metni), Hakkımızda'da "31 yıllık". Seçilen sayı her yere uygulanacak.
- [ ] **YouTube** — footer'daki hangi sosyal medyanın yerine geçeceği ve gerçek kanal adresi.
- [ ] **Yayın şekli** — kök / alt alan adı / `/robotik`. `NEXT_PUBLIC_TEKNOSEM_BASE_PATH` ve `NEXT_PUBLIC_TEKNOSEM_SITE_URL` ile ayarlanır; alan adı verilince canonical ve paylaşım görselleri otomatik açılır.
- [ ] **Git geçmişindeki orijinal görseller** — WebP dönüşümünden önceki JPG/PNG'ler ilk commit'te duruyor (paket ≈106 MB). İstenirse geçmişten temizlenebilir.

## Ortak kullanılan görseller (şimdilik bilinçli olarak bırakıldı)
- `polisaj-2.jpg` → Robotik Polisaj, Robotik Zımpara, TPM-1000
- `zimpara-hucresi` → TGM-1000, TGM-1000 Double Task
- `basik-2.jpg` → iLW-Cell, iLW-Desk
- TK-7'nin 6 görselinden 5'i TK-5 ile aynı (olduğu gibi kalacak)
