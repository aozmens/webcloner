"use client";

/* eslint-disable @next/next/no-img-element -- panel previews straight from Storage */
import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { reorder } from "./actions/catalog";
import { deleteProductImage, updateProductImageAlt, uploadProductImage } from "./actions/products";
import { ReorderButtons } from "./reorder-buttons";
import { shrinkImage } from "./resize-image";
import { buttonClass, inputClass, Notice } from "./ui";
import { confirmDelete, useAction } from "./use-action";
import { useOrderedList } from "./use-ordered-list";

export type PanelImage = { id: string; src: string; width: number; height: number; alt: string };

export function ProductImages({ productId, images }: { productId: string; images: PanelImage[] }) {
  const action = useAction();
  const [progress, setProgress] = useState<string | null>(null);
  const { items, move, dragProps } = useOrderedList(images, (ids) => reorder("product_images", ids), (error) => action.setMessage({ tone: "error", text: error }));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files];
    for (const [index, file] of list.entries()) {
      setProgress(`Yükleniyor: ${index + 1} / ${list.length}`);
      const form = new FormData();
      form.set("file", await shrinkImage(file, 1800));
      const result = await action.run(() => uploadProductImage(productId, form), list.length > 1 ? `${list.length} görsel yüklendi.` : "Görsel yüklendi.");
      if (!result.ok) break;
    }
    setProgress(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        İlk görsel menüde, listelerde ve paylaşım önizlemesinde kullanılır. Yüklenen görseller WebP biçimine çevrilir ve en uzun kenarı 1800 piksele
        küçültülür. Ürün fotoğraflarında beyaz yerine şeffaf arka plan en iyi sonucu verir.
      </p>
      {action.message && <Notice tone={action.message.tone}>{action.message.text}</Notice>}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((image, index) => (
          <li key={image.id} {...dragProps(index)} className="flex flex-col gap-2 rounded-md border border-neutral-200 bg-white p-2 data-[dragging]:opacity-50">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded bg-neutral-100">
              <img src={image.src} alt={image.alt} className="max-h-full max-w-full object-contain" loading="lazy" />
              {index === 0 && <span className="absolute top-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs text-white">Kapak</span>}
            </div>
            <input
              className={inputClass}
              placeholder="Görsel açıklaması (alt metin)"
              aria-label="Görsel açıklaması"
              defaultValue={image.alt}
              onBlur={(event) => event.target.value !== image.alt && action.run(() => updateProductImageAlt(image.id, event.target.value), "Açıklama kaydedildi.")}
            />
            <div className="flex items-center justify-between">
              <ReorderButtons index={index} count={items.length} onMove={move} label={`Görsel ${index + 1}`} />
              <span className="text-xs text-neutral-500">
                {image.width}×{image.height}
              </span>
              <button
                type="button"
                className={buttonClass.icon}
                aria-label={`Görsel ${index + 1} sil`}
                onClick={() => confirmDelete("Bu görsel") && action.run(() => deleteProductImage(image.id), "Görsel silindi.")}
              >
                <Trash2 aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <label className={`${buttonClass.secondary} cursor-pointer`}>
        <ImagePlus aria-hidden />
        {progress ?? "Görsel yükle"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={Boolean(progress)}
          onChange={(event) => {
            upload(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
