"use server";

// Saves Teklif Al / Servis Talebi / İletişim forms to Supabase before the visitor is sent on to WhatsApp.
// Spam protection: a hidden "website" field that people never fill in (honeypot) and at most
// SUBMISSIONS_PER_HOUR forms per IP address. The address itself is never stored, only a keyed hash of it.

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import type { SubmissionKind } from "@/lib/supabase/database.types";
import { getServiceRoleKey } from "@/lib/server-env";
import { createServiceClient } from "@/lib/supabase/service";

const SUBMISSIONS_PER_HOUR = 5;

export type FormResult = { ok: true } | { ok: false; message: string; /** Saving failed on our side: WhatsApp still works. */ fallback: boolean };

const kinds: SubmissionKind[] = ["quote", "service", "contact"];

/** Form field names (see corporate-pages.tsx) → submissions columns. */
const columns = { adSoyad: "name", firma: "company", telefon: "phone", eposta: "email", konu: "subject", urun: "product_slug", mesaj: "message", talep: "message" } as const;
const limits = { name: 200, company: 200, phone: 50, email: 200, subject: 200, product_slug: 200, message: 5000 } as const;

async function ipHash() {
  const list = await headers();
  const ip = list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "bilinmiyor";
  return createHmac("sha256", getServiceRoleKey()).update(`teknosem-form:${ip}`).digest("hex");
}

export async function submitForm(input: { kind: string; values: Record<string, string>; website: string }): Promise<FormResult> {
  // Bots fill in every field; pretend it worked so they do not retry.
  if (input.website) return { ok: true };
  if (!kinds.includes(input.kind as SubmissionKind)) return { ok: false, message: "Geçersiz form.", fallback: false };

  const row = { name: "", company: "", phone: "", email: "", subject: "", product_slug: "", message: "" };
  for (const [field, value] of Object.entries(input.values ?? {})) {
    const column = columns[field as keyof typeof columns];
    if (column && typeof value === "string") row[column] = value.trim().slice(0, limits[column]);
  }
  if (!row.name) return { ok: false, message: "Lütfen adınızı ve soyadınızı yazın.", fallback: false };
  if (!row.message) return { ok: false, message: "Lütfen mesajınızı yazın.", fallback: false };
  if (input.kind !== "contact" && !row.phone) return { ok: false, message: "Lütfen telefon numaranızı yazın.", fallback: false };

  try {
    const db = createServiceClient();
    const hash = await ipHash();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await db.from("submissions").select("id", { count: "exact", head: true }).eq("ip_hash", hash).gte("created_at", since);
    if (countError) throw countError;
    if ((count ?? 0) >= SUBMISSIONS_PER_HOUR) {
      return {
        ok: false,
        message: "Kısa sürede çok fazla form gönderildi. Lütfen bir saat sonra tekrar deneyin ya da bize telefon veya WhatsApp ile ulaşın.",
        fallback: false,
      };
    }
    const { error } = await db.from("submissions").insert({ ...row, kind: input.kind as SubmissionKind, ip_hash: hash });
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    console.error("Form kaydedilemedi:", error);
    return { ok: false, message: "Talebiniz şu anda kaydedilemedi. Mesajınızı WhatsApp ile yine de gönderebilirsiniz.", fallback: true };
  }
}
