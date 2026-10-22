"use client";

/* eslint-disable @next/next/no-img-element -- panel previews */
import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { reorder } from "./actions/catalog";
import { deleteLogo, updateLogo, uploadLogo } from "./actions/content";
import { ReorderButtons } from "./reorder-buttons";
import { shrinkImage } from "./resize-image";
import { buttonClass, inputClass, Notice } from "./ui";
import { confirmDelete, useAction } from "./use-action";
import { useOrderedList } from "./use-ordered-list";

export type PanelLogo = { id: string; src: string; name: string; published: boolean };

export function LogosManager({ logos }: { logos: PanelLogo[] }) {
  const action = useAction();
  const [progress, setProgress] = useState<string | null>(null);
  const { items, move, dragProps } = useOrderedList(logos, (ids) => reorder("reference_logos", ids), (error) => action.setMessage({ tone: "error", text: error }));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files];
    for (const [index, file] of list.entries()) {
      setProgress(`Yükleniyor: ${index + 1} / ${list.length}`);
      const form = new FormData();
      form.set("file", await shrinkImage(file, 480));
      const result = await action.run(() => uploadLogo(form), list.length > 1 ? `${list.length} logo yüklendi.` : "Logo yüklendi.");
      if (!result.ok) break;
    }
    setProgress(null);
  };

  return (
    <div className="space-y-4">
      {action.message && <Notice tone={action.message.tone}>{action.message.text}</Notice>}
      <label className={`${buttonClass.primary} cursor-pointer`}>
        <ImagePlus aria-hidden />
        {progress ?? "Logo yükle"}
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
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((logo, index) => (
          <li key={logo.id} {...dragProps(index)} className="flex flex-col gap-2 rounded-md border border-neutral-200 bg-white p-2 data-[dragging]:opacity-50">
            {/* Dark tile: the site shows the logos on black. */}
            <div className="relative flex h-24 items-center justify-center rounded bg-neutral-900 p-3">
              <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" loading="lazy" />
              {logo.published && items.slice(0, index).filter((other) => other.published).length < 12 && <span className="absolute top-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[11px] text-white">Ana sayfada</span>}
            </div>
            <input
              className={inputClass}
              placeholder="Firma adı (alt metin)"
              aria-label="Firma adı"
              defaultValue={logo.name}
              onBlur={(event) => event.target.value !== logo.name && action.run(() => updateLogo(logo.id, { name: event.target.value }), "Kaydedildi.")}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ReorderButtons index={index} count={items.length} onMove={move} label={logo.name || `Logo ${index + 1}`} />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={logo.published}
                  disabled={action.pending}
                  onChange={(event) => action.run(() => updateLogo(logo.id, { published: event.target.checked }), event.target.checked ? "Logo gösteriliyor." : "Logo gizlendi.")}
                />
                Sitede
              </label>
              <button
                type="button"
                className={buttonClass.icon}
                aria-label={`${logo.name || `Logo ${index + 1}`} sil`}
                onClick={() => confirmDelete("Bu logo") && action.run(() => deleteLogo(logo.id), "Logo silindi.")}
              >
                <Trash2 aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
