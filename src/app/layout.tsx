import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { allowIndexing, siteUrl } from "@/components/sites/teknosem/site-config";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  style: ["normal", "italic"],
});

const description =
  "Robotik sistemlerimiz, akademik bilgi ve mühendislik uzmanlığıyla endüstriyel üretimden sağlığa kadar geniş bir kullanım alanı sunar. Teknosem inovatif çözümleriyle sektöre yön verirken bilimin rehberliğinde büyümeye devam etmektedir.";

export const metadata: Metadata = {
  // Absolute URLs (canonical, og:image) are only produced once the production domain is configured.
  ...(siteUrl ? { metadataBase: new URL(`${siteUrl}/`) } : {}),
  ...(allowIndexing ? {} : { robots: { index: false, follow: false } }),
  title: "Teknosem - HPDC Robot Sistemleri, Robotik Zımpara / Polisaj Sistemleri",
  description,
  openGraph: {
    title: "Teknosem - HPDC Robot Sistemleri, Robotik Zımpara / Polisaj Sistemleri",
    description,
    type: "website",
    locale: "tr_TR",
    siteName: "Teknosem",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-page="/" className={workSans.variable}>
      <body>{children}</body>
    </html>
  );
}
