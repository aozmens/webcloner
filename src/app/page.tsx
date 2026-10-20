import { ExpertSection, HeroSection, ProductsSection, ReasonsSection, ReferencesStrip, StrengthsSection } from "@/components/sites/teknosem/home-sections";
import { SiteShell } from "@/components/sites/teknosem/site-shell";

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
