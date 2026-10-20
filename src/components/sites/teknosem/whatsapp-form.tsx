"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

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
 * No backend yet: the form turns its fields into a ready-made message and opens WhatsApp with it.
 * The visitor sends the message from their own WhatsApp.
 */
export function WhatsAppForm({ subject, fields, whatsappNumber, kvkkHref }: { subject: string; fields: FormField[]; whatsappNumber: string; kvkkHref: string }) {
  const [values, setValues] = useState<Record<string, string>>({});

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

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const lines = fields
      .map((field) => {
        const raw = values[field.name]?.trim();
        if (!raw) return null;
        const value = field.options?.find((option) => option.value === raw)?.label ?? raw;
        return `${field.label}: ${value}`;
      })
      .filter(Boolean);
    const text = [`*${subject}*`, ...lines].join("\n");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <form className="whatsapp-form" onSubmit={submit}>
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
                <textarea {...common} rows={6} onChange={(event) => update(field.name, event.target.value)} />
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
                <input {...common} type={field.type ?? "text"} onChange={(event) => update(field.name, event.target.value)} />
              )}
            </div>
          </div>
        );
      })}
      <div className="form-actions">
        <p className="form-note">
          Gönder&apos;e bastığınızda mesajınız WhatsApp&apos;ta hazır olarak açılır. Kişisel verileriniz{" "}
          <a href={kvkkHref}>KVKK aydınlatma metni</a> kapsamında işlenir.
        </p>
        <button type="submit" className="primary-btn">
          WhatsApp ile Gönder
          <div className="icon">
            <ArrowRight aria-hidden />
          </div>
        </button>
      </div>
    </form>
  );
}
