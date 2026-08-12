---
type: concept
title: Сегменты клиентов «hvac» (Панама)
updated: 2026-08-11
sources: [research 2026-05-29 (4 параллельных агента: AmCham, JTIA, PanamaCompra, expat-форумы, Encuentra24, data-center-map, Rodelag), PROJECT_MEMORY.md]
related: [entities/24clima, concepts/service-pricing, concepts/protected-seo-elements]
status: current
---

## Суть

Кто в Панаме ищет «hvac» (английский термин, не «aire acondicionado») —
четыре сегмента с разным fit; проверять сюда перед новыми страницами и копи.

## 1. Expats — сильнейший fit, /en/ TODO

8–15 тыс. домохозяйств в метро Панама-Сити (Punta Pacífica, Costa del
Este, Clayton/Albrook, Casco Viejo). Боль №1 — англоговорящий техник;
канал — WhatsApp; хотят фикс-цену в USD; бренды LG/Samsung/Mitsubishi.
Рычаг: `/en/` мини-сайт «English-speaking HVAC technicians · WhatsApp ·
USD fixed quote» — закрывает сигнал 137 показов / 0 CTR в GSC.

## 2. B2B commercial (отели/офисы/рестораны) — частичный fit

Закупки начинаются с квалификации: **JTIA idoneidad** (лицензия
инженера-электромеханика, non-negotiable), Aviso de Operación, RUC,
póliza RC. Рычаг: страница «Credenciales + SLA» с тремя контрактными
тирами. Перед запуском подтвердить у владельца наличие JTIA idoneidad.
Ограничение: chillers и сложный VRF/VRV — только через партнёров.

## 3. Администрадоры PH / недвижимость — сильный fit, SHIPPED 2026-05-29

~18 люкс-башен в одной Punta Pacífica (150–250 юнитов). AC = 60–80%
счёта за свет. Готово (commit `7745527`): `/servicio-para-administradoras-ph/`,
`/contrato-mantenimiento-aire-acondicionado/` (тиры $15/$22/$35 за юнит/мес),
пилюля «Para PH» в хедере. Правила копи: не ссылаться на законы (Ley 31/284),
«factura electrónica DGI», писать «PH», не «torres».

## 4. Technical/specialty (дата-центры, госпитали) — НЕ fit

Требуют инженерную команду с JTIA, авторизации производителей, склад
CRAC-запчастей, миллионные страховки. **Не строить** лендинги под
дата-центры/госпитали/cleanroom/VRF — сжигает доверие и SEO-бюджет.

## 5. Event cooling (аренда для мероприятий) — лид-ген тест, SHIPPED 2026-06-06

`/alquiler-aire-acondicionado-eventos/` (es/en/ru), парка техники НЕТ —
страница валидирует спрос до закупки (решение владельца + codex).
Правила честности: не заявлять собственный парк («según proyecto / con
aliados»), не обещать температуру в открытых пространствах. Панамская
специфика: проблема — влажность, misting не работает; пик спроса
декабрь–апрель. Приоритет аудиторий: event/AV-продакшены → корпоративные
организаторы → expo (ATLAPA, Amador) → отели.

## Geo: Panamá Oeste (shipped 2026-06-06)

9 зон запада (Arraiján…La Chorrera, Vacamonte) в `areas-de-servicio` —
появился сотрудник на западе, выезд `<2–2.5h`; премиум-зоны Costa Verde
и Playa Dorada Residences `<1.5h`.

## Противоречия / сроки годности

Исследование от 2026-05-29; перепроверять раз в 6–12 месяцев (законы PH,
тарифы JTIA, покрытие AI Overviews на испанском).

## Связи

- [24clima](../entities/24clima.md)
- [Цены на услуги](../concepts/service-pricing.md)
