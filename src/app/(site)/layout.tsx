import "@/components/sites/teknosem/teknosem-adaptation.css";

/** Public site routes. The site stylesheet is loaded here (not in the root layout) so /yonetim stays unaffected. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
