import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { catalog, categoryHref, company, pageHref, pages } from "./content";
import { CurrentYear } from "./current-year";
import { TeknosemLogo } from "./logo";

type FooterColumn = { title: string; links: { label: string; href: string }[] };

// One column per catalog category (its groups link to /urunler/<kategori>#<grup>), then Kurumsal and İletişim.
const columns: FooterColumn[] = [
  ...catalog.map((category) => ({
    title: category.title,
    links: category.groups.map((group) => ({ label: group.title, href: categoryHref(category, group) })),
  })),
  { title: "Kurumsal", links: (["about", "contact", "quote", "services", "kvkk"] as const).map((key) => ({ label: pages[key].label, href: pageHref(key) })) },
  {
    title: "İletişim",
    links: [
      { label: `Arayın: ${company.phone}`, href: company.phoneHref },
      { label: `Mail gönderin: ${company.email}`, href: `mailto:${company.email}` },
      { label: `WhatsApp: ${company.whatsapp}`, href: company.whatsappHref },
      { label: company.address, href: pageHref("contact") },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: company.social.instagram, className: "bottom-link" },
  { label: "Linkedin", href: company.social.linkedin, className: "bottom-link desc-link" },
  { label: "Facebook", href: company.social.facebook, className: "bottom-link" },
];

export function SiteFooter() {
  return (
    <footer>
      {columns.map((column) => (
        <div key={column.title} className="links">
          <button type="button">
            {column.title}
            <ChevronDown aria-hidden />
          </button>
          {column.links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      ))}
      {socialLinks.map((link) => (
        <a key={link.label} className={link.className} href={link.href} target="_blank" rel="noopener">
          {link.label}
          <ArrowRight className="icon" aria-hidden strokeWidth={1.5} />
        </a>
      ))}
      <Link className="bottom-link brand" href="/" aria-label="Teknosem ana sayfa">
        <TeknosemLogo />
      </Link>
      <span className="last-elem-footer">
        {" "}
        © <CurrentYear /> Teknosem{" "}
      </span>
      <span className="last-elem-footer"> {company.legalName} </span>
      <span className="last-elem-footer"> {company.city} </span>
      <a href={pageHref("kvkk")} className="last-elem-footer">
        KVKK
      </a>
    </footer>
  );
}
