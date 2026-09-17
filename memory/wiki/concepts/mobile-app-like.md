---
type: concept
title: Мобильная версия как приложение (app-like)
updated: 2026-09-16
sources: [PROJECT_MEMORY.md, DESIGN.md, CLAUDE.md]
related: [concepts/design-system-package, concepts/protected-seo-elements, synthesis/gotchas]
status: current
---

## Суть

Мобильная версия сделана похожей на нативное приложение при
**responsive-подходе**: один URL, разный CSS. Граница — `lg:` (1024px).
Десктопная версия в мобильных сессиях не меняется — это жёсткое правило.
(Отдельная задача 2026-08-13 с явным ok владельца изменила десктопную
шапку — см. [шапка и навигация](header-navigation.md); правило для
мобильных сессий остаётся в силе.)

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
  Якорный `id="calculadora"` (+ `scroll-mt-20` под fixed-шапку 80px) —
  ТОЛЬКО на всегда видимой обёртке оркестратора, не в вариантах: два id
  в DOM ломали якорь на десктопе (грабли №24, PR #40, 2026-08-13).
- `next.config.js`: avif+webp, `minimumCacheTTL` 60 дней, `compress`,
  без `poweredByHeader` и prod source maps.
- GA и Yandex Metrika отложены до первого взаимодействия или 3s idle;
  Meta Pixel оставлен на `lazyOnload` — он важен для конверсий.
- Service Worker вручную, без зависимостей: stale-while-revalidate для
  HTML, cache-first для статики (`public/sw.js`).

## Производительность, второй проход (2026-09-16, ветка perf-mobile-speed)

Повод: PSI владельца — 88, LCP 3,5 с. Диагноз по трассам: реальный LCP-элемент —
текстовый h1, без троттлинга он рисуется за 0,7–1,5 с; симулированный LCP высок
из-за объёма байт, стартующих до него: HTML 41 KB br (233 KB raw, из них 144 KB —
inline RSC, 56 KB — ПОЛНЫЙ словарь es.json в `NextIntlClientProvider`), 4 preload
шрифтов 127 KB (Inter+Lora, latin+cyrillic), JS ~200 KB br. Пять правок, дизайн и
десктоп не тронуты (разметка главной сверена побайтно, JSON-LD/meta идентичны),
SEO-ревью — approve:

1. **Шрифты.** `(es)/layout` — Inter только `latin`; Lora убрана из обоих корневых
   layout и объявлена в `consejos-y-guias/layout.tsx` (обёртка `div.contents`,
   переменная `--font-lora` та же — её читает preset пакета дизайна). Итог: `/` тянет
   один woff2 вместо четырёх; блог — Inter + Lora; `/ru/` — Inter latin+cyr.
2. **Словарь клиенту.** `src/i18n/client-messages.ts`: `CLIENT_SHELL_NAMESPACES` +
   `pickMessages()` (поддерживает `tienda.cart`). Корневые провайдеры отдают только
   оболочку; `services`, `tienda`, `tipsAdmin` — вложенными провайдерами в layout
   роутов (оба дерева). Вложенный провайдер **замещает** словарь родителя, поэтому
   получает `[...SHELL, своё]` (грабли №37). Страховки: `scripts/check-client-i18n.mjs`
   (в `bun run lint`) и `scripts/smoke-routes.mjs` (обход sitemap, 2 UA, ловит маркеры
   падения и сырые ключи).
3. **Мобильное меню** (`Sheet` = Radix Dialog) вынесено в `components/header/MobileMenuSheet.tsx`
   и грузится `next/dynamic({ ssr: false })` при первом открытии; бургер — обычная
   кнопка с прогревом чанка на pointerenter/touchstart/focus. `NavItem` и строки
   классов — в `components/header/`. Ссылки меню и раньше не были в SSR-HTML.
4. **browserslist** в `package.json` (chrome/edge/firefox ≥ 90, safari ≥ 14.1,
   ios ≥ 14.5). Полифиллы `Array.prototype.at`/`Object.hasOwn`, которые показывает
   Lighthouse, — это `polyfill-module` самого Next, browserslist их не убирает;
   выигрыш First Load JS — ~1 KB, оставлено как гигиена.
5. **Префетч отложен, не выключен:** `LazyPrefetchLink` (`prefetch={false}` до
   `load` + `requestIdleCallback`, потом дефолт) — только на карточках услуг
   (`Services.tsx` мобильная сетка, `ServicesGrid.tsx`). BottomNav и hero-кнопка на
   дефолте. Трассы: те же 8 `_rsc`-запросов, но после load.

Замер (локальный `next start`, Lighthouse 13.4 mobile, медиана из 3): 88 → 91,
LCP 3,80 → 3,33 с, всего байт 518 → 391 KB, HTML главной 233 → 186 KB raw.
Честная планка на проде — «низкие 90-е», не 95+ (Codex, консультация 16.09). Полевые
CWV (CrUX) не проверены — квота PSI API была исчерпана. CLS 0,33 на «Eventos»
(display:none) и пинг `m.youtube.com` в отчёте владельца — шум одного прогона PSI, в
трёх прогонах не воспроизвелись (грабли №39).

## Известные нюансы

- `?_mobile=1` (тест мобильного варианта на десктопе) работает только в
  development — защищено `NODE_ENV !== "production"`.
- Нерешённое на момент записи: SafeArea для notch, swipe-жесты, dark
  mode (закомментирован в `globals.css`), оптимизация форм.

## Связи

- [Дизайн-система @24clima/design](design-system-package.md)
- [Защищённые SEO-элементы](protected-seo-elements.md) — каждая мобильная сессия закрывалась чек-листом 10/10
