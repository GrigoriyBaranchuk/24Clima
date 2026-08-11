---
type: concept
title: Как в проекте работают AI-агенты
updated: 2026-08-10
sources: [PROJECT_MEMORY.md, CLAUDE.md, .claude/skills, .agents/skills/24clima-seo-guide]
related: [concepts/protected-seo-elements, concepts/seo-monitoring-system, synthesis/gotchas]
status: current
---

## Суть

Сложившийся за несколько сессий процесс: план → внешнее ревью → работа в
изолированном worktree → проверки → **ожидание явного OK на push**.

## Правила, подтверждённые практикой

- **Push только по явному OK.** Несколько сессий подряд заканчивались
  формулировкой «не запушено, ждёт OK» — это норма, а не забывчивость
  [PROJECT_MEMORY.md, 2026-06-27, 2026-08-07].
- **План гоняется через codex consult.** Типичный улов — 24 замечания на
  план, из них учитывается большинство. Именно так всплыли правила про
  двойное дерево роутов и единый источник цен.
- **SEO-гейт — агент `seo-reviewer`.** Вердикт flag-with-conditions
  означает, что условия обязаны быть закрыты до мержа; в двух сессиях
  так и было.
- **Проверки перед сдачей:** `tsc --noEmit`, `bun run build` (или
  `npm run build`), biome/eslint по изменённым файлам. Отдельно —
  grep по статическому HTML в `.next/server/app` и проверка через
  `next start`, потому что часть страниц (limpieza, `/servicios`)
  динамические и не пререндерятся.
- Предсуществующие ошибки линтера **не чинятся заодно** — чтобы не
  хоронить диff (biome на `MetricsOverview.tsx`, ChatPanel).

## Инструменты

| Что | Где |
|---|---|
| Скилл SEO-справочник | `.agents/skills/24clima-seo-guide/` (json-ld-catalog, local-seo, protected-elements, monitoring-playbook, pre-merge-checklist) |
| Скилл рабочего цикла | `.claude/skills/seo-tasks/` — забрать accepted-рекомендации → сделать → закрыть в Supabase |
| Ревьюер | `.claude/agents/seo-reviewer.md` |
| Память сессий | `PROJECT_MEMORY.md` (хронология) |
| Память знаний | `memory/wiki/` (эта вики), операции — скилл `/wiki` |
| Память диалогов | Memory Compiler на хуках — см. [архитектуру памяти](memory-architecture.md) |

## Грабли

- Guard worktree-изоляции блокирует компаунд-команды и редиректы в Bash —
  обходится выносом логики в скрипты во временную директорию задания
  [PROJECT_MEMORY.md, 2026-08-07].
- Повреждённый webpack-кэш после структурных изменений даёт ложную
  ошибку `next/headers in pages/ directory` — лечится `rm -rf .next`.

## Связи

- [Защищённые SEO-элементы](protected-seo-elements.md)
- [Система SEO-мониторинга](seo-monitoring-system.md)
- [Грабли проекта](../synthesis/gotchas.md)
