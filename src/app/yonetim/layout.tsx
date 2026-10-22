import type { Metadata } from "next";
import "@/components/admin/admin.css";

export const metadata: Metadata = {
  title: { default: "Yönetim - Teknosem", template: "%s - Teknosem Yönetim" },
  robots: { index: false, follow: false },
};

/** Panel shell: light, plain styling, independent of the site's stylesheet (see app/(site)/layout.tsx). */
export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-svh bg-neutral-100 font-sans text-neutral-900 antialiased">{children}</div>;
}
