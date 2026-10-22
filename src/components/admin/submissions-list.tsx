"use client";

import { Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SubmissionKind, SubmissionStatus } from "@/lib/supabase/database.types";
import { deleteSubmission, updateSubmission } from "./actions/submissions";
import { statusLabels } from "./labels";
import { Badge, buttonClass, inputClass, Notice } from "./ui";
import { confirmDelete, useAction } from "./use-action";

export type PanelSubmission = {
  id: string;
  kind: SubmissionKind;
  name: string;
  company: string;
  phone: string;
  email: string;
  subject: string;
  product: { slug: string; name: string } | null;
  productSlug: string;
  message: string;
  status: SubmissionStatus;
  note: string;
  createdAt: string;
};

const kindLabels: Record<SubmissionKind, { label: string; tone: "blue" | "amber" | "neutral" }> = {
  quote: { label: "Teklif", tone: "blue" },
  service: { label: "Servis", tone: "amber" },
  contact: { label: "İletişim", tone: "neutral" },
};

const dateFormat = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" });

/** "0545 829 06 52" → "905458290652" for wa.me. */
const whatsappNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `9${digits}`;
  if (digits.length === 10) return `90${digits}`;
  return digits;
};

function SubmissionCard({ item, action }: { item: PanelSubmission; action: ReturnType<typeof useAction> }) {
  const [note, setNote] = useState(item.note);
  const kind = kindLabels[item.kind];
  return (
    <li className={`rounded-lg border bg-white p-4 shadow-sm ${item.status === "new" ? "border-blue-300" : "border-neutral-200"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={kind.tone}>{kind.label}</Badge>
        {item.status === "new" && <Badge tone="green">Yeni</Badge>}
        <span className="text-xs text-neutral-500">{dateFormat.format(new Date(item.createdAt))}</span>
        <select
          className={`${inputClass} ml-auto w-auto py-1.5`}
          aria-label="Durum"
          value={item.status}
          disabled={action.pending}
          onChange={(event) => action.run(() => updateSubmission(item.id, { status: event.target.value as SubmissionStatus }), "Durum güncellendi.")}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-1 text-sm">
          <p className="text-base font-semibold">{item.name}</p>
          {item.company && <p className="text-neutral-700">{item.company}</p>}
          {item.phone && (
            <p className="flex flex-wrap items-center gap-3">
              <a className="inline-flex items-center gap-1 text-blue-700 hover:underline" href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}>
                <Phone className="size-3.5" aria-hidden /> {item.phone}
              </a>
              <a className="inline-flex items-center gap-1 text-green-700 hover:underline" href={`https://wa.me/${whatsappNumber(item.phone)}`} target="_blank" rel="noopener">
                <MessageCircle className="size-3.5" aria-hidden /> WhatsApp
              </a>
            </p>
          )}
          {item.email && (
            <a className="inline-flex items-center gap-1 text-blue-700 hover:underline" href={`mailto:${item.email}`}>
              <Mail className="size-3.5" aria-hidden /> {item.email}
            </a>
          )}
          {(item.product || item.productSlug) && (
            <p>
              Ürün:{" "}
              {item.product ? (
                <a className="text-blue-700 hover:underline" href={`/urun/${item.product.slug}`} target="_blank" rel="noopener">
                  {item.product.name}
                </a>
              ) : (
                item.productSlug
              )}
            </p>
          )}
          {item.subject && <p>Konu: {item.subject}</p>}
        </div>
        <div className="space-y-3">
          <p className="rounded-md bg-neutral-50 p-3 text-sm whitespace-pre-wrap">{item.message}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <textarea className={`${inputClass} min-h-16 flex-1`} placeholder="Not ekleyin (yalnızca panelde görünür)" aria-label="Not" value={note} onChange={(event) => setNote(event.target.value)} />
            <div className="flex gap-2">
              <button type="button" className={buttonClass.secondary} disabled={action.pending || note === item.note} onClick={() => action.run(() => updateSubmission(item.id, { note }), "Not kaydedildi.")}>
                Notu kaydet
              </button>
              <button
                type="button"
                className={buttonClass.icon}
                aria-label={`${item.name} başvurusunu sil`}
                onClick={() => confirmDelete(`${item.name} adlı kişinin başvurusu`) && action.run(() => deleteSubmission(item.id), "Başvuru silindi.")}
              >
                <Trash2 aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function SubmissionsList({ items }: { items: PanelSubmission[] }) {
  const action = useAction();
  return (
    <div className="space-y-3">
      {action.message && <Notice tone={action.message.tone}>{action.message.text}</Notice>}
      {items.length === 0 ? (
        <p className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-600">Bu listede başvuru yok.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <SubmissionCard key={item.id} item={item} action={action} />
          ))}
        </ul>
      )}
    </div>
  );
}
