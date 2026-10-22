import { ExpertSection, HeroSection, ProductsSection, ReasonsSection, ReferencesStrip, StrengthsSection } from "@/components/sites/teknosem/home-sections";
import { SiteShell } from "@/components/sites/teknosem/site-shell";
import { siteUrl } from "@/components/sites/teknosem/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = siteUrl ? { alternates: { canonical: "./" } } : {};

export default function Home() {
  return (
    <SiteShell page="home">
      <HeroSection />
      <ReasonsSection />
      <StrengthsSection />
      <ProductsSection />
      <ReferencesStrip />
      <ExpertSection />
    </SiteShell>
  );
}
