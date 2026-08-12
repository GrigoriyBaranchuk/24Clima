---
type: concept
title: Магазин /tienda — переезд с shop.24clima.com
updated: 2026-08-11
sources: [PROJECT_MEMORY.md, src/middleware.ts, src/features/tienda/lib/api-client.ts, локальная память Claude (машина 2)]
related: [entities/24clima, concepts/google-customer-reviews, concepts/supabase-projects, concepts/i18n-dual-route-tree]
status: current
---

## Суть

Магазин живёт **внутри основного сайта** по пути `24clima.com/tienda`, а не
на отдельном поддомене. Старый домен `shop.24clima.com` оставлен только под
редирект. Код магазина — `src/features/tienda/**` плюс роуты в обоих деревьях
`(es)/tienda` и `[locale]/tienda`.

## Факты

- **Один домен — не только косметика.** Требование Google Customer Reviews
  «корзина и чекаут в одном домене» выполняется автоматически именно потому,
  что магазин на `24clima.com/tienda`
  [локальная память Claude, 2026-08-11].
- **Редирект старого домена** — `src/middleware.ts`: хост `shop.24clima.com`
  (и `www.`) отображается одним хопом на `/tienda`-дерево с сохранением
  локали и query. `/es` снимается (es на сайте без префикса), `en`/`ru`
  переносятся на цель.
- **Редирект пока 302, а не 301** — константа `CUTOVER_REDIRECT_PERMANENT =
  false`. Так задумано на время прогрева: пока хоп временный, поисковики
  держат старые URL магазина. Флип на `true` — после того как новые
  `/tienda`-страницы прогреются и проиндексируются [проверено в коде
  2026-08-11]. **Это открытая задача, не забытый флаг.**
- **API-трафик не редиректится:** запросы на `/api/` с хоста магазина
  проходят насквозь (тот же бэкенд через rewrite `/api/v1`), редирект их
  никогда не трогает — защита в middleware плюс исключение в matcher.
- **Данные магазина — в собственном бэкенде**, а не в базе сайта: клиент
  ходит в `/v1/...` (`src/features/tienda/lib/api-client.ts`) через
  same-origin rewrite, адрес — `NEXT_PUBLIC_API_URL` в браузере и
  `API_PROXY_TARGET` на сервере. Supabase-проект у магазина тоже отдельный
  (см. [Supabase-проекты](supabase-projects.md)).
- **Чекаут:** телефон обязателен и выбирается с кодом страны
  (`src/features/tienda/lib/phone-countries.ts`), email — **необязательный**.
  Оплата — при получении и переводом; карты не обрабатываются
  [PROJECT_MEMORY.md, 2026-08-10].

## Грабли / ограничения

- Бэкенд `/v1/orders/{ref}` **не возвращает** email покупателя и дату
  доставки. Поэтому чекаут кладёт их в `sessionStorage` сразу после создания
  заказа, а страница заказа читает оттуда — окно жизни данных ровно одно:
  вкладка покупателя до её закрытия. Если бэкенд научится их отдавать —
  костыль надо убрать (см. [Google Отзывы клиентов](google-customer-reviews.md)).
- Email необязателен в чекауте ⇒ у части заказов запроса согласия на отзыв
  не будет вовсе: без email модуль Google не рендерится.
- Правки в магазине, как и везде на сайте, вносятся **дважды** — в `(es)` и
  в `[locale]` (см. [двойное дерево роутов](i18n-dual-route-tree.md)).

## Связи

- [Google Отзывы клиентов](google-customer-reviews.md)
- [Supabase-проекты](supabase-projects.md)
- [24clima](../entities/24clima.md)
