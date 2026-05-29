# Protected elements

10 categories that may NOT be modified, removed, or refactored without explicit instruction. Each one is anchored to a current Google source that explains why it matters. A change that "looks safe" because it doesn't visually affect the page can still drop rankings overnight.

## The 10 categories

### 1. JSON-LD schemas

`HVACBusiness`, `WebSite`, `Service`, `FAQPage`, `BreadcrumbList`, `ItemList`, `Article`, `Person`, `EducationalOrganization`. Plus `HowTo` on `/diagnostico/` (currently shipping; **deprecated rich result since Aug 2023** — see [json-ld-catalog.md](json-ld-catalog.md)).

> "You must include all the required properties for an object to be eligible for appearance in Google Search with enhanced display."
> — [Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

Must stay valid AND minified (`JSON.stringify(obj)` without indent). Validate every change with [Rich Results Test](https://search.google.com/test/rich-results).

### 2. Meta tags

`title`, `description`, `keywords` (legacy, no ranking value but documented in our setup), OpenGraph (`og:*`), Twitter Cards. Driven by `generateMetadata()` per page. Localized via `next-intl`.

### 3. Canonical URLs + hreflang alternates

> "Each language version must list itself as well as all other language versions."
> "If two pages don't both point to each other, the tags will be ignored."
> — [Localized versions docs](https://developers.google.com/search/docs/specialty/international/localized-versions)

Per-page, self-referencing. Bidirectional. Don't touch URL shape or `getLocalePrefix` logic. See [i18n-hreflang.md](i18n-hreflang.md).

### 4. `robots.txt` + `sitemap.ts`

`robots.txt` explicitly allows AI crawlers (GPTBot, ClaudeBot, CCBot, PerplexityBot, Google-Extended, etc.). Sitemap is dynamic and includes Supabase articles. See [sitemap-and-robots.md](sitemap-and-robots.md).

### 5. Middleware redirects

`www → non-www`, `/es/ → /`, old-slug redirects. Order matters — don't reorder. File: `middleware.ts`.

> "When you do change URLs, make sure to use 301 (permanent) redirects."
> — [Change page URLs with 301 redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)

### 6. Semantic HTML landmarks

`<main id="main-content">`, `<article>`, `<nav>`, `<header>`, `<footer>`, `aria-label`/`aria-labelledby` on regions. Don't replace landmarks with `<div>`s.

Google's general indexing relies on heading structure and landmark roles for content understanding (implicit in [JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)).

### 7. `data-ai-summary="true"` block

In `app/[locale]/layout.tsx` and `app/(es)/layout.tsx`. An `sr-only` paragraph with a plain-language summary for LLMs/AI Overviews.

This is NOT structured data (it's HTML text), so [SD policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) about visibility don't apply. It's a screen-reader-accessible block, intentionally not shown to sighted users. Don't remove "to clean up the DOM" — invisibility to humans, visibility to bots is the point.

See [ai-seo-aeo.md](ai-seo-aeo.md).

### 8. Analytics tracking calls

GA4, Yandex.Metrika, Meta Pixel. Components `LazyAnalytics`, `GoogleAnalytics`, `YandexMetrika`, `MetaPixel` defer scripts until first interaction or 3s idle.

> "Reducing the size of JavaScript bundles ... or moving JavaScript off the main thread ... improves INP."
> — [INP optimization](https://web.dev/articles/inp)

Don't switch to `strategy="beforeInteractive"` or remove deferral — it's tuned for LCP + INP.

### 9. E-E-A-T signals

`src/lib/author-data.ts` (Person + EducationalOrganization + `knowsAbout`) and `AuthorBio` component.

> "Is it self-evident to your visitors who authored your content?"
> "Do pages carry a byline, where one might be expected? Do bylines lead to further information about the author or authors involved?"
> — [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

The site-owner credentials shipped as schema + visible author block are a ranking moat for a single-operator HVAC business. See [json-ld-catalog.md](json-ld-catalog.md) → Article + Person.

### 10. Geo meta tags

`geo.region=PA`, `geo.placename=Ciudad de Panamá`, `geo.country=Panama`, `ICBM=9.0820,-79.4761`. In root `<head>`.

Google does not document a current use for these specific meta names, but Bing and other engines still ingest them. No downside to keeping; potential downside to removing.

## Post-change checklist

Run on every PR that touches the surface:

- [ ] `h1` still present, unique per page
- [ ] All JSON-LD blocks parse and pass [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] `<title>` / `<meta description>` unchanged unless intentional
- [ ] Self-referencing `<link rel="canonical">` + bidirectional `hreflang` alternates present
- [ ] Breadcrumbs render (where applicable) and match URL hierarchy
- [ ] FAQ schema on each `/servicios/<slug>/` page (still valid even though rich result deprecated — kept for AEO)
- [ ] `data-ai-summary` block in layout DOM
- [ ] `aria-label` / `aria-labelledby` on landmarks intact
- [ ] Skip-to-main-content link intact
- [ ] GA4 / Yandex / Meta Pixel events fire on click (check Network or Tag Assistant)
- [ ] Every content `<img>` is `next/image` with `width`, `height`, `alt` (priority on hero)
- [ ] Form inputs have `font-size >= 16px` on iOS (anti-zoom)
- [ ] Geo meta tags in `<head>`
- [ ] CLS score ≤ 0.1 (DevTools → Performance → Web Vitals)
- [ ] LCP element ≤ 2.5s at 75th percentile (priority on hero image still present)

## Historical incident — JSON-LD on service pages, 2026-05

Two-layer GSC error. Full details in [json-ld-catalog.md](json-ld-catalog.md) → "Historical incident". One-line summary:

- Layer 1 (`bc48771`): `provider` used bare `@id` ref → Google validates each `<script>` block independently → fix: self-contained `HVACBusiness` node.
- Layer 2 (`f354d5d`): `aggregateRating` inside `Service` → Service not on review-snippet parent whitelist → fix: removed.

Lessons:
1. Duplicate `@type` next to every `@id`.
2. Put `aggregateRating` only on whitelisted parents.
3. After fixing one Rich Results Test error, re-run — the next error often appears the moment the first is gone.

## When you'd be tempted to break a rule

- **"Reorganize routes"** → before moving, list every internal link, sitemap entry, hreflang alternate pointing at the old URL. Plan 301 redirects in middleware. Update `sitemap.ts`. Let Search Console reprocess.
- **"JSON-LD is hard to read inline"** → extract a builder in `src/lib/seo-jsonld.ts`. Don't move to MDX or a separate component if it changes hydration timing.
- **"Add a fancy hover that grows the card"** → see [animations-and-cwv.md](animations-and-cwv.md). Transform-only on a card = fine. Height/padding on parent = no.
- **"Remove the `data-ai-summary` — it's just a hidden paragraph"** → it's intentional. See [ai-seo-aeo.md](ai-seo-aeo.md).
- **"Update `<lastmod>` to now on every build"** → don't. Google de-weights `<lastmod>` if it sees it churning without content changes.

## Sources used in this file

- [Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Change page URLs with 301 redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [INP optimization](https://web.dev/articles/inp)
- [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
