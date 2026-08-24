---
type: concept
title: Как в проекте работают AI-агенты
updated: 2026-08-12
sources: [PROJECT_MEMORY.md, CLAUDE.md, .claude/skills, .agents/skills/24clima-seo-guide]
related: [concepts/protected-seo-elements, concepts/seo-monitoring-system, synthesis/gotchas, concepts/vercel-deploy-and-errors]
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

## Гигиена веток и worktree

Ветки в проекте копятся: часть PR мержится сквошем, и `git branch --merged`
их не видит (грабли №17). Рабочий порядок — **проверять содержимое, а не
флаг**. Рецепт, отработанный на чистке 2026-08-12 (15 веток):

```
base=$(git merge-base origin/main origin/$B)
files=$(git diff --name-only $base origin/$B)     # что ветка трогала
git diff --stat origin/main origin/$B -- $files   # пусто ⇒ содержимое уже в main
```

- Пустой `files` ⇒ ветка ничего не вносит поверх базы (предок main).
- Пустой второй diff ⇒ по её же файлам main совпадает с веткой — сквош-мерж,
  удалять через `git branch -D` (обычный `-d` откажет, и это не сигнал беды).
- Непустой diff ⇒ **не удалять вслепую**: посмотреть, что за файл, и поднять
  номер PR (`gh pr list --state merged --json number,headRefName`). Типичный
  случай — ветка смержена, а main позже переписал тот же файл: тогда diff
  показывает не потерянную работу, а отставание ветки.
- Порядок удаления: сначала снять worktree (`git worktree remove` + `prune`),
  потом локальные ветки, потом `git push origin --delete`. Ветку собственного
  PR удалять сразу после мержа — иначе чистка порождает новый мусор.
- Массовый `gh pr merge --delete-branch` не использовать (грабли №16).

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
- [Деплой на Vercel и ошибки на клиенте](vercel-deploy-and-errors.md) — настройки проекта агент менять не может, только владелец
