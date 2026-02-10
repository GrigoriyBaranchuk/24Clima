# Designer Skill — Reference

## Typography Scale (Tailwind)

```
text-xs   → 12px  — avoid for readable content
text-sm   → 14px  — captions, labels, meta (minimum for reading)
text-base → 16px  — body default
text-lg   → 18px  — lead/emphasis body
text-xl   → 20px
text-2xl  → 24px
text-3xl  → 30px
text-4xl  → 36px
text-5xl  → 48px
text-6xl  → 60px
```

## Quick Fixes for Small Text

| Before        | After (readable) | When |
|---------------|------------------|------|
| `text-xs`     | `text-sm`        | Descriptions, links, captions, footer, nav |
| `text-sm`     | `text-base`      | Main body paragraphs if space allows |
| —             | `text-sm`        | Keep for badges/labels that are optional |

## Color Contrast (WCAG)

- Normal text: 4.5:1 minimum.
- Large text (18px+ or 14px bold): 3:1.
- Gray-500/600 on white often fails; prefer gray-700 for body, gray-600 for secondary.

## CSS Variables Pattern (globals.css)

```css
:root {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --text-body: 1rem;      /* 16px */
  --text-body-lg: 1.125rem;
  --text-caption: 0.875rem; /* 14px min */
  --leading-body: 1.625;
  --leading-heading: 1.25;
}
```

## Component Patterns

- **Nav links:** `text-base` or `text-sm` (no smaller).
- **Footer links/legal:** `text-sm` minimum.
- **Card descriptions:** `text-base` or `text-sm`, never `text-xs`.
- **Stats label under number:** `text-sm`.
- **Badge "NEW"/"Popular":** `text-sm` acceptable.
- **Button label:** `text-base` or `text-lg` for primary CTA.
