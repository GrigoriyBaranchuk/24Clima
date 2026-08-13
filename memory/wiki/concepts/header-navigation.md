---
type: concept
title: Шапка и навигация
updated: 2026-08-13
sources: [PROJECT_MEMORY.md, src/components/Header.tsx]
related: [concepts/tienda-shop, concepts/protected-seo-elements, concepts/agent-workflow, concepts/mobile-app-like]
status: current
---

## Суть

Шапка (`src/components/Header.tsx`) собирается из слотов `HeaderShell`
пакета `@24clima/design`: logo / nav / actions / mobileMenu. После
редизайна 2026-08-13 (PR #41, связка «1A+2A+3A», утверждена владельцем)
десктопная навигация разгружена, телефон — иконка, магазин выделен кнопкой.

## Структура desktop (слева направо)

- Лого (ссылка на главную; пункта «Inicio» нет — лого достаточно).
- Дропдаун **«Servicios»** — сгруппированный, три блока:
  1. Servicios: 6 ссылок `/servicios/<slug>` с короткими ярлыками из
     `common.serviceNav.*` + «Todos los servicios» → `/servicios`;
  2. Problemas: «Problemas comunes» → `/problemas`, «Diagnóstico AC» → `/diagnostico`;
  3. Soluciones: Para PH, Eventos (прежний отдельный дропдаун влит сюда).
- Пункты: Consejos y Guías, Nosotros, Contacto.
- Actions: переключатель языка → кнопка **Tienda** (outline, иконка сумки) →
  телефон-иконка (`tel:`, aria-label «Llámanos: +507 6828-2120») →
  зелёная WhatsApp CTA.

## Ключевые решения и инварианты

- **WhatsApp — единственный зелёный элемент шапки** (primary CTA);
  Tienda — нейтральная secondary, телефон — тихая иконка.
- **Корзина ≠ магазин** (ревью Codex): кнопка «Tienda» видна на всех
  страницах, включая `/tienda`; `TiendaCartLink` (ведёт в `/tienda/cart`)
  рендерится только на страницах магазина через проп `showCartLink`.
- **Crawlability-паттерн дропдауна** (approve seo-reviewer): ссылки всегда
  в DOM, скрытие только визуальное (opacity+transform 150ms,
  `motion-reduce:transition-none`); `invisible` держит скрытые ссылки вне
  tab order; `aria-haspopup`/`aria-expanded` на триггере.
- Телефонный номер текстом остаётся в футере и `/contacto`
  (NAP-консистентность), из шапки убран (ломался на 3 строки).
- Мобильное sheet-меню: пункты ведут на хабы `/servicios` и `/problemas`
  (не на якоря главной `/#servicios`, `/#problemas`); Inicio и Tienda
  сохранены; группа Soluciones отдельным блоком.
- Прямые ссылки на все 6 сервисных money-pages теперь site-wide
  (внутренняя перелинковка усилена — оценка seo-reviewer).

## Открытое

- Активные состояния навигации (подсветка «Servicios» на `/servicios/*`,
  `/problemas` и т.д.) — замечание Codex №14, не реализовано.
