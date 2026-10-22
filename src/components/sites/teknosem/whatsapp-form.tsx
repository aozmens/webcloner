"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { SubmissionKind } from "@/lib/supabase/database.types";
import { submitForm } from "./form-actions";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
  autoComplete?: string;
  /** Pre-fill from this query parameter (e.g. ?urun=ty-1000 on Teklif Al). */
  queryParam?: string;
};

/**
 * The form is saved to the panel (Başvurular) first; then WhatsApp opens with the same text ready to send, and the
 * visitor sends it from their own WhatsApp.
 */
export function WhatsAppForm({
  kind,
  subject,
  fields,
  whatsappNumber,
  kvkkHref,
}: {
  kind: SubmissionKind;
  subject: string;
  fields: FormField[];
  whatsappNumber: string;
  kvkkHref: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ message: string; fallbackHref?: string } | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill: Record<string, string> = {};
    for (const field of fields) {
      const value = field.queryParam ? params.get(field.queryParam) : null;
      if (value && (!field.options || field.options.some((option) => option.value === value))) prefill[field.name] = value;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the query string is only readable after hydration
    if (Object.keys(prefill).length > 0) setValues((current) => ({ ...prefill, ...current }));
  }, [fields]);

  const update = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));

  const whatsappUrl = () => {
    const lines = fields
      .map((field) => {
        const raw = values[field.name]?.trim();
        if (!raw) return null;
        const value = field.options?.find((option) => option.value === raw)?.label ?? raw;
        return `${field.label}: ${value}`;
      })
      .filter(Boolean);
    const text = [`*${subject}*`, ...lines].join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    const url = whatsappUrl();
    // Browsers only allow a new tab during the click itself, so it is opened now and pointed at WhatsApp once saved.
    const tab = window.open("", "_blank");
    setPending(true);
    setError(null);
    const result = await submitForm({ kind, values, website }).catch(() => ({
      ok: false as const,
      message: "Bağlantı kurulamadı. Mesajınızı WhatsApp ile yine de gönderebilirsiniz.",
      fallback: true,
    }));
    setPending(false);
    if (!result.ok) {
      tab?.close();
      setError({ message: result.message, fallbackHref: result.fallback ? url : undefined });
      return;
    }
    setSent(true);
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
  };

  return (
    <form className="whatsapp-form" onSubmit={submit}>
      {/* Honeypot: hidden from people and screen readers; bots that fill it in are ignored. */}
      <div className="form-trap" aria-hidden>
        <label htmlFor={`form-${kind}-website`}>Web siteniz</label>
        <input id={`form-${kind}-website`} name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>
      {fields.map((field) => {
        const id = `form-${field.name}`;
        const common = {
          id,
          name: field.name,
          required: field.required,
          value: values[field.name] ?? "",
          autoComplete: field.autoComplete,
        };
        return (
          <div key={field.name} className={field.type === "textarea" ? "field-wrapper textarea" : "field-wrapper"}>
            <label htmlFor={id}>
              {field.label}
              {field.required && <span aria-hidden> *</span>}
            </label>
            <div className="field">
              {field.type === "textarea" ? (
                <textarea {...common} rows={6} maxLength={5000} onChange={(event) => update(field.name, event.target.value)} />
              ) : field.type === "select" ? (
                <select {...common} onChange={(event) => update(field.name, event.target.value)}>
                  <option value="">Seçiniz</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...common} type={field.type ?? "text"} maxLength={200} onChange={(event) => update(field.name, event.target.value)} />
              )}
            </div>
          </div>
        );
      })}
      <div className="form-actions">
        {error ? (
          <p className="form-note form-error" role="alert">
            {error.message}
            {error.fallbackHref && (
              <>
                {" "}
                <a href={error.fallbackHref} target="_blank" rel="noopener">
                  WhatsApp&apos;ı aç
                </a>
              </>
            )}
          </p>
        ) : sent ? (
          <p className="form-note" role="status">
            Talebiniz kaydedildi. WhatsApp&apos;ta açılan mesajı göndermeyi unutmayın.
          </p>
        ) : (
          <p className="form-note">
            Gönder&apos;e bastığınızda talebiniz kaydedilir ve mesajınız WhatsApp&apos;ta hazır olarak açılır. Kişisel verileriniz{" "}
            <a href={kvkkHref}>KVKK aydınlatma metni</a> kapsamında işlenir.
          </p>
        )}
        <button type="submit" className="primary-btn" disabled={pending} aria-busy={pending}>
          {pending ? "Gönderiliyor…" : "WhatsApp ile Gönder"}
          <div className="icon">
            <ArrowRight aria-hidden />
          </div>
        </button>
      </div>
    </form>
  );
}
