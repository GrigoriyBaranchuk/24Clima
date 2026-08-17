---
type: concept
title: Защищённые SEO-элементы
updated: 2026-08-10
sources: [PROJECT_MEMORY.md, .agents/skills/24clima-seo-guide/references/protected-elements.md]
related: [entities/24clima, concepts/seo-monitoring-system, concepts/i18n-dual-route-tree, concepts/panama-advertising-law]
status: current
---

## Суть

Список из 10 групп элементов, которые нельзя трогать при любых правках
дизайна и рефакторинга. Введён перед мобильным редизайном (2026-04-27)
и с тех пор действует как чек-лист приёмки: перед мержем проверяется
«10/10 сохранено».

## Список

1. **JSON-LD:** `HVACBusiness`, `WebSite`, `Service`, `Article`,
   `FAQPage`, `BreadcrumbList`, `ItemList`.
2. **Meta:** title, description, keywords, OpenGraph, Twitter cards.
3. **Canonical + hreflang** для трёх локалей (es/en/ru).
4. **`robots.txt`** (в нём разрешены AI-краулеры) и `sitemap.ts`.
5. **Middleware-редиректы:** www→non-www, `/es/`→`/`, старые слаги.
6. **Семантический HTML:** `main#main-content`, `article`, `nav`,
   `header`, `footer`, `aria-*`.
7. **`data-ai-summary`** в layout — GEO-сигнал.
8. **Трекинг:** GA4, Yandex Metrika, Meta Pixel.
9. **E-E-A-T:** `author-data.ts`, экспертные регалии.
10. **Геометки:** `geo.region`, ICBM.

## Уточнения, добытые инцидентами

- **`aggregateRating` — под запретом.** В 2026-07 GSC флагал статьи
  («отзыву назначено несколько общих оценок»): единственный
  `aggregateRating` сайта из `HVACBusiness` склеивался парсером Google
  по `@id #organization` с инлайн-декларациями в `publisher`/`worksFor`
  внутри Article JSON-LD. Убран из `layout.tsx`, вместе с ним — спящий
  Organization JSON-LD в `Reviews.tsx` (UI отзывов остался).
  Отдельно: это self-serving review, звёзды невозможны с 2019 г.
  **независимо от того, что цифры взяты из Google Reviews** — прежняя
  трактовка «из Google reviews = ок» была ошибочной и исправлена в
  `local-seo.md` скилла [PROJECT_MEMORY.md, 2026-07-05, commit 2615556].
- JSON-LD везде минифицирован (`JSON.stringify` без indent) — так и
  оставлять.
- FAQPage не дублировать между страницами: на `/problemas` его
  сознательно не добавили, потому что вопрос дублировал бы
  `/diagnostico` [PROJECT_MEMORY.md, 2026-08-07].

## Процедура

Правки, задевающие этот список, проходят через агента `seo-reviewer`
(`.claude/agents/seo-reviewer.md`). Вердикты: approve /
flag-with-conditions (условия обязательны к закрытию) / reject.
Справочник по разметке — скилл `24clima-seo-guide`
(`references/json-ld-catalog.md`, `local-seo.md`).

## Связи

- [Система SEO-мониторинга](seo-monitoring-system.md)
- [Двойное дерево роутов es / [locale]](i18n-dual-route-tree.md) — правки нужно вносить в оба
- [Право: реклама и энергоуслуги](panama-advertising-law.md) — панамские ограничения на числа и обещания в копи (другой слой, чем Google)
