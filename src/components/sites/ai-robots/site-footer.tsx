import Link from "next/link";
import { asset, footerColumns, socialLinks, sourceUrl } from "./data";

export function SiteFooter() {
  return (
    <footer>
      {footerColumns.map((column) => (
        <div key={column.title} className="links">
          <button type="button">
            {column.title}
            <img src={asset("/icons/chevron-down.svg")} alt="" loading="lazy" width={24} height={24} />
          </button>
          {column.links.map((link) => (
            <a key={link.label} href={sourceUrl(link.href)}>
              {link.label}
            </a>
          ))}
        </div>
      ))}
      {socialLinks.map((link) => (
        <a key={link.label} className={link.className} href={link.href} target="_blank" rel="noopener">
          {link.label}
          <img className="icon" src={asset("/icons/arrow_right.svg")} alt="" loading="lazy" width={22} height={17} />
        </a>
      ))}
      <Link className="bottom-link brand" href="/">
        <img src={asset("/logos/ai_robots_logo.svg")} alt="Ai Robots Brand" loading="lazy" width={211} height={26} />
      </Link>
      <span className="last-elem-footer"> © All rights reserved 2026. </span>
      <span className="last-elem-footer"> © All rights reserved 2026. </span>
      <span className="last-elem-footer"> Greece </span>
      <a href="" className="last-elem-footer">
        Customer Service
      </a>
    </footer>
  );
}
