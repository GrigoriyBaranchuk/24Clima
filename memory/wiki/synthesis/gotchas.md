---
type: synthesis
title: Грабли проекта — сводка
updated: 2026-08-22
sources: [PROJECT_MEMORY.md, wiki/sources/2026-08-15-panama-passive-cooling-research, src/components/Header.tsx]
related: [concepts/design-system-package, concepts/i18n-dual-route-tree, concepts/seo-monitoring-system, concepts/agent-workflow, concepts/panama-advertising-law, concepts/header-navigation]
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
| 17 | Сквош-мерж прячет ветки от `git branch --merged` | смерженные через squash-PR ветки выглядят живыми, копятся десятками | сверять **содержимое**: diff ветки по её же файлам против main. `git cherry` тут врёт — на сквош-мерже помечает `+` все коммиты (проверено 2026-08-12). Рецепт — [процесс агентов](../concepts/agent-workflow.md) |
| 18 | Мёртвый лок `git worktree` | worktree помечен locked, хотя Claude-сессия давно умерла | pid из причины лока → `ps -p <pid>`; если мёртв: `git worktree unlock && git worktree remove` |
| 19 | Виджет `merchantwidget.js` не принимает merchant_id | значка рейтинга нет на localhost и превью-доменах — выглядит как сломанная интеграция | привязка по подтверждённому в Merchant Center домену; проверять только на боевом `24clima.com` (старый `gapi.ratingbadge` отменён) — [Google Отзывы клиентов](../concepts/google-customer-reviews.md) |
| 20 | Проект ставится ТОЛЬКО через `bun` | npm собирает с версиями, отличными от прода | `bun@1.3.14` зафиксирован в `packageManager`, но npm это поле **не соблюдает** (проверено); протухший `package-lock.json` удалён и в .gitignore; в свежем worktree нет `node_modules` — `bun install` |
| 21 | `node`/`bun` не всегда в PATH у агента | команда «не найдена» в хуке или субагенте, провал тихий | `export PATH="/opt/homebrew/bin:$PATH"` — [архитектура памяти](../concepts/memory-architecture.md) |
| 22 | Пустой `.git/index.lock` от умершего процесса | `git pull` падает «Another git process seems to be running», хотя ни одного git-процесса нет | `ps aux \| grep git` → если пусто и лок нулевого размера/старый, удалить `rm -f .git/index.lock` (случай 2026-08-11: лок от 08.08) |
| 23 | Протокол сессии пропущен, потому что задача «выглядит как обсуждение» | агент сразу берётся за задачу: анализ идёт по устаревшему коду (вторая машина уже меняла файлы), todo-список не выведен; пробел всплывает только вопросом пользователя | шаги 1–2 протокола (`git fetch --prune && git pull` + todo-список) — безусловные, выполняются ДО самой задачи в начале КАЖДОЙ сессии; тип задачи (обсуждение, read-only, фоновый джоб) значения не имеет (случай 2026-08-12) |
| 24 | Dual-render паттерн (mobile+desktop оба в DOM на десктопном UA) дублирует `id` | якорь `#calculadora` целился в первый матч — мобильную секцию, скрытую `lg:hidden` (display:none); клик по «Cotizar ahora» — тихий no-op на десктопе (баг жил на проде до 2026-08-13, PR #40) | якорные `id` вешать ТОЛЬКО на всегда видимую обёртку в оркестраторе (`Calculator.tsx`), не внутри вариантов; `scroll-mt-20` = высота fixed-шапки (80px) — [mobile-app-like](../concepts/mobile-app-like.md) |
| 25 | Chrome замораживает smooth scroll в скрытой вкладке (`visibilityState: hidden`) | автоматизированный QA-клик по якорю «застревает» на полпути — выглядит как сломанный скролл, хотя код верен; таймеры тоже затроттлены (~1 тик/с) | перед выводом «скролл не работает» проверить `document.visibilityState`; для проверки якоря использовать instant `scrollIntoView` или проверять DOM (1 видимый id), а не smooth-анимацию (случай 2026-08-13) |
| 26 | Числа об экономии в копи = обязательство по Ley 45 | «снизим счёт на 30 %» или «экономия $50/мес» без привязки к объекту — это `publicidad engañosa`: ACODECO наложила 615 штрафов на $574 600, пожаловаться может конкурент через онлайн-форму | любое число только с досье (расчёт, замеры до/после, методика) либо ссылкой на чужой официальный источник (SNE: 1 °C = 5–10 %); энергоаудиты как услуга требуют аккредитации MICI + JTIA по Ley 69 — [право Панамы](../concepts/panama-advertising-law.md) |
| 27 | Внешние источники не читаются штатными инструментами | WebFetch отдаёт 403 на сайтах, режущих не-браузерный UA (случай `tropiclima.com`, 2026-08-14); внутренние страницы — 307 без `-L`; официальные PDF Панамы бывают зашифрованы (`/Encrypt` у Ley 45 на acodeco.gob.pa) и текст не извлекается | `curl -sSL -A "Mozilla/5.0 ..."`; для PDF проверять `/Encrypt` перед попытками распарсить, при шифровании искать текст в других публикациях и **честно помечать**, что первоисточник не сверялся |
| 28 | Конфликтующая tailwind-утилита, **дописанная** через `className` | активный цвет ссылки не применяется (или применяется через раз): `text-gray-700` и `text-brand-green-dark` — одна и та же утилита, победителя решает порядок в СГЕНЕРИРОВАННОМ CSS, а не порядок в атрибуте `class`. Ровно этим болен `HeaderNavLink` пакета: он склеивает `NAV_CLASS + className` | держать ПАРЫ полных строк классов (неактивная / активная) и подменять целиком, а не дописывать; `!important`-модификатор — не решение, а маскировка (случай 2026-08-22) — [шапка и навигация](../concepts/header-navigation.md) |
| 29 | `trailingSlash: true` + `usePathname` | путь приходит как `/nosotros/`, поэтому `pathname === "/nosotros"` — всегда false; активный пункт навигации молча не загорается. next-intl снимает локаль-префикс (`/en/nosotros/` → `/nosotros/`), но хвостовой слеш оставляет | нормализовать слеш перед сравнением (`/` — исключение); проверять на `next start`, а не в dev (`next.config.js:27`, случай 2026-08-22) |
| 30 | Превью-домены Vercel закрыты Deployment Protection | `curl` по `*-git-*.vercel.app` отдаёт 302 на `vercel.com/sso-api` — выглядит как «превью сломано» или как редирект middleware, хотя деплой `pass` | это SSO, а не баг: смотреть превью в браузере под своим логином Vercel, а автоматическую проверку HTML делать на локальном `next start` того же билда (случай 2026-08-22, PR #47). Рабочий обход для проверки на самом превью (2026-08-23, PR #51): Vercel MCP `get_access_to_vercel_url` → share-ссылка `?_vercel_share=…` → открыть её в **Chrome MCP** (кука ставится, дальше все запросы/картинки/`fetch()` из страницы работают). Через `curl` share-токен одноразовый и привязан к URL — второй запрос снова уводит на логин |
| 31 | `biome format --write` по всему репо | Opus «отформатировал» 146 незатронутых файлов — diff PR раздулся, ревью невозможно | форматировать только свои файлы (`bunx biome check --write <paths>`), общий прогон — отдельным PR; при случайном прогоне `git checkout -- <незатронутые>` и оставить только свои патчи (случай 2026-08-23, PR #51) |

## Связи

- [Процесс работы агентов](../concepts/agent-workflow.md)
- [Право: реклама и энергоуслуги](../concepts/panama-advertising-law.md) — грабля №26 целиком оттуда
