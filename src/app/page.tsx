import { ExpertSection, HeroSection, ProductsSection, ReasonsSection, ReferencesStrip, StrengthsSection } from "@/components/sites/teknosem/home-sections";
import { PageScripts } from "@/components/sites/teknosem/page-scripts";
import { SiteFooter } from "@/components/sites/teknosem/site-footer";
import { Preloader, SiteHeader } from "@/components/sites/teknosem/site-header";

export default function Home() {
  return (
    <>
      <Preloader />
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeroSection />
            <ReasonsSection />
            <StrengthsSection />
            <ProductsSection />
            <ReferencesStrip />
            <ExpertSection />
          </main>
          <SiteFooter />
        </div>
      </div>
      <PageScripts />
    </>
  );
}
