import type { ReactNode } from "react";
import { buildNavData } from "./nav-data";
import { PageScripts, type PageKind } from "./page-scripts";
import { SiteFooter } from "./site-footer";
import { Preloader, SiteHeader } from "./site-header";

/** Page frame shared by every Teknosem route: header/nav, ScrollSmoother wrapper, footer and page scripts. */
export function SiteShell({ page, children }: { page: PageKind; children: ReactNode }) {
  return (
    <>
      {page === "home" && <Preloader />}
      <SiteHeader activeHome={page === "home"} nav={buildNavData()} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className={page === "home" ? undefined : `${page}-page`}>{children}</main>
          <SiteFooter />
        </div>
      </div>
      <PageScripts page={page} />
    </>
  );
}
