---
type: source
title: PROJECT_MEMORY.md — журнал сессий проекта
updated: 2026-08-10
sources: [PROJECT_MEMORY.md]
related: [concepts/seo-monitoring-system, concepts/mobile-app-like, concepts/design-system-package, concepts/service-pricing, concepts/protected-seo-elements, concepts/i18n-dual-route-tree, concepts/agent-workflow, entities/24clima, entities/ryhor-baranchuk]
status: current
---

## Что это

Файл в корне репозитория: хронологический журнал всех AI-сессий, от
начальной разработки до 2026-08-07. 406 строк на момент ингеста.
Основной источник, из которого засеяна эта вики.

## Покрытые сессии

| Дата | Тема | Куда легло |
|---|---|---|
| — | Сессия 1: старт (Next.js 15 + Tailwind + Supabase, i18n, калькулятор, отзывы) | [24clima](../entities/24clima.md) |
| — | Сессия 2: SEO-планы, `.cursor/rules/` | — |
| 2026-04-27 | Сессия 3: планирование мобильного редизайна, список защищённых SEO-элементов | [app-like](../concepts/mobile-app-like.md), [защищённые элементы](../concepts/protected-seo-elements.md) |
| 2026-04-27 | Сессия 4: реализация мобильного редизайна, `BottomNav` | [app-like](../concepts/mobile-app-like.md) |
| 2026-04-28 | Сессия 5: главная в один экран, `/servicios`, `GoogleRatingCard` | [app-like](../concepts/mobile-app-like.md) |
| 2026-04-29 | Сессия 6: mobile performance overhaul (9 пунктов) | [app-like](../concepts/mobile-app-like.md) |
| 2026-06-06 | Panamá Oeste (9 зон) + лендинг аренды холода | [24clima](../entities/24clima.md) |
| 2026-06-27 | Система SEO-мониторинга + админ-дашборд | [SEO-мониторинг](../concepts/seo-monitoring-system.md) |
| 2026-07-05 | Фикс `aggregateRating` (GSC-инцидент) | [защищённые элементы](../concepts/protected-seo-elements.md) |
| 2026-07-15 | Пакет `@24clima/design` | [дизайн-система](../concepts/design-system-package.md) |
| 2026-07-31 | Невидимые графики: `--chart-*` не определены | [дизайн-система](../concepts/design-system-package.md) |
| 2026-08-07 | Замкнутый цикл рекомендаций + засечки на графиках | [SEO-мониторинг](../concepts/seo-monitoring-system.md) |
| 2026-08-07 | Первый прогон `/seo-tasks`: рекомендации id 9, 10, 11 (цены, AI Overview) | [цены](../concepts/service-pricing.md) |

## Как относиться к источнику

Это лог «что делали», а не описание «как устроено». Часть утверждений
там верна на дату записи и могла устареть — при расхождении вики с
`PROJECT_MEMORY.md` побеждает проверка в коде, а расхождение
оформляется как противоречие по правилам `memory/CLAUDE.md`.

Файл продолжает вестись: новые сессии дописываются в него, а сжатое
знание — в вики.
