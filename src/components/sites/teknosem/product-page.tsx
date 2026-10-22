import { FileDown } from "lucide-react";
import Link from "next/link";
import { ExpertSection } from "./home-sections";
import { categoryHref, pageHref, pages, productHref, productsHref } from "./links";
import { LineElement, PrimaryButton, ProductThumb } from "./primitives";
import { ProductGallery } from "./product-gallery";
import { ProductTabs, type TabPanel } from "./product-tabs";
import { cleanHtml } from "./rich-text";
import type { Product, SpecRow } from "./site-data";

export const youtubeId = (url: string) => url.match(/(?:embed\/|youtu\.be\/|[?&]v=|shorts\/)([\w-]{11})/)?.[1];

function SpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <div className="product-prose">
      <table className="spec-table">
        <tbody>
          {rows.map(({ label, value }, index) =>
            value ? (
              <tr key={index}>
                <th scope="row">{label}</th>
                <td>{value}</td>
              </tr>
            ) : (
              <tr key={index} className="group-row">
                <th scope="rowgroup" colSpan={2}>
                  {label}
                </th>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ProductPage({ product, siblings }: { product: Product; siblings: Product[] }) {
  const description = cleanHtml(product.descriptionHtml);
  const videos = product.videos.filter((url) => youtubeId(url));

  const panels: TabPanel[] = [];
  if (description) panels.push({ id: "aciklama", title: "Açıklama", content: <div className="product-prose" dangerouslySetInnerHTML={{ __html: description }} /> });
  if (product.specs.length > 0) panels.push({ id: "teknik", title: "Teknik Detaylar", content: <SpecTable rows={product.specs} /> });
  if (videos.length > 0) {
    panels.push({
      id: "video",
      title: "Video",
      content: (
        <div className="product-videos">
          {videos.map((url, index) => (
            <div key={url} className="video-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId(url)}`}
                title={`${product.name} — video ${index + 1}`}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      ),
    });
  }

  const { manual } = product;

  return (
    <>
      <section className="product-hero">
        {/* Not a <nav>: the inherited base styles every nav element as the fixed main menu bar. */}
        <div className="breadcrumb" role="navigation" aria-label="Sayfa yolu">
          <Link href="/">Ana Sayfa</Link>
          <span aria-hidden>/</span>
          <a href={productsHref}>Ürünler</a>
          <span aria-hidden>/</span>
          <a href={categoryHref(product.category)}>{product.category.title}</a>
          <span aria-hidden>/</span>
          <span aria-current="page">{product.name}</span>
        </div>
        <ProductGallery images={product.images} name={product.name} />
        <div className="product-summary">
          <LineElement> {product.group.title} </LineElement>
          <h1 className="h1">
            {product.name.split(" ").map((word, index) => (
              <span key={index}>
                {index > 0 && " "}
                {/* Model codes such as "TK-5" must not break at the hyphen. */}
                {word.includes("-") ? <span className="nowrap">{word}</span> : word}
              </span>
            ))}
          </h1>
          <p className="paragraph-1 text-start">{product.shortDescription}</p>
          <div className="product-actions">
            <PrimaryButton href={`${pageHref("quote")}?urun=${product.slug}`}>{pages.quote.label}</PrimaryButton>
            {manual && (
              <a className="secondary-btn" href={manual.src} target="_blank" rel="noopener" download>
                <FileDown aria-hidden strokeWidth={1.5} />
                Kullanım Kılavuzu ({[manual.model, manual.version].filter(Boolean).join(", ") || manual.title})
              </a>
            )}
          </div>
        </div>
      </section>

      {panels.length > 0 && (
        <section className="product-details product-reveal">
          <ProductTabs panels={panels} />
        </section>
      )}

      {product.faq.length > 0 && (
        <section className="product-faq product-reveal">
          <h2 className="h2">{product.faqTitle}</h2>
          <div className="faq-list">
            {product.faq.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                {item.answer
                  .split(/\n+/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
              </details>
            ))}
          </div>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="product-related product-reveal">
          <h2 className="h2">{product.group.title}</h2>
          <div className="related-list">
            {siblings.map((sibling) => (
              <a key={sibling.slug} href={productHref(sibling)} className="related-card with-border">
                <ProductThumb image={sibling.images[0]} size={320} />
                <span>{sibling.name}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <ExpertSection />
    </>
  );
}
