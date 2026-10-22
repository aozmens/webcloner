import { ArrowRight, ChevronsDown, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { iconFor } from "./icons";
import { leadSentence, pageHref, pages, productHref, productsHref } from "./links";
import { media, mediaByName } from "./media";
import { LineElement, Picture, PrimaryButton } from "./primitives";
import { withYears } from "./settings";
import { getSiteData, settingImage } from "./site-data";

function IconBadge({ icon: Icon, className }: { icon: LucideIcon; className: string }) {
  return (
    <div className={`icon-badge ${className}`}>
      <Icon aria-hidden strokeWidth={1.5} />
    </div>
  );
}

function ProgressBar({ id, variant }: { id: string; variant: "mobile-horizontal transition" | "desktop-vertical" }) {
  return (
    <div className={`bar ${variant}`} id={id}>
      <div className="loaded" />
      <div className="glow" />
    </div>
  );
}

export async function HeroSection() {
  const { settings, product } = await getSiteData();
  // Slides whose product is unpublished (or has no image) are skipped.
  const slides = settings.hero.slides.flatMap((slide) => {
    const p = product(slide.productSlug);
    const image = settingImage(slide.image, p);
    return p && image ? [{ ...slide, product: p, image, fit: slide.fit === "contain" ? "contain" : "cover" }] : [];
  });
  return (
    <section id="hero-section">
      <div className="hero-content">
        {slides.map((slide, index) => (
          <div key={`${slide.productSlug}-${index}`} className={index === 0 ? "content active" : "content"}>
            <LineElement> {slide.eyebrow} </LineElement>
            <h1 className="title h1">{slide.product.name}</h1>
            <p className="paragraph-1">{leadSentence(slide.product.shortDescription)}</p>
            <PrimaryButton href={productHref(slide.product)}>İncele</PrimaryButton>
          </div>
        ))}
      </div>
      <div className="splide" id="hero-splide">
        <div className="splide__arrows">
          <button className="splide__arrow splide__arrow--prev" type="button" aria-label="Önceki slayt">
            <ArrowRight aria-hidden strokeWidth={1.5} />
          </button>
          <button className="splide__arrow splide__arrow--next" type="button" aria-label="Sonraki slayt">
            <ArrowRight aria-hidden strokeWidth={1.5} />
          </button>
        </div>
        <div className="splide__track">
          <div className="splide__list">
            {slides.map((slide, index) => (
              <div key={`${slide.productSlug}-${index}`} className={`splide__slide fit-${slide.fit}`}>
                <Image
                  src={slide.image.src}
                  alt={slide.product.name}
                  width={slide.image.width}
                  height={slide.image.height}
                  className="shot"
                  sizes="100vw"
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  style={slide.position ? { objectPosition: slide.position } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-indicator">
          <div className="carousel-steps">
            {slides.map((slide, index) => (
              <button key={`${slide.step}-${index}`} type="button">
                {slide.step}
              </button>
            ))}
          </div>
          <div className="carousel-line">
            <span />
          </div>
        </div>
      </div>
      <div className="scroll-down">
        kaydırın
        <ChevronsDown aria-hidden strokeWidth={1.25} />
      </div>
    </section>
  );
}

export async function ReasonsSection() {
  const { settings, product } = await getSiteData();
  const robot = product("tru-50-3")?.images[0];
  return (
    <section id="autonomy-section">
      <div className="h2-wrapper">
        <h2 className="h1">{settings.reasons.title}</h2>
      </div>
      <div className="autonomy-robot">
        {robot && <Picture image={robot} alt="TRU-50-3 Parça Alma, Spreyleme ve Insert Uygulaması" sizes="(orientation: portrait) 90vw, 40vw" />}
      </div>
      <span className="blue-shade" aria-hidden />
      <span className="ellipse" aria-hidden />
      <div className="autonomy-details">
        {settings.reasons.items.map((reason, index) => (
          <div key={index} className="detail">
            <IconBadge icon={iconFor(reason.icon)} className="img" />
            <p>{reason.title}</p>
            <span>{reason.text}</span>
            <div className="autonomy-line" aria-hidden />
          </div>
        ))}
      </div>
    </section>
  );
}

export async function StrengthsSection() {
  const { settings, product, contact } = await getSiteData();
  const { strengths } = settings;
  const years = (text: string) => withYears(text, contact.experienceYears);
  const robot = product("robotik-polisaj")?.images[0];
  return (
    <section id="redefining-section">
      <div className="head">
        <div className="h2-wrapper">
          <h2 className="h1">{years(strengths.title)}</h2>
        </div>
        <p>{years(strengths.subtitle)}</p>
      </div>
      <div className="info">
        <h2>{strengths.heading}</h2>
        <span> {strengths.tagline} </span>
        <p>{years(strengths.text)}</p>
        <div className="splide">
          <div className="splide__track">
            <div className="splide__list">
              {strengths.cards.map((card, index) => (
                <div key={index} className="splide__slide with-border">
                  <strong className="shade" />
                  <strong className="shade" />
                  <IconBadge icon={iconFor(card.icon)} className="icon" />
                  <span> {years(card.title)} </span>
                  <p>{years(card.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bar-wrapper">
          <ProgressBar id="redefining-progress-bar" variant="mobile-horizontal transition" />
        </div>
      </div>
      <div className="redefining-robot">
        {robot && <Picture image={robot} alt="Robotik Polisaj Uygulaması" className="img" sizes="(orientation: portrait) 90vw, 60vw" />}
        <span className="ellipse" aria-hidden />
      </div>
    </section>
  );
}

export async function ProductsSection() {
  const { settings, product } = await getSiteData();
  const { showcase } = settings;
  const items = showcase.items.flatMap((item) => {
    const p = product(item.productSlug);
    const image = p?.images[item.productImage] ?? p?.images[0];
    return p && image ? [{ ...item, product: p, image }] : [];
  });
  return (
    <section id="target-section">
      <div className="head">
        <div className="h2-wrapper overflow-hidden">
          <h2 className="h1">{showcase.title}</h2>
        </div>
        <span>{showcase.text}</span>
        <div className="all-products">
          <PrimaryButton href={productsHref}>Tüm Ürünleri Gör</PrimaryButton>
        </div>
        <div className="progress">
          <ProgressBar id="target-progress-bar" variant="desktop-vertical" />
          <strong />
          <div className="steps-container">
            <div className="steps">
              {items.map((item, index) => (
                <span key={index}>{item.step}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="splide">
        <div className="splide__track">
          <div className="list splide__list">
            {items.map((item, index) => (
              <div key={index} className="item splide__slide">
                <p>
                  <a href={productHref(item.product)}>{item.product.name}</a>
                </p>
                <span>{item.product.shortDescription}</span>
                <Picture image={item.image} alt={item.product.name} className="media" sizes="(orientation: portrait) 80vw, 50vw" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bar-wrapper">
        <ProgressBar id="target-progress-bar-mob" variant="mobile-horizontal transition" />
      </div>
    </section>
  );
}

export async function ReferencesStrip() {
  const logos = (await getSiteData()).logos.slice(0, 12);
  if (logos.length === 0) return null;
  return (
    <section id="references-strip" aria-label="Referanslarımız">
      <div className="head">
        <h2 className="h2">Referanslarımız</h2>
        <a href={pageHref("references")} className="own-link">
          {pages.references.label}
        </a>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {[...logos, ...logos].map((logo, index) => (
            <span key={`${logo.src}-${index}`} className="logo-tile" aria-hidden={index >= logos.length}>
              <Image
                src={logo.src}
                alt={index < logos.length ? logo.alt || "Teknosem referansı" : ""}
                width={logo.width}
                height={logo.height}
                sizes="160px"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExpertSection() {
  return (
    <section id="future-section">
      <Picture image={mediaByName(media.home, "re-7")} alt="" className="bck" sizes="100vw" />
      <h2 className="h1">
        Doğru Çözümler için <br className="br-mobile br-tablet" /> Uzman <br className="br-desktop" /> Dokunuşu
      </h2>
      <p>
        Bilgi almak için veya teknik sorunlar ve kurulum talepleriniz için iletişim formunu doldurarak ya da iletişim bilgilerimizi kullanarak
        bizimle iletişime geçebilirsiniz.
      </p>
      <PrimaryButton href={pageHref("contact")}>Uzmanlarımıza Danışın</PrimaryButton>
    </section>
  );
}
