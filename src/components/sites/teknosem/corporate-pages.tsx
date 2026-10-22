// Corporate pages. Texts edited in the panel (Hakkımızda, Hizmetler, KVKK, contact details) come from
// site_settings; the rest is the copy from docs/teknosem-icerik/02_Kurumsal/*/icerik.md with the agreed typo
// fixes ("HDPC" → "HPDC", "İHer" → "Her", "yada" → "ya da").

import { FileDown, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ExpertSection } from "./home-sections";
import { iconFor } from "./icons";
import { formatSize, pageHref, pages, productHref, type PageKey } from "./links";
import { media } from "./media";
import { LineElement, PrimaryButton } from "./primitives";
import { paragraphs, withYears, type ContactInfo } from "./settings";
import { getSiteData, type Category } from "./site-data";
import { WhatsAppForm, type FormField } from "./whatsapp-form";

function PageHero({ page, eyebrow, title, children, image }: { page: PageKey; eyebrow?: string; title: string; children?: ReactNode; image?: { src: string; width: number; height: number; alt: string } }) {
  return (
    <section className={image ? "product-hero corporate-hero with-image" : "product-hero corporate-hero"}>
      <div className="breadcrumb" role="navigation" aria-label="Sayfa yolu">
        <Link href="/">Ana Sayfa</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{pages[page].label}</span>
      </div>
      <div className="catalog-intro">
        {eyebrow && <LineElement> {eyebrow} </LineElement>}
        <h1 className="h1">{title}</h1>
        {children}
      </div>
      {image && (
        <div className="corporate-image">
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(orientation: portrait) 92vw, 40vw" priority />
        </div>
      )}
    </section>
  );
}

function IconCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="corporate-card with-border">
      <strong className="shade" />
      <div className="icon-badge card-icon">
        <Icon aria-hidden strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

function ContactButtons({ contact }: { contact: ContactInfo }) {
  return (
    <div className="product-actions">
      <a className="secondary-btn" href={contact.phoneHref}>
        <Phone aria-hidden strokeWidth={1.5} />
        {contact.phone}
      </a>
      <a className="secondary-btn" href={`mailto:${contact.email}`}>
        <Mail aria-hidden strokeWidth={1.5} />
        {contact.email}
      </a>
    </div>
  );
}

const productOptions = (catalog: Category[]) =>
  catalog.flatMap((category) => category.groups.flatMap((group) => group.products.map((p) => ({ value: p.slug, label: `${p.shortName} — ${category.title}` }))));

const kvkkHref = pageHref("kvkk");

/* ---------------------------------------------------------------- Hakkımızda */

export async function AboutPage() {
  const { settings, contact } = await getSiteData();
  const { about } = settings;
  const years = (text: string) => withYears(text, contact.experienceYears);
  const image = media.about[0];
  return (
    <>
      <PageHero page="about" eyebrow={about.eyebrow} title={about.title} image={{ ...image, alt: "Teknosem Robotic Automation System" }}>
        <p className="paragraph-1 text-start">{years(about.intro)}</p>
      </PageHero>
      <section className="corporate-section product-reveal">
        <h2 className="h2">{about.heading}</h2>
        <div className="product-prose">
          {paragraphs(years(about.body)).map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>
      <ExpertSection />
    </>
  );
}

/* ---------------------------------------------------------------- Hizmetler */

export async function ServicesPage() {
  const { settings, contact } = await getSiteData();
  const { services } = settings;
  return (
    <>
      <PageHero page="services" eyebrow="TEKNOSEM" title={services.title}>
        <p className="paragraph-1 text-start">{services.intro}</p>
        {services.tagline && <p className="corporate-tagline">{services.tagline}</p>}
      </PageHero>
      <section className="corporate-section product-reveal">
        <div className="corporate-cards">
          {services.cards.map((service, index) => (
            <IconCard key={index} icon={iconFor(service.icon)} title={service.title}>
              <p>{service.text}</p>
            </IconCard>
          ))}
        </div>
      </section>
      <section className="corporate-section corporate-split product-reveal">
        <div>
          <LineElement> Teknosem </LineElement>
          <h2 className="h2">{services.consultTitle}</h2>
        </div>
        <div className="product-prose">
          {paragraphs(services.consultText).map((text) => (
            <p key={text}>{text}</p>
          ))}
          <ContactButtons contact={contact} />
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- Referanslar */

export async function ReferencesPage() {
  const { logos } = await getSiteData();
  return (
    <>
      <PageHero page="references" eyebrow="TEKNOSEM" title="Referanslarımız" />
      <section className="corporate-section product-reveal">
        <div className="reference-grid">
          {logos.map((logo, index) => (
            <span key={logo.src} className="logo-tile">
              <Image src={logo.src} alt={logo.alt || `Teknosem referansı ${index + 1}`} width={logo.width} height={logo.height} sizes="200px" />
            </span>
          ))}
        </div>
      </section>
      <ExpertSection />
    </>
  );
}

/* ---------------------------------------------------------------- İndirmeler */

export async function DownloadsPage() {
  const { manuals } = await getSiteData();
  return (
    <>
      <PageHero page="downloads" eyebrow="TEKNOSEM" title="İndirme Merkezi">
        <p className="paragraph-1 text-start">İndirme merkeziyle istediğin dosyayı anında indir.</p>
      </PageHero>
      <section className="corporate-section product-reveal">
        <h2 className="h2">Kullanım Kılavuzları</h2>
        <ul className="download-list">
          {manuals.map((manual) => (
            <li key={manual.id} className="download-item with-border">
              <FileDown aria-hidden strokeWidth={1.25} className="download-icon" />
              <div className="download-info">
                <strong>
                  {manual.title}
                  {manual.version && ` · ${manual.version}`}
                </strong>
                <span>
                  {[
                    manual.product && (
                      <a key="product" href={productHref(manual.product)}>
                        {manual.product.name}
                      </a>
                    ),
                    manual.date,
                    "PDF",
                    formatSize(manual.size),
                  ]
                    .filter(Boolean)
                    .flatMap((part, index) => (index > 0 ? [" · ", part] : [part]))}
                </span>
              </div>
              <a className="secondary-btn" href={manual.src} target="_blank" rel="noopener" download>
                İndir
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- İletişim */

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1508.2556331049457!2d29.34415653912988!3d40.88259857073338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cad96d753942c9%3A0xe2380e17603fae97!2zTWVzY2l0LCBBeWTEsW5sxLEgWW9sdSBDZC4gTm86MTYsIDM0OTU2IFR1emxhL8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1746086318215!5m2!1str!2str";

const contactFields: FormField[] = [
  { name: "adSoyad", label: "Ad Soyad", required: true, autoComplete: "name" },
  { name: "telefon", label: "Telefon", type: "tel", autoComplete: "tel" },
  { name: "eposta", label: "E-posta", type: "email", autoComplete: "email" },
  { name: "konu", label: "Konu" },
  { name: "mesaj", label: "Mesajınız", type: "textarea", required: true },
];

export async function ContactPage() {
  const { contact } = await getSiteData();
  const image = media.contact[0];
  const rows: { icon: LucideIcon; label: string; href: string }[] = [
    { icon: Phone, label: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
    { icon: MessageCircle, label: `WhatsApp: ${contact.whatsapp}`, href: contact.whatsappHref },
    { icon: MapPin, label: contact.address, href: "#harita" },
  ];
  const social = [
    { label: "Linkedin", href: contact.social.linkedin },
    { label: "Facebook", href: contact.social.facebook },
    { label: "Instagram", href: contact.social.instagram },
    { label: "Youtube", href: contact.social.youtube },
  ].filter((item) => item.href);
  return (
    <>
      <PageHero page="contact" title="Bize Ulaşın" image={{ ...image, alt: "Teknosem" }}>
        <ul className="contact-list">
          {rows.map((row) => (
            <li key={row.label}>
              <a href={row.href} {...(row.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                <row.icon aria-hidden strokeWidth={1.5} />
                {row.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="product-actions">
          {social.map((item) => (
            <a key={item.label} className="secondary-btn" href={item.href} target="_blank" rel="noopener">
              {item.label}
            </a>
          ))}
        </div>
      </PageHero>
      <section className="corporate-section corporate-split product-reveal">
        <div>
          <h2 className="h2">Uzmanlarımıza Danışın</h2>
          <p className="paragraph-1 text-start">
            Bilgi almak için veya teknik sorunlar ve kurulum talepleriniz için iletişim formunu doldurarak ya da iletişim bilgilerimizi kullanarak
            bizimle iletişime geçebilirsiniz.
          </p>
        </div>
        <WhatsAppForm kind="contact" subject="İletişim formu (teknosem web sitesi)" fields={contactFields} whatsappNumber={contact.whatsappNumber} kvkkHref={kvkkHref} />
      </section>
      <section className="corporate-section product-reveal" id="harita">
        <div className="map-frame">
          <iframe src={MAP_EMBED} title="Teknosem konum haritası" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- Teklif Al */

const quoteSteps = [
  { title: "Formu Doldurun", text: "Gereken bilgileri eksiksiz doldurarak gönderin." },
  { title: "Uzmanlarımız İncelesin", text: "Talepleriniz doğrultusunda detaylı inceleme yapılır." },
  { title: "Teklifinizi Alın", text: "En uygun fiyat ve çözüm önerileri kısa sürede size sunulur." },
];

export async function QuotePage() {
  const { catalog, contact } = await getSiteData();
  const quoteFields: FormField[] = [
    { name: "adSoyad", label: "Ad Soyad", required: true, autoComplete: "name" },
    { name: "firma", label: "Firma", autoComplete: "organization" },
    { name: "telefon", label: "Telefon", type: "tel", required: true, autoComplete: "tel" },
    { name: "eposta", label: "E-posta", type: "email", autoComplete: "email" },
    { name: "urun", label: "İlgilendiğiniz ürün", type: "select", options: productOptions(catalog), queryParam: "urun" },
    { name: "mesaj", label: "Mesajınız", type: "textarea", required: true },
  ];
  return (
    <>
      <PageHero page="quote" eyebrow="TEKNOSEM" title="İhtiyaçlarınıza Özel Laboratuvar Çözümleri Sunuyoruz!">
        <p className="paragraph-1 text-start">
          TEKNOSEM olarak laboratuvar projelerinize en uygun çözümleri sağlamak için buradayız. Gelişmiş ekipmanlarımızla araştırma, üretim ve
          kalite kontrol süreçlerinizi güçlendiriyoruz. Size özel fiyat teklifi almak için aşağıdaki formu doldurun. Profesyonel ekibimiz en kısa
          sürede sizinle iletişime geçerek ihtiyacınıza yönelik en iyi çözümü sunacaktır.
        </p>
      </PageHero>
      <section className="corporate-section product-reveal">
        <h2 className="h2">Teklif Süreci</h2>
        <ol className="process-steps">
          {quoteSteps.map((step, index) => (
            <li key={step.title} className="with-border">
              <span className="step-number">{index + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="corporate-section corporate-split product-reveal">
        <div>
          <h2 className="h2">Teklif Alın</h2>
          <p className="paragraph-1 text-start">
            İhtiyaçlarınıza en uygun laboratuvar ekipmanlarını ve çözümleri sunuyoruz! Size özel fiyat teklifi almak için aşağıdaki formu
            doldurun. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.
          </p>
        </div>
        <WhatsAppForm kind="quote" subject="Teklif talebi (teknosem web sitesi)" fields={quoteFields} whatsappNumber={contact.whatsappNumber} kvkkHref={kvkkHref} />
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- Servis Talebi */

export async function ServiceRequestPage() {
  const { catalog, contact } = await getSiteData();
  const serviceFields: FormField[] = [
    { name: "adSoyad", label: "Ad Soyad", required: true, autoComplete: "name" },
    { name: "firma", label: "Firma", autoComplete: "organization" },
    { name: "telefon", label: "Telefon", type: "tel", required: true, autoComplete: "tel" },
    { name: "urun", label: "Ürün", type: "select", options: productOptions(catalog), queryParam: "urun" },
    { name: "talep", label: "Talebiniz", type: "textarea", required: true },
  ];
  return (
    <>
      <PageHero page="service" eyebrow="TEKNOSEM" title="Servis Talebi">
        <p className="paragraph-1 text-start">Teknik Destek Servis Talebiniz için buradayız.</p>
      </PageHero>
      <section className="corporate-section corporate-split product-reveal">
        <div>
          <h2 className="h2">Teknik Destek Formu</h2>
          <h3 className="corporate-subtitle">Hızlı ve Güvenilir Destek – Teknosem Yanınızda!</h3>
          <p className="paragraph-1 text-start">
            Teknosem olarak, sadece yüksek teknoloji ürünler sunmakla kalmıyor, aynı zamanda müşterilerimize kapsamlı teknik destek hizmetleri
            sağlıyoruz. Uzman ekibimiz, cihazlarınızın sorunsuz bir şekilde çalışmasını sağlamak için her zaman yanınızda.
          </p>
          <div className="product-actions">
            <PrimaryButton href={contact.whatsappHref} external>
              WhatsApp Destek Hattı
            </PrimaryButton>
          </div>
        </div>
        <WhatsAppForm kind="service" subject="Servis talebi (teknosem web sitesi)" fields={serviceFields} whatsappNumber={contact.whatsappNumber} kvkkHref={kvkkHref} />
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- İnsan Kaynakları */

export async function CareersPage() {
  const { contact } = await getSiteData();
  return (
    <>
      <PageHero page="careers" eyebrow="TEKNOSEM" title="Teknosem Ailesine Katılın: Birlikte Geleceği Tasarlayalım">
        <p className="paragraph-1 text-start">
          Teknosem olarak, gelişimin ve inovasyonun gücüne inanıyoruz. Çalışanlarımız, başarımızın temel taşlarıdır. Siz de dinamik ekibimize
          katılarak teknolojiyi şekillendiren ve sektörümüze yön veren bir organizasyonun parçası olabilirsiniz.
        </p>
      </PageHero>
      <section className="corporate-section corporate-split product-reveal">
        <div>
          <h2 className="h2">Teknosem’de Kariyerinize Yeni Bir Başlangıç Yapın!</h2>
          <p className="paragraph-1 text-start">
            Teknosem’de çalışmak sadece bir iş değil; gelişen bir ekosistemin parçası olmak demek. Siz de bu yolculukta bize katılın, birlikte
            teknolojinin geleceğini şekillendirelim!
          </p>
        </div>
        <div className="product-prose">
          <h3>Neden Teknosem’de Çalışmalısınız?</h3>
          <ul>
            <li>Yeni fikirlerinizi özgürce ifade edebilir, teknolojiye katkı sağlayabilirsiniz.</li>
            <li>Kişisel ve profesyonel gelişiminiz için eğitimler ve atölyeler düzenliyoruz.</li>
            <li>Başarılarımızı ekip çalışmasıyla büyütüyor, birlikte öğrenip gelişiyoruz.</li>
            <li>İnsana ve çevreye duyarlı üretim anlayışımızla sürdürülebilir bir geleceği destekliyoruz.</li>
          </ul>
        </div>
      </section>
      <section className="corporate-section apply-box product-reveal">
        <h2 className="h2">Şimdi Başvurun</h2>
        <a className="apply-mail" href={`mailto:${contact.email}`}>
          <Mail aria-hidden strokeWidth={1.5} />
          {contact.email}
        </a>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- KVKK */

const isKvkkHeading = (text: string) => text.length <= 80 && !/[.;:,]$/.test(text);
const isKvkkItem = (text: string) => /^[a-zçğ]\.\s/.test(text);

export async function KvkkPage() {
  const { settings } = await getSiteData();
  const body = paragraphs(settings.kvkk.body);
  const blocks: ReactNode[] = [];
  for (let i = 0; i < body.length; i++) {
    const text = body[i];
    if (isKvkkItem(text)) {
      const items = [text];
      while (i + 1 < body.length && isKvkkItem(body[i + 1])) items.push(body[++i]);
      blocks.push(
        <ul key={i} className="lettered">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>,
      );
    } else if (isKvkkHeading(text)) blocks.push(<h2 key={i}>{text}</h2>);
    else blocks.push(<p key={i}>{text}</p>);
  }
  return (
    <>
      <PageHero page="kvkk" title={pages.kvkk.label}>
        <p className="corporate-tagline">{settings.kvkk.title}</p>
      </PageHero>
      <section className="corporate-section product-reveal">
        <div className="product-prose legal-text">{blocks}</div>
      </section>
    </>
  );
}
