"use client";

import { ExternalLink, FileUp, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { MEDIA_BUCKET } from "@/lib/supabase/media";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { formatDate, formatSize } from "@/components/sites/teknosem/links";
import { createDownload, deleteDownload, discardUpload, setDownloadPublished, updateDownload, type DownloadInput } from "./actions/downloads";
import { slugify } from "./slug";
import { Badge, buttonClass, Card, Field, inputClass, Notice } from "./ui";
import { confirmDelete, useAction } from "./use-action";

const MAX_PDF_BYTES = 50 * 1024 * 1024;

export type PanelDownload = DownloadInput & { id: string; src: string; size: number; isCurrent: boolean };
export type ProductOption = { id: string; name: string; slug: string };

const emptyInput = (productId: string | null): DownloadInput => ({ productId, title: "", model: "", version: "", releaseDate: "", note: "", published: true });

function DownloadFields({ value, onChange, products }: { value: DownloadInput; onChange: (value: DownloadInput) => void; products: ProductOption[] }) {
  const set = <K extends keyof DownloadInput>(key: K, next: DownloadInput[K]) => onChange({ ...value, [key]: next });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Ürün" hint="Boş bırakılırsa yalnızca İndirmeler sayfasında listelenir.">
        <select className={inputClass} value={value.productId ?? ""} onChange={(event) => set("productId", event.target.value || null)}>
          <option value="">Ürüne bağlı değil</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Başlık" hint="Örnek: TY-1000 Kullanım Kılavuzu">
        <input className={inputClass} required value={value.title} onChange={(event) => set("title", event.target.value)} />
      </Field>
      <Field label="Model (kılavuz kapağındaki)">
        <input className={inputClass} value={value.model} onChange={(event) => set("model", event.target.value)} />
      </Field>
      <Field label="Sürüm" hint="Örnek: V1.12">
        <input className={inputClass} value={value.version} onChange={(event) => set("version", event.target.value)} />
      </Field>
      <Field label="Tarih" hint="En güncel sürüm bu tarihe göre belirlenir.">
        <input className={inputClass} type="date" value={value.releaseDate} onChange={(event) => set("releaseDate", event.target.value)} />
      </Field>
      <Field label="İç not" hint="Yalnızca panelde görünür.">
        <input className={inputClass} value={value.note} onChange={(event) => set("note", event.target.value)} />
      </Field>
      <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
        <input type="checkbox" className="size-4" checked={value.published} onChange={(event) => set("published", event.target.checked)} />
        Sitede göster
      </label>
    </div>
  );
}

function UploadForm({ products, defaultProduct, action }: { products: ProductOption[]; defaultProduct: string | null; action: ReturnType<typeof useAction> }) {
  const [file, setFile] = useState<File | null>(null);
  const [input, setInput] = useState(() => emptyInput(defaultProduct));
  const [uploading, setUploading] = useState(false);

  const submit = async () => {
    if (!file) return action.setMessage({ tone: "error", text: "Bir PDF dosyası seçin." });
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) return action.setMessage({ tone: "error", text: "Yalnızca PDF dosyası yüklenebilir." });
    if (file.size > MAX_PDF_BYTES) return action.setMessage({ tone: "error", text: "Dosya 50 MB'tan büyük olamaz." });

    setUploading(true);
    action.setMessage(null);
    const folder = products.find((product) => product.id === input.productId)?.slug ?? "genel";
    const name = `${slugify(file.name.replace(/\.pdf$/i, "")) || "dosya"}-${Date.now().toString(36)}.pdf`;
    const storagePath = `dokumanlar/${folder}/${name}`;
    const { error } = await createBrowserSupabase().storage.from(MEDIA_BUCKET).upload(storagePath, file, { contentType: "application/pdf", cacheControl: "31536000" });
    setUploading(false);
    if (error) {
      console.error(error);
      return action.setMessage({ tone: "error", text: "Dosya yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin; sorun sürerse yeniden giriş yapın." });
    }
    const result = await action.run(() => createDownload({ ...input, storagePath }), "Kılavuz yüklendi ve kaydedildi.");
    if (result.ok) {
      setFile(null);
      setInput(emptyInput(defaultProduct));
    } else {
      await discardUpload(storagePath);
    }
  };

  const busy = uploading || action.pending;
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <Field label="PDF dosyası" hint="En fazla 50 MB. Boyut otomatik hesaplanır.">
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-neutral-300 file:bg-white file:px-3 file:py-2 file:text-sm"
          onChange={(event) => {
            const chosen = event.target.files?.[0] ?? null;
            setFile(chosen);
            if (chosen && !input.title) {
              const base = chosen.name.replace(/\.pdf$/i, "");
              const [model, version] = base.split("_");
              setInput((current) => ({ ...current, model: current.model || model, version: current.version || version || "", title: `${model} Kullanım Kılavuzu` }));
            }
          }}
        />
      </Field>
      <DownloadFields value={input} onChange={setInput} products={products} />
      <button type="submit" className={buttonClass.primary} disabled={busy}>
        <FileUp aria-hidden />
        {uploading ? "Dosya yükleniyor…" : action.pending ? "Kaydediliyor…" : "Yükle ve kaydet"}
      </button>
    </form>
  );
}

function DownloadRow({ download, products, action }: { download: PanelDownload; products: ProductOption[]; action: ReturnType<typeof useAction> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DownloadInput>(download);
  const product = products.find((p) => p.id === download.productId);

  if (editing) {
    return (
      <li className="rounded-md border border-blue-200 bg-blue-50/40 p-3">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            action.run(() => updateDownload(download.id, draft), "Kaydedildi.").then((result) => result.ok && setEditing(false));
          }}
        >
          <DownloadFields value={draft} onChange={setDraft} products={products} />
          <div className="flex gap-2">
            <button type="submit" className={buttonClass.primary} disabled={action.pending}>
              Kaydet
            </button>
            <button type="button" className={buttonClass.secondary} onClick={() => setEditing(false)}>
              Vazgeç
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-md border border-neutral-200 bg-white p-3">
      <div className="min-w-0 flex-1 basis-56">
        <p className="font-medium">
          {download.title} {download.version && <span className="text-neutral-500">· {download.version}</span>}
        </p>
        <p className="text-xs text-neutral-500">
          {[product?.name ?? "Ürüne bağlı değil", formatDate(download.releaseDate || null), formatSize(download.size)].filter(Boolean).join(" · ")}
        </p>
        {download.note && <p className="mt-1 text-xs text-amber-700">Not: {download.note}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {download.isCurrent && <Badge tone="green">Ürün sayfasında</Badge>}
        {!download.published && <Badge tone="amber">Gizli</Badge>}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={download.published}
            disabled={action.pending}
            onChange={(event) => action.run(() => setDownloadPublished(download.id, event.target.checked), event.target.checked ? "Dosya sitede gösteriliyor." : "Dosya gizlendi.")}
          />
          Sitede
        </label>
        <a href={download.src} target="_blank" rel="noopener" className={buttonClass.icon} aria-label={`${download.title} dosyasını aç`}>
          <ExternalLink aria-hidden />
        </a>
        <button type="button" className={buttonClass.icon} onClick={() => setEditing(true)} aria-label={`${download.title} düzenle`}>
          <Pencil aria-hidden />
        </button>
        <button
          type="button"
          className={buttonClass.icon}
          aria-label={`${download.title} sil`}
          onClick={() => confirmDelete(`"${download.title} ${download.version}" dosyası`) && action.run(() => deleteDownload(download.id), "Dosya silindi.")}
        >
          <Trash2 aria-hidden />
        </button>
      </div>
    </li>
  );
}

export function DownloadsManager({ downloads, products, focusProduct }: { downloads: PanelDownload[]; products: ProductOption[]; focusProduct: string | null }) {
  const action = useAction();
  const [filter, setFilter] = useState(focusProduct ?? "");
  const shown = filter ? downloads.filter((download) => (filter === "none" ? !download.productId : download.productId === filter)) : downloads;

  return (
    <div className="space-y-6">
      {action.message && <Notice tone={action.message.tone}>{action.message.text}</Notice>}
      <Card title="Yeni dosya yükle" description="Yeni bir sürüm yüklediğinizde, tarihi en yeni olan yayındaki sürüm ürün sayfasında gösterilir. Eski sürümleri İndirmeler sayfasında göstermek ya da gizlemek için “Sitede” kutusunu kullanın.">
        <UploadForm key={focusProduct ?? "all"} products={products} defaultProduct={focusProduct} action={action} />
      </Card>
      <Card title="Dosyalar">
        <Field label="Ürüne göre süz" className="mb-4 max-w-sm">
          <select className={inputClass} value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="">Tümü ({downloads.length})</option>
            <option value="none">Ürüne bağlı olmayanlar</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </Field>
        {shown.length === 0 ? (
          <p className="text-sm text-neutral-600">Dosya yok.</p>
        ) : (
          <ul className="space-y-2">
            {shown.map((download) => (
              <DownloadRow key={download.id} download={download} products={products} action={action} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
