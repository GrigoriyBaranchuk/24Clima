# JSON-LD catalog

What schemas live on this site, where, and the rules for changing them — sourced from current Google documentation. Validate every change with [Rich Results Test](https://search.google.com/test/rich-results) before merge.

## Google's general structured-data rules

> "Google recommends using JSON-LD for structured data if your site's setup allows it, as it's the easiest solution for website owners to implement and maintain at scale."
> — [Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

> "Don't create blank or empty pages just to hold structured data, and don't add structured data about information that is not visible to the user, even if the information is accurate."
> — same source

> "You must include all the required properties for an object to be eligible for appearance in Google Search with enhanced display."
> — same source

> "Google does not guarantee that your structured data will show up in search results, even if your page is marked up correctly."
> — [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

**Important**: each `<script type="application/ld+json">` block is its own independent graph in Google's eyes. Cross-block `@id` references are not guaranteed to resolve. Repeat `@type` next to every `@id` reference. This is the lesson from our 2026-05 incident below.

Format: `JSON.stringify(obj)` (no indent argument), minified.

## Catalog

### `HVACBusiness` — site-wide, in `src/app/layout.tsx`

Root organization schema. The single source of truth for NAP and aggregate rating.

**Required by Google** (for LocalBusiness): `address` (PostalAddress) and `name`.
**Recommended by Google**: `aggregateRating`, `geo` (5+ decimal places), `openingHoursSpecification`, `priceRange` (≤ 100 chars), `telephone`, `url`, `department`, `review`.

Source: [Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)

> "Use the most specific `LocalBusiness` sub-type possible; for example, `Restaurant`, `DaySpa`, `HealthClub`."
> — same source

`HVACBusiness` is a valid schema.org subtype of `LocalBusiness`. We use it correctly.

`@id`: `https://24clima.com/#organization` — referenced from other blocks, but always with a local `@type` repeat (see incident below).

### `WebSite` — in `src/app/layout.tsx`

Names the site, declares language coverage, exposes a `potentialAction` of type `ContactAction` pointing at the WhatsApp URL.

Don't add `SearchAction` — we don't have on-site search.

### `Service` — per service page

`src/app/[locale]/servicios/[service]/page.tsx` and `src/app/(es)/servicios/[service]/page.tsx`. One `Service` block per slug.

Rules:

- `provider` must be a **self-contained `HVACBusiness`** node (full `@type` + `name` + `url` + `telephone`), not `{ "@id": "..." }` alone. See historical incident below.
- **No `aggregateRating`** on Service. The [review snippet whitelist](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) is: *"Book, Course list, Event, Local business, Movie, Product, Recipe, Software App, CreativeWorkSeason, CreativeWorkSeries, Episode, Game, MediaObject, MusicPlaylist, MusicRecording, Organization"*. `Service` is not on it.
- Self-serving rule applies: *"If the entity that's being reviewed controls the reviews about itself, their pages that use LocalBusiness or any other type of Organization structured data are ineligible for star review feature."* — we satisfy this by sourcing ratings from Google reviews via `sync-reviews`, not from on-site forms.
- Name and description localized via i18n (`messages/{es,en,ru}.json`).

### `FAQPage` — `src/components/ServiceFAQ.tsx`

**Status as of 2026-05-28**: Rich result is being phased out.

> "As of May 7, 2026, FAQ rich results are no longer appearing in Google Search."
> — [FAQPage structured data docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

Before that: restricted since August 2023 to "well-known, authoritative websites that are government-focused or health-focused" ([source](https://developers.google.com/search/blog/2023/08/howto-faq-changes)).

**What this means for 24clima**: The `FAQPage` schema on `/servicios/<slug>/` pages **never produced a rich result for us** (we're not gov/health) and now never will. **But keep the schema**. LLM crawlers (ChatGPT, Claude, Perplexity) actively mine `FAQPage` content for AI citations — it's still a high-value AEO signal even when the SERP rich result is gone.

Required fields (still): `mainEntity` → array of `Question` with `name` + `acceptedAnswer.text`.

### `HowTo` — `src/app/[locale]/diagnostico/page.tsx`, `src/app/(es)/diagnostico/page.tsx`

**Status: deprecated since August 2023.**

> The HowTo rich result was deprecated as part of the August 2023 changes alongside FAQ restrictions.
> — [HowTo and FAQ changes blog post](https://developers.google.com/search/blog/2023/08/howto-faq-changes)

**Action required**: this is currently shipping in production but produces no rich result. Two options:

1. **Remove** — clean up dead schema. Recommended if no other consumer (LLMs do parse HowTo, but the value is lower than FAQPage).
2. **Keep** — same logic as FAQPage: still parseable by LLMs.

**Don't remove without owner confirmation** — `/diagnostico` is a conversion-flow page (diagnostic intake form). Flag in PR, ask, then act.

### `Article` + `Person` — blog posts

`src/app/[locale]/consejos-y-guias/[slug]/page.tsx` and `(es)` variant.

> "There are no required properties. Instead, add the properties that apply to your content."
> — [Article structured data docs](https://developers.google.com/search/docs/appearance/structured-data/article)

Recommended: `headline`, `image`, `datePublished`, `dateModified`, `author`.

**Author specifics** (Google):

> "Only specify the name of the author" — no titles, prefixes, organization in `author.name`.
> Use `author.url` "pointing to a web page that uniquely identifies the author" or use `sameAs`.

Multiple authors → array.

`Person` schema lives in `src/lib/author-data.ts`. Has `knowsAbout` (HVAC topics), `alumniOf` (`EducationalOrganization`), `worksFor` (root org).

E-E-A-T tie-in (Google):

> "Is it self-evident to your visitors who authored your content?"
> "Do pages carry a byline, where one might be expected?" Bylines should "lead to further information about the author or authors involved."
> — [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

`AuthorBio` component renders the Person schema **plus** a visible author block on each post — visible author + schema is the pattern Google asks for.

> "Trust is most important. The others contribute to trust, but content doesn't necessarily have to demonstrate all of them."
> — same source

### `BreadcrumbList` — service detail, blog detail, area pages

> "define a `BreadcrumbList` that contains at least two `ListItems`" to be eligible.
> — [Breadcrumb docs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

Required in `ListItem`: `item` (URL — not required on the last item), `name`, `position` (integer, position 1 = beginning).

Don't add breadcrumbs to homepage or to top-level category pages with no hierarchy above them.

### `ItemList` — `/areas-de-servicio`

Lists the served neighborhoods. Useful for AI Overviews answering *"which areas of Panama does 24clima serve."*

## What's NOT on the site (and why we're not adding it)

- **`Product`** — we sell services, not products. Don't switch to it for ratings; the rating already lives on `HVACBusiness`.
- **`Review` (individual)** — only the aggregate is exposed. Self-serving review policy makes individual on-site reviews ineligible for snippets anyway.
- **`SpecialAnnouncement`** — deprecated July 2025 per Google's structured data appearance docs.
- **`VideoObject`** — no video hero on the site. If a video lands on a page, add this then.

## Adding a new schema type

Before adding any new JSON-LD type:

1. Check [Google's supported types list](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) — currently supported, not deprecated?
2. Check rich result eligibility — does it produce an in-SERP feature, or is it documentation-only?
3. Identify the page type. Don't shotgun across the whole site.
4. Build a sample, validate with [Rich Results Test](https://search.google.com/test/rich-results) against a deployed preview.
5. Localize all `name` / `description` / `headline` strings via i18n.
6. Minify with `JSON.stringify()`.
7. Add an entry to this catalog before merging.

## Historical incident — 2026-05 — JSON-LD on `/servicios/<slug>/`

Two-layer GSC error. Documented because the same pattern keeps re-appearing in JSON-LD work.

**Layer 1** (commit `bc48771`): `provider: { "@id": ... }` referenced the root `HVACBusiness` node by ID without local `@type`. Google validates each `<script type="application/ld+json">` block as an independent graph — `@id` references between blocks are NOT resolved. Fix: expand `provider` to a self-contained `HVACBusiness` node (`@type` + `name` + `url` + `telephone`).

**Layer 2** (commit `f354d5d`): after Layer 1, GSC surfaced a second error on `aggregateRating` inside `Service`. Google's review-snippet whitelist (cited above) excludes `Service`. Fix: removed `aggregateRating` from Service JSON-LD; kept it only on `HVACBusiness` in `app/layout.tsx`.

**Lessons:**
1. Always duplicate `@type` next to `@id` — don't rely on graph-stitching across `<script>` blocks.
2. Put `aggregateRating` only on parents from [the review snippet whitelist](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
3. After fixing one Rich Results Test error, immediately re-run it — the next error often appears the moment the first is gone.

## Audit scripts

```bash
# Every JSON-LD block in the codebase
grep -rn 'application/ld+json' src/

# Every schema @type
grep -rn '"@type":' src/ | sort -u
```

Both should match this catalog. If you find an `@type` not listed here, either add it to the catalog or remove it from the code.

## Sources used in this file

- [Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Local business](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [FAQPage](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [HowTo / FAQ changes (Aug 2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Article](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Search gallery (supported types)](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
