// Small building blocks for the panel. No hooks, so they work in server and client components alike.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-neutral-100";

const buttonBase =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

export const buttonClass = {
  primary: cn(buttonBase, "bg-blue-600 text-white hover:bg-blue-700"),
  secondary: cn(buttonBase, "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"),
  danger: cn(buttonBase, "bg-red-600 text-white hover:bg-red-700"),
  ghost: cn(buttonBase, "text-neutral-700 hover:bg-neutral-100"),
  icon: "inline-flex size-9 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 [&_svg]:size-4",
};

export function PageTitle({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-neutral-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, description, children, className }: { title?: string; description?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-6", className)}>
      {title && <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>}
      {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
      <div className={title || description ? "mt-4" : undefined}>{children}</div>
    </section>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-sm font-medium text-neutral-800">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "green" | "amber" | "blue" | "red"; children: ReactNode }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700",
    green: "bg-green-100 text-green-800",
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap", tones[tone])}>{children}</span>;
}

export function Notice({ tone, children }: { tone: "ok" | "error" | "info"; children: ReactNode }) {
  const tones = { ok: "border-green-200 bg-green-50 text-green-800", error: "border-red-200 bg-red-50 text-red-800", info: "border-blue-200 bg-blue-50 text-blue-800" };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-md border px-3 py-2 text-sm", tones[tone])}>
      {children}
    </div>
  );
}
