---
name: 24clima-seo-guide
description: Project-specific SEO/Local SEO (GEO)/AEO rulebook for 24clima.com, sourced directly from current Google documentation (Search Central, web.dev, structured data guides). Use when changing any of: page/route structure, metadata, JSON-LD, hreflang, sitemap, robots, headers/CSP, hero/CTA content, animations or scroll behavior, image markup, semantic HTML, geo meta tags, AI summary block, or analytics. Codifies what Google currently says, what's on the site, and what must not break.
---

# 24clima.com SEO/GEO Guide

Every rule in this skill is anchored to a current Google source. The skill states **what Google says**, **what's already on the site**, and **what must not break**. Generic SEO commentary lives elsewhere. Read the relevant `references/` file before any of: design iteration, page edits, animation work, route reshuffles, analytics changes, hero rewrites.

The site is the marketing surface for an HVAC company in Panama City. Conversion happens through WhatsApp (`+507 6828-2120`). Default locale is Spanish (`es`, no URL prefix); English and Russian live under `/en/` and `/ru/`. Production: `https://24clima.com` → Vercel from `main`.

## How to use this skill

Trigger → reference:

| Trigger | Reference |
|---|---|
| "don't break SEO", refactor near `app/`, `components/`, `lib/seo-*` | [references/protected-elements.md](references/protected-elements.md) |
| Animations, scroll effects, motion, transitions, hover, View Transitions | [references/animations-and-cwv.md](references/animations-and-cwv.md) |
| Hidden content, `opacity:0`, `display:none`, JS-rendered content, scroll-reveal | [references/javascript-seo-and-visibility.md](references/javascript-seo-and-visibility.md) |
| Any `<script type="application/ld+json">`, Service/Article/FAQ/Person schemas | [references/json-ld-catalog.md](references/json-ld-catalog.md) |
| Geo meta, areaServed, NAP, Google Business Profile, local-pack | [references/local-seo.md](references/local-seo.md) |
| `hreflang`, canonical, locale routing, x-default, `[locale]` route group | [references/i18n-hreflang.md](references/i18n-hreflang.md) |
| `sitemap.ts`, `robots.txt`, AI crawlers (GPTBot/ClaudeBot/PerplexityBot/CCBot) | [references/sitemap-and-robots.md](references/sitemap-and-robots.md) |
| AI Overviews, LLM citation, `data-ai-summary`, AEO/Generative Engine Optimization | [references/ai-seo-aeo.md](references/ai-seo-aeo.md) |
| Before merging any visible change to `main` | [references/pre-merge-checklist.md](references/pre-merge-checklist.md) |

## The five rules that override everything else

These are non-negotiable. If a design proposal violates one of them, push back before implementing.

1. **Don't touch any of the 10 protected categories** without explicit instruction. See [protected-elements.md](references/protected-elements.md).
2. **CLS ≤ 0.1, ideally 0** on every change. Google: *"a CLS score of 0.1 or less"* is good; *"greater than 0.25"* is poor ([web.dev/articles/cls](https://web.dev/articles/cls)). Only `opacity` and `transform` in animations.
3. **Content must be in the rendered DOM.** Google: *"Google can only see content that's visible in the rendered HTML"* ([JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)). Scroll-reveal patterns hide content via CSS *after* hydration, never by withholding from the server response. Structured data must reflect content visible to readers (Google SD policy).
4. **Don't regress LCP.** Target: **< 2.5s** at the 75th percentile across mobile/desktop ([web.dev/articles/lcp](https://web.dev/articles/lcp)). Hero image is `priority` `next/image` AVIF/WebP. Don't add render-blocking JS or fonts to the critical path.
5. **Locale routing stays as-is.** Default `es` at root (no `/es/` prefix), `/en/` and `/ru/` for others, `x-default → es`. hreflang must be bidirectional (Google: *"If two pages don't both point to each other, the tags will be ignored"* — [Localized versions docs](https://developers.google.com/search/docs/specialty/international/localized-versions)).

## Quick orientation: what's on the site

You don't need to recreate any of this; you need to not break it.

- **JSON-LD blocks**: `HVACBusiness` + `WebSite` in `src/app/layout.tsx`; `Service` + `FAQPage` per `/servicios/<slug>/` page; `HowTo` on `/diagnostico/` (**deprecated since Aug 2023 — flag for removal**); `Article` + `Person` on blog posts; `BreadcrumbList` + `ItemList` where applicable. `aggregateRating` lives **only** on `HVACBusiness` ([review snippet whitelist](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) — Service is not on it).
- **Sitemap**: `src/app/sitemap.ts`, dynamic. Includes all locales with hreflang `alternates`. Within Google's 50MB / 50K URL limits ([sitemap docs](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)).
- **robots.txt**: `public/robots.txt`, explicitly allows AI crawlers. See [sitemap-and-robots.md](references/sitemap-and-robots.md) for the current vendor-confirmed user-agent list.
- **hreflang**: per-page via `alternates.languages` in `generateMetadata()`. Self-referencing canonical per locale. `x-default → es`.
- **Geo meta**: `geo.region=PA`, `geo.placename=Ciudad de Panamá`, `geo.country=Panama`, `ICBM=9.0820,-79.4761`.
- **AI summary block**: `<p class="sr-only" data-ai-summary="true">…</p>` in both `app/[locale]/layout.tsx` and `app/(es)/layout.tsx`. Plain-language overview for LLMs/AI Overviews. Stays in the rendered DOM.
- **E-E-A-T**: `src/lib/author-data.ts` exports `Person` + `EducationalOrganization` JSON-LD for the site owner. `AuthorBio` on every article surfaces visible author + schema together (Google: *"Is it self-evident to your visitors who authored your content?"* — [helpful content guide](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)).
- **Performance baselines**: server components by default; analytics deferred until first interaction or 3s idle (`LazyAnalytics`); service worker stale-while-revalidate; AVIF→WebP fallback.

## Recent Google changes that affect this site

| Date | Change | What it means for 24clima | Source |
|---|---|---|---|
| **2024-03-12** | INP replaced FID as a stable Core Web Vital | Track INP, not FID. Target ≤ 200ms. | [web.dev/blog/inp-cwv-launch](https://web.dev/blog/inp-cwv-launch) |
| **2024-07-05** | Mobile-first indexing fully complete | Only mobile UA crawl is used. Our `isMobileDevice()` UA-detection is for *our* rendering, not for Google. | [Search Central blog 2024/06](https://developers.google.com/search/blog/2024/06/mobile-indexing-vlast-final-final.doc) |
| **2023-08** → **2026-05-07** | FAQ rich result restricted (gov/health only) → fully discontinued | Our `FAQPage` schema on `/servicios/<slug>/` no longer produces a SERP rich result. **Keep the schema** — LLMs (Claude, Perplexity) still mine it for AI citations. | [FAQPage docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage) |
| **2023-08** | HowTo rich result deprecated | `HowTo` schema on `/diagnostico/` no longer gives a rich result. **Flag for removal** unless owner objects. | [HowTo/FAQ changes blog](https://developers.google.com/search/blog/2023/08/howto-faq-changes) |
| **2024-05-05** | "Site reputation abuse" became enforceable spam policy | Don't host third-party content on subpaths/subdomains with no first-party oversight. We don't, but watch for any future "guest blog" proposals. | [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) |
| **2024–2025** | AI Overviews rollout across 100+ countries / languages | Spanish AI Overviews are live for Panama users. AEO matters now, not later. | [AI Overviews support](https://support.google.com/websearch/answer/14901683) |

## What "GEO" means here

Two meanings, both apply:

- **Geographic SEO / Local SEO**: ranking in Panama City for HVAC queries. Driven by `HVACBusiness` schema, `areaServed`, geo meta, NAP, Google Business Profile (off-site), Spanish locale. Required fields per Google: *"address (PostalAddress)"* and *"name"*. See [local-seo.md](references/local-seo.md).
- **Generative Engine Optimization (AEO)**: getting cited by AI Overviews, ChatGPT, Perplexity, Claude. Google publishes no AI-Overview-specific technical guidance — instead they say *"focus on helpful content"* via the [creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) guide. See [ai-seo-aeo.md](references/ai-seo-aeo.md).

When the user says "GEO" without context, ask which.

## Sources

All references in this skill are anchored to one of these:

- **Search Central** — `developers.google.com/search/docs/*`
- **web.dev** — Core Web Vitals canonical source
- **Google Search Central blog** — `developers.google.com/search/blog/*` (timestamped announcements)
- **Google Search Help (consumer-facing)** — `support.google.com/websearch/*` (AI Overviews)
- **schema.org** — type definitions

Non-Google sources used only where there is no Google equivalent (e.g. AI crawler vendor docs for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `CCBot`). Each non-Google citation is marked **[vendor]** in the references.

Last-fetched date: **2026-05-28**. Re-verify before re-issuing this skill: Google rotates these docs and adds new spam policies several times per year.
