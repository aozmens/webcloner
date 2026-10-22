"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_PATH } from "@/components/sites/teknosem/site-config";

const items = [
  { href: ADMIN_PATH, label: "Özet" },
  { href: `${ADMIN_PATH}/urunler`, label: "Ürünler" },
  { href: `${ADMIN_PATH}/kategoriler`, label: "Kategoriler" },
  { href: `${ADMIN_PATH}/indirmeler`, label: "İndirmeler" },
  { href: `${ADMIN_PATH}/anasayfa`, label: "Ana Sayfa" },
  { href: `${ADMIN_PATH}/kurumsal`, label: "Kurumsal" },
  { href: `${ADMIN_PATH}/referanslar`, label: "Referanslar" },
  { href: `${ADMIN_PATH}/basvurular`, label: "Başvurular" },
];

/** Horizontal tab bar; scrolls sideways on phones. */
export function AdminNav({ newSubmissions }: { newSubmissions: number }) {
  const pathname = usePathname();
  const active = (href: string) => (href === ADMIN_PATH ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <div className="mx-auto max-w-6xl overflow-x-auto px-2">
      <div className="flex min-w-max gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active(item.href) ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm whitespace-nowrap",
              active(item.href) ? "border-blue-600 font-medium text-blue-700" : "border-transparent text-neutral-600 hover:text-neutral-900",
            )}
          >
            {item.label}
            {item.label === "Başvurular" && newSubmissions > 0 && (
              <span className="rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white" aria-label={`${newSubmissions} yeni`}>
                {newSubmissions}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
