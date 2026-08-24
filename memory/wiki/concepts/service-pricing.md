---
type: concept
title: Цены на услуги и их отображение
updated: 2026-08-23
sources: [PROJECT_MEMORY.md, src/lib/business-data.ts, src/lib/calculator-pricing.ts, PR #51 (2026-08-23)]
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

## Цена за единицу (с 2026-08-23)

`SERVICE_PRICING[slug]` получил необязательные `priceUnitCode` /
`priceUnitText`. Если задан `priceUnitCode` (gypsum: `"MTK"` = м²),
`Offer.priceSpecification` в JSON-LD Service собирается как
`UnitPriceSpecification` с `unitCode`, а хелпер `formatPrice()` дописывает
«/m²» в hero, OG-картинке (`PRICE_UNIT` в `opengraph-image.tsx`) и
answer-блоках. Без `priceUnitCode` — прежний `Offer` с `price`/`priceRange`.
Rich Results Test принимает без ошибок (проверено 2026-08-23).

Корневой `HVACBusiness.priceRange` — `"$"` (было `"$$"`): при чеках от $25 до
$20 000 один знак ничего не сегментирует, оставлен нижний ярус
(ревью Codex 01a03017). Меняется только в `src/lib/business-data.ts`.

> **Инцидент:** hero instalación показывал $120 вместо $200 — ключ был
> спутан с carga-de-gas. Починено в commit `159a241`. При правках цен
> перепроверять соответствие ключ ↔ услуга.

## Что где показывается

| Страница | Что стоит |
|---|---|
| `/servicios/instalacion`, `/servicios/mantenimiento` | `ServicePricingTable` |
| `/servicios/limpieza` | **не** таблица — там уже `CleaningPackages` + `Calculator` |
| `/servicios/carga-de-gas` | цена в hero + таблица |
| `/servicios/gypsum` | цена в hero **за m²** («desde $35/m²») + таблица с условиями «desde» в сноске |
| `/servicios/aire-acondicionado-oculto` | «desde $6 000» в hero + таблица (visita gratis, зона, квартира) |
| `/servicios` (хаб) | `ServicesAnswerBlock` — все 8 услуг с ценами одной фразой (под AI Overview) |
| `/areas-de-servicio` | `AreasPricingNote` |

`ServiceIntentNote` связывает limpieza ↔ mantenimiento: Google даёт по
этим запросам почти одинаковую выдачу, поэтому страницы явно
разграничены для пользователя.

## Связи

- [Новые услуги: gypsum и clima oculto](new-services-ducted-gypsum.md) — цены desde $35/m², LED-короб desde $25/ml, canalные по cotización (2026-08-23)
- [24clima](../entities/24clima.md)
- [Система SEO-мониторинга](seo-monitoring-system.md) — эти правки закрывали рекомендации id 9 и 10
