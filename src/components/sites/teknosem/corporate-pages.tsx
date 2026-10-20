// Corporate pages. Copy is taken verbatim from docs/teknosem-icerik/02_Kurumsal/*/icerik.md; the only edits are
// the agreed typo fixes ("HDPC" → "HPDC", "İHer" → "Her", "yada" → "ya da").

import fs from "node:fs";
import path from "node:path";
import { FileDown, KeyRound, Mail, MapPin, MessageCircle, PackageCheck, PenTool, Phone, Wrench, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import kvkkJson from "./content/kvkk.json";
import { catalog, company, manuals, media, pageHref, pages, product, productHref, shortName, type PageKey } from "./content";
import { ExpertSection } from "./home-sections";
import { LineElement, PrimaryButton } from "./primitives";
import { basePath } from "./site-config";
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

function ContactButtons() {
  return (
    <div className="product-actions">
      <a className="secondary-btn" href={company.phoneHref}>
        <Phone aria-hidden strokeWidth={1.5} />
        {company.phone}
      </a>
      <a className="secondary-btn" href={`mailto:${company.email}`}>
        <Mail aria-hidden strokeWidth={1.5} />
        {company.email}
      </a>
    </div>
  );
}

const productOptions = catalog.flatMap((category) =>
  category.groups.flatMap((group) => group.products.map((slug) => ({ value: slug, label: `${shortName(product(slug))} — ${category.title}` }))),
);

const kvkkHref = pageHref("kvkk");

/* ---------------------------------------------------------------- Hakkımızda */

export function AboutPage() {
  const image = media.about[0];
  return (
    <>
      <PageHero page="about" eyebrow="TEKNOSEM" title="Teknolojik Çözüm Ortağınız" image={{ ...image, alt: "Teknosem Robotic Automation System" }}>
        <p className="paragraph-1 text-start">
          Teknosem Test ve Analiz Cihazları Teknoloji Araştırma Sanayi Dış Ticaret A.Ş., 1994 yılında şahıs şirketi olarak kurulmuş ve üretime
          başlamıştır. Kuruluşundan bu yana Teknosem, test ve analiz cihazları ile robotik otomasyon sistemleri alanında faaliyet göstermektedir.
          Üretim ve yazılım süreçlerini kendi bünyesinde geliştirerek, müşterilerine anahtar teslim projeler sunmaktadır. Bu sayede, sektörde
          güvenilir ve yenilikçi çözümler üreterek, kullanıcılarına en yüksek verimliliği ve kaliteyi sağlamaktadır.
        </p>
      </PageHero>
      <section className="corporate-section product-reveal">
        <h2 className="h2">Hakkımızda</h2>
        <div className="product-prose">
          <p>
            Teknosem Test ve Analiz Cihazları Teknoloji Araştırma Sanayi Dış Ticaret A.Ş., 1994 yılında şahıs şirketi olarak kurulmuş ve üretime
            başlamıştır. 2006 yılında adını ve vizyonunu yenileyerek, hedeflerine ulaşmak için çalışmalarına hız kazandırmıştır. Güçlü altyapısı ve
            kurumsal kimliği ile sektördeki 31 yıllık tecrübesini kullanarak, Türkiye’de test ve analiz cihazları ile robotik otomasyon sistemleri
            alanında öncü adımlar atmaya devam etmektedir.
          </p>
          <p>
            Kuruluşundan bu yana Teknosem, test ve analiz cihazları ile robotik otomasyon sistemleri alanında faaliyet göstermektedir. Üretim ve
            yazılım süreçlerini kendi bünyesinde geliştirerek, müşterilerine anahtar teslim projeler sunmaktadır. Bu sayede, sektörde güvenilir ve
            yenilikçi çözümler üreterek, kullanıcılarına en yüksek verimliliği ve kaliteyi sağlamaktadır.
          </p>
          <p>
            Özellikle HPDC Sistemleri başta olmak üzere, farklı enjeksiyon sistemlerine uygun yağlama ve otomatik dozajlama robotları üretmektedir.
            Bu sistemler, sanayi üretim süreçlerinde verimliliği artırırken, maliyetleri düşürmekte ve üretim hatlarında maksimum hassasiyet
            sağlamaktadır. Teknosem’in geliştirdiği robotik çözümler, üretim süreçlerini optimize ederken, işletmelere rekabet avantajı
            kazandırmaktadır.
          </p>
          <p>
            Tasarım ve üretim sürecinde, alanında uzman akademisyenler ve üniversitelerle yapılan iş birlikleri sayesinde üretilen sistemlerin
            bilimselliği ve güncelliği en üst seviyede tutulmaktadır. Teknosem, sadece teknolojiyi takip eden değil, yeni teknolojiler üreten bir
            firma olma vizyonuyla hareket etmekte ve insana, çevreye duyarlı üretim anlayışını benimsemektedir.
          </p>
          <p>
            Teknosem, Ar-Ge çalışmalarıyla sektöre yenilikçi çözümler sunmaya devam ederken, kaliteli, dayanıklı ve yüksek performanslı test
            cihazları ve robotik otomasyon sistemleri ile geleceğe yön vermeyi amaçlamaktadır. Müşteri odaklı yaklaşımı ve sürekli gelişim anlayışı
            ile sektördeki lider konumunu pekiştirerek, ulusal ve uluslararası arenada başarılarına yenilerini eklemektedir.
          </p>
        </div>
      </section>
      <ExpertSection />
    </>
  );
}

/* ---------------------------------------------------------------- Hizmetler */

const services: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: KeyRound,
    title: "Anahtar Teslim Projeler",
    text: "Müşterilerimizin ihtiyaçlarına özel olarak tasarlanan anahtar teslim projeler sunuyoruz. Üretim tesisleri için eksiksiz sistem entegrasyonu sağlayarak, verimli ve sorunsuz bir çalışma ortamı oluşturuyoruz.",
  },
  {
    icon: Wrench,
    title: "Teknik Servis ve Satış Sonrası Destek",
    text: "Ürünlerimizin uzun ömürlü ve sorunsuz çalışmasını sağlamak için kapsamlı teknik servis ve satış sonrası destek hizmeti sunuyoruz. Hızlı müdahale ve yerinde servis imkanlarımızla müşteri memnuniyetini en üst seviyede tutuyoruz.",
  },
  {
    icon: PackageCheck,
    title: "Yedek Parça Teminatı",
    text: "Garantisi Dolmuş olan cihazlarınızın yedek parçalarını firmamızdan temin edebilirsiniz. Garantisi Bitmeyen cihazlarımız için dışarıdan alıp takılan parçalar cihazınızı garanti dışı bırakır.",
  },
  {
    icon: PenTool,
    title: "İsteğe Özel Aksesuar Tasarımı",
    text: "Endüstriyel üretim süreçlerini hızlandırmak, maliyetleri azaltmak ve verimliliği artırmak amacıyla özelleştirilmiş robotik sistemleri tasarlayıp üretiyoruz.",
  },
];

export function ServicesPage() {
  return (
    <>
      <PageHero page="services" eyebrow="TEKNOSEM" title="Teknosem Robotik Hizmetleri">
        <p className="paragraph-1 text-start">
          Teknosem olarak, robotik otomasyon sistemleri alanında yenilikçi ve güvenilir çözümler sunuyoruz. Üretim ve yazılım süreçlerini kendi
          bünyemizde geliştirerek, müşterilerimize yüksek kalite standartlarında hizmet sağlıyoruz.
        </p>
        <p className="corporate-tagline">Verimliliği Artıran Akıllı Sistemler Teknosem’de!</p>
      </PageHero>
      <section className="corporate-section product-reveal">
        <div className="corporate-cards">
          {services.map((service) => (
            <IconCard key={service.title} icon={service.icon} title={service.title}>
              <p>{service.text}</p>
            </IconCard>
          ))}
        </div>
      </section>
      <section className="corporate-section corporate-split product-reveal">
        <div>
          <LineElement> Teknosem </LineElement>
          <h2 className="h2">Uzmanlarımıza Danışın</h2>
        </div>
        <div className="product-prose">
          <p>
            Her sorununuz için doğru çözümler sunan deneyimli ekibimiz yanınızda! İhtiyaç duyduğunuz tüm bilgileri, teknik destek ve ürün
            tavsiyelerini uzmanlarımızla görüşerek öğrenebilirsiniz.
          </p>
          <p>
            Teknik sorularınız, proje talepleriniz ya da danışmanlık ihtiyaçlarınız için hemen bizimle iletişime geçin! Uzmanlarımız, size en kısa
            sürede geri dönüş yaparak ihtiyaçlarınıza yönelik çözümler sunacaktır.
          </p>
          <ContactButtons />
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- Referanslar */

export function ReferencesPage() {
  return (
    <>
      <PageHero page="references" eyebrow="TEKNOSEM" title="Referanslarımız" />
      <section className="corporate-section product-reveal">
        <div className="reference-grid">
          {media.references.map((logo, index) => (
            <span key={logo.src} className="logo-tile">
              <Image src={logo.src} alt={`Teknosem referansı ${index + 1}`} width={logo.width} height={logo.height} sizes="200px" />
            </span>
          ))}
        </div>
      </section>
      <ExpertSection />
    </>
  );
}

/* ---------------------------------------------------------------- İndirmeler */

function fileSize(src: string) {
  const file = path.join(process.cwd(), "public", src.slice(basePath.length));
  const mb = fs.statSync(file).size / 1024 / 1024;
  return `${mb.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} MB`;
}

export function DownloadsPage() {
  return (
    <>
      <PageHero page="downloads" eyebrow="TEKNOSEM" title="İndirme Merkezi">
        <p className="paragraph-1 text-start">İndirme merkeziyle istediğin dosyayı anında indir.</p>
      </PageHero>
      <section className="corporate-section product-reveal">
        <h2 className="h2">Kullanım Kılavuzları</h2>
        <ul className="download-list">
          {manuals.map((manual) => (
            <li key={manual.src} className="download-item with-border">
              <FileDown aria-hidden strokeWidth={1.25} className="download-icon" />
              <div className="download-info">
                <strong>
                  {manual.model} Kullanım Kılavuzu · {manual.version}
                </strong>
                <span>
                  <a href={productHref(manual.product)}>{manual.product.name}</a> · {manual.date} · PDF · {fileSize(manual.src)}
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

export function ContactPage() {
  const image = media.contact[0];
  const rows: { icon: LucideIcon; label: string; href: string }[] = [
    { icon: Phone, label: company.phone, href: company.phoneHref },
    { icon: Mail, label: company.email, href: `mailto:${company.email}` },
    { icon: MessageCircle, label: `WhatsApp: ${company.whatsapp}`, href: company.whatsappHref },
    { icon: MapPin, label: company.address, href: "#harita" },
  ];
  const social = [
    { label: "Linkedin", href: company.social.linkedin },
    { label: "Facebook", href: company.social.facebook },
    { label: "Instagram", href: company.social.instagram },
    { label: "Youtube", href: company.social.youtube },
  ];
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
        <WhatsAppForm subject="İletişim formu (teknosem web sitesi)" fields={contactFields} whatsappNumber={company.whatsappNumber} kvkkHref={kvkkHref} />
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

const quoteFields: FormField[] = [
  { name: "adSoyad", label: "Ad Soyad", required: true, autoComplete: "name" },
  { name: "firma", label: "Firma", autoComplete: "organization" },
  { name: "telefon", label: "Telefon", type: "tel", required: true, autoComplete: "tel" },
  { name: "eposta", label: "E-posta", type: "email", autoComplete: "email" },
  { name: "urun", label: "İlgilendiğiniz ürün", type: "select", options: productOptions, queryParam: "urun" },
  { name: "mesaj", label: "Mesajınız", type: "textarea", required: true },
];

const quoteSteps = [
  { title: "Formu Doldurun", text: "Gereken bilgileri eksiksiz doldurarak gönderin." },
  { title: "Uzmanlarımız İncelesin", text: "Talepleriniz doğrultusunda detaylı inceleme yapılır." },
  { title: "Teklifinizi Alın", text: "En uygun fiyat ve çözüm önerileri kısa sürede size sunulur." },
];

export function QuotePage() {
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
        <WhatsAppForm subject="Teklif talebi (teknosem web sitesi)" fields={quoteFields} whatsappNumber={company.whatsappNumber} kvkkHref={kvkkHref} />
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- Servis Talebi */

const serviceFields: FormField[] = [
  { name: "adSoyad", label: "Ad Soyad", required: true, autoComplete: "name" },
  { name: "firma", label: "Firma", autoComplete: "organization" },
  { name: "telefon", label: "Telefon", type: "tel", required: true, autoComplete: "tel" },
  { name: "urun", label: "Ürün", type: "select", options: productOptions, queryParam: "urun" },
  { name: "talep", label: "Talebiniz", type: "textarea", required: true },
];

export function ServiceRequestPage() {
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
            <PrimaryButton href={company.whatsappHref} external>
              WhatsApp Destek Hattı
            </PrimaryButton>
          </div>
        </div>
        <WhatsAppForm subject="Servis talebi (teknosem web sitesi)" fields={serviceFields} whatsappNumber={company.whatsappNumber} kvkkHref={kvkkHref} />
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- İnsan Kaynakları */

export function CareersPage() {
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
        <a className="apply-mail" href={`mailto:${company.email}`}>
          <Mail aria-hidden strokeWidth={1.5} />
          {company.email}
        </a>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- KVKK */

const kvkk = kvkkJson as string[];
const isKvkkHeading = (text: string) => text.length <= 80 && !/[.;:,]$/.test(text);
const isKvkkItem = (text: string) => /^[a-zçğ]\.\s/.test(text);

export function KvkkPage() {
  const [title, ...body] = kvkk;
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
        <p className="corporate-tagline">{title}</p>
      </PageHero>
      <section className="corporate-section product-reveal">
        <div className="product-prose legal-text">{blocks}</div>
      </section>
    </>
  );
}
