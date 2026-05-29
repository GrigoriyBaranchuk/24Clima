# JavaScript SEO & content visibility

This file exists because animations and scroll-reveal patterns often hide content via CSS, and Google has specific rules about what counts as "visible." Important for our scroll-reveal work and for any future View Transitions API adoption.

## How Google processes JavaScript

> "Google processes JavaScript web apps in three main phases:
> 1. Crawling
> 2. Rendering
> 3. Indexing"
> — [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

> "Google can only see content that's visible in the rendered HTML."
> — same source

Googlebot runs an evergreen Chromium renderer; it executes our JavaScript. So content that depends on `useEffect` to materialize is still indexable — assuming the render completes and the network resources load.

> "Google may execute your JavaScript, but rendering web pages on Search is challenging because:
> - Resource budgets per page are limited."
> — same source

**Implication**: don't depend on JS for *critical SEO content* (H1, primary copy, schema). Server-render it. JS-driven enhancements (animations, lazy modals, interactive UI) are fine.

## The visibility rule for structured data

> "Don't mark up content that is not visible to readers of the page."
> — [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

> "Don't create blank or empty pages just to hold structured data, and don't add structured data about information that is not visible to the user, even if the information is accurate."
> — [Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

**Applies to**: any `<script type="application/ld+json">` block. The facts it asserts must correspond to facts the user can see on the page.

**Does NOT apply to**: plain HTML text inside an `sr-only` element (like our `data-ai-summary` block) — that's accessible to screen readers and bots, just not sighted users. Different from structured data.

## What about `opacity: 0`, `display: none`, `visibility: hidden`?

Google has no single canonical statement of "these CSS techniques are OK / not OK." The relevant rules across docs:

1. **Indexing**: Google indexes content in the rendered DOM regardless of CSS visibility. `display: none` content is in the DOM, gets indexed, and counts toward the page's text.
2. **Ranking effect**: Historically (pre-2014), hidden content was heavily de-weighted. Since the mobile-first era, hidden behind UI (accordions, tabs) is treated as full-weight content — *if it's visible to mobile users on demand*.
3. **Manipulation**: hiding text purely to stuff keywords is a [spam policy](https://developers.google.com/search/docs/essentials/spam-policies) violation ("Hidden text or links").

**Operational rules for our site**:

| Pattern | Verdict |
|---|---|
| Scroll-reveal: `opacity: 0` initial → `opacity: 1` on viewport entry | ✅ OK — content visible to all users without interaction, animation is decorative |
| Tab/accordion content: `display: none` until clicked | ✅ OK — visible on user demand, treated as on-page content |
| Hidden facts in JSON-LD that aren't visible anywhere on page | ❌ Violation of SD policy |
| `data-ai-summary` `sr-only` block | ⚠️ Defensible — plain text, accessible to assistive tech and bots, intentionally not shown to sighted users. Not a structured-data violation (it's HTML, not JSON-LD). |
| Keyword-stuffed text in `display: none` | ❌ Spam policy violation |
| Below-fold content rendered server-side, animation only fades it in | ✅ OK |

## Risk profile of `ScrollReveal` on this site

The component sets `isVisible: false` initially → SSR renders `opacity: 0` and `transform: translateY(30px)`.

**Risk**: a no-JS rendering pass (rare for Googlebot, more common for some social scrapers and CDN snapshots) sees the content as `opacity: 0`.

**Mitigation**:
- Text remains in the DOM (text is parseable from raw HTML even with `opacity: 0`).
- Reveal is `opacity` + `transform` only — no `display: none`, no removed nodes.
- Googlebot runs JS and completes the transition to `opacity: 1`.

**Acceptable use**:
- Below-the-fold sections — gain visual interest without ranking risk.
- Card grids, testimonials, secondary content.

**Not acceptable use**:
- Hero copy (LCP candidate).
- Primary CTA.
- H1 element.
- Any element that would, if hidden, change the page's evident purpose to a no-JS reader.

If in doubt: render visible by default, animate *as enhancement* via a class added in `useEffect`. That guarantees no-JS clients see the final state immediately.

```tsx
// Defensive pattern for critical content
const [shouldAnimate, setShouldAnimate] = useState(false);
useEffect(() => { setShouldAnimate(true); }, []);
// className conditionally adds 'will-animate' only when shouldAnimate is true
```

This is over-engineering for the current `ScrollReveal` use cases (testimonials, secondary blocks). But noting it for completeness.

## Rendering trade-offs

> "Google's web crawlers ... will follow JavaScript-generated `<a>` links to crawl them."
> — [JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

So client-rendered nav and links are crawlable. We don't depend on that — Next.js generates real `<a>` tags in the server response — but it's defensible if a future feature requires it.

> "If your site embeds links to other pages, ensure that you use `<a href>` HTML elements with URLs as `href` attribute values, and consider adding `data-href` attributes."
> — same source

We do this everywhere via the Next.js `Link` component → renders to `<a href>`. Don't replace with `onClick` handlers without thought.

## CSS background images

> "Search bots may not see content that's loaded as a CSS background image — use `<img>` for content images."
> — implicit in [Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)

Operational: any image that *is content* (product photos, hero, technician photos) → `<img>` (via `next/image`). Decorative background gradients can use CSS.

## Pre-merge JS-SEO check

- [ ] H1, primary copy, schema all server-rendered (no `useEffect`-only injection)
- [ ] No content in `display: none` that doesn't have a visible-on-demand trigger (tab, accordion)
- [ ] No JSON-LD asserting facts not visible on the page
- [ ] Scroll-reveal limited to below-the-fold, non-LCP sections
- [ ] Navigation uses `<a href>` (Next.js `Link` qualifies)
- [ ] Content images use `<img>` (`next/image`), not CSS `background-image`

## Sources used in this file

- [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Intro to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
