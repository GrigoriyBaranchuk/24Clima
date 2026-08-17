---
type: source
title: Исследование рынка пассивного охлаждения в Панаме (август 2026)
updated: 2026-08-17
sources: [raw/dataforseo/2026-08-15-panama-passive-cooling-keywords.csv, ASEP «Estadística del mercado eléctrico panameño» MAYO 2026, tropiclima.com, panama.generadordeprecios.info, artifact 6078d9e9]
related: [concepts/passive-cooling-service, concepts/panama-electricity-market, concepts/panama-advertising-law, entities/tropiclima, concepts/hvac-customer-segments]
status: current
---

## Суть

Разовое исследование, проведённое 15 августа 2026 по запросу владельца:
оценить, стоит ли 24clima заходить в услугу «вентиляция кровли +
вентилируемые фасады», продаваемую через экономию электроэнергии.
Итоговый отчёт опубликован артефактом
`https://claude.ai/code/artifact/6078d9e9-8515-47c7-9255-4d90abb49de6`.

## Из чего состоит источник

- **Выгрузка DataForSEO / Google Ads Keyword Planner**, локация
  `location_code=2591` (Panama), языки `es` и `en`, 15 августа 2026.
  4 расширения по сид-запросам → 17 616 уникальных фраз, 6 469 с
  ненулевой частотой. Сырые данные (точные замеры, сезонность,
  топ-200 расширения) — `raw/dataforseo/2026-08-15-panama-passive-cooling-keywords.csv`.
  Все 11 задач вернули `Ok.`, потрачено ~$0.64 с баланса аккаунта
  `ryhor@24clima.com`.
- **SERP-проверка по Панаме** (DataForSEO organic live advanced,
  depth 20) по 6 коммерческим запросам.
- **Статистика ASEP** «Estadística del mercado eléctrico panameño MAYO
  2026», раздел X «Clientes, ventas e ingresos por distribuidora».
- **Справочник цен CYPE** `panama.generadordeprecios.info` — панамские
  расценки на вентфасад и эоловый экстрактор, ставки труда.
- **Законы**: Ley 45 de 2007, Ley 69 de 2012 + Decreto Ejecutivo 398 de
  2013 — по публикациям ACODECO, vLex, CAPAC и прессе.
- **Сайт tropiclima.com** — прочитан целиком (5 страниц + JS).

## Ключевые тезисы

1. Поискового спроса на услугу в Панаме **нет**: 0–10 запросов/мес по
   всем формулировкам, включая английские для экспатов.
2. Спрос есть вокруг счёта (ENSA 18 100 + Naturgy 9 900) и оборудования
   (кондиционеры, солнечные панели, `aislante térmico para techo` 260).
3. Коммерческий сектор потребляет 41,30 % электроэнергии страны — больше
   всего жилого сектора, и платит без субсидии.
4. Оборудование в Панаме доступно всем (Nimbus Fans, CFM, HOPSA, PEMCO),
   инженерного слоя «расчёт + замер + подтверждённый результат» нет ни у
   кого.
5. Заявления об экономии регулируются Ley 45; энергоаудиты как услуга —
   Ley 69 (аккредитация MICI + JTIA).

## Ограничения источника

- Доли экономии (8–15 %) и доля кондиционирования в счёте (40 %) —
  **модельные гипотезы, а не замеры**. Не цитировать как факт.
- Проникновение кондиционеров 35 % домохозяйств — предварительные данные
  переписи INEC 2023 (DMC), финальные таблицы не сверялись.
- Номера статей Ley 45 по первоисточнику не подтверждены: PDF на сайте
  ACODECO зашифрован (`/Encrypt`), текст статей извлечь не удалось.
- Оценка «~107 тыс. не-жилых подключений» и «$967 средний счёт не-жилого
  клиента» — **расчёт от агрегатов ASEP** при допущении 92 % жилых
  клиентов, а не официальная цифра.

## Связи

- [Услуга пассивного охлаждения](../concepts/passive-cooling-service.md)
- [Рынок электроэнергии Панамы](../concepts/panama-electricity-market.md)
- [Право: реклама и энергоуслуги](../concepts/panama-advertising-law.md)
- [TropiClima](../entities/tropiclima.md)
- [Сегменты клиентов «hvac»](../concepts/hvac-customer-segments.md)
