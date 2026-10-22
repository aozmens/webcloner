import type { ReactNode } from "react";
import { buildNavData } from "./nav-data";
import { PageScripts, type PageKind } from "./page-scripts";
import { getSiteData } from "./site-data";
import { SiteFooter } from "./site-footer";
import { Preloader, SiteHeader } from "./site-header";

/** Page frame shared by every Teknosem route: header/nav, ScrollSmoother wrapper, footer and page scripts. */
export async function SiteShell({ page, children }: { page: PageKind; children: ReactNode }) {
  const data = await getSiteData();
  return (
    <>
      {page === "home" && <Preloader />}
      <SiteHeader activeHome={page === "home"} nav={buildNavData(data)} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className={page === "home" ? undefined : `${page}-page`}>{children}</main>
          <SiteFooter catalog={data.catalog} contact={data.contact} />
        </div>
      </div>
      <PageScripts page={page} />
    </>
  );
}
