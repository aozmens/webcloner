"use client";

import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { categories, company, corporateLinks, pages, product, productHref, type ProductGroup } from "./content";
import { TeknosemLogo } from "./logo";
import { ProductThumb } from "./primitives";
import { Search } from "./search";

/** Desktop splits long groups into untitled columns; the mobile accordion shows them as one list. */
const mergeUntitled = (groups: ProductGroup[]) =>
  groups.reduce<ProductGroup[]>((merged, group) => {
    const last = merged[merged.length - 1];
    if (!group.title && last) merged[merged.length - 1] = { ...last, slugs: [...last.slugs, ...group.slugs] };
    else merged.push(group);
    return merged;
  }, []);

export function Preloader() {
  return (
    <aside id="preloader" className="visible">
      <div className="logo intro">
        <TeknosemLogo />
      </div>
    </aside>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Accordion keys that are expanded ("1" = first level, "1-0" = nested group).
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleMenu = () => {
    if (menuOpen) setExpanded(new Set());
    setMenuOpen(!menuOpen);
  };

  const toggleGroup = (key: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const groupClass = (key: string, level: 1 | 2) =>
    `${level === 1 ? "accordion accordion-1" : "accordion-2"}${expanded.has(key) ? "" : " hidden"} accordion-group`;

  return (
    <>
      <header style={{ "--desktopOpacity": 1 } as React.CSSProperties}>
        <Link href="/" className="brand-link home-link" aria-label="Ana sayfaya git">
          <TeknosemLogo />
        </Link>
        <div className="menus">
          <button aria-label="Mobil menüyü aç" id="hamburger" type="button" className={menuOpen ? "open" : undefined} onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </button>
          <Search />
          <span />
          <a href={company.whatsappHref} target="_blank" rel="noopener" aria-label="WhatsApp ile yazın">
            <MessageCircle aria-hidden />
          </a>
          <a href={pages.quote.href} className="quote-link">
            {pages.quote.label}
          </a>
        </div>
      </header>

      <nav style={{ "--desktopOpacity": 1 } as React.CSSProperties}>
        <Link href="/" className="nav-link home-link active">
          Ana Sayfa
        </Link>
        {categories.map((category) => (
          <li key={category.title} className="nav-link ">
            {category.title}
          </li>
        ))}
        <li className="nav-link ">Kurumsal</li>
        {categories.map((category) => (
          <div key={category.title} className="sub-nav" data-link={category.title}>
            {category.groups.map((group, index) => (
              <div key={`${group.title}-${index}`} className="group">
                <span>{group.title || " "}</span>
                {group.slugs.map((slug) => {
                  const p = product(slug);
                  return (
                    <a key={slug} href={productHref(p)}>
                      <ProductThumb image={p.images[0]} size={64} />
                      {p.name}
                    </a>
                  );
                })}
              </div>
            ))}
            <a href={category.href} className="own-link">
              {category.title}
              <ArrowRight aria-hidden />
            </a>
          </div>
        ))}
        <div className="sub-nav" data-link="Kurumsal">
          <div className="group">
            <span>Kurumsal</span>
            {corporateLinks.slice(0, 4).map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="group">
            <span>{" "}</span>
            {corporateLinks.slice(4).map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <aside id="menu" className={menuOpen ? "open" : undefined}>
        <div className="menu-wrapper">
          <div className="accordion accordion-1 hidden accordion-group" />
          {categories.map((category, index) => {
            const key = String(index);
            return (
              <div key={key} className={groupClass(key, 1)}>
                <button className="btn" type="button" onClick={() => toggleGroup(key)}>
                  {category.title}
                  <ChevronDown aria-hidden />
                </button>
                <div className="accordion child">
                  {mergeUntitled(category.groups).map((group, groupIndex) => {
                    const childKey = `${key}-${groupIndex}`;
                    return (
                      <div key={childKey} className={groupClass(childKey, 2)}>
                        <button className="btn" type="button" onClick={() => toggleGroup(childKey)}>
                          {group.title}
                          <ChevronDown aria-hidden />
                        </button>
                        <div className="products child">
                          {group.slugs.map((slug) => {
                            const p = product(slug);
                            return (
                              <a key={slug} href={productHref(p)}>
                                <ProductThumb image={p.images[0]} size={160} />
                                <span>{p.name}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className={groupClass("corporate", 1)}>
            <button className="btn" type="button" onClick={() => toggleGroup("corporate")}>
              Kurumsal
              <ChevronDown aria-hidden />
            </button>
            <div className="accordion child corporate-links">
              {corporateLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
