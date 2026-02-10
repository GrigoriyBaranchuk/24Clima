---
name: designer
description: Applies a modern design system and UI/UX best practices when improving visuals, typography, colors, or layout. Use when the user asks for design improvements, accessibility, readability, or consistency with a design system.
---

# Designer Skill — Design System & UI/UX

Apply this skill when improving the visual design, accessibility, or consistency of a project.

## Design System (Tokens)

### Typography — Accessibility First

**Minimum readable sizes (WCAG 2.2 / vision-friendly):**
- **Body text**: never below 16px (1rem). Prefer 18px for main content.
- **Secondary/caption**: minimum 14px (0.875rem). Avoid 12px (text-xs) for anything users must read.
- **Small labels/badges**: 14px acceptable only for non-essential labels (e.g. "NEW"); never for descriptions or links.

**Scale (use semantic names):**
| Role        | Min size   | Tailwind   | Use |
|------------|------------|------------|-----|
| Display    | 48–60px    | text-4xl–6xl | Hero titles |
| H1         | 36–48px    | text-3xl–5xl | Page titles |
| H2         | 28–36px    | text-2xl–4xl | Section titles |
| H3         | 20–24px    | text-xl–2xl  | Card/subsection |
| Body       | 16–18px    | text-base, text-lg | Paragraphs |
| Body small | 14px       | text-sm     | Captions, meta; not smaller |
| Label      | 14px       | text-sm     | Form labels, nav; avoid text-xs |

**Line height:** 1.5 for body, 1.25 for headings. Use `leading-relaxed` (1.625) for long text.

**Font stack:** Prefer variable fonts (Inter, Plus Jakarta Sans, DM Sans). Include `font-feature-settings` for numerals and kerning.

### Spacing

- Base unit: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Section padding: 64–96px vertical on desktop, 48–64px on mobile.
- Consistent gaps: 16px (gap-4) for related items, 24–32px (gap-6–8) between sections.

### Colors

- **Contrast:** Text on background ≥ 4.5:1 (normal), ≥ 3:1 for large text (18px+ or 14px bold).
- **Muted text:** Use 60–70% opacity or a defined muted color; ensure contrast still passes.
- Prefer CSS variables (e.g. `--foreground`, `--muted-foreground`) for theme consistency.

### Radius & Shadows

- Cards/buttons: 8–12px (rounded-lg, rounded-xl).
- Subtle shadows for elevation; avoid heavy borders for “flat” modern look.

---

## UI/UX Principles (Trendy & Modern)

1. **Clarity over decoration** — Clear hierarchy, one primary CTA per section.
2. **Whitespace** — Generous padding; don’t crowd content.
3. **Touch targets** — Minimum 44×44px for buttons/links on mobile.
4. **Progressive disclosure** — Show essentials first; details on expand or next step.
5. **Consistency** — Same component patterns and spacing across pages.
6. **Feedback** — Hover/focus states and loading states for actions.

---

## Accessibility Checklist

- [ ] No body or important text below 14px; body preferably 16px+.
- [ ] Replace `text-xs` with `text-sm` for any readable content (descriptions, links, captions).
- [ ] Contrast ratio ≥ 4.5:1 for normal text.
- [ ] Focus visible on interactive elements.
- [ ] Form labels and errors associated and readable.

---

## When Editing Components

1. **Audit font sizes:** Search for `text-xs` and `text-sm`; upgrade to `text-sm` or `text-base` where content must be read.
2. **Use design tokens:** Prefer Tailwind theme (e.g. `text-foreground`, `text-muted-foreground`) over raw gray/hex in components.
3. **Keep hierarchy:** Headings one step larger than body; don’t flatten everything to one size.

For full token reference and examples, see [reference.md](reference.md).
