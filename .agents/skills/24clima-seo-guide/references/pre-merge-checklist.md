# Pre-merge checklist

Union of the per-topic checklists, condensed to one pass. Run before merging any visible change to `main`. If something fails, fix in-branch; don't merge "to look at it on prod."

Every threshold and policy below is sourced from Google's current documentation — see the linked references for citations.

## Structural

- [ ] `h1` present on every page, unique, matches page intent
- [ ] All semantic landmarks intact: `<main id="main-content">`, `<header>`, `<nav>`, `<footer>`, `<article>` where applicable
- [ ] `aria-label` / `aria-labelledby` on landmarks and interactive elements
- [ ] Skip-to-main-content link works (Tab on a fresh page → link appears → Enter scrolls to main)
- [ ] No new `<div>` replacing a semantic landmark

## Metadata & alternates ([i18n-hreflang.md](i18n-hreflang.md))

- [ ] `<title>` unchanged or intentionally improved
- [ ] `<meta name="description">` unique per page, 150–160 chars
- [ ] Self-referencing `<link rel="canonical">` per page
- [ ] `hreflang` alternates for all three locales + `x-default`, all with trailing slash, all `https`
- [ ] Bidirectional: every locale lists every other (Google requirement)
- [ ] `og:locale` matches the route locale (`es_PA` / `en_US` / `ru_RU`)
- [ ] Geo meta tags in root `<head>` (`geo.region`, `geo.placename`, `geo.country`, `ICBM`)

## JSON-LD ([json-ld-catalog.md](json-ld-catalog.md))

- [ ] Every JSON-LD block parses
- [ ] Every change validated with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] `@id` references duplicated with local `@type` (Google validates each `<script>` block independently)
- [ ] `aggregateRating` only on `HVACBusiness` (not `Service` — review snippet whitelist)
- [ ] `provider` in `Service` is a self-contained `HVACBusiness` (not just `{ "@id": ... }`)
- [ ] All JSON-LD minified with `JSON.stringify(obj)`
- [ ] No newly added deprecated types (`HowTo`, `SpecialAnnouncement`, `FAQPage` for rich result purposes — see catalog for nuance)
- [ ] Marked-up content visible to readers (Google SD policy: don't mark up invisible facts)

## AI / AEO ([ai-seo-aeo.md](ai-seo-aeo.md))

- [ ] `data-ai-summary` block in both layouts (`[locale]` and `(es)`)
- [ ] Summary accurate if facts changed
- [ ] `robots.txt` allows AI crawlers — no accidental removal of `Allow` lines for `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `GPTBot`, `CCBot`, `Google-Extended`
- [ ] `AuthorBio` rendered on articles, `Person` schema intact

## Local SEO ([local-seo.md](local-seo.md))

- [ ] Phone number identical everywhere: schema, visible footer, contact page, `geo.placename`
- [ ] WhatsApp URL identical (`50768282120`)
- [ ] `areaServed` matches `/areas-de-servicio/` visible list
- [ ] No fake locations added (Google SD policy: don't deceive)
- [ ] `addressRegion: "Panamá"` (with accent)

## Animations & CWV ([animations-and-cwv.md](animations-and-cwv.md))

- [ ] Only `opacity` and `transform` in transitions/keyframes
- [ ] CLS ≤ 0.1 at 75th percentile
- [ ] LCP ≤ 2.5s at 75th percentile (no animations on hero LCP element)
- [ ] INP ≤ 200ms (no long scroll/hover handlers)
- [ ] `prefers-reduced-motion` honored
- [ ] IntersectionObserver, not scroll listeners
- [ ] Reveal durations ≤ 700ms, UI durations ≤ 300ms
- [ ] Tested with DevTools 4× CPU throttle

## JavaScript SEO ([javascript-seo-and-visibility.md](javascript-seo-and-visibility.md))

- [ ] H1, primary copy, schema all server-rendered
- [ ] No content in `display: none` without a visible-on-demand trigger
- [ ] No JSON-LD asserting facts not visible on the page
- [ ] Scroll-reveal limited to below-the-fold, non-LCP sections
- [ ] Navigation uses `<a href>` (Next.js `Link` qualifies)
- [ ] Content images use `<img>` (`next/image`), not CSS `background-image`

## Sitemap & robots ([sitemap-and-robots.md](sitemap-and-robots.md))

- [ ] No `<priority>` or `<changefreq>` introduced (Google ignores these)
- [ ] `<lastmod>` reflects real page modification time
- [ ] New routes added to `sitemap.ts`
- [ ] All sitemap URLs `https://`, trailing slash
- [ ] No `Disallow` added without explicit instruction
- [ ] AI crawler `Allow` lines intact
- [ ] `Sitemap:` directive in `robots.txt` intact
- [ ] `curl https://24clima.com/sitemap.xml` returns valid XML

## Performance

- [ ] LCP element (hero image) still `priority` with `next/image`
- [ ] Every content `<img>` is `next/image` with `width`, `height`, `alt`
- [ ] Below-fold images lazy
- [ ] No new render-blocking JS in critical path
- [ ] Analytics still deferred (`LazyAnalytics`)
- [ ] Build passes: `npm run build`
- [ ] TypeScript clean: `bunx tsc --noEmit`
- [ ] No new Tailwind ambiguous-class warnings

## Browser behavior

- [ ] Tested on Chrome desktop
- [ ] Tested on iOS Safari (or DevTools mobile emulation as fallback)
- [ ] Tested keyboard navigation (Tab, Enter, Esc)
- [ ] No console errors on home, services, contact, blog
- [ ] WhatsApp link opens WhatsApp (tap on real device if possible)
- [ ] Phone link opens dialer on mobile

## Analytics

- [ ] GA4 fires `Lead` event on WhatsApp CTA click
- [ ] Meta Pixel fires `Contact` event on WhatsApp CTA click
- [ ] Yandex.Metrika records pageview
- [ ] No new analytics with `strategy="beforeInteractive"`

## Spam-policy hygiene

- [ ] No "scaled content abuse" — bulk pages produced primarily for ranking, not user value
- [ ] No "doorway abuse" — many similar pages funneling to one destination
- [ ] No hidden keyword-stuffed text
- [ ] No third-party content hosted on subpaths without first-party oversight (site reputation abuse, enforceable since May 2024)
- [ ] Source: [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

## Final passes

- [ ] `git diff main...HEAD --stat` — does the surface match the intent of the PR?
- [ ] No accidental changes to `app/layout.tsx` JSON-LD, `app/[locale]/layout.tsx` AI summary, `middleware.ts`, `next.config.js`, `robots.txt`, `sitemap.ts` unless they're the subject of the PR
- [ ] CHANGELOG / commit message describes the *why*, not just the *what*

If any single line above isn't checked and there's no explicit reason in the PR description for why it's OK, don't merge.

## Sources

This checklist is a union of:

- [protected-elements.md](protected-elements.md)
- [animations-and-cwv.md](animations-and-cwv.md)
- [javascript-seo-and-visibility.md](javascript-seo-and-visibility.md)
- [json-ld-catalog.md](json-ld-catalog.md)
- [local-seo.md](local-seo.md)
- [i18n-hreflang.md](i18n-hreflang.md)
- [sitemap-and-robots.md](sitemap-and-robots.md)
- [ai-seo-aeo.md](ai-seo-aeo.md)

All Google source URLs are listed in the individual references.
