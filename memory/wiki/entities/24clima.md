---
type: entity
title: 24clima (WOW Soluciones Panama)
updated: 2026-08-10
sources: [PROJECT_MEMORY.md, CLAUDE.md, src/lib/business-data.ts]
related: [concepts/service-pricing, concepts/seo-monitoring-system, entities/ryhor-baranchuk]
status: current
---

## Суть

HVAC/R-компания в Панаме: обслуживание, чистка, ремонт, монтаж
кондиционеров и холодильного оборудования. Юрлицо — WOW Soluciones
Panama, бренд и домен — 24clima. Сайт: https://24clima.com.

## Факты

- **Регион:** Ciudad de Panamá + Panamá Oeste. Зоны обслуживания заданы
  в `src/lib/areas-data.ts`; в 2026-06 добавлено 9 зон Panamá Oeste
  (Arraiján, Nuevo Arraiján, Vista Alegre, Costa Verde, La Chorrera,
  El Espino, La Floresta, Vacamonte, Playa Dorada Residences) — после
  того как на западе появился сотрудник, то есть время выезда честное,
  не маркетинговое. Costa Verde и Playa Dorada Residences — приоритет
  `<1.5h` [PROJECT_MEMORY.md, 2026-06-06].
- **Контакт и основной CTA:** WhatsApp +507 6828-2120. Ключевой
  конверсионный путь: сайт → WhatsApp → заказ услуги
  [PROJECT_MEMORY.md].
- **Языки контента:** испанский (основной, `defaultLocale: es`),
  английский, русский. Язык разработки и общения с агентами — русский
  [CLAUDE.md].
- **Сегменты:** частные клиенты; администраторы PH (кондоминиумы) —
  отдельная посадочная `/servicio-para-administradoras-ph/`; аренда
  холода на мероприятия `/alquiler-aire-acondicionado-eventos/` —
  лид-ген без собственного парка техники, тест спроса
  [PROJECT_MEMORY.md, 2026-06-06].
- **NAP и areaServed** дублируются в трёх местах и обязаны совпадать:
  `src/lib/business-data.ts`, JSON-LD `HVACBusiness` в `layout.tsx`,
  on-page копия на `areas-de-servicio`. Рассинхрон ловил seo-reviewer
  [PROJECT_MEMORY.md, 2026-06-06].
- **Смежный проект:** магазин shop.24clima.com (репозиторий
  `24clima-shop`), делит дизайн-систему с сайтом.

## Грабли

- Собственный `aggregateRating` на сайте — self-serving review, звёзды
  в выдаче невозможны с 2019 г. Убран из `HVACBusiness` в 2026-07,
  ставить обратно нельзя (см. [Защищённые SEO-элементы](../concepts/protected-seo-elements.md)).

## Связи

- [Ryhor Baranchuk](ryhor-baranchuk.md) — владелец, лицо E-E-A-T.
- [Цены на услуги](../concepts/service-pricing.md)
- [Система SEO-мониторинга](../concepts/seo-monitoring-system.md)
