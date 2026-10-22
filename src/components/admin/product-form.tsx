"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";
import { saveProduct, type ProductInput } from "./actions/products";
import { RichEditor } from "./rich-editor";
import { slugify } from "./slug";
import { buttonClass, Card, Field, inputClass, Notice } from "./ui";
import { useAction } from "./use-action";

export type GroupOption = { id: string; title: string; category: string };

/** Add / remove / reorder rows of a small repeating list (spec rows, FAQ entries, videos). */
function Rows<T>({ items, onChange, blank, render, addLabel }: { items: T[]; onChange: (items: T[]) => void; blank: T; render: (item: T, update: (item: T) => void, index: number) => ReactNode; addLabel: string }) {
  const move = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-2">
          <div className="min-w-0 flex-1">{render(item, (value) => onChange(items.map((current, i) => (i === index ? value : current))), index)}</div>
          <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
            <button type="button" className={buttonClass.icon} disabled={index === 0} onClick={() => move(index, index - 1)} aria-label="Yukarı taşı">
              <ArrowUp aria-hidden />
            </button>
            <button type="button" className={buttonClass.icon} disabled={index === items.length - 1} onClick={() => move(index, index + 1)} aria-label="Aşağı taşı">
              <ArrowDown aria-hidden />
            </button>
            <button type="button" className={buttonClass.icon} onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="Satırı kaldır">
              <Trash2 aria-hidden />
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={buttonClass.secondary} onClick={() => onChange([...items, blank])}>
        <Plus aria-hidden /> {addLabel}
      </button>
    </div>
  );
}

export function ProductForm({ initial, groups }: { initial: ProductInput; groups: GroupOption[] }) {
  const router = useRouter();
  const action = useAction();
  const [product, setProduct] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setProduct((current) => ({ ...current, [key]: value }));

  const categories = [...new Set(groups.map((group) => group.category))];

  const submit = async () => {
    const result = await action.run(() => saveProduct(product), product.id ? "Ürün kaydedildi. Site güncellendi." : undefined);
    if (result.ok && !product.id && result.data) router.push(`${ADMIN_PATH}/urunler/${result.data.id}?yeni=1`);
    else if (result.ok) router.refresh();
  };

  return (
    <form
      className="space-y-6 pb-24"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <Card title="Temel bilgiler">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ürün adı" className="sm:col-span-2">
            <input
              className={inputClass}
              required
              value={product.name}
              onChange={(event) => setProduct((current) => ({ ...current, name: event.target.value, slug: slugTouched ? current.slug : slugify(event.target.value) }))}
            />
          </Field>
          <Field label="Menüdeki kısa ad" hint="Menüde ve ürün kartlarında görünür (ör. TY-1000). Boşsa ürün adı kullanılır.">
            <input className={inputClass} value={product.shortName} onChange={(event) => set("shortName", event.target.value)} />
          </Field>
          <Field label="Adres" hint={`Sayfa adresi: /urun/${product.slug || "…"} — Değiştirirseniz eski bağlantılar çalışmaz.`}>
            <input
              className={inputClass}
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              value={product.slug}
              onChange={(event) => {
                setSlugTouched(true);
                set("slug", event.target.value);
              }}
            />
          </Field>
          <Field label="Grup">
            <select className={inputClass} required value={product.groupId} onChange={(event) => set("groupId", event.target.value)}>
              <option value="">Seçin…</option>
              {categories.map((category) => (
                <optgroup key={category} label={category}>
                  {groups
                    .filter((group) => group.category === category)
                    .map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.title}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end py-2 text-sm font-medium">
            <input type="checkbox" className="size-4" checked={product.published} onChange={(event) => set("published", event.target.checked)} />
            Yayında (sitede görünsün)
          </label>
          <Field label="Kısa açıklama" hint="Ürün sayfasının üst kısmında, menüde ve aramada görünür." className="sm:col-span-2">
            <textarea className={`${inputClass} min-h-28`} value={product.shortDescription} onChange={(event) => set("shortDescription", event.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Açıklama" description="Ürün sayfasındaki “Açıklama” sekmesi.">
        <RichEditor label="Ürün açıklaması" value={product.descriptionHtml} onChange={(html) => set("descriptionHtml", html)} />
      </Card>

      <Card title="Teknik detaylar" description="“Teknik Detaylar” sekmesindeki tablo. Değeri boş bırakılan satır, tabloda ara başlık olarak görünür. Hiç satır yoksa sekme gösterilmez.">
        <Rows
          items={product.specs}
          onChange={(specs) => set("specs", specs)}
          blank={{ label: "", value: "" }}
          addLabel="Satır ekle"
          render={(row, update) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={inputClass} placeholder="Özellik (ör. Ağırlık)" aria-label="Özellik" value={row.label} onChange={(event) => update({ ...row, label: event.target.value })} />
              <input className={inputClass} placeholder="Değer (ör. 120 kg)" aria-label="Değer" value={row.value} onChange={(event) => update({ ...row, value: event.target.value })} />
            </div>
          )}
        />
      </Card>

      <Card title="Sıkça sorulan sorular">
        <Field label="Bölüm başlığı" className="mb-4">
          <input className={inputClass} value={product.faqTitle} onChange={(event) => set("faqTitle", event.target.value)} />
        </Field>
        <Rows
          items={product.faq}
          onChange={(faq) => set("faq", faq)}
          blank={{ question: "", answer: "" }}
          addLabel="Soru ekle"
          render={(item, update) => (
            <div className="space-y-2">
              <input className={inputClass} placeholder="Soru" aria-label="Soru" value={item.question} onChange={(event) => update({ ...item, question: event.target.value })} />
              <textarea className={`${inputClass} min-h-20`} placeholder="Cevap" aria-label="Cevap" value={item.answer} onChange={(event) => update({ ...item, answer: event.target.value })} />
            </div>
          )}
        />
      </Card>

      <Card title="Videolar" description="YouTube bağlantıları (ör. https://www.youtube.com/watch?v=…). “Video” sekmesinde gösterilir.">
        <Rows
          items={product.videos}
          onChange={(videos) => set("videos", videos)}
          blank=""
          addLabel="Video ekle"
          render={(url, update) => <input className={inputClass} type="url" placeholder="https://www.youtube.com/watch?v=…" aria-label="YouTube bağlantısı" value={url} onChange={(event) => update(event.target.value)} />}
        />
      </Card>

      <Card title="Arama motoru (SEO)" description="Boş bırakırsanız ürün adı ve kısa açıklama kullanılır.">
        <div className="grid gap-4">
          <Field label="Sayfa başlığı" hint={`${product.seoTitle.length} karakter (önerilen en fazla 60)`}>
            <input className={inputClass} placeholder={`${product.name || "Ürün adı"} - Teknosem`} value={product.seoTitle} onChange={(event) => set("seoTitle", event.target.value)} />
          </Field>
          <Field label="Açıklama" hint={`${product.seoDescription.length} karakter (önerilen en fazla 160)`}>
            <textarea className={`${inputClass} min-h-20`} value={product.seoDescription} onChange={(event) => set("seoDescription", event.target.value)} />
          </Field>
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <button type="submit" className={buttonClass.primary} disabled={action.pending}>
            {action.pending ? "Kaydediliyor…" : product.id ? "Kaydet" : "Ürünü oluştur"}
          </button>
          {action.message && (
            <div className="min-w-0 flex-1">
              <Notice tone={action.message.tone}>{action.message.text}</Notice>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
