# i18n & hreflang

Three locales, one site, one canonical entity. This file says how URLs are shaped, how alternates are emitted, and what NOT to do when adjusting routing — anchored to Google's localization docs.

## Locale model

- **`es` (default, Panama Spanish)**: no URL prefix. Homepage `https://24clima.com/`.
- **`en` (English)**: `/en/...`.
- **`ru` (Russian)**: `/ru/...`.

Default locale lives under `app/(es)/` route group, not under `app/[locale]/es/`. `[locale]` is reserved for `en` and `ru`. This keeps canonical URLs short and drops redundant `/es/` prefixes.

`src/i18n/config.ts` is the source of truth:

- `locales = ["es", "en", "ru"]`
- `defaultLocale = "es"`
- `getLocalePrefix(locale)` returns `""` for `es`, `"/en"` for `en`, `"/ru"` for `ru`.

`middleware.ts` enforces the `/es/* → /*` redirect for any inbound link with the redundant prefix.

## What Google requires

> "Each language version must list itself as well as all other language versions."
> — [Localized versions docs](https://developers.google.com/search/docs/specialty/international/localized-versions)

> "If page X links to page Y, page Y must link back to page X."
> — same source

> "If two pages don't both point to each other, the tags will be ignored."
> — same source

> "The reserved value `x-default` ... is used when no other language/region matches the user's browser setting."
> — same source

> "`EU`, `UN`, or `UK` have no effect in hreflang."
> — same source (invalid region codes are ignored)

## How we emit hreflang

Every page exposes its locale alternates via `generateMetadata()`:

```ts
alternates: {
  canonical: canonicalUrl,
  languages: {
    "x-default": "https://24clima.com/",
    es: "https://24clima.com/",
    en: "https://24clima.com/en/",
    ru: "https://24clima.com/ru/",
  },
}
```

For non-home pages, substitute the path. Example for `/servicios/limpieza/`:

```ts
languages: {
  "x-default": "https://24clima.com/servicios/limpieza/",
  es: "https://24clima.com/servicios/limpieza/",
  en: "https://24clima.com/en/servicios/limpieza/",
  ru: "https://24clima.com/ru/servicios/limpieza/",
}
```

Rules:

- **Trailing slash on every URL**, including `x-default` and canonical. `trailingSlash: true` in `next.config.js` — don't override.
- **`x-default` points to the `es` URL**, not `en`. Business is in Panama → default for unknown locale = Spanish.
- **Self-referencing** — current locale must include itself in its own `languages` map. Google's bidirectional rule above.
- **No `http://`**. Always `https://24clima.com/...`.
- **No mid-page locale switches.** A page in `/en/` must not link to `/ru/...` in its content; only the language switcher does that.

## Canonical interplay

> "A canonical URL is the URL of a page that Google chose as the most representative from a set of duplicate pages."
> "Indicating a canonical preference is a hint, not a rule."
> — [Canonicalization docs](https://developers.google.com/search/docs/crawling-indexing/canonicalization)

Google does not consider different language versions as duplicates: *"only considered duplicates if the primary content is in the same language."*

Each page = self-canonical + hreflang to all other locales + `x-default`. Don't point a localized canonical to a different locale.

## Slugs across locales

URL slugs stay in Spanish across all locales. We don't translate `servicios` → `services` → `услуги` in the URL. Deliberate trade-off:

- ✅ Simpler routing, single sitemap, easier hreflang
- ✅ Owner shares one URL across language conversations
- ❌ Mild loss of keyword-in-URL relevance in EN/RU — but we own Spanish queries (90%+ of Panama traffic)

Don't propose translating URL slugs. If it ever needs to change, it's a strategy decision, not a refactor.

## Sitemap

`src/app/sitemap.ts` is dynamic. For every URL, it emits:

- `url`: localized absolute URL
- `lastModified`: from Supabase for articles, `new Date()` for static pages
- `alternates.languages`: full hreflang map

Google also accepts hreflang inside sitemaps directly:

> "You can use an XML sitemap to tell Google all of the language and region variants for each URL."
> — [Localized versions docs](https://developers.google.com/search/docs/specialty/international/localized-versions)

Adding a new route:

1. Add the path to `sitemap.ts` (look for the existing `localeUrl` + `langAlternates` pattern).
2. Make sure `generateMetadata()` on the new page emits the same alternates.

## Common ways to break hreflang silently

- Mixing `http://` and `https://` between canonical and alternates.
- Missing trailing slash on one alternate (all or none).
- One locale's alternate URL returning 404.
- `<link rel="canonical">` pointing to a different locale than the page is in.
- `<html lang="es">` on an `/en/` page (set from the route, not hardcoded).
- Invalid region codes (`EU`, `UN`, `UK` — silently ignored by Google).

## Audit

```bash
# All generateMetadata callsites
grep -rn "alternates:" src/app/

# Sitemap hreflang in production
curl -s https://24clima.com/sitemap.xml | grep -E "(loc|xhtml:link)" | head -30
```

Every `alternates` block should reference all three locales + `x-default`.

## Pre-merge i18n checklist

- [ ] Default locale still `es`, no `/es/` URL prefix
- [ ] `[locale]` route group still serves only `en` / `ru`
- [ ] `app/(es)/` group still has its own `layout.tsx` mirroring `[locale]` one
- [ ] Middleware redirects in place (`www→non-www`, `/es/*→/*`, legacy slugs)
- [ ] Sitemap rebuilds and validates
- [ ] hreflang on every new page references all three locales + `x-default`
- [ ] All hreflang URLs return 200 (no broken alternates)
- [ ] `og:locale` matches the route locale on each layout
- [ ] No new translated URL slugs

## Sources used in this file

- [Localized versions docs](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
