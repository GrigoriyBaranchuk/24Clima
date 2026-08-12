---
type: concept
title: Общая дизайн-система @24clima/design
updated: 2026-08-10
sources: [PROJECT_MEMORY.md, CLAUDE.md, tailwind.config.ts, vercel.json]
related: [concepts/mobile-app-like, synthesis/gotchas]
status: current
---

## Суть

Дизайн-токены вынесены в приватный пакет-репозиторий
`~/Projects/24clima-design` (github.com/GrigoriyBaranchuk/24clima-design),
общий для 24clima.com и shop.24clima.com. Значения токенов **не
редактируются** в `globals.css` или `tailwind.config.ts` — только в
пакете [CLAUDE.md; PROJECT_MEMORY.md, 2026-07-15].

## Содержимое пакета

- `tokens.css` — все `:root`-переменные (shadcn HSL, brand hex,
  типографика) + `.hero-gradient` + `.whatsapp-pulse` (2s×5).
  Импортируется в `src/app/layout.tsx` **перед** `globals.css`.
- `tailwind-preset.js` — общая тема (colors/fonts/container/radius/easing),
  подключается через `presets:`. В конфиге сайта остались только
  chart-цвета и плагины.

Фирменные цвета: brand green `#7BC043` (основной CTA), brand navy
`#1e3a5f` (хедер, фон hero), WhatsApp green `#25D366`. Шрифты: Inter
(основной), Lora (акценты).

## Workflow обновления

Правка в пакете → **новый тег** → bump версии в `package.json` обоих
проектов → `bun install` → коммит lockfile. Зависимость указывается
тегом (`git+ssh://...#v0.1.0`), не веткой — детерминизм сборки, вывод
ревью codex.

## Грабли

- **Шрифты:** preset ссылается на `var(--font-inter, Inter)`. На сайте
  переменная от `next/font` висит на `<div>`, поэтому определять
  `--font-sans` в `:root` **нельзя** — это заморозит fallback. В shop
  срабатывает fallback на Google Fonts.
- **Прод-деплой и приватный репозиторий:** в `vercel.json` есть
  `installCommand` с подменой `insteadOf ssh://git@github.com/` и
  токеном из env `GH_PAT` (fine-grained PAT, Contents:Read на
  24clima-design). **Без `GH_PAT` прод-деплой падает на `bun install`.**
- **`--chart-1..5` не существуют.** `tailwind.config.ts` объявляет
  `colors.chart.1..5` через несуществующие CSS-переменные — ни в
  `globals.css`, ни в `tokens.css` их нет. Любой `bg-chart-1` /
  `stroke-chart-3` молча даст невидимый элемент (невалидный `stroke`
  откатывается в `none`). Именно так графики на админ-дашборде рисовались
  пустыми до фикса `4c12c16`, где серии задали явными hex `#29a366` и
  `#4059c4`. Блок либо определить в пакете, либо выпилить из конфига —
  на момент записи **не сделано ни то, ни другое**
  [PROJECT_MEMORY.md, 2026-07-31].

## Связи

- [Мобильная версия app-like](mobile-app-like.md)
- [Грабли проекта](../synthesis/gotchas.md)
