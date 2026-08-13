# Индекс вики 24clima

Каталог всех страниц. Начинай отсюда: найди релевантные страницы,
прочитай их, и только потом лезь в код. Правила ведения — в
[`memory/CLAUDE.md`](../CLAUDE.md).

Обновлено: 2026-08-13 · страниц: 17

## Сущности

| Страница | О чём |
|---|---|
| [24clima](entities/24clima.md) | компания, регион, сегменты, NAP и зоны обслуживания |
| [Ryhor Baranchuk](entities/ryhor-baranchuk.md) | владелец, автор контента, E-E-A-T-сигналы |

## Концепции

| Страница | О чём |
|---|---|
| [Система SEO/GEO-мониторинга](concepts/seo-monitoring-system.md) | таблицы `seo_*`, синки, дашборд, цикл рекомендаций и засечки |
| [Защищённые SEO-элементы](concepts/protected-seo-elements.md) | 10 групп, которые нельзя ломать; запрет `aggregateRating` |
| [Двойное дерево роутов (es)/[locale]](concepts/i18n-dual-route-tree.md) | почему правку надо вносить дважды |
| [Цены на услуги](concepts/service-pricing.md) | единый источник цен, что где показывается, ориентиры рынка |
| [Мобильная версия app-like](concepts/mobile-app-like.md) | решения редизайна и performance overhaul |
| [Шапка и навигация](concepts/header-navigation.md) | структура после редизайна 2026-08-13, инварианты (WhatsApp — единственный зелёный, корзина ≠ магазин, crawlable-дропдаун) |
| [Дизайн-система @24clima/design](concepts/design-system-package.md) | токены в отдельном пакете, workflow обновления, `GH_PAT` |
| [Как работают AI-агенты](concepts/agent-workflow.md) | план → codex → seo-reviewer → проверки → OK на push |
| [Сегменты клиентов «hvac»](concepts/hvac-customer-segments.md) | expats / B2B / администрадоры PH / not-fit specialty / event-аренда + Panamá Oeste |
| [Архитектура памяти](concepts/memory-architecture.md) | три слоя и политика: канонична только repo-память, локальная — кэш |
| [Магазин /tienda](concepts/tienda-shop.md) | магазин внутри сайта, редирект со `shop.24clima.com` (пока 302), свой бэкенд |
| [Google Отзывы клиентов](concepts/google-customer-reviews.md) | merchant_id, opt-in, витринный виджет, `/privacidad`, что осталось до запуска |
| [Supabase-проекты](concepts/supabase-projects.md) | два проекта, проект сайта не виден через MCP, как ходить по REST |

## Источники

| Страница | О чём |
|---|---|
| [PROJECT_MEMORY.md](sources/project-memory.md) | журнал сессий, разложенный по темам |

## Синтез

| Страница | О чём |
|---|---|
| [Грабли проекта](synthesis/gotchas.md) | 23 ошибки, которые уже стоили времени — просмотреть перед работой |

## Пробелы

Темы, которых в вики пока нет — кандидаты на ingest:

- `DESIGN.md` — бренд-бук мобильной версии (не заингещен).
- Бэкенд магазина (репозиторий `24clima-shop`): устройство API `/v1/**`,
  где он хостится, что умеет отдавать по заказу. Витрина описана
  ([магазин /tienda](concepts/tienda-shop.md)), бэкенд — нет.
- Калькулятор: модель ценообразования `calculator-pricing.ts`.
- Блог `/consejos-y-guias`: структура, авторство, что и зачем пишется.
- Живые данные GSC/GA4 — как только появится доступ к цифрам.
