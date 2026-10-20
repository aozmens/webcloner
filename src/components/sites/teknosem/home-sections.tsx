import { ArrowRight, Award, Box, ChevronsDown, FlaskConical, KeyRound, PackageCheck, PenTool, ShieldCheck, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { leadSentence, media, pages, product, productHref, productsHref, type ImageAsset } from "./content";
import { LineElement, Picture, PrimaryButton } from "./primitives";

const mediaByName = (list: ImageAsset[], name: string) => {
  const found = list.find((image) => image.src.includes(name));
  if (!found) throw new Error(`Missing Teknosem image: ${name}`);
  return found;
};

type HeroSlide = {
  slug: string;
  eyebrow: string;
  step: string;
  image: ImageAsset;
  /** Renders shot on white are shown whole on a white slide instead of being cropped to 16:9. */
  fit: "cover" | "contain";
  position?: string;
};

const heroSlides: HeroSlide[] = [
  { slug: "ty-1000", eyebrow: "Spreyleme Üniteleri", step: "TY-1000", image: mediaByName(media.products, "deneme-15"), fit: "cover", position: "50% 45%" },
  { slug: "tru-13", eyebrow: "Robotik Uygulamalar", step: "TRU-13", image: mediaByName(media.home, "katalog-karakaya"), fit: "cover" },
  { slug: "ilc-cell", eyebrow: "Robotik Lazer Sistemleri", step: "iLC-Cell", image: product("ilc-cell").images[0], fit: "contain" },
  { slug: "tk-5", eyebrow: "Otomatik Kepçe Sistemleri", step: "TK-5", image: product("tk-5").images[1], fit: "contain" },
];

const reasons: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Box, title: "3D Özelleştirilmiş Üretim Çözümleri", text: "Fabrikanızda yapılan incelemeler sonrasında sizlere özel robotik hat çözümleri geliştirmekte." },
  {
    icon: PackageCheck,
    title: "Yedek Parça Teminatı",
    text: "Yedek parça teminatı, bir ürünün veya cihazın kullanımı sırasında meydana gelebilecek arızalar ya da aşınmalar için gerekli parçaların sağlanması sürecidir.",
  },
  { icon: PenTool, title: "İsteğe Özel Aksesuar Tasarımı", text: "Müşterilerimizin ihtiyaçları doğrultusunda özel imalat robot toolları geliştirmekteyiz." },
  {
    icon: ShieldCheck,
    title: "Üretici Firma Garantisi",
    text: "Teknosem olarak, üretici firma garantisi kapsamında müşterilerimize ürünlerimizin kalitesine ve dayanıklılığına dair güvence sunmaktayız.",
  },
];

const strengths: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FlaskConical,
    title: "Yenilikçi ve Güçlü Ar-Ge Altyapısı",
    text: "Teknosem, test ve analiz cihazları ile robotik otomasyon sistemleri alanında ileri düzey Ar-Ge çalışmaları yaparak, sektöre yenilikçi çözümler sunmaktadır.",
  },
  {
    icon: KeyRound,
    title: "Anahtar Teslim Çözümler",
    text: "Üretim ve yazılım süreçlerini kendi bünyesinde geliştiren Teknosem, müşteri ihtiyaçlarına özel anahtar teslim projeler sunarak verimli ve entegre çözümler sağlar.",
  },
  {
    icon: Award,
    title: "30 Yıllık Tecrübe ve Güven",
    text: "1994 yılından beri sektörde var olan Teknosem, güçlenerek gelen altyapısı ve deneyimli ekibi ile güvenilir, kaliteli ve yüksek performanslı ürünler üretmektedir.",
  },
];

const showcase = [
  { step: "HPDC Robot Sistemleri", slug: "ty-700-multi-axis", image: 0 },
  { step: "Robotik Uygulamalar", slug: "robotik-polisaj", image: 1 },
  { step: "Yardımcı Ekipman ve Aksesuarlar", slug: "tnd-4", image: 0 },
];

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

export function HeroSection() {
  return (
    <section id="hero-section">
      <div className="hero-content">
        {heroSlides.map((slide, index) => {
          const p = product(slide.slug);
          return (
            <div key={slide.slug} className={index === 0 ? "content active" : "content"}>
              <LineElement> {slide.eyebrow} </LineElement>
              <h1 className="title h1">{p.name}</h1>
              <p className="paragraph-1">{leadSentence(p.shortDescription)}</p>
              <PrimaryButton href={productHref(p)}>İncele</PrimaryButton>
            </div>
          );
        })}
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
            {heroSlides.map((slide, index) => (
              <div key={slide.slug} className={`splide__slide fit-${slide.fit}`}>
                <Image
                  src={slide.image.src}
                  alt={product(slide.slug).name}
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
            {heroSlides.map((slide) => (
              <button key={slide.step} type="button">
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

export function ReasonsSection() {
  const robot = product("tru-50-3").images[0];
  return (
    <section id="autonomy-section">
      <div className="h2-wrapper">
        <h2 className="h1">Neden TEKNOSEM?</h2>
      </div>
      <div className="autonomy-robot">
        <Picture image={robot} alt="TRU-50-3 Parça Alma, Spreyleme ve Insert Uygulaması" sizes="(orientation: portrait) 90vw, 40vw" />
      </div>
      <span className="blue-shade" aria-hidden />
      <span className="ellipse" aria-hidden />
      <div className="autonomy-details">
        {reasons.map((reason) => (
          <div key={reason.title} className="detail">
            <IconBadge icon={reason.icon} className="img" />
            <p>{reason.title}</p>
            <span>{reason.text}</span>
            <div className="autonomy-line" aria-hidden />
          </div>
        ))}
      </div>
    </section>
  );
}

export function StrengthsSection() {
  const robot = product("robotik-polisaj").images[0];
  return (
    <section id="redefining-section">
      <div className="head">
        <div className="h2-wrapper">
          <h2 className="h1">Teknosem – Yüksek Teknoloji ile Geleceğe Yön Veriyoruz</h2>
        </div>
        <p>30 Yıllık Tecrübe ve İnovasyonun Gücüyle Yanınızdayız</p>
      </div>
      <div className="info">
        <h2>TEKNOSEM</h2>
        <span> Teknolojik Çözüm Ortağınız </span>
        <p>
          Kuruluşundan bu yana Teknosem, test ve analiz cihazları ile robotik otomasyon sistemleri alanında faaliyet göstermektedir. Üretim ve
          yazılım süreçlerini kendi bünyesinde geliştirerek, müşterilerine anahtar teslim projeler sunmaktadır.
        </p>
        <div className="splide">
          <div className="splide__track">
            <div className="splide__list">
              {strengths.map((card) => (
                <div key={card.title} className="splide__slide with-border">
                  <strong className="shade" />
                  <strong className="shade" />
                  <IconBadge icon={card.icon} className="icon" />
                  <span> {card.title} </span>
                  <p>{card.text}</p>
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
        <Picture image={robot} alt="Robotik Polisaj Uygulaması" className="img" sizes="(orientation: portrait) 90vw, 60vw" />
        <span className="ellipse" aria-hidden />
      </div>
    </section>
  );
}

export function ProductsSection() {
  return (
    <section id="target-section">
      <div className="head">
        <div className="h2-wrapper overflow-hidden">
          <h2 className="h1">Ürünlerimiz</h2>
        </div>
        <span>
          Robotik sistemlerimiz, akademik bilgi ve mühendislik uzmanlığıyla endüstriyel üretimden sağlığa kadar geniş bir kullanım alanı sunar.
        </span>
        <div className="all-products">
          <PrimaryButton href={productsHref}>Tüm Ürünleri Gör</PrimaryButton>
        </div>
        <div className="progress">
          <ProgressBar id="target-progress-bar" variant="desktop-vertical" />
          <strong />
          <div className="steps-container">
            <div className="steps">
              {showcase.map((item) => (
                <span key={item.step}>{item.step}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="splide">
        <div className="splide__track">
          <div className="list splide__list">
            {showcase.map((item) => {
              const p = product(item.slug);
              return (
                <div key={item.slug} className="item splide__slide">
                  <p>
                    <a href={productHref(p)}>{p.name}</a>
                  </p>
                  <span>{p.shortDescription}</span>
                  <Picture image={p.images[item.image]} alt={p.name} className="media" sizes="(orientation: portrait) 80vw, 50vw" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bar-wrapper">
        <ProgressBar id="target-progress-bar-mob" variant="mobile-horizontal transition" />
      </div>
    </section>
  );
}

export function ReferencesStrip() {
  const logos = media.references.slice(0, 12);
  return (
    <section id="references-strip" aria-label="Referanslarımız">
      <div className="head">
        <h2 className="h2">Referanslarımız</h2>
        <a href={pages.references.href} className="own-link">
          {pages.references.label}
        </a>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {[...logos, ...logos].map((logo, index) => (
            <span key={`${logo.src}-${index}`} className="logo-tile" aria-hidden={index >= logos.length}>
              <Image src={logo.src} alt={index < logos.length ? "Teknosem referansı" : ""} width={logo.width} height={logo.height} sizes="160px" />
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
      <PrimaryButton href={pages.contact.href}>Uzmanlarımıza Danışın</PrimaryButton>
    </section>
  );
}
