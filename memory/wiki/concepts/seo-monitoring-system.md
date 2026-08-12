---
type: concept
title: Система SEO/GEO/AI-мониторинга и админ-дашборд
updated: 2026-08-11
sources: [PROJECT_MEMORY.md, docs/seo-monitoring.md, supabase/migrations/004_seo_monitoring.sql]
related: [entities/24clima, concepts/service-pricing, synthesis/gotchas, concepts/protected-seo-elements, concepts/supabase-projects]
status: current
---

## Суть

Замкнутый цикл: данные (GSC/GA4/PSI/DataForSEO) → Supabase → агрегация →
рекомендации агента → работа в терминале → засечки на графиках. Задуман
как непрерывный feedback-loop для SEO с интерфейсом для владельца.
На эту страницу ссылается `PROJECT_MEMORY.md` (сессия 2026-06-27).

## Бэкенд сбора

- **Схема:** миграция `004_seo_monitoring.sql` — 9 таблиц `seo_*`.
  RLS включён, select-политики нет: читать может только service role
  (крон + дайджест), наружу не отдаётся никогда.
- `seo_gsc_daily` — срез GSC по дате × странице × запросу
  (clicks, impressions, ctr, position), уникальность `(date, page, query)`.
- `seo_sync_runs` — трекинг прогонов; отличает «0 результатов» от
  «API упал» / «никогда не запускалось». Дайджест и агент читают её
  первой и помечают устаревшие источники.
- `seo_cwv_snapshots` — field (CrUX) и lab (Lighthouse) хранятся
  **разными строками**; сравнивать их между собой нельзя.
- **Роуты:** `/api/sync-seo` (Google, daily; JWT service account,
  пагинация GSC через `startRow`, окно 10 дней, GA4 organic, PSI mobile,
  режим `?preflight=1`), `/api/sync-dataforseo` (weekly; AI mentions,
  rankings, on_page, backlinks, с учётом `cost`).
- **Периодика:** `scripts/seo-digest.ts` + workflows
  `.github/workflows/seo-{dataforseo,digest}.yml` — недельный дайджест
  в GitHub issue.

## Дашборд

`/consejos-y-guias/admin/seo` — под `requireAdmin`, логин через Supabase
auth (`ADMIN_EMAILS`), `admin/layout.tsx` ставит noindex, в sitemap не
входит. 5 роутов `/api/admin/seo/{metrics,sync,analyze,recommendations,chat}`.
`analyze` — structured output, `chat` — streaming, `sync` — прокси через
`CRON_SECRET`. Общий считатель метрик — `src/lib/seo-aggregate.ts`
(используют дайджест, дашборд и агент — единый источник цифр).

## Цикл рекомендаций (2026-08-07)

Миграция `006_seo_reco_resolution.sql` добавила в `seo_recommendations`
поля `resolution` (что сделано + commit sha) и `done_at`, constraint
`seo_reco_done_at_consistency` (`done` ⇔ `done_at is not null`) защищает
оба пути записи — API и прямой SQL из скилла.

Поток: агент предлагает → владелец принимает (✓) на дашборде → скилл
`/seo-tasks` забирает accepted из Supabase в рабочий док → работа →
`UPDATE status='done', resolution, done_at` → на графиках появляются
вертикальные засечки с динамикой «среднее 7д до → 7д после».

> Тренд на засечках подписан как **корреляция, а не причинность** —
> формулировку не убирать.

Таймзона засечек: `done_at` → дата Панамы (`sv-SE` + `America/Panama`),
со снаппингом к ближайшей дате серии, потому что лаг GSC ~2 дня.

## Грабли

- **Supabase MCP не видит проект сайта** `qgvfnpafbzzgnryoxnoj` — он в
  другом аккаунте. Ходить по REST с service-role из `.env.local`
  [PROJECT_MEMORY.md, 2026-08-07]. При этом в локальном `.env.local`
  `SUPABASE_SERVICE_ROLE_KEY` может быть пустым — реальные значения в
  Vercel (`vercel env pull`) [проверено 2026-08-10]. Подробности и второй
  проект (магазина) — [Supabase-проекты](supabase-projects.md); там же факт,
  что таблицы `admins` в базе сайта нет и админ-доступ держится на
  `ADMIN_EMAILS`.
- Миграция `006` применена к проду 2026-08-07 (устаревшее «не применена»
  снято 2026-08-11). Management API заблокирован политикой — миграции
  применять через SQL editor или `mcp apply_migration` после явного OK.
- **Тоталы кликов/показов были занижены в ~6 раз** (диагноз 2026-08-08):
  агрегация по `seo_gsc_daily` (срез date×page×query) теряет запросы,
  скрытые GSC из page-level выгрузки. Фикс — PR #25 (смержен 2026-08-11):
  таблица `seo_gsc_totals` (миграция `007_gsc_totals.sql`), сбор тоталов
  отдельным запросом без dimensions, backfill 16 мес
  (`scripts/backfill-gsc-totals.mjs`), сверка с GSC UI сходится <1%.
- Данные появляются не сразу: эффект правок под AI Overview смотреть
  через 3–4 недели.

## Связи

- [Защищённые SEO-элементы](protected-seo-elements.md)
- [Supabase-проекты](supabase-projects.md) — где лежат таблицы `seo_*` и как в них ходить
- [Цены на услуги](service-pricing.md) — рекомендации id 9/10 меняли именно их
- [Грабли проекта](../synthesis/gotchas.md)
