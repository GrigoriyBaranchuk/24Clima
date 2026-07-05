# Local SEO (Panama City HVAC)

24clima competes for queries like *limpieza aire acondicionado Ciudad de Panamá*, *reparación AC Costa del Este*, *técnico HVAC 24/7 Panamá*. Ranking is a function of three layers: on-site signals (this skill), off-site signals (Google Business Profile, citations), and review velocity. This file is the on-site contract, anchored to Google's local-business documentation.

## What Google requires from a LocalBusiness page

> "These properties are required for your content to be eligible for display as a rich result: `address` (PostalAddress) and `name`."
> — [Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)

**Recommended by Google** (improves likelihood of rich result, helps ranking):

| Property | Notes |
|---|---|
| `aggregateRating` | Only if reviews are *not* self-collected. We source via Google reviews. |
| `geo` | 5+ decimal places of precision |
| `openingHoursSpecification` | We're 24/7 → emit `00:00 → 23:59`, all 7 days |
| `priceRange` | ≤ 100 characters. We use `$29.99 - $600`. |
| `telephone` | International format |
| `url` | Self-canonical |
| `department` | Sub-business; we have none |
| `review` | Individual reviews; self-serving rule applies |

Subtype choice:

> "Use the most specific `LocalBusiness` sub-type possible; for example, `Restaurant`, `DaySpa`, `HealthClub`."

We use `HVACBusiness` (valid schema.org subtype of LocalBusiness).

## The single-location reality

We're one business, one phone, one WhatsApp. That means:

- **One canonical `HVACBusiness` schema** in `app/layout.tsx`. No per-page duplication.
- **No location pages** (we don't have multiple physical locations).
- **Service-area pages** are different: `/areas-de-servicio/` lists the neighborhoods we cover. That's an `ItemList`, not separate `HVACBusiness` schemas per area.

## NAP consistency

Name, Address, Phone — must be identical across:

- JSON-LD (`name`, `address`, `telephone`)
- `geo.placename` meta
- Visible page text (Footer, Contact page)
- Google Business Profile (off-site)
- Citations (off-site directories)

Canonical formats:

- Display: `+507 6828-2120`
- JSON-LD telephone: `+507-6828-2120`
- WhatsApp link: `https://wa.me/50768282120`

If the phone format needs to change, change it everywhere in one PR.

## areaServed

In `src/app/layout.tsx`, the `HVACBusiness` block lists Panama City neighborhoods we serve. Current:

> Ciudad de Panamá, Costa del Este, Punta Pacífica, Albrook, Clayton, Panamá Pacífico, San Francisco, El Cangrejo, Obarrio, Bella Vista

Rules:

- Keep congruent with `/areas-de-servicio/` visible content.
- Onboarding a new neighborhood requires updating both places **in the same PR**.
- Don't pad with neighborhoods we don't actually serve. Google: *"Don't use structured data to deceive or mislead users."* — [SD policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Local pack proximity algorithms compare schema area vs. user location; lying gets you filtered.

## Geo meta tags

In `src/app/layout.tsx` `<head>`:

```html
<meta name="geo.region" content="PA" />
<meta name="geo.placename" content="Ciudad de Panamá" />
<meta name="geo.country" content="Panama" />
<meta name="ICBM" content="9.0820, -79.4761" />
```

These are not Google-required (Google doesn't document a use for `geo.*` or `ICBM` in modern Search Central), but Bing and other engines still ingest them. No downside to keeping them; downside to removing.

The ICBM coordinates point to Panama City center — neighborhood precision, not address-level.

## Language and locale

- Default locale `es-PA`. Use `addressRegion: "Panamá"` (with accent), not `"Panama"`. Spanish accents matter for the place index.
- `openGraph.locale: "es_PA"` for default; `en_US`, `ru_RU` for others.
- All locale variants reference the same `HVACBusiness` entity — same phone, same area, same address. Only translations of `name`/`description`/`slogan` change.

## aggregateRating — the self-serving rule

> "If the entity that's being reviewed controls the reviews about itself, their pages that use LocalBusiness or any other type of Organization structured data are ineligible for star review feature."
> — [Review snippet docs](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)

> "Ratings must be sourced directly from users."
> — same source

**For 24clima**: this policy applies to us in full — "sourced from Google reviews" does NOT exempt the markup, because Google explicitly counts republishing third-party reviews about yourself as self-serving. That earlier reading was wrong; it produced the GSC error "Review has multiple aggregate ratings" (2026-07). `aggregateRating`/`review` markup about 24clima was removed from `src/app/layout.tsx` and `src/components/Reviews.tsx` and must not come back. The real rating lives in Google Business Profile and renders in Maps/local pack on its own.

## Things that look like Local SEO but aren't on-site work

- **Google Business Profile** — managed off-site. NAP must match. Service areas in GBP should mirror `areaServed`. Posts/photos/reviews drive local pack rank far more than on-site tweaks.
- **Google Maps citations** — directory listings (Yelp Panama, PaginasAmarillas.com.pa). NAP consistency across all. Not a code change.
- **Reviews** — see `sync-reviews` above. Don't fabricate.

## Pre-merge local-SEO checklist

For any change touching `app/layout.tsx`, `/contacto`, `/nosotros`, `/areas-de-servicio`, footer, or NAP-bearing content:

- [ ] Phone number identical in JSON-LD, visible text, footer, contact page
- [ ] WhatsApp URL identical wherever it appears (`50768282120`)
- [ ] `areaServed` matches the visible `/areas-de-servicio/` list
- [ ] No new locations without ground-truth confirmation
- [ ] Geo meta tags untouched
- [ ] No `aggregateRating`/`review` markup about 24clima itself anywhere (self-serving, removed 2026-07)
- [ ] `addressRegion: "Panamá"` (with accent)
- [ ] Locale-specific `og:locale` correct in each layout
- [ ] Validated with [Rich Results Test](https://search.google.com/test/rich-results)

## When the user asks for "more SEO"

Common requests and the right response:

- **"Add more neighborhoods to areaServed"** → Verify operationally first. Padding violates Google SD policies.
- **"Add more JSON-LD types"** → Check [json-ld-catalog.md](json-ld-catalog.md). Only add if it produces a rich result or a meaningful AEO citation surface.
- **"Build a city page for every barrio"** → No. Google calls this "doorway abuse": *"Doorway abuse is when sites or pages are created to rank for specific, similar search queries"* ([Spam policies](https://developers.google.com/search/docs/essentials/spam-policies)). Use the existing `ItemList`.
- **"Translate everything"** → We already have es/en/ru. A fourth language requires updating locales config, middleware, hreflang, sitemap, message catalog, OG locales. Don't half-do it.

## Sources used in this file

- [Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
