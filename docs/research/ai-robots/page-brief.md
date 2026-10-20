# AI Robots — home page brief

Source: https://ai-robots.apps.mdxpreview.xyz/ (Astro 5 + GSAP 3.13 ScrollTrigger/ScrollSmoother + Splide 4.1.4, Work Sans).
Local route: `/` → `src/app/page.tsx`.

## Files
- `src/components/sites/ai-robots/ai-robots.css` — source stylesheets ported verbatim. Astro `[data-astro-cid-*]` scoping is rewritten to `:not(.\#)` so specificity is unchanged. Without it, the global `a{border:none}` reset strips the footer dividers.
- `page-scripts.tsx` — ported behavior: preloader → header/nav/hero intro, ScrollSmoother (`smooth 1.5, speed .5`, landscape only), keyboard scrolling, sub-nav hover timelines, footer accordion (portrait phone), hero fade-type Splide with clip-path wipes, scroll-scrubbed autonomy/redefining/target (pinned head)/future timelines, and Splide carousels in portrait.
- `site-header.tsx` (header, desktop nav and sub-navs, mobile accordion menu), `search.tsx`, `sidecart.tsx`, `site-footer.tsx`, `home-sections.tsx`, `data.ts`, `pictures.ts` (srcsets extracted from the source).
- Assets: `public/sites/ai-robots/` (`_astro/*` → `img/`). The list of source URLs is in `asset-urls.txt`.

## Responsive rules (from source CSS)
`--fs` = .85vw landscape, 3.5vw portrait phone (aspect < .625), 2vw portrait tablet. Additional rules apply at landscape aspect ≥ 1.8 and ≥ 2.

## Known source behavior reproduced
- `/api/products` and `/api/predictive-search` return 404 on the source, so search always shows "No products found". The cart is always empty.
- The hero step labels (H2/B2/Go2/B2-w) sit under `.hero-content` and are not clickable on the source either.
- The home links prevent the default click action on `/`.
