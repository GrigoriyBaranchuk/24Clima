---
type: concept
title: Деплой на Vercel и обработка ошибок на клиенте
updated: 2026-08-23
sources: [PROJECT_MEMORY.md, vercel.json, src/app/error.tsx, src/app/global-error.tsx, src/lib/skew-error.ts, Vercel API (проект 24-clima)]
related: [synthesis/gotchas, concepts/agent-workflow]
status: current
---

## Суть

Сайт и магазин живут в одном Vercel-проекте `24-clima`; каждый мерж в
`main` — прод-деплой. Страница описывает, как деплой ведёт себя для
пользователя с уже открытой вкладкой (version skew), что делает наш
error boundary и где искать ошибки прода.

## Факты

- **Проект:** `prj_5rmBzanicqiIpqSdXWh1gv4QQnT7`, команда
  `team_nkx1IZ9GaceujsHFp1Ib45IF` (grigoriybaranchuks-projects, план Pro),
  регион `iad1`, Node 24.x, Next 15.3.6. Домены: `24clima.com`, `www`,
  `shop.24clima.com` — один проект, разделение по host в `vercel.json`
  [Vercel API, 2026-08-23].
- **Деплой = мерж в main.** Прод-деплой создаётся на каждый merge-коммит,
  включая чисто документационные (`docs(memory)`) — память и код в одном
  репо, поэтому запись памяти тоже передеплоивает сайт
  [PROJECT_MEMORY.md, 2026-08-23].
- **Skew Protection включена**, Maximum Age 12 ч (максимум для Pro).
  Проверка, что она действует: в HTML прода встроен `dpl_…`
  (`curl -s https://24clima.com/ | grep -o 'dpl_[A-Za-z0-9]*'`).
  На Next ≥ 14.1.4 доп. конфиг не нужен [Vercel, 2026-08-23].
- **Окно 12 ч — не панацея.** Билд, вытесненный следующим деплоем, живёт
  12 ч после вытеснения. Два деплоя подряд (2026-08-22: 23:51 и 23:58)
  вытесняют билд через минуты; вкладка с него ловит `ChunkLoadError` на
  следующий день — так владелец увидел «Something went wrong» 2026-08-23
  [PROJECT_MEMORY.md, 2026-08-23]. Ещё симптом того же: серверная группа
  `Failed to find Server Action "x"` (в основном — бот-сканеры, POST с
  `Next-Action: x`).
- **HTML прода не кэшируется:** `cache-control: private, no-cache,
  no-store` — skew возможен только из давно открытой вкладки или
  восстановленной сессии браузера, не из свежего захода.
- **Error boundary (PR #50, 2026-08-23):**
  - `src/lib/skew-error.ts` распознаёт skew-ошибки (ChunkLoadError,
    `Loading chunk … failed`, failed dynamic import, CSS chunk,
    `missing required error components`) и делает **один** hard reload
    за 60 с (метка в `sessionStorage`, защита от цикла). Голый `Failed to
    fetch` НЕ считается skew — это оффлайн/сеть.
  - `src/app/error.tsx` при skew рендерит `null` и перезагружает; иначе —
    испанский экран «Algo salió mal» с «Recargar la página» (hard reload,
    главная кнопка), «Intentar de nuevo» (`reset()`, второстепенная) и
    `Ref: <digest>`; `console.error(error)` в `useEffect`. Инлайн-стили —
    Tailwind-CSS мог быть частью упавшего чанка.
  - `src/app/global-error.tsx` ловит падения корневого layout (обычный
    `error.tsx` их не видит); рендерит собственные `<html lang="es">` и
    `<body>`.
  - План проверял Codex: TTL вместо липкого флага, не ловить `Failed to
    fetch`, добавить `global-error.tsx`.
- **Где смотреть ошибки прода:** MCP `vercel` →
  `get_runtime_errors` (агрегированные группы, до 7 дней) и
  `get_runtime_logs` (уровни error/fatal, фильтр по `environment`).
  Клиентские ошибки (error boundary) в runtime-логи **не попадают** —
  только `digest` с экрана пользователя.
- **Настройки проекта из сессии агента не меняются:** PATCH на
  `api.vercel.com/v9/projects/...` блокируется политикой auto-mode;
  читать (`GET`) можно. Менять — владельцу в дашборде.
- **Deployment Protection** закрывает превью-домены SSO — см. грабли №30.
- **Крон-джобы** (`vercel.json`): `/api/sync-reviews` 06:00 UTC,
  `/api/sync-seo` 07:00 UTC.

## Грабли / ограничения

- Не выпускать два прод-деплоя подряд с интервалом в минуты без нужды —
  сокращает защитное окно для открытых вкладок (грабли №31).
- Старый `error.tsx` ничего не логировал — причину инцидента 2026-08-23
  нельзя было подтвердить; теперь есть `digest` + `console.error`.

## Связи

- [Грабли проекта](../synthesis/gotchas.md) — №30 (превью под SSO), №31 (skew)
- [Как работают AI-агенты](agent-workflow.md) — мерж кода в main только по «ok»
