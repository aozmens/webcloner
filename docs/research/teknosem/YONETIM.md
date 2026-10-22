# Teknosem Robotik — yönetim paneli

Panel adresi: `/yonetim` (giriş: `/yonetim/giris`). Arama motorlarına kapalıdır (`noindex`, robots.txt).

## Yapı
- **Veri:** Supabase (`teknosem-robotik` projesi, Frankfurt). Şema `supabase/migrations/` altında; yeni bir projede bu dosyalar sırayla çalıştırılarak aynı yapı kurulur.
- **Dosyalar:** Supabase Storage, `media` bucket'ı (herkese açık okuma). Klasörler: `urunler/<ürün>/`, `dokumanlar/<ürün>/`, `referanslar/`, `anasayfa/`.
- **Yetki:** Giriş Supabase Auth (e-posta + şifre). Yalnızca `admin_users` tablosundaki hesaplar panele girebilir. Bütün tablolarda RLS açık:
  ziyaretçi yalnızca yayındaki kayıtları okur, yazma yalnızca admin; form başvurularını ziyaretçi yalnızca ekleyebilir, okuyamaz.
- **Önbellek:** Site sayfaları statik üretilir. Panelde her kayıttan sonra veriler ve sayfalar yeniden üretilir (`updateTag` + `revalidatePath`), değişiklik hemen görünür.

| Panel sekmesi | Ne düzenlenir | Tablo |
|---|---|---|
| Ürünler | ad, adres, grup, sıra, kısa açıklama, açıklama (görsel editör), teknik detaylar, SSS, videolar, yayında mı, SEO, görseller | `products`, `product_images` |
| Kategoriler | kategori ve gruplar, sıraları, görünürlük | `categories`, `groups` |
| İndirmeler | PDF kılavuzlar ve sürümleri | `downloads` |
| Ana Sayfa | hero slaytları, "Neden TEKNOSEM?", kartlar, "Ürünlerimiz" | `site_settings` |
| Kurumsal | iletişim bilgileri, Hakkımızda, Hizmetler, KVKK | `site_settings` |
| Referanslar | logolar, sıraları, görünürlük | `reference_logos` |
| Başvurular | form kayıtları, durum (yeni / görüldü / tamamlandı), not | `submissions` |

## Kurallar
- **Görseller:** Yüklenirken WebP'ye çevrilir. En uzun kenar ürünlerde 1800 px, slaytlarda 2560 px, logolarda 480 px ile sınırlanır. Tarayıcı önce küçültür; sunucu sonra kesin olarak dönüştürür.
- **PDF:** Tarayıcıdan doğrudan Storage'a yüklenir (en fazla 50 MB). Boyut, yüklemeden sonra Storage'dan okunur.
  Ürün sayfasında, ürünün tarihi en yeni olan yayındaki sürümü görünür. İndirmeler sayfasında "Sitede" işaretli bütün dosyalar listelenir.
- **Silme:** Her silme işlemi onay ister. Ürün silinince görselleri de silinir. Ürüne bağlı kılavuzlar silinmez, "ürüne bağlı değil" olarak İndirmeler'de kalır.
- **Formlar:** Başvuru önce kaydedilir, sonra ziyaretçi hazır mesajla WhatsApp'a yönlendirilir. Gizli bir alan (honeypot) vardır.
  IP başına saatte en fazla 5 gönderim yapılabilir. IP adresi saklanmaz, yalnızca anahtarlı özeti (HMAC) tutulur.
- **"{yıl}":** Ana sayfa ve Hakkımızda metinlerinde `{yıl}` yazan yere, Kurumsal › İletişim bilgilerindeki tecrübe yılı gelir.

## İlk kurulum
1. Migration'ları uygulayın (`supabase/migrations/`, dosya adı sırasıyla).
2. `.env.local` dosyasına `SUPABASE_SERVICE_ROLE_KEY` değerini girin (Supabase → Project Settings → API Keys → secret).
3. Mevcut içeriği aktarın:
   ```
   npx tsx --env-file=.env.local scripts/teknosem/import-to-supabase.mts
   ```
   Betik tekrar çalıştırılabilir; kayıtlar kısa ad veya dosya yoluyla eşleştirildiği için veri çiftlenmez.
   Var olan kayıtlara dokunmaz, böylece panelde yapılan değişiklikler korunur. Var olanların üzerine yazmak için sona `--guncelle` ekleyin.

## İlk yönetici
1. Supabase → **Authentication → Users → Add user → Create new user**. E-posta ve şifre girin, **Auto Confirm User** işaretli olsun.
2. Supabase → **SQL Editor**'de şunu çalıştırın (e-postayı değiştirin):
   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'yonetici@ornek.com';
   ```
3. `/yonetim/giris` adresinden giriş yapın.
4. Önerilen: **Authentication → Sign In / Providers → "Allow new users to sign up"** kapatın. Kayıt olan biri `admin_users` tablosunda olmadığı için panele zaten giremez, ama gereksiz hesap açılmasının önüne geçer.

Yetkiyi geri almak için: `delete from public.admin_users where email = '...';`
Şifre sıfırlamak için: Authentication → Users → kullanıcı → "Send password recovery" ya da kullanıcıyı silip yeniden oluşturun.

## Vercel
Ortam değişkenlerinin dördü de gerekli. `SUPABASE_SERVICE_ROLE_KEY` form kaydı için gerekir ve yalnızca sunucuda kullanılır.
