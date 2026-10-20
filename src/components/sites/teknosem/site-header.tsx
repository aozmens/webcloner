"use client";

import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { company, corporateLinks, pages } from "./company";
import { TeknosemLogo } from "./logo";
import type { NavData, NavGroup } from "./nav-data";
import { ProductThumb } from "./primitives";
import { Search } from "./search";

const ALL_PRODUCTS = "Tüm Ürünleri Gör";

export function Preloader() {
  return (
    <aside id="preloader" className="visible">
      <div className="logo intro">
        <TeknosemLogo />
      </div>
    </aside>
  );
}

/** Mega panel column entry: a titled group lists its products; a one-product group is a single link. */
function MegaGroup({ group }: { group: NavGroup }) {
  if (group.products.length === 1) {
    const [only] = group.products;
    return (
      <div className="group">
        <a href={only.href} title={only.name}>
          <ProductThumb image={only.thumb} size={64} />
          {group.title}
        </a>
      </div>
    );
  }
  return (
    <div className="group">
      <span>{group.title}</span>
      {group.products.map((p) => (
        <a key={p.slug} href={p.href} title={p.name}>
          <ProductThumb image={p.thumb} size={64} />
          {p.short}
        </a>
      ))}
    </div>
  );
}

export function SiteHeader({ activeHome, nav }: { activeHome: boolean; nav: NavData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Expanded accordion keys: "urunler", "urunler/<category>", "urunler/<category>/<group>", "kurumsal".
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

  const groupClass = (key: string, level: 1 | 2 | 3) =>
    `${level === 1 ? "accordion accordion-1" : `accordion-${level}`}${expanded.has(key) ? "" : " hidden"} accordion-group`;

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
          <Search nav={nav} />
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
        <Link href="/" className={activeHome ? "nav-link home-link active" : "nav-link home-link"}>
          Ana Sayfa
        </Link>
        <a href={nav.productsHref} className="nav-link ">
          Ürünler
        </a>
        <li className="nav-link ">Kurumsal</li>

        <div className="sub-nav mega" data-link="Ürünler">
          {nav.categories.map((category) => (
            <div key={category.slug} className="mega-col">
              <a href={category.href} className="mega-category">
                {category.title}
              </a>
              {category.groups.map((group) => (
                <MegaGroup key={group.slug} group={group} />
              ))}
            </div>
          ))}
          <a href={nav.productsHref} className="own-link">
            {ALL_PRODUCTS}
            <ArrowRight aria-hidden />
          </a>
        </div>
        <div className="sub-nav corporate" data-link="Kurumsal">
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
          <div className={groupClass("urunler", 1)}>
            <button className="btn" type="button" onClick={() => toggleGroup("urunler")}>
              Ürünler
              <ChevronDown aria-hidden />
            </button>
            <div className="accordion child">
              <a href={nav.productsHref} className="all-products">
                {ALL_PRODUCTS}
                <ArrowRight aria-hidden />
              </a>
              {nav.categories.map((category) => {
                const categoryKey = `urunler/${category.slug}`;
                return (
                  <div key={category.slug} className={groupClass(categoryKey, 2)}>
                    <button className="btn" type="button" onClick={() => toggleGroup(categoryKey)}>
                      {category.title}
                      <ChevronDown aria-hidden />
                    </button>
                    <div className="child">
                      {category.groups.map((group) => {
                        const groupKey = `${categoryKey}/${group.slug}`;
                        return (
                          <div key={group.slug} className={groupClass(groupKey, 3)}>
                            <button className="btn" type="button" onClick={() => toggleGroup(groupKey)}>
                              {group.title}
                              <ChevronDown aria-hidden />
                            </button>
                            <div className="products child">
                              {group.products.map((p) => (
                                <a key={p.slug} href={p.href} title={p.name}>
                                  <ProductThumb image={p.thumb} size={160} />
                                  <span>{p.short}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={groupClass("kurumsal", 1)}>
            <button className="btn" type="button" onClick={() => toggleGroup("kurumsal")}>
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
