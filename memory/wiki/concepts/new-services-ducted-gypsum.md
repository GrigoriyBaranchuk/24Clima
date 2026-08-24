---
type: concept
title: Новые услуги — гипсокартон, скрытый климат (ductos) под ключ, магазин VIP Aire, сметы B2B
updated: 2026-08-23
sources: [sources/2026-08-23-panama-new-services-research.md, решения владельца в сессии 2026-08-23, ревью Codex 01a02fda и 01a03017, ~/Downloads/VIP_AIRE (прайсы), PR #51 (commit 802076b)]
related: [sources/2026-08-23-panama-new-services-research, entities/vip-aire, entities/eurocalidad, concepts/panama-contractor-licensing, concepts/service-pricing, concepts/tienda-shop, concepts/hvac-customer-segments, concepts/passive-cooling-service, concepts/panama-advertising-law]
status: current
---

## Суть

Решение владельца (2026-08-23): 24clima добавляет четыре направления —
**(A) Gypsum** (потолки, стены, дизайнерские решения из гипсокартона, как
самостоятельная услуга), **(B) Clima oculto llave en mano** (канальная
система fan coil/ducted + гипсокартонный потолок вокруг неё, одна
ответственность), **(C) магазин компонентов VIP Aire** внутри `/tienda`,
**(D) сметы для B2B**. Инспекции/экспертиза — **нет**. Позиция:
«кондиционер, которого не видно: потолок и климат в нём — один подрядчик,
один контракт». Стратегия v2 — `memory/inbox/2026-08-23-strategy-draft.md`
(черновик, локально); суть ниже.

## Решения владельца

| Вопрос | Решение |
|---|---|
| Порядок запуска | потолки + канальные первыми (один пакет), магазин параллельно, сметы B2B — после 2–3 объектов |
| Бригада | своя, доучиваем; новых нанимаем под присмотром EuroCalidad |
| Лицензия JTIA | инженера нет, стартуем без неё; **будет человек с правом подписи** → оформить контракт + регистрацию компании в JTIA. У владельца ребёнок-панамец — лицензия для него возможна позже |
| EuroCalidad на сайте | **не показываем**; видео немецких объектов берём с подписью «obra en Alemania» |
| Фото работ | из Notion-каталога VIP Aire (скачать к себе — CDN-ссылки могут умереть) |
| Цены на сайте | потолки — «desde $/m²» (клиенту просто считать); clima oculto — сначала «cotización gratis», после ревью Codex 01a03017 — **видимая цена desde $6 000** (диапазон $6 000–20 000 за объект), потому что цена в JSON-LD без цены на странице = расхождение разметки с контентом |
| Цены gypsum | liso **desde $35/m²** (под покраску: каркас, лист, лента, pasta, шлифовка; покраска отдельно); **LED-короб desde $25/ml**; дизайн и стены — cotización |
| Наценка магазина | **35%** на все прайсы VIP Aire + 7% ITBMS → ×1,4445 |
| Медь | себестоимость только от бухты 45 м (режем сами), продажа по метрам, **мин. отрез 5 м**, шаг 1 м |
| Люки | премиум через факты («marco de aluminio, tapa pasteable invisible, para quien no acepta compromisos»), без «mejores de Panamá» |
| Решётки с фильтром | поштучно, от $40 за стандарт |

## Что можно без лицензии, что нет

Подробно — [лицензирование](panama-contractor-licensing.md). Коротко: гипсокартон —
везде; монтаж канальной системы техником с LTR — в жилье и PH, где пермит не
нужен, и по чужим подписанным планам (ГК); магазин и сметы Express — да.
Нельзя до регистрации идóneo: слова «ingeniería / diseño / proyecto» в
рекламе (Art. 18 Ley 15), подпись планов и пермиты, коммерческие объекты с
разрешением напрямую, госзакупки.

## Сегменты — порядок входа

1. Частники с ремонтом (квартиры, дома, экспаты) — gypsum и clima oculto.
2. Администрадоры PH — общие зоны, лобби, скрытие A/C.
3. Малый коммерческий fit-out **субподрядом у ГК** (PRODEO, Forero, Teran
   Arquitectura, Spazio Reforma) — по их планам и пермитам.
4. После идóneo: сети напрямую (Platinum/KFC, Vierci, Pizza Hut, Regus),
   девелоперы, госпитали, PanamaCompra.

## Реализовано на сайте (2026-08-23, PR #51, commit 802076b)

Обе услуги — **полноценные записи реестра** `SERVICE_SLUGS` (не лендинги):
меню, главная, `/servicios`, sitemap, три языка, JSON-LD Service.

| | `gypsum` (ключ `gypsum`) | `aire-acondicionado-oculto` (ключ `hiddenAc`) |
|---|---|---|
| Hero | «desde $35/m²», иконка `Layers`, фото `gypsum-opt.webp` (slot2-03) | «desde $6 000», иконка `AirVent`, фото `aire-oculto-opt.webp` (slot-01) |
| Таблица цен | liso $35/m²; cajón LED $25/ml; paredes, niveles — cotización; сноска-условия (≥20 m², высота ≤3 м, без демонтажа, MR/firecode — доплата) | visita gratis; 1 зона до ~40 m² desde $6 000; apartamento 100–150 m² $9 000–20 000; cielo raso incluido |
| `SERVICE_PRICING` | 35–65, warrantyDays 365, `priceUnitCode: "MTK"` | 6 000–20 000, warrantyDays 365 |
| JSON-LD | `Offer.priceSpecification` = `UnitPriceSpecification` с `unitCode: "MTK"` (цена за м²) | обычный `Offer` с диапазоном |
| FAQ | 6 (gypsum vs PVC, MR в ванных, сроки, покраска, что входит) | 6 (опуск потолка, доступ через люки, дренаж, сроки, гарантия) |

Общие решения: гарантия 365 дней на обе услуги; корневой `HVACBusiness.priceRange`
сменён с `"$$"` на `"$"` (Codex: с чеками от $6 000 и от $25 сегментация
одним знаком бессмысленна, оставлен нижний ярус); в новом копи нет слов
«ingeniería / diseño / proyecto / planos» (Art. 18 Ley 15); главная — новые
услуги в **первой четвёрке** карточек (мобайл режет до 4), порядок:
instalación, limpieza, gypsum, oculto, mantenimiento, reparación, carga,
emergencia; дропдаун «Servicios» — 8 ссылок в две колонки
([шапка](header-navigation.md)). Цитаты: ASTM C840, gypsum.org, ASHRAE 62.1,
ENERGY STAR. Проверки: lint/build чисто, RRT — 3 элемента без ошибок,
seo-reviewer flag-with-conditions → условия выполнены; каталог JSON-LD в
скилле пополнен `UnitPriceSpecification`.

Отложено: галерея фото (20 фото VIP Aire лежат в `raw/photos/vipaire-2026-08-23/`,
компонента галереи нет — новый UI без отдельного решения не вводим); футер;
старые цитаты ENERGY STAR (`saveathome/…`) отдают 404 — отдельная задача.

## Что дальше на сайте

1. Пять статей: «¿Cuánto cuesta un cielo raso de gypsum en Panamá?» (первая),
   «¿Cuánto cuesta un sistema de ductos?», «¿Qué es el armaflex?»,
   «Gypsum vs PVC», «Cómo esconder el aire acondicionado». Про RAV — только
   после чтения нормы.
2. Магазин: волна 1 — медь с изоляцией по метрам, bases/soportes, rejilla de
   retorno con filtro; волна 2 — ductos Isodec, cuellos; люки — после
   подтверждения поштучной продажи. Перед заливкой сверять с Copper Group /
   Frío Panamá «precio final al cliente» и проверить, не добавляет ли
   бэкенд ITBMS второй раз.
3. Переписать нашу статью с «$4 500–5 500 за 150 m²» — реальный коридор $9–20k.
4. Галерея работ на страницах услуг — решить компонент (через seo-reviewer).

## До первого клиента (из ревью Codex)

- Политика гарантии: швы потолка, конденсат/протечки, оборудование; срок.
- «Кто платит при вскрытии потолка» — ответ: люки по нашему чек-листу, вскрытия нет.
- Не писать «немецкий стандарт» как свой опыт — только конкретика (чек-лист, фото узлов, гарантия).

## Вне сайта (90 дней)

GBP-категории (проверить «Drywall contractor» в Панаме; fallback Contractor /
Air conditioning contractor); Instagram — обучающие серии, мерить лиды;
1–2 первых объекта «до/после»; póliza RC; LTR техникам; VIP Aire — SKU-лист,
цены на диффузоры/решётки/базы/кабель, подтвердить прайс Isodec 2023, мин.
партии, онлайн-эксклюзив; EXPO CAPAC 24–27.09.2026 — посетителем.

## KPI

90 дней: страницы в индексе, GBP с ≥5 отзывами, 3 статьи, ≥10 SKU, 1–2
объекта, 3–5 лидов/мес. 6 мес: 10+ лидов/мес, 3+ объекта через ГК, первая
смета зачтена, идóneo оформлен. 12 мес: сегмент 4, решение по стенду CAPAC 2027.

## Грабли / ограничения

- Ley 45 / ACODECO: не приписывать себе немецкие объекты; превосходные степени запрещены.
- $35/m² без условий «desde» — ловушка убыточных мелких заказов.
- Прайс Isodec 2023 г.; в прайсах VIP Aire нет диффузоров/решёток/баз/кабеля.

## Связи

- [Исследование 2026-08-23](../sources/2026-08-23-panama-new-services-research.md)
- [VIP Aire](../entities/vip-aire.md) · [EuroCalidad](../entities/eurocalidad.md)
- [Лицензирование подрядчика](panama-contractor-licensing.md)
- [Цены на услуги](service-pricing.md) · [Магазин /tienda](tienda-shop.md)
- [Сегменты клиентов](hvac-customer-segments.md)
- [Услуга пассивного охлаждения](passive-cooling-service.md) — другое направление того же партнёра
- [Право: реклама](panama-advertising-law.md)
