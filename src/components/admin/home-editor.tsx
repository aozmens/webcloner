"use client";

/* eslint-disable @next/next/no-img-element -- panel previews */
import { ImagePlus, Plus } from "lucide-react";
import { useState } from "react";
import type { HeroSlide, Settings } from "@/components/sites/teknosem/settings";
import { uploadSlideImage } from "./actions/content";
import { shrinkImage } from "./resize-image";
import { IconCardsEditor, ListControls, moveItem, SettingsForm, TextArea, TextInput, YEARS_HINT } from "./settings-form";
import { buttonClass, Field, inputClass, Notice } from "./ui";

export type ProductChoice = { slug: string; name: string; images: string[] };

function ProductSelect({ value, products, onChange }: { value: string; products: ProductChoice[]; onChange: (slug: string) => void }) {
  return (
    <Field label="Ürün" hint="Başlık, kısa açıklama ve “İncele” bağlantısı bu üründen gelir.">
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {!products.some((p) => p.slug === value) && <option value={value}>{value ? `${value} (bulunamadı)` : "Seçin…"}</option>}
        {products.map((product) => (
          <option key={product.slug} value={product.slug}>
            {product.name}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Picks one of the product's images by number. */
function ProductImagePicker({ product, value, onChange }: { product?: ProductChoice; value: number; onChange: (index: number) => void }) {
  if (!product || product.images.length === 0) return <p className="text-sm text-neutral-500">Bu ürünün görseli yok.</p>;
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Ürün görseli">
      {product.images.map((src, index) => (
        <button
          key={src}
          type="button"
          role="radio"
          aria-checked={value === index}
          aria-label={`Görsel ${index + 1}`}
          onClick={() => onChange(index)}
          className={`size-20 overflow-hidden rounded border-2 bg-neutral-100 ${value === index ? "border-blue-600" : "border-transparent"}`}
        >
          <img src={src} alt="" className="size-full object-contain" loading="lazy" />
        </button>
      ))}
    </div>
  );
}

function SlideEditor({ slide, products, onChange }: { slide: HeroSlide; products: ProductChoice[]; onChange: (slide: HeroSlide) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const product = products.find((p) => p.slug === slide.productSlug);
  const ownImage = Boolean(slide.image.src);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.set("file", await shrinkImage(file, 2560));
    const result = await uploadSlideImage(form).catch(() => ({ ok: false as const, error: "Sunucuya ulaşılamadı." }));
    setUploading(false);
    if (!result.ok) return setError(result.error);
    if (result.data) onChange({ ...slide, image: { ...result.data, productImage: 0 } });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ProductSelect value={slide.productSlug} products={products} onChange={(productSlug) => onChange({ ...slide, productSlug })} />
      <TextInput label="Üst etiket" value={slide.eyebrow} onChange={(eyebrow) => onChange({ ...slide, eyebrow })} hint="Başlığın üstündeki küçük yazı." />
      <TextInput label="Alt gezinme adı" value={slide.step} onChange={(step) => onChange({ ...slide, step })} hint="Slayt altındaki düğmede görünür (ör. TY-1000)." />
      <Field label="Görsel yerleşimi">
        <select className={inputClass} value={slide.fit} onChange={(event) => onChange({ ...slide, fit: event.target.value })}>
          <option value="cover">Tam ekran (fotoğraf)</option>
          <option value="contain">Beyaz zemin üzerinde bütün (ürün görseli)</option>
        </select>
      </Field>
      <div className="space-y-2 sm:col-span-2">
        <p className="text-sm font-medium">Görsel</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={!ownImage} onChange={() => onChange({ ...slide, image: { src: "", width: 0, height: 0, productImage: slide.image.productImage } })} />
            Ürün görsellerinden seç
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={ownImage} onChange={() => !ownImage && setError("Kendi görselinizi kullanmak için aşağıdan bir dosya yükleyin.")} />
            Ayrı görsel yükle
          </label>
        </div>
        {ownImage ? (
          <div className="flex flex-wrap items-end gap-3">
            <img src={slide.image.src} alt="" className="h-28 rounded bg-neutral-100 object-contain" />
            <span className="text-xs text-neutral-500">
              {slide.image.width}×{slide.image.height}
            </span>
          </div>
        ) : (
          <ProductImagePicker product={product} value={slide.image.productImage} onChange={(productImage) => onChange({ ...slide, image: { ...slide.image, productImage } })} />
        )}
        <label className={`${buttonClass.secondary} cursor-pointer`}>
          <ImagePlus aria-hidden />
          {uploading ? "Yükleniyor…" : ownImage ? "Başka görsel yükle" : "Görsel yükle"}
          <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(event) => upload(event.target.files?.[0])} />
        </label>
        {error && <Notice tone="error">{error}</Notice>}
        {slide.fit === "cover" && (
          <TextInput
            label="Odak noktası (isteğe bağlı)"
            value={slide.position}
            onChange={(position) => onChange({ ...slide, position })}
            hint="Görsel kırpılırken ortada kalacak yer, yatay ve dikey yüzde olarak. Örnek: 50% 45%"
          />
        )}
      </div>
    </div>
  );
}

export function HomeEditor({ settings, products }: { settings: Settings; products: ProductChoice[] }) {
  return (
    <div className="space-y-6">
      <SettingsForm settingKey="hero" initial={settings.hero} title="Hero slaytları" description="Ana sayfanın en üstündeki kayan bölüm. Yayında olmayan ürünlerin slaytları gösterilmez.">
        {(hero, set) => (
          <div className="space-y-4">
            {hero.slides.map((slide, index) => (
              <div key={index} className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Slayt {index + 1}</span>
                  <ListControls
                    index={index}
                    count={hero.slides.length}
                    label={`Slayt ${index + 1}`}
                    onMove={(from, to) => set({ slides: moveItem(hero.slides, from, to) })}
                    onRemove={hero.slides.length > 1 ? () => set({ slides: hero.slides.filter((_, i) => i !== index) }) : undefined}
                  />
                </div>
                <SlideEditor slide={slide} products={products} onChange={(next) => set({ slides: hero.slides.map((s, i) => (i === index ? next : s)) })} />
              </div>
            ))}
            <button
              type="button"
              className={buttonClass.secondary}
              onClick={() =>
                set({
                  slides: [
                    ...hero.slides,
                    { productSlug: products[0]?.slug ?? "", eyebrow: "", step: "", image: { src: "", width: 0, height: 0, productImage: 0 }, fit: "contain", position: "" },
                  ],
                })
              }
            >
              <Plus aria-hidden /> Slayt ekle
            </button>
          </div>
        )}
      </SettingsForm>

      <SettingsForm settingKey="reasons" initial={settings.reasons} title="“Neden TEKNOSEM?” bölümü" description="Robot görselinin çevresindeki dört madde.">
        {(reasons, set) => (
          <>
            <TextInput label="Bölüm başlığı" value={reasons.title} onChange={(title) => set({ ...reasons, title })} />
            <IconCardsEditor cards={reasons.items} onChange={(items) => set({ ...reasons, items })} fixed />
          </>
        )}
      </SettingsForm>

      <SettingsForm settingKey="strengths" initial={settings.strengths} title="“Yüksek Teknoloji” bölümü ve kartlar" description={YEARS_HINT}>
        {(strengths, set) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Bölüm başlığı" value={strengths.title} onChange={(title) => set({ ...strengths, title })} />
              <TextInput label="Alt başlık" value={strengths.subtitle} onChange={(subtitle) => set({ ...strengths, subtitle })} />
              <TextInput label="Büyük yazı" value={strengths.heading} onChange={(heading) => set({ ...strengths, heading })} />
              <TextInput label="Slogan" value={strengths.tagline} onChange={(tagline) => set({ ...strengths, tagline })} />
            </div>
            <TextArea label="Metin" value={strengths.text} onChange={(text) => set({ ...strengths, text })} />
            <IconCardsEditor cards={strengths.cards} onChange={(cards) => set({ ...strengths, cards })} fixed />
          </>
        )}
      </SettingsForm>

      <SettingsForm settingKey="showcase" initial={settings.showcase} title="“Ürünlerimiz” bölümü" description="Kaydırdıkça değişen üç ürün kartı.">
        {(showcase, set) => (
          <>
            <TextInput label="Bölüm başlığı" value={showcase.title} onChange={(title) => set({ ...showcase, title })} />
            <TextArea label="Metin" rows={2} value={showcase.text} onChange={(text) => set({ ...showcase, text })} />
            {showcase.items.map((item, index) => {
              const update = (next: typeof item) => set({ ...showcase, items: showcase.items.map((current, i) => (i === index ? next : current)) });
              return (
                <div key={index} className="space-y-3 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Kart {index + 1}</span>
                    <ListControls index={index} count={showcase.items.length} label={`Kart ${index + 1}`} onMove={(from, to) => set({ ...showcase, items: moveItem(showcase.items, from, to) })} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextInput label="Kenar yazısı" value={item.step} onChange={(step) => update({ ...item, step })} />
                    <ProductSelect value={item.productSlug} products={products} onChange={(productSlug) => update({ ...item, productSlug, productImage: 0 })} />
                  </div>
                  <ProductImagePicker product={products.find((p) => p.slug === item.productSlug)} value={item.productImage} onChange={(productImage) => update({ ...item, productImage })} />
                </div>
              );
            })}
          </>
        )}
      </SettingsForm>
    </div>
  );
}
