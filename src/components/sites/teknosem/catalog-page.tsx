import Link from "next/link";
import { ExpertSection } from "./home-sections";
import { categoryHref, productHref, productsHref } from "./links";
import { LineElement, ProductThumb } from "./primitives";
import type { Category } from "./site-data";

/** "Ürünlerimiz" intro from the source home page. */
const PRODUCTS_INTRO =
  "Robotik sistemlerimiz, akademik bilgi ve mühendislik uzmanlığıyla endüstriyel üretimden sağlığa kadar geniş bir kullanım alanı sunar. TEKNOSEM, inovatif çözümleriyle sektöre yön verirken bilimin rehberliğinde büyümeye devam etmektedir.";

function CategoryBlock({ category, headingLevel }: { category: Category; headingLevel: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <section className="catalog-category product-reveal" id={category.slug}>
      {headingLevel === "h2" && (
        <h2 className="h2">
          <a href={categoryHref(category)}>{category.title}</a>
        </h2>
      )}
      {category.groups.map((group) => (
        <div key={group.slug} className="catalog-group" id={group.slug}>
          <Heading className="catalog-group-title">{group.title}</Heading>
          <div className="catalog-grid">
            {group.products.map((p) => (
              <a key={p.slug} href={productHref(p)} className="catalog-card with-border" title={p.name}>
                <ProductThumb image={p.images[0]} size={360} />
                <span>{p.shortName}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/** /urunler (all categories) or /urunler/<kategori> (one category). */
export function CatalogPage({ categories, current }: { categories: Category[]; current?: Category }) {
  return (
    <>
      <section className="product-hero catalog-hero">
        <div className="breadcrumb" role="navigation" aria-label="Sayfa yolu">
          <Link href="/">Ana Sayfa</Link>
          <span aria-hidden>/</span>
          {current ? <a href={productsHref}>Ürünler</a> : <span aria-current="page">Ürünler</span>}
          {current && (
            <>
              <span aria-hidden>/</span>
              <span aria-current="page">{current.title}</span>
            </>
          )}
        </div>
        <div className="catalog-intro">
          {current && <LineElement> Ürünlerimiz </LineElement>}
          <h1 className="h1">{current ? current.title : "Ürünlerimiz"}</h1>
          {!current && <p className="paragraph-1 text-start">{PRODUCTS_INTRO}</p>}
          <div className="catalog-jump">
            {(current ? current.groups : categories).map((item) => (
              <a key={item.slug} href={current ? `#${item.slug}` : categoryHref(item)} className="secondary-btn">
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </section>
      {(current ? [current] : categories).map((category) => (
        <CategoryBlock key={category.slug} category={category} headingLevel={current ? "h3" : "h2"} />
      ))}
      <ExpertSection />
    </>
  );
}
