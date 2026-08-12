---
type: synthesis
title: Грабли проекта — сводка
updated: 2026-08-11
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
| 13 | Node 25 подсовывает пустой стаб `globalThis.localStorage` | dev/start отдаёт 500 на каждый запрос, `TypeError: localStorage.getItem is not a function`, стек врёт про `_document.tsx` | НЕ удалять `scripts/strip-localstorage-stub.js` и `NODE_OPTIONS="--require ..."` в scripts package.json; Vercel (Node 20/22) не затронут |
| 14 | async Server Component внутри `"use client"` (React #482) | страница падает в глобальный error boundary; в dev: «Footer is an async Client Component» | `Footer` — async Server Component, из клиентских страниц его не рендерить напрямую; чинится server-shell (инцидент 2026-06-28, админка) |
| 15 | Анимация входа recharts | скриншот графика через 1–4 с после загрузки — оси без линий, выглядит как баг | второй скриншот через 5–8 с; невидимость линий проверять поиском цветов в бандле, не глазами |
| 16 | `gh pr merge --delete-branch` падает из-за worktree | `fatal: 'main' is already used by worktree...` выглядит как «мерж не удался», но PR уже MERGED | мержить без `--delete-branch`, ветку удалять отдельно; при ошибке проверить `gh pr view N --json state` — не перемерживать |
| 17 | Сквош-мерж прячет ветки от `git branch --merged` | смерженные через squash-PR ветки выглядят живыми, копятся десятками | проверять `git cherry main branch` и diff содержимого, а не только флаг merged (чистка 2026-08-11: 18 таких веток) |
| 18 | Мёртвый лок `git worktree` | worktree помечен locked, хотя Claude-сессия давно умерла | pid из причины лока → `ps -p <pid>`; если мёртв: `git worktree unlock && git worktree remove` |
| 19 | Виджет `merchantwidget.js` не принимает merchant_id | значка рейтинга нет на localhost и превью-доменах — выглядит как сломанная интеграция | привязка по подтверждённому в Merchant Center домену; проверять только на боевом `24clima.com` (старый `gapi.ratingbadge` отменён) — [Google Отзывы клиентов](../concepts/google-customer-reviews.md) |
| 20 | Проект ставится ТОЛЬКО через `bun` | npm собирает с версиями, отличными от прода | `bun@1.3.14` зафиксирован в `packageManager`, но npm это поле **не соблюдает** (проверено); протухший `package-lock.json` удалён и в .gitignore; в свежем worktree нет `node_modules` — `bun install` |
| 21 | `node`/`bun` не всегда в PATH у агента | команда «не найдена» в хуке или субагенте, провал тихий | `export PATH="/opt/homebrew/bin:$PATH"` — [архитектура памяти](../concepts/memory-architecture.md) |
| 22 | Пустой `.git/index.lock` от умершего процесса | `git pull` падает «Another git process seems to be running», хотя ни одного git-процесса нет | `ps aux \| grep git` → если пусто и лок нулевого размера/старый, удалить `rm -f .git/index.lock` (случай 2026-08-11: лок от 08.08) |

## Связи

- [Процесс работы агентов](../concepts/agent-workflow.md)
