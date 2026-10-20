import { FileDown } from "lucide-react";
import Link from "next/link";
import { pages, productHref, productPlacement, type Product } from "./content";
import { ExpertSection } from "./home-sections";
import { LineElement, PrimaryButton, ProductThumb } from "./primitives";
import { ProductGallery } from "./product-gallery";
import { MarkdownBlocks, parseTab } from "./product-markdown";
import { ProductTabs, type TabPanel } from "./product-tabs";

const youtubeId = (url: string) => url.match(/embed\/([\w-]+)/)?.[1];

export function ProductPage({ product }: { product: Product }) {
  const { category, group, siblings } = productPlacement(product.slug);
  const [descriptionTab, specsTab, videoTab] = product.tabs;
  const description = parseTab(descriptionTab.markdown, descriptionTab.title);
  const specs = specsTab ? parseTab(specsTab.markdown, specsTab.title) : null;
  const videos = [...new Set([...(videoTab?.videos ?? []), ...product.videos])].filter((url) => youtubeId(url));

  const panels: TabPanel[] = [];
  if (description.blocks.length > 0) panels.push({ id: "aciklama", title: descriptionTab.title, content: <MarkdownBlocks blocks={description.blocks} /> });
  if (specs && specs.blocks.length > 0) panels.push({ id: "teknik", title: specsTab.title, content: <MarkdownBlocks blocks={specs.blocks} /> });
  if (videos.length > 0) {
    panels.push({
      id: "video",
      title: videoTab?.title ?? "Video",
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

  return (
    <>
      <section className="product-hero">
        {/* Not a <nav>: the inherited base styles every nav element as the fixed main menu bar. */}
        <div className="breadcrumb" role="navigation" aria-label="Sayfa yolu">
          <Link href="/">Ana Sayfa</Link>
          <span aria-hidden>/</span>
          <a href={category.href}>{category.title}</a>
          <span aria-hidden>/</span>
          <span aria-current="page">{product.name}</span>
        </div>
        <ProductGallery images={product.images} name={product.name} />
        <div className="product-summary">
          <LineElement> {group.title} </LineElement>
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
            <PrimaryButton href={pages.quote.href}>{pages.quote.label}</PrimaryButton>
            {product.documents.map((doc) => (
              <a key={doc.src} className="secondary-btn" href={doc.src} target="_blank" rel="noopener" download>
                <FileDown aria-hidden strokeWidth={1.5} />
                Kullanım Kılavuzu ({doc.name})
              </a>
            ))}
          </div>
        </div>
      </section>

      {panels.length > 0 && (
        <section className="product-details product-reveal">
          <ProductTabs panels={panels} />
        </section>
      )}

      {description.faq.length > 0 && (
        <section className="product-faq product-reveal">
          <h2 className="h2">{description.faqTitle}</h2>
          <div className="faq-list">
            {description.faq.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                {item.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </details>
            ))}
          </div>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="product-related product-reveal">
          <h2 className="h2">{group.title}</h2>
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
