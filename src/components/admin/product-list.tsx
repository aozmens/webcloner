"use client";

/* eslint-disable @next/next/no-img-element -- small panel thumbnails straight from Storage */
import { ExternalLink, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";
import { reorder } from "./actions/catalog";
import { deleteProduct, setProductPublished } from "./actions/products";
import { ReorderButtons } from "./reorder-buttons";
import { Badge, buttonClass, inputClass, Notice } from "./ui";
import { confirmDelete, useAction } from "./use-action";
import { useOrderedList } from "./use-ordered-list";

type ListProduct = { id: string; slug: string; name: string; published: boolean; thumb: string | null };
type ListGroup = { id: string; title: string; published: boolean; products: ListProduct[] };
export type ListCategory = { id: string; title: string; published: boolean; groups: ListGroup[] };

const normalize = (value: string) => value.toLocaleLowerCase("tr");

function GroupProducts({ group, filter, action }: { group: ListGroup; filter: string; action: ReturnType<typeof useAction> }) {
  const { items, move, dragProps } = useOrderedList(group.products, (ids) => reorder("products", ids), (error) => action.setMessage({ tone: "error", text: error }));
  const visible = items.filter((product) => !filter || normalize(`${product.name} ${product.slug}`).includes(filter));
  if (filter && visible.length === 0) return null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2">
        <h3 className="font-medium">{group.title}</h3>
        {!group.published && <Badge tone="amber">Grup gizli</Badge>}
        <span className="ml-auto text-xs text-neutral-500">{items.length} ürün</span>
      </div>
      {items.length === 0 ? (
        <p className="px-3 py-4 text-sm text-neutral-500">Bu grupta ürün yok.</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {items.map((product, index) =>
            filter && !visible.includes(product) ? null : (
              <li key={product.id} {...(filter ? {} : dragProps(index))} className="flex flex-wrap items-center gap-3 px-3 py-2 data-[dragging]:opacity-50">
                {!filter && <ReorderButtons index={index} count={items.length} onMove={move} label={product.name} />}
                <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-100">
                  {product.thumb && <img src={product.thumb} alt="" className="size-full object-contain" loading="lazy" />}
                </span>
                <div className="min-w-0 flex-1 basis-40">
                  <Link href={`${ADMIN_PATH}/urunler/${product.id}`} className="font-medium hover:text-blue-700">
                    {product.name}
                  </Link>
                  <p className="text-xs text-neutral-500">/urun/{product.slug}</p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={product.published}
                    disabled={action.pending}
                    onChange={(event) =>
                      action.run(
                        () => setProductPublished(product.id, event.target.checked),
                        event.target.checked ? `"${product.name}" yayına alındı.` : `"${product.name}" yayından kaldırıldı.`,
                      )
                    }
                  />
                  Yayında
                </label>
                <div className="flex gap-1">
                  {product.published && (
                    <a href={`/urun/${product.slug}`} target="_blank" rel="noopener" className={buttonClass.icon} aria-label={`${product.name} sayfasını aç`}>
                      <ExternalLink aria-hidden />
                    </a>
                  )}
                  <Link href={`${ADMIN_PATH}/urunler/${product.id}`} className={buttonClass.icon} aria-label={`${product.name} düzenle`}>
                    <Pencil aria-hidden />
                  </Link>
                  <button
                    type="button"
                    className={buttonClass.icon}
                    aria-label={`${product.name} sil`}
                    onClick={() => confirmDelete(`"${product.name}" ürünü ve görselleri`) && action.run(() => deleteProduct(product.id), "Ürün silindi.")}
                  >
                    <Trash2 aria-hidden />
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

export function ProductList({ categories }: { categories: ListCategory[] }) {
  const action = useAction();
  const [query, setQuery] = useState("");
  const filter = normalize(query.trim());

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
        <input className={`${inputClass} pl-9`} type="search" placeholder="Ürün ara…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Ürün ara" />
      </div>
      {action.message && <Notice tone={action.message.tone}>{action.message.text}</Notice>}
      {filter && <p className="text-xs text-neutral-500">Arama yaparken sıralama kapalıdır.</p>}
      {categories.map((category) => (
        <section key={category.id} className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            {category.title}
            {!category.published && <Badge tone="amber">Kategori gizli</Badge>}
          </h2>
          {category.groups.map((group) => (
            <GroupProducts key={group.id} group={group} filter={filter} action={action} />
          ))}
        </section>
      ))}
    </div>
  );
}
