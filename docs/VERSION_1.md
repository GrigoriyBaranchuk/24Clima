# Version 1 — Baseline (откат без push)

**Commit hash:** `625eb87`  
**Date:** 2025-02-09

## Как откатиться

```bash
git reset --hard 625eb87
```

## Что включено

- slug fix (`src/lib/slug.ts`, fallback в `[slug]/page.tsx`, `normalizeSlug` в admin)
- Советы и Руководства (tips list, article page, admin)
- trailingSlash: true, custom middleware с getPreferredLocale
- root app/page.tsx с redirect на `/${defaultLocale}/`
