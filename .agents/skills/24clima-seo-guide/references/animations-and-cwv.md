# Animations & Core Web Vitals

Animations are the #1 way "harmless visual polish" silently regresses search rankings. Core Web Vitals feed into Google's ranking systems. This file is the contract for **how** we add motion without paying for it in search.

> "Core Web Vitals are used by our ranking systems."
> — Google Search Central, [Understanding Page Experience](https://developers.google.com/search/docs/appearance/page-experience)

> "Google Search always seeks to show the most relevant content, even if the page experience is sub-par."
> — same source

Page experience is **not** a single signal — it's a set (HTTPS, mobile-friendly, no intrusive interstitials, ad density, CWV). Of these, only CWV are mechanically tied to ranking.

## The three vitals — current thresholds

All thresholds measured at the **75th percentile** of page loads, mobile and desktop separately. Source: [web.dev/articles/vitals](https://web.dev/articles/vitals).

### LCP — Largest Contentful Paint

> "sites should strive to have Largest Contentful Paint of **2.5 seconds** or less"
> — [web.dev/articles/lcp](https://web.dev/articles/lcp)

| Status | Threshold |
|---|---|
| Good | ≤ 2.5s |
| Needs improvement | 2.5–4.0s |
| Poor | > 4.0s |

**Animations that hurt LCP**: hero entrance animations that delay paint of the LCP element. Don't fade-in the hero — keep it visible from first paint.

### INP — Interaction to Next Paint (replaced FID on 2024-03-12)

> "An INP below or at **200 milliseconds** means a page has good responsiveness."
> "An INP above **500 milliseconds** means a page has poor responsiveness."
> — [web.dev/articles/inp](https://web.dev/articles/inp)

| Status | Threshold |
|---|---|
| Good | ≤ 200ms |
| Needs improvement | 200–500ms |
| Poor | > 500ms |

> "Today's the day! After years of work, we're finally ready to make Interaction to Next Paint (INP) a stable Core Web Vital metric." (2024-03-12)
> — [web.dev/blog/inp-cwv-launch](https://web.dev/blog/inp-cwv-launch)

**Animations that hurt INP**: long-running JS handlers on scroll/hover/click, heavy `requestAnimationFrame` loops, layout thrashing.

### CLS — Cumulative Layout Shift

> "Good CLS values are **0.1** or less. Poor values are greater than **0.25**."
> — [web.dev/articles/cls](https://web.dev/articles/cls)

| Status | Threshold |
|---|---|
| Good | ≤ 0.1 |
| Needs improvement | 0.1–0.25 |
| Poor | > 0.25 |

**Animations that hurt CLS**: any animation that affects layout — `height`, `width`, `margin`, `padding`, `top`/`left` on positioned elements, font-loading flashes.

## Allowed properties (transform + opacity only)

These run on the GPU compositor thread and **do not trigger layout or paint**:

- `transform: translate / scale / rotate / matrix`
- `opacity`
- `filter` (use sparingly — heavy on Safari)

Everything else triggers reflow and is banned in animations:

- `width`, `height`, `min-width`, `max-height` etc.
- `padding`, `margin`
- `top`, `left`, `right`, `bottom`
- `font-size`, `line-height`
- `border-width`

If you want a "growing card" effect, use `transform: scale(1.02)` not `padding: 20px → 24px`.

## The scroll-reveal pattern on this site

We have `ScrollReveal` (`src/components/ScrollReveal.tsx`) + `useScrollReveal` (`src/hooks/useScrollReveal.ts`) + `RevealOnDesktop` (server wrapper). Use these. Don't ship a second reveal mechanism.

### How they behave

- IntersectionObserver, threshold 0.15, `rootMargin: "0px 0px -60px 0px"`, `once: true`.
- Transition: 700ms `cubic-bezier(0.16, 1, 0.3, 1)` on `opacity` + `transform` only.
- Variants: `fade-up`, `fade-in`, `fade-left`, `fade-right`.
- `prefers-reduced-motion: reduce` → instantly visible, no animation. Already handled by the hook.
- `RevealOnDesktop` skips the reveal on mobile UA — children render raw.

### Why this is SEO-safe

Two Google rules to satisfy:

1. *"Google can only see content that's visible in the rendered HTML."* — [JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
2. *"Don't mark up content that is not visible to readers of the page."* — [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

Our reveal pattern satisfies both because:

- Content stays in the DOM at all times (we transition `opacity` from 0 to 1, never `display: none` or `visibility: hidden` that would remove it from the accessibility tree).
- Hydration adds the initial hidden state, then IntersectionObserver triggers the visible state on scroll. Googlebot renders JS (evergreen Chromium since 2019), so the final state is `opacity: 1` and the content is visible in the rendered HTML.
- For no-JS / partial-render scenarios, we accept the trade-off: text is still in the DOM and indexable from raw HTML; only the *visual presentation* is affected.

For more on the visibility risk, see [javascript-seo-and-visibility.md](javascript-seo-and-visibility.md).

### When NOT to use scroll-reveal

- **Above-the-fold hero content** (LCP risk — delays paint of likely LCP element).
- **The primary CTA** (visibility = conversions, not aesthetics).
- **Any LCP candidate element** (largest image or text block in the viewport).
- **Form labels and inputs** (anti-pattern: hidden labels confuse screen readers even with opacity-only).
- **Inside an already-animated parent** (stacking transitions causes jank).

## Special rules for the LCP element

The LCP candidate on `/` is the hero `<h1>` + price badge + hero image (whichever paints largest, typically the image at 1440×500). Treat these elements as off-limits for the following, even though the properties themselves are GPU-cheap:

- **No infinite/looping animations on the LCP element** — including `transform`-only loops (ken-burns scale, slow rotate, infinite alternate). Two reasons:
  1. Lighthouse's LCP measurement is finalized at the moment of "stable paint." An infinite animation keeps the element continuously re-painting on the compositor, which can extend the measurement window or push LCP scoring past 2.5s on low-end devices.
  2. Infinite compositor work costs battery and main-thread idle, which drives INP up on slow devices (target ≤ 200ms per [web.dev/articles/inp](https://web.dev/articles/inp)).
- **No `filter: blur()` on the LCP element** — Safari rasterizes filters synchronously and the cost compounds with image size. Even on Chrome, a transient blur on hero text/image during the LCP window measurably delays paint.
- **No initial `opacity: 0` on the LCP element** — even with a fast animation to 1, the LCP measurement starts from the first paint; an initially-transparent LCP candidate is interpreted by Lighthouse as "not yet painted" and pushes the metric out.
- **No `transform` on the LCP candidate during the first 1500ms after mount** — even a static transform fixed offset is fine, but animating *from* a transform delays paint of the final state.

**Decorative motion adjacent to the LCP element is still fine**: an SVG underline drawn near the H1, an accent that fades in *after* the LCP paint, a count-up on a non-LCP stat below the H1. Animate around the LCP, not on it.

If a design proposal calls for motion on the LCP element, the answer is one of:
- Animate a decorative sibling instead (underline, badge, caret).
- Defer the animation until after LCP confirms (listen for `LargestContentfulPaint` PerformanceObserver entry — overkill in most cases).
- Drop it.

### Stagger between siblings

For "card list" entrance:
- Max 8 items in a single stagger group.
- Delay step: 60–80ms.
- Total stagger length ≤ ~400ms (beyond that the user is waiting, not delighted).
- Pass `delay={i * 70}` when mapping.

## Custom easing — the two we use

```css
--ease-emil:  cubic-bezier(0.23, 1, 0.32, 1);   /* UI: buttons, hover, micro-interactions */
--ease-grand: cubic-bezier(0.16, 1, 0.3, 1);    /* Scroll-reveal: longer, more cinematic */
```

`ease-emil` is registered in `tailwind.config.ts` as `ease-out-emil`. `ease-grand` is inlined in `ScrollReveal` styles. Don't introduce a third curve unless there's a real reason — cohesion matters more than variety.

## Durations (cheat sheet)

| Element | Duration |
|---|---|
| Button press (`:active scale(0.97)`) | 100–160ms |
| Hover lift on CTA | 200ms |
| Tooltip / popover entrance | 150–200ms |
| Section scroll-reveal | 500–700ms |
| Page entrance crossfade | 200–280ms |
| Marketing/explanatory (rare) | up to 1200ms |

**Hard ceiling: 300ms on any pressable / hoverable UI element.** Anything longer feels delayed on click and risks INP regression.

## INP budget on scroll handlers

- Use IntersectionObserver, never `window.addEventListener("scroll", ...)`.
- If you must listen on scroll, throttle to `requestAnimationFrame` + a single boolean flag.
- Never read layout (`getBoundingClientRect`, `offsetTop`) inside a scroll handler without batching with `requestAnimationFrame`.
- `passive: true` on every scroll listener.

## prefers-reduced-motion

Already handled in `useScrollReveal`. For any **new** animation:

```css
@media (prefers-reduced-motion: reduce) {
  .my-animation { animation: none; transition: none; opacity: 1; transform: none; }
}
```

Or use Tailwind `motion-reduce:` prefixes:

```jsx
className="hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
```

`globals.css` already has a global reduced-motion override.

## Touch-device hover trap

> "Hover, in some cases, can lead to unexpected behavior on touchscreens" — implicit in CSS specs; respected by gating with `(hover: hover) and (pointer: fine)`.

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: scale(1.02); }
}
```

Tailwind `hover:` modifier doesn't gate by pointer type. For polish, gate manually in CSS.

## Quick decision flow

> "Should I animate X?"

1. How often will the user see this animation per session?
   - 100+ times (keyboard, rapid clicks): **no animation, ever**
   - Tens of times (hover, list nav): drastically reduced, < 160ms
   - Few times (modal, drawer): standard timing
   - Rare/first-time (onboarding): can be expressive
2. Property `transform` or `opacity`? If no → rewrite or drop.
3. Above-the-fold during LCP window? If yes → don't.
4. `prefers-reduced-motion` handled? If no → add it.
5. Tested on a slow CPU (DevTools 4× CPU throttling) — does it stutter? → drop it.

## Pre-merge animation check

- [ ] Only `opacity` and `transform` in transitions/keyframes
- [ ] No CLS contribution (run DevTools Performance / Web Vitals panel)
- [ ] `prefers-reduced-motion` honored
- [ ] No animation on hero LCP element
- [ ] IntersectionObserver, not scroll listeners
- [ ] Total animation duration ≤ 700ms (reveals), ≤ 300ms (UI)
- [ ] Tested with 4× CPU throttle in DevTools

## Sources used in this file

- [web.dev/articles/vitals](https://web.dev/articles/vitals) — overview, 75th-percentile rule
- [web.dev/articles/lcp](https://web.dev/articles/lcp) — LCP thresholds
- [web.dev/articles/inp](https://web.dev/articles/inp) — INP thresholds
- [web.dev/articles/cls](https://web.dev/articles/cls) — CLS thresholds
- [web.dev/blog/inp-cwv-launch](https://web.dev/blog/inp-cwv-launch) — INP stable date
- [developers.google.com/search/docs/appearance/page-experience](https://developers.google.com/search/docs/appearance/page-experience) — CWV in ranking
- [developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) — rendered HTML
- [developers.google.com/search/docs/appearance/structured-data/sd-policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) — visibility of marked-up content
