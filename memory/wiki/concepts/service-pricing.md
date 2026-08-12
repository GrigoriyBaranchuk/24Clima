---
type: concept
title: Цены на услуги и их отображение
updated: 2026-08-10
sources: [PROJECT_MEMORY.md, src/lib/business-data.ts, src/lib/calculator-pricing.ts]
related: [entities/24clima, concepts/seo-monitoring-system, concepts/protected-seo-elements]
status: current
---

## Суть

Публикация цен — сознательное конкурентное решение, а не оформление.
Разбор живой выдачи Панамы (DataForSEO, location 2591) в 2026-08 показал:
цены публикуют только 3 из 8 конкурентов, и страница, которая
ранжируется (ProClean с «Desde $25» прямо в H1), — из их числа.
**Все вопросы People Also Ask по теме — про цену.**

## Единый источник

`SERVICE_PRICING_TABLES` в `src/lib/business-data.ts` — один источник
и для компонента `ServicePricingTable`, и для JSON-LD `offers`. Введено
специально против ценового drift между таблицей на странице и разметкой
[PROJECT_MEMORY.md, 2026-08-07, commit 159a241].

Калькулятор считает по своей таблице `src/lib/calculator-pricing.ts`.

## Ориентиры рынка и свои цены

- Рынок Панамы: монтаж $65–140 labor-only, limpieza ~$25 за юнит.
- «Desde $X» вынесено в hero для limpieza и mantenimiento.
- carga-de-gas: до $210, поиск утечки включён, inverter считается по весу.
- Цены **одинаковы во всех зонах обслуживания** — это отдельно вынесено
  в `AreasPricingNote` на `/areas-de-servicio` (плюс recarga $120 и
  WhatsApp CTA).

> **Инцидент:** hero instalación показывал $120 вместо $200 — ключ был
> спутан с carga-de-gas. Починено в commit `159a241`. При правках цен
> перепроверять соответствие ключ ↔ услуга.

## Что где показывается

| Страница | Что стоит |
|---|---|
| `/servicios/instalacion`, `/servicios/mantenimiento` | `ServicePricingTable` |
| `/servicios/limpieza` | **не** таблица — там уже `CleaningPackages` + `Calculator` |
| `/servicios/carga-de-gas` | цена в hero + таблица |
| `/servicios` (хаб) | `ServicesAnswerBlock` — все 6 услуг с ценами одной фразой (под AI Overview) |
| `/areas-de-servicio` | `AreasPricingNote` |

`ServiceIntentNote` связывает limpieza ↔ mantenimiento: Google даёт по
этим запросам почти одинаковую выдачу, поэтому страницы явно
разграничены для пользователя.

## Связи

- [24clima](../entities/24clima.md)
- [Система SEO-мониторинга](seo-monitoring-system.md) — эти правки закрывали рекомендации id 9 и 10
