"use client";

import Link from "next/link";
import { useState } from "react";
import { asset, mobileMenu, mobileMenuTitles, sourceUrl, subNavs } from "./data";
import { Search } from "./search";
import { Sidecart } from "./sidecart";

const desktopLinks = ["humanoid", "quadruped", "digital human"];

export function Preloader() {
  return (
    <aside id="preloader" className="visible">
      <div className="logo intro">
        <img src={asset("/logos/ai_robots_logo.svg")} alt="Ai Robots Brand" width={211} height={26} />
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
        <Link href="/" className="brand-link home-link" aria-label="Click to go home">
          <img src={asset("/logos/ai_robots_logo.svg")} alt="Ai Robots Brand" width={211} height={26} fetchPriority="high" />
        </Link>
        <div className="menus">
          <button aria-label="Click to open mobile menu" id="hamburger" type="button" className={menuOpen ? "open" : undefined} onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </button>
          <Search />
          <span />
          <a href={sourceUrl("/access/signin")} target="_blank" rel="noopener" aria-label="Click to check account">
            <img src={asset("/icons/user.svg")} alt="User Account" width={17} height={20} />
          </a>
          <Sidecart />
        </div>
      </header>

      <nav style={{ "--desktopOpacity": 1 } as React.CSSProperties}>
        <Link href="/" className="nav-link home-link active">
          <img src={asset("/icons/home.png")} alt="" />
          home
        </Link>
        {desktopLinks.map((label) => (
          <li key={label} className="nav-link ">
            {label}
          </li>
        ))}
        <a href={sourceUrl("/industries")} className="nav-link ">
          industry
        </a>
        {subNavs.map((subNav) => (
          <div key={subNav.key} className="sub-nav" data-link={subNav.key}>
            {subNav.groups.map((group) => (
              <div key={group.title} className="group">
                <span>{group.title}</span>
                {group.links.map((link) => (
                  <a key={link.href} href={sourceUrl(link.href)}>
                    <img src={asset(link.image)} alt="" />
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
            {subNav.ownLink && (
              <a href={sourceUrl(subNav.ownLink.href)} className="own-link">
                {subNav.ownLink.label}
                <img src={asset("/icons/arrow_right.svg")} alt="" loading="lazy" width={22} height={17} />
              </a>
            )}
          </div>
        ))}
      </nav>

      <aside id="menu" className={menuOpen ? "open" : undefined}>
        <div className="menu-wrapper">
          <div className="accordion accordion-1 hidden accordion-group" />
          {mobileMenu.map((groups, index) => {
            const key = String(index);
            return (
              <div key={key} className={groupClass(key, 1)}>
                <button className="btn" type="button" onClick={() => toggleGroup(key)}>
                  {mobileMenuTitles[index]}
                  <img src={asset("/icons/chevron-down.svg")} alt="" loading="lazy" width={24} height={24} />
                </button>
                <div className="accordion child">
                  {groups.map((group, groupIndex) => {
                    const childKey = `${key}-${groupIndex}`;
                    return (
                      <div key={childKey} className={groupClass(childKey, 2)}>
                        <button className="btn" type="button" onClick={() => toggleGroup(childKey)}>
                          {group.title}
                          <img src={asset("/icons/chevron-down.svg")} alt="" loading="lazy" width={24} height={24} />
                        </button>
                        <div className="products child">
                          {group.links.map((link) => (
                            <a key={link.href} href={sourceUrl(link.href)}>
                              <img src={asset(link.image)} alt="" loading="lazy" />
                              <span>{link.label}</span>
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
          <div className="accordion accordion-1 hidden accordion-group">
            <a href={sourceUrl("/industries")} className="btn">
              industry
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
