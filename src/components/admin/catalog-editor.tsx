"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCategory, deleteGroup, reorder, saveCategory, saveGroup } from "./actions/catalog";
import { ReorderButtons } from "./reorder-buttons";
import { slugify } from "./slug";
import { Badge, buttonClass, Field, inputClass, Notice } from "./ui";
import { confirmDelete, useAction } from "./use-action";
import { useOrderedList } from "./use-ordered-list";

export type EditorGroup = { id: string; categoryId: string; title: string; slug: string; published: boolean; productCount: number };
export type EditorCategory = { id: string; title: string; slug: string; published: boolean; groups: EditorGroup[] };

type Draft = { title: string; slug: string; published: boolean; categoryId?: string };

function ItemForm({
  initial,
  categories,
  submitLabel,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: Draft;
  categories?: { id: string; title: string }[];
  submitLabel: string;
  onSubmit: (draft: Draft) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [draft, setDraft] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  return (
    <form
      className="grid gap-3 rounded-md border border-blue-200 bg-blue-50/40 p-3 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(draft);
      }}
    >
      <Field label="Başlık">
        <input
          className={inputClass}
          value={draft.title}
          required
          onChange={(event) => setDraft({ ...draft, title: event.target.value, slug: slugTouched ? draft.slug : slugify(event.target.value) })}
        />
      </Field>
      <Field label="Kısa ad (adres)" hint="Adreste görünür: /urunler/kisa-ad. Değiştirirseniz eski bağlantılar çalışmaz.">
        <input
          className={inputClass}
          value={draft.slug}
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          onChange={(event) => {
            setSlugTouched(true);
            setDraft({ ...draft, slug: event.target.value });
          }}
        />
      </Field>
      {categories && (
        <Field label="Kategori">
          <select className={inputClass} value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </Field>
      )}
      <label className="flex items-center gap-2 self-end py-2 text-sm">
        <input type="checkbox" className="size-4" checked={draft.published} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} />
        Sitede göster
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" className={buttonClass.primary} disabled={pending}>
          {pending ? "Kaydediliyor…" : submitLabel}
        </button>
        <button type="button" className={buttonClass.secondary} onClick={onCancel}>
          Vazgeç
        </button>
      </div>
    </form>
  );
}

function GroupList({ category, categories, action }: { category: EditorCategory; categories: { id: string; title: string }[]; action: ReturnType<typeof useAction> }) {
  const { items, move, dragProps } = useOrderedList(category.groups, (ids) => reorder("groups", ids), (error) => action.setMessage({ tone: "error", text: error }));
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <ul className="mt-3 space-y-2 border-l-2 border-neutral-200 pl-3">
      {items.map((group, index) => (
        <li key={group.id} {...dragProps(index)} className="rounded-md border border-neutral-200 bg-white p-2 data-[dragging]:opacity-50">
          {editing === group.id ? (
            <ItemForm
              initial={group}
              categories={categories}
              submitLabel="Grubu kaydet"
              pending={action.pending}
              onCancel={() => setEditing(null)}
              onSubmit={(draft) =>
                action.run(() => saveGroup({ ...draft, id: group.id, categoryId: draft.categoryId ?? group.categoryId }), "Grup kaydedildi.").then((r) => r.ok && setEditing(null))
              }
            />
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <ReorderButtons index={index} count={items.length} onMove={move} label={group.title} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{group.title}</p>
                <p className="text-xs text-neutral-500">
                  #{group.slug} · {group.productCount} ürün
                </p>
              </div>
              {!group.published && <Badge tone="amber">Gizli</Badge>}
              <button type="button" className={buttonClass.icon} onClick={() => setEditing(group.id)} aria-label={`${group.title} grubunu düzenle`}>
                <Pencil aria-hidden />
              </button>
              <button
                type="button"
                className={buttonClass.icon}
                aria-label={`${group.title} grubunu sil`}
                onClick={() => confirmDelete(`"${group.title}" grubu`) && action.run(() => deleteGroup(group.id), "Grup silindi.")}
              >
                <Trash2 aria-hidden />
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function CatalogEditor({ categories }: { categories: EditorCategory[] }) {
  const action = useAction();
  const { items, move, dragProps } = useOrderedList(categories, (ids) => reorder("categories", ids), (error) => action.setMessage({ tone: "error", text: error }));
  const [editing, setEditing] = useState<string | null>(null);
  const options = categories.map(({ id, title }) => ({ id, title }));

  return (
    <div className="space-y-4">
      {action.message && <Notice tone={action.message.tone}>{action.message.text}</Notice>}
      <ul className="space-y-4">
        {items.map((category, index) => (
          <li key={category.id} {...dragProps(index)} className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm data-[dragging]:opacity-50 sm:p-4">
            {editing === category.id ? (
              <ItemForm
                initial={category}
                submitLabel="Kategoriyi kaydet"
                pending={action.pending}
                onCancel={() => setEditing(null)}
                onSubmit={(draft) => action.run(() => saveCategory({ ...draft, id: category.id }), "Kategori kaydedildi.").then((r) => r.ok && setEditing(null))}
              />
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <ReorderButtons index={index} count={items.length} onMove={move} label={category.title} />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold">{category.title}</p>
                  <p className="text-xs text-neutral-500">/urunler/{category.slug}</p>
                </div>
                {!category.published && <Badge tone="amber">Gizli</Badge>}
                <button type="button" className={buttonClass.icon} onClick={() => setEditing(category.id)} aria-label={`${category.title} kategorisini düzenle`}>
                  <Pencil aria-hidden />
                </button>
                <button
                  type="button"
                  className={buttonClass.icon}
                  aria-label={`${category.title} kategorisini sil`}
                  onClick={() => confirmDelete(`"${category.title}" kategorisi`) && action.run(() => deleteCategory(category.id), "Kategori silindi.")}
                >
                  <Trash2 aria-hidden />
                </button>
              </div>
            )}
            <GroupList category={category} categories={options} action={action} />
            <div className="mt-3 pl-3">
              {editing === `new-group-${category.id}` ? (
                <ItemForm
                  initial={{ title: "", slug: "", published: true, categoryId: category.id }}
                  submitLabel="Grubu ekle"
                  pending={action.pending}
                  onCancel={() => setEditing(null)}
                  onSubmit={(draft) => action.run(() => saveGroup({ ...draft, categoryId: category.id }), "Grup eklendi.").then((r) => r.ok && setEditing(null))}
                />
              ) : (
                <button type="button" className={buttonClass.ghost} onClick={() => setEditing(`new-group-${category.id}`)}>
                  <Plus aria-hidden /> Bu kategoriye grup ekle
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {editing === "new-category" ? (
        <ItemForm
          initial={{ title: "", slug: "", published: true }}
          submitLabel="Kategoriyi ekle"
          pending={action.pending}
          onCancel={() => setEditing(null)}
          onSubmit={(draft) => action.run(() => saveCategory(draft), "Kategori eklendi.").then((r) => r.ok && setEditing(null))}
        />
      ) : (
        <button type="button" className={buttonClass.secondary} onClick={() => setEditing("new-category")}>
          <Plus aria-hidden /> Yeni kategori
        </button>
      )}
    </div>
  );
}
