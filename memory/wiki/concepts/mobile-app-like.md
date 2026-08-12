---
type: concept
title: Мобильная версия как приложение (app-like)
updated: 2026-08-10
sources: [PROJECT_MEMORY.md, DESIGN.md, CLAUDE.md]
related: [concepts/design-system-package, concepts/protected-seo-elements, synthesis/gotchas]
status: current
---

## Суть

Мобильная версия сделана похожей на нативное приложение при
**responsive-подходе**: один URL, разный CSS. Граница — `lg:` (1024px).
Десктопная версия при этом не менялась ни разу — это жёсткое правило
всех мобильных сессий.

## Принятые решения

- Стиль — Apple-style (вариант A из трёх мокапов) плюс кнопка
  «Escribenos» из Airbnb-варианта. Бренд-бук — `DESIGN.md`
  [PROJECT_MEMORY.md, 2026-04-27].
- `BottomNav` — 5 элементов: Inicio · Servicios · WhatsApp FAB · Blog ·
  Problemas. `WhatsAppButton` остался только на десктопе (`lg:flex`).
- Главная на мобильном — **один экран без прокрутки**:
  Hero + Services + Calculator + `GoogleRatingCard` в
  `h-[100dvh] overflow-hidden`; остальные блоки обёрнуты `hidden lg:block`.
- Типографика: font-semibold, letter-spacing −0.2/−0.3px. Touch-таргеты
  min 44×44px, `active:scale-95`. Pill-кнопки (`rounded-full`) на CTA.
  Горизонтальный скролл со `snap-x` для карточек.

## Производительность (2026-04-29)

Девять пунктов, дизайн не тронут:

- `Hero`, `Footer`, `Services`, `ServicesGrid` переведены в Server
  Components; клиентский onClick вынесен в остров `TrackedWhatsAppLink`.
- **UA-детект через `headers()`** (`src/lib/device.ts`): desktop-only
  блоки не попадают в HTML на мобильном UA. `ScrollReveal` грузится
  только на десктопе через `RevealOnDesktop`.
- Калькулятор разделён на `CalculatorMobile` / `CalculatorDesktop`,
  выбор — в серверном оркестраторе `Calculator.tsx`. Гибрид: на
  мобильном UA только Mobile, на десктопном оба + CSS-переключатель по
  `lg:` (иначе на десктопном UA с узким окном показывался десктопный).
- `next.config.js`: avif+webp, `minimumCacheTTL` 60 дней, `compress`,
  без `poweredByHeader` и prod source maps.
- GA и Yandex Metrika отложены до первого взаимодействия или 3s idle;
  Meta Pixel оставлен на `lazyOnload` — он важен для конверсий.
- Service Worker вручную, без зависимостей: stale-while-revalidate для
  HTML, cache-first для статики (`public/sw.js`).

## Известные нюансы

- `?_mobile=1` (тест мобильного варианта на десктопе) работает только в
  development — защищено `NODE_ENV !== "production"`.
- Нерешённое на момент записи: SafeArea для notch, swipe-жесты, dark
  mode (закомментирован в `globals.css`), оптимизация форм.

## Связи

- [Дизайн-система @24clima/design](design-system-package.md)
- [Защищённые SEO-элементы](protected-seo-elements.md) — каждая мобильная сессия закрывалась чек-листом 10/10
