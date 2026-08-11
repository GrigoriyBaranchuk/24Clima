---
type: synthesis
title: Грабли проекта — сводка
updated: 2026-08-10
sources: [PROJECT_MEMORY.md]
related: [concepts/design-system-package, concepts/i18n-dual-route-tree, concepts/seo-monitoring-system, concepts/agent-workflow]
status: current
---

## Суть

Собранные в одном месте ошибки, которые уже стоили времени. Каждая
описана подробнее на своей странице — здесь короткие формулировки,
чтобы просмотреть перед началом работы.

| # | Грабли | Симптом | Подробнее |
|---|---|---|---|
| 1 | `--chart-1..5` нигде не определены | элемент с `bg-chart-*` / `stroke-chart-*` невидим, без ошибок в консоли | [дизайн-система](../concepts/design-system-package.md) |
| 2 | Два дерева роутов `(es)` и `[locale]` | правка видна только в одной языковой версии | [i18n](../concepts/i18n-dual-route-tree.md) |
| 3 | Нет `GH_PAT` в env Vercel | прод-деплой падает на `bun install` (приватный пакет дизайна) | [дизайн-система](../concepts/design-system-package.md) |
| 4 | `--font-sans` в `:root` | замораживает fallback, `next/font` перестаёт применяться | [дизайн-система](../concepts/design-system-package.md) |
| 5 | Supabase MCP не видит проект `qgvfnpafbzzgnryoxnoj` | «проект не найден», хотя он существует — он в другом аккаунте; ходить по REST с service-role | [SEO-мониторинг](../concepts/seo-monitoring-system.md) |
| 6 | `SUPABASE_SERVICE_ROLE_KEY` в локальном `.env.local` пустой | 401 «Invalid API key» при обращении к REST; реальные значения — в Vercel (`vercel env pull`) | [SEO-мониторинг](../concepts/seo-monitoring-system.md) |
| 7 | `aggregateRating` в JSON-LD | GSC: «отзыву назначено несколько общих оценок»; звёзд всё равно не будет | [защищённые элементы](../concepts/protected-seo-elements.md) |
| 8 | Повреждённый `.next` после структурных правок | ложная ошибка `next/headers in pages/ directory` | `rm -rf .next` |
| 9 | Ключ цены спутан между услугами | hero показывал $120 вместо $200 | [цены](../concepts/service-pricing.md) |
| 10 | Пропущенный ключ перевода | рантайм `MISSING_MESSAGE` | [i18n](../concepts/i18n-dual-route-tree.md) |
| 11 | Часть страниц не пререндерится | grep по `.next/server/app` ничего не находит — проверять через `next start` | [процесс агентов](../concepts/agent-workflow.md) |
| 12 | Лаг GSC ~2 дня | свежие даты выглядят как «провал трафика» | [SEO-мониторинг](../concepts/seo-monitoring-system.md) |

## Связи

- [Процесс работы агентов](../concepts/agent-workflow.md)
