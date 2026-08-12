---
type: concept
title: Supabase-проекты сайта и магазина
updated: 2026-08-11
sources: [PROJECT_MEMORY.md, локальная память Claude (машина 2), проверка по REST 2026-08-10]
related: [concepts/seo-monitoring-system, concepts/tienda-shop, synthesis/gotchas]
status: current
---

## Суть

Проектов Supabase **два, и они не связаны**: у основного сайта свой, у
магазина свой. Ключи между ними не взаимозаменяемы. Это регулярно
съедает время, потому что проект сайта вдобавок не виден через
подключённый к Claude Supabase MCP.

## Факты

| | Project ref | Где виден |
|---|---|---|
| Сайт 24clima.com | `qgvfnpafbzzgnryoxnoj` | **не виден** через Supabase MCP |
| Магазин (`24clima-shop`) | `fbnxowigwyblwsfosata` | орг. `olcxdsukawxyuaolhnua` (там же `Breeze`) |

- **Проект сайта в другой организации/аккаунте**, поэтому MCP-инструменты
  (`list_tables`, `execute_sql`) с ним не работают вообще: его просто нет в
  списке проектов, и это легко принять за «базы не существует»
  [проверено 2026-08-10].
- **Как ходить в базу сайта:** напрямую по PostgREST с
  `SUPABASE_SERVICE_ROLE_KEY` —
  `https://qgvfnpafbzzgnryoxnoj.supabase.co/rest/v1/<table>`.
- В локальном `.env.local` `SUPABASE_SERVICE_ROLE_KEY` бывает **пустым**:
  реальные значения лежат в Vercel, забирать через `vercel env pull`
  [проверено 2026-08-10]. Симптом пустого ключа — 401 «Invalid API key».
- **Таблицы `admins` в базе сайта нет** — миграция `002_admins_rls.sql` не
  применена. Доступ администратора держится только на переменной
  `ADMIN_EMAILS` [проверено 2026-08-10]. Проверять актуальность перед тем,
  как строить что-то поверх `admins`.
- Таблица `reviews` в базе сайта на ту же дату **пустая**.
- Management API заблокирован политикой: миграции применяются через SQL
  editor или `mcp apply_migration` — и только после явного OK владельца
  (см. [SEO-мониторинг](seo-monitoring-system.md)).

## Связи

- [Система SEO-мониторинга](seo-monitoring-system.md) — все таблицы `seo_*` в базе сайта.
- [Магазин /tienda](tienda-shop.md) — витрина ходит в свой бэкенд, не в базу сайта.
- [Грабли проекта](../synthesis/gotchas.md)
