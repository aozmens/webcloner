import { pageHref, productsHref } from "./content";
import { PrimaryButton } from "./primitives";

export function NotFoundPage() {
  return (
    <section className="product-hero catalog-hero not-found">
      <div className="catalog-intro">
        <p className="corporate-tagline">404</p>
        <h1 className="h1">Sayfa bulunamadı</h1>
        <p className="paragraph-1 text-start">Aradığınız sayfa taşınmış ya da kaldırılmış olabilir.</p>
        <div className="product-actions">
          <PrimaryButton href="/">Ana Sayfa</PrimaryButton>
          <a className="secondary-btn" href={productsHref}>
            Ürünler
          </a>
          <a className="secondary-btn" href={pageHref("contact")}>
            İletişim
          </a>
        </div>
      </div>
    </section>
  );
}
