# Индекс вики 24clima

Каталог всех страниц. Начинай отсюда: найди релевантные страницы,
прочитай их, и только потом лезь в код. Правила ведения — в
[`memory/CLAUDE.md`](../CLAUDE.md).

Обновлено: 2026-08-23 · страниц: 22

## Сущности

| Страница | О чём |
|---|---|
| [24clima](entities/24clima.md) | компания, регион, сегменты, NAP и зоны обслуживания |
| [Ryhor Baranchuk](entities/ryhor-baranchuk.md) | владелец, автор контента, E-E-A-T-сигналы |
| [TropiClima](entities/tropiclima.md) | SUNNY RAMPAGE INC., опрос-воронка про перегрев домов, источник технологии пассивного охлаждения |

## Концепции

| Страница | О чём |
|---|---|
| [Система SEO/GEO-мониторинга](concepts/seo-monitoring-system.md) | таблицы `seo_*`, синки, дашборд, цикл рекомендаций и засечки |
| [Защищённые SEO-элементы](concepts/protected-seo-elements.md) | 10 групп, которые нельзя ломать; запрет `aggregateRating` |
| [Двойное дерево роутов (es)/[locale]](concepts/i18n-dual-route-tree.md) | почему правку надо вносить дважды |
| [Цены на услуги](concepts/service-pricing.md) | единый источник цен, что где показывается, ориентиры рынка |
| [Мобильная версия app-like](concepts/mobile-app-like.md) | решения редизайна и performance overhaul |
| [Шапка и навигация](concepts/header-navigation.md) | структура после редизайна 2026-08-13, активные состояния 2026-08-22, инварианты (WhatsApp — единственный зелёный, корзина ≠ магазин, crawlable-дропдаун) |
| [Дизайн-система @24clima/design](concepts/design-system-package.md) | токены в отдельном пакете, workflow обновления, `GH_PAT` |
| [Как работают AI-агенты](concepts/agent-workflow.md) | план → codex → seo-reviewer → проверки → OK на push |
| [Сегменты клиентов «hvac»](concepts/hvac-customer-segments.md) | expats / B2B / администрадоры PH / not-fit specialty / event-аренда + Panamá Oeste |
| [Архитектура памяти](concepts/memory-architecture.md) | три слоя и политика: канонична только repo-память, локальная — кэш |
| [Магазин /tienda](concepts/tienda-shop.md) | магазин внутри сайта, редирект со `shop.24clima.com` (пока 302), свой бэкенд |
| [Google Отзывы клиентов](concepts/google-customer-reviews.md) | merchant_id, opt-in, витринный виджет, `/privacidad`, что осталось до запуска |
| [Supabase-проекты](concepts/supabase-projects.md) | два проекта, проект сайта не виден через MCP, как ходить по REST |
| [Услуга пассивного охлаждения](concepts/passive-cooling-service.md) | вентиляция кровли + вентфасады: решения владельца, спрос (его нет), конкуренты, экономика, план |
| [Рынок электроэнергии Панамы](concepts/panama-electricity-market.md) | тарифы BTS, субсидия FET, агрегаты ASEP, структура спроса, порог $1 500/мес |
| [Право: реклама и энергоуслуги](concepts/panama-advertising-law.md) | Ley 45 и ACODECO, Ley 69 и аккредитация MICI/JTIA, правила формулировок про экономию |

## Источники

| Страница | О чём |
|---|---|
| [PROJECT_MEMORY.md](sources/project-memory.md) | журнал сессий, разложенный по темам |
| [Исследование рынка пассивного охлаждения](sources/2026-08-15-panama-passive-cooling-research.md) | DFS + ASEP + SERP + законы, август 2026; что в нём гипотеза, а что факт |

## Синтез

| Страница | О чём |
|---|---|
| [Грабли проекта](synthesis/gotchas.md) | 30 ошибок, которые уже стоили времени — просмотреть перед работой |

## Пробелы

Темы, которых в вики пока нет — кандидаты на ingest:

- `DESIGN.md` — бренд-бук мобильной версии (не заингещен).
- Бэкенд магазина (репозиторий `24clima-shop`): устройство API `/v1/**`,
  где он хостится, что умеет отдавать по заказу. Витрина описана
  ([магазин /tienda](concepts/tienda-shop.md)), бэкенд — нет.
- Калькулятор: модель ценообразования `calculator-pricing.ts`.
- Блог `/consejos-y-guias`: структура, авторство, что и зачем пишется.
- Живые данные GSC/GA4 — как только появится доступ к цифрам.
- Наличие у владельца **JTIA idoneidad** — висит с research 2026-05-29
  (условие входа в B2B), и с 2026-08 к нему добавился тот же вопрос по
  Ley 69 для энергоуслуг. Закрывать оба вместе.
- Цены панамских поставщиков вентиляции (Nimbus Fans, CFM, HOPSA) —
  нужны для расчёта окупаемости
  ([услуга пассивного охлаждения](concepts/passive-cooling-service.md)).
