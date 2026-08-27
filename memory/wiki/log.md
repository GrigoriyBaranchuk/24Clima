# Журнал операций над вики

Append-only, новые записи сверху.

## [2026-08-26] ingest | диагноз «Algo salió mal» после деплоя: 504 /tienda (runtime-вид грабли №34), не skew

Затронуто: `concepts/vercel-deploy-and-errors` (runtime-504 на /tienda:
15 случаев, 12 пользователей 28.06–26.08; признак отличия от skew — экран
без `Ref:`), `synthesis/gotchas` (№34 дополнен runtime-последствием).

Суть: скриншот владельца «после новой версии» оказался не skew №31, а
зависанием force-dynamic `/tienda` на холодном shop-api (300 с → 504 →
error boundary без digest). PR #58 закрыл и runtime-путь; прод проверен
(200 за ~1 с). Источник — Vercel get_runtime_errors/get_runtime_logs.

## [2026-08-27] ingest | закрытие сессии: вторая волна билд-падений (sitemap) + таймауты api-client

Затронуто: `synthesis/gotchas` (№34 — remedy дополнен), 
`concepts/vercel-deploy-and-errors` (вторая волна: 3 прод-деплоя Error на
sitemap; фикс PR #58 — Promise.race-таймаут 45 с, не AbortSignal).

Суть: зависший fetch к холодному shop-api — не ошибка, поэтому
graceful-degradation sitemap не срабатывал; прод стоял на старом билде,
пока не смержили #58. Прод проверен живьём после деплоя 223e87f.

## [2026-08-26] ingest | цикл /seo-tasks (id 27, 29) + фикс скролла + фикс билда merchant-feed

Затронуто: `synthesis/gotchas` (№33 scroll={false}, №34 билд-заложник ISR),
`concepts/seo-monitoring-system` (id 27/29 закрыты; противоречие снято:
Supabase MCP теперь видит проект сайта, но read-only),
`concepts/vercel-deploy-and-errors` (кейс merchant-feed).

Суть: id 27 закрыт диагностикой (источник был здоров), id 29 — PR #56
(merge 0c063ad: футер-ссылки, reparacion/limpieza/instalacion) + статья
recarga реструктурирована в Supabase (развод интентов со второй статьёй).
Попутно: сквозной фикс scroll={false} (isHashNav) и revalidate=0 для
merchant-feed. id 26 в accepted, гео-страницы районов — делаем.

## [2026-08-24] ingest | переименование ductos + галереи + видео (PR #51, 4 коммита)

Затронуто: `concepts/new-services-ducted-gypsum` (разделы «Переименование»
и «Галерея и видео»), `concepts/header-navigation` (слаг в дропдауне),
`concepts/service-pricing` (слаг в таблице), `index.md`.

Суть: slug `aire-acondicionado-oculto` → `aire-acondicionado-por-ductos`
(Codex 01a03212: fan coil = товарный интент, ductos = подрядный; владелец
принял), меню «A/C ductos», +2 FAQ; ServiceGallery (scroll-snap, 4+4 webp)
и LiteYouTube-фасад (wHiH9qb3hf0, «Obra en Alemania») + точечная CSP-правка.
seo-reviewer approve, условия закрыты. Коммиты 4fc82fe, 6d088c1, 4bf7efc,
2b981e3.

## [2026-08-23] ingest | страницы услуг gypsum + aire-acondicionado-oculto (PR #51)

Затронуто: `concepts/new-services-ducted-gypsum` (раздел «Реализовано на
сайте», цена oculto стала видимой — desde $6 000), `concepts/service-pricing`
(цена за единицу `UnitPriceSpecification`/MTK, `priceRange` → «$»),
`concepts/header-navigation` (8 услуг в дропдауне, две колонки),
`synthesis/gotchas` (biome format по всему репо — теперь №32, №31 занят skew), `index.md`.

Источник: commit 802076b (Opus по плану `inbox/2026-08-23-plan-service-pages.md`,
ревью Codex 01a03017, seo-reviewer flag-with-conditions → выполнено, RRT без
ошибок). Фото VIP Aire — `raw/photos/vipaire-2026-08-23/`.

## [2026-08-23] ingest | инцидент «Something went wrong» → error boundary + skew (PR #50)

Затронуто: новая `concepts/vercel-deploy-and-errors`; `synthesis/gotchas`
(№31, связи); обратная ссылка в `concepts/agent-workflow`; `index.md`
(+1 концепт, счётчик грабель 31).
Примечание: Skew Protection была включена ДО инцидента (первичная запись
«включить» исправлена в PR #52); причина — вкладка старше 12-часового окна
после двух деплоев подряд. Факты о проекте Vercel сняты с API (GET) —
PATCH настроек из сессии агента блокируется политикой.

## [2026-08-23] ingest | исследование новых услуг (ducted + gypsum + VIP Aire + B2B)

Затронуто: новые `sources/2026-08-23-panama-new-services-research`,
`concepts/new-services-ducted-gypsum`, `concepts/panama-contractor-licensing`,
`entities/vip-aire`, `entities/eurocalidad`; обратные ссылки в
`entities/tropiclima`, `entities/24clima`, `concepts/service-pricing`,
`concepts/tienda-shop`, `concepts/hvac-customer-segments`,
`concepts/panama-advertising-law`; `index.md` (+5 страниц, закрыт пробел
JTIA idoneidad, добавлены пробелы RAV и tax_amount).

Сырьё: 7 отчётов в `raw/research/` + CSV в `raw/dataforseo/`. Решения
владельца и ревью Codex (сессия 01a02fda) — в концепт-странице; полная
стратегия v2 — в `inbox/` (локально, не коммитится).

## [2026-08-23] ingest | новые задачи владельца по шапке

Затронуто: `concepts/header-navigation` (раздел «Запрошено владельцем»),
`PROJECT_MEMORY.md`.

Записаны два пункта, поставленных владельцем при закрытии сессии:
переключатель языка влево и усиление CTR кнопки «Tienda». Оба
зафиксированы вместе с препятствием, а не как голые формулировки:
первый упирается в набор слотов `HeaderShell` пакета, второй — в
инвариант «WhatsApp — единственный зелёный заливкой» и потому требует
решения владельца о приоритете, а не только дизайна.

## [2026-08-22] ingest | активные состояния навигации (собственная работа)

Затронуто: `concepts/header-navigation` (новый раздел «Активные состояния»,
блок про локальный `NavItem` вместо `HeaderNavLink`, переписан «Открытое»),
`synthesis/gotchas` (грабли №28 и №29).

Примечания:
- Закрыт переходящий пункт Codex №14, тянувшийся с редизайна шапки 2026-08-13.
- Развилка «расширять пакет дизайна против локального компонента» решена
  консультацией Codex в пользу локального; условие возврата записано на
  странице навигации.
- Две грабли добытые этой задачей: конфликт дописанных tailwind-утилит и
  хвостовой слеш в `usePathname` при `trailingSlash: true`.
- seo-reviewer не вызывался (инструкция сессии запрещает спавнить агентов
  без запроса); проверка защищённых элементов сделана вручную по
  `concepts/protected-seo-elements` — 10/10 на HTML с `next start`.
- Добавлены грабли №30: превью-домены Vercel закрыты Deployment Protection,
  `curl` получает 302 на SSO — проверять HTML на локальном `next start`.
- Код и эта запись уехали одним PR #47 (смержен в main по ok владельца).

## [2026-08-17] ingest | исследование рынка пассивного охлаждения в Панаме

Затронуто: `entities/tropiclima.md` (новая), `concepts/passive-cooling-service.md`
(новая — решения владельца, спрос, конкуренты, экономика, план),
`concepts/panama-electricity-market.md` (новая — тарифы BTS, FET, агрегаты
ASEP за май 2026, структура спроса), `concepts/panama-advertising-law.md`
(новая — Ley 45/ACODECO, Ley 69/аккредитация, правила формулировок),
`sources/2026-08-15-panama-passive-cooling-research.md` (новая),
`raw/dataforseo/2026-08-15-panama-passive-cooling-keywords.csv` (новый
источник, 273 строки), `synthesis/gotchas.md` (грабли №26 и №27),
`entities/24clima.md`, `concepts/hvac-customer-segments.md`,
`concepts/protected-seo-elements.md` (обратные ссылки), `index.md`
(+5 страниц, счётчик 22, счёт граблей 27, два новых пробела).

Примечание: read-only исследование по запросу владельца, кода не касалось.
Найденная связка: требование **JTIA** из Ley 69 для энергоуслуг — то же
ведомство, что `JTIA idoneidad` в B2B-сегменте (research 2026-05-29), где
вопрос «есть ли у владельца idoneidad» до сих пор открыт; теперь оба
пробела сведены в `index.md`. Гипотезы (экономия 8–15 %, доля
кондиционирования 40 %) помечены как гипотезы на всех страницах — не
цитировать как факт. Отчёт-артефакт:
`https://claude.ai/code/artifact/6078d9e9-8515-47c7-9255-4d90abb49de6`.

## [2026-08-13] ingest | редизайн шапки desktop (PR #41)

Затронуто: `concepts/header-navigation.md` (новая страница — структура шапки,
инварианты: WhatsApp — единственный зелёный, корзина ≠ магазин,
crawlable-дропдаун), `concepts/mobile-app-like.md` (уточнение правила
«десктоп не трогаем» — изменение 2026-08-13 было с явным ok владельца),
`index.md` (строка + счётчик 17).

Примечание: знание из сессии редизайна (обсуждение с Codex + approve
seo-reviewer + plan review Codex, PR #41 смержен в main). Открытый хвост —
активные состояния навигации (Codex №14) — зафиксирован на странице.

## [2026-08-12] ingest | пропуск протокола сессии (инцидент, фоновый джоб)

Затронуто: `synthesis/gotchas.md` (новая грабля №23), `index.md` (счётчик),
корневой `CLAUDE.md` (шаги 1–2 протокола помечены безусловными).

Примечание: агент начал разбор шапки главной без `git pull` и todo-списка,
посчитав задачу «обсуждением». По требованию user протокол ужесточён:
тип задачи значения не имеет.

## [2026-08-12] ingest | иконка корзины в шапке магазина (PR #36)

Затронуто: `concepts/tienda-shop` (факт «вход в корзину — иконка в шапке
через проп showCartLink»; новая грабля «GET /v1/cart/items создаёт корзину
гостю → бейдж не ходит в API, счётчик зеркалится в localStorage»).

Примечание: дизайн-решение прогнано через codex (проп вместо
pathname-детекта; бейдж только слушает cart-updated; BottomNav не трогать),
seo-reviewer дал approve без условий. Рекомендация seo-reviewer на будущее:
следить в GSC за индексацией закрытого в robots `/tienda/cart` — при
появлении в SERP переходить на crawl-allow + noindex.

## [2026-08-12] ingest | фикс markdown в описании товара (PR #31)

Затронуто: `concepts/tienda-shop` (новый факт «контент каталога — markdown»:
видимый рендер через react-markdown, машинные поверхности — через
`src/lib/markdown-plain-text.ts`).

Примечание: находка codex — сырой markdown уходил не только в UI, но и в
Product/FAQPage JSON-LD; seo-reviewer одобрил чистку строк (структура схем
не тронута) и отклонил подмену description на meta_description. Попутный
пробел: в скилле `24clima-seo-guide` `json-ld-catalog.md` до сих пор
утверждает «Product не используем» — устарело, tienda эмитит Product/Offer;
кандидат на правку.

## [2026-08-12] ingest | закрытие сессии машины 2 — гигиена веток

Затронуто: `concepts/agent-workflow` (новый раздел «Гигиена веток и
worktree» — рецепт аудита ветки по содержимому, порядок удаления),
`synthesis/gotchas` (уточнена №17).

Примечание: **`git cherry` на сквош-мерже врёт** — для
`feat/google-customer-reviews` пометил `+` все 8 коммитов, хотя файлы
ветки байт-в-байт совпадали с main. Прежняя формулировка граблей №17
советовала именно `git cherry`; заменено на diff содержимого по файлам,
которые ветка трогала. Практика: чистка 15 веток 2026-08-12, потерь нет.

## [2026-08-11] ingest | локальная память Claude (машина 2)

Вторая половина той же разовой миграции, что на машине 1: проектные факты
из авто-памяти Claude Code (`~/.claude/projects/…/memory/`) перенесены в
вики, локальный `MEMORY.md` сведён к указателям.

Создано 3 страницы:
- `concepts/google-customer-reviews` — программа Google Отзывы клиентов:
  merchant_id `5828751614`, модуль opt-in, витринный виджет, `/privacidad`,
  срок доставки 2 дня, что осталось до запуска.
- `concepts/tienda-shop` — магазин живёт на `24clima.com/tienda`, старый
  хост `shop.24clima.com` редиректится middleware.
- `concepts/supabase-projects` — два проекта (сайт `qgvfnpafbzzgnryoxnoj`,
  магазин `fbnxowigwyblwsfosata`), ключи не взаимозаменяемы.

Обновлено: `synthesis/gotchas` (+4, №19–22), `entities/24clima`
(противоречие про домен магазина), `concepts/seo-monitoring-system`
(ссылка на supabase-проекты), `concepts/memory-architecture`
(третий слой + политика авторитета), `index.md`.

Примечания:
- **Противоречие разрешено по коду:** в вики значилось «смежный проект
  shop.24clima.com». Фактически магазин — часть сайта (`/tienda`), а хост
  редиректится в `src/middleware.ts`. Старая формулировка не затёрта, а
  помечена блоком «Противоречие» на `entities/24clima`.
- **Найдено при проверке фактов:** редирект `shop.24clima.com → /tienda`
  сейчас **302**, а не 301 (`CUTOVER_REDIRECT_PERMANENT = false`) — так
  задумано на время прогрева, флип после индексации. Записано как открытая
  задача, а не как баг.
- Грабли №20–21 (bun/`packageManager`, PATH) взяты не из локальной памяти,
  а из `PROJECT_MEMORY.md` — в вики их не было, добавлены попутно.
- **Не перенесено сознательно:** правило делегирования простого кода
  субагенту (личное предпочтение владельца по работе с агентом) — остаётся
  в локальной памяти машины 2.
- Разошлось с параллельной записью машины 1 (PR #27) в трёх файлах —
  `PROJECT_MEMORY.md`, `log.md`, `memory-architecture`; конфликт разрешён
  сохранением обеих записей, статус миграции машины 2 обновлён на «выполнена».

## [2026-08-11] ingest | закрытие сессии — финальная политика двух машин

Затронуто: `concepts/memory-architecture` (раздел «Политика двух машин»:
repo-память = единственный источник, inbox без auto-commit, ритуал
«начинаем/заканчиваем», Cursor выведен, статус миграции обеих машин),
`log.md` (запись 2026-08-11 перенесена наверх по формату схемы).

Примечание: консультация codex `019ff412…` сохранена в сессии
(`.context/codex-session-id`), можно продолжать follow-up-вопросами.

## [2026-08-11] ingest | локальная память Claude (машина 1) + политика памяти

Перенос долговременных проектных фактов из машинно-локальной авто-памяти
Claude Code в вики (решение по консультации codex: repo-память —
единственный источник истины, локальная — не-authoritative кэш):

- `synthesis/gotchas.md`: +6 граблей (№13–18 — Node 25 localStorage-стаб,
  React #482, анимация recharts, `gh pr merge --delete-branch`,
  сквош-мерж прячет merged-ветки, мёртвый лок worktree).
- Новая страница `concepts/hvac-customer-segments.md` — 4+1 сегмент
  «hvac»-поиска + Panamá Oeste (исследование 2026-05-29).
- `concepts/seo-monitoring-system.md`: снято устаревшее «миграция 006 не
  применена»; добавлен фикс тоталов GSC (PR #25, `seo_gsc_totals`).
- В `memory/CLAUDE.md` — политика источника истины + каталог `inbox/`
  (черновики, .gitignore, в вики только через явный ingest).
- Cursor выведен из проекта: `.cursor/rules/` удалён из репо.

Не перенесено сознательно: личные предпочтения владельца и правила
взаимодействия с конкретным агентом — остаются в локальной памяти машин.

## [2026-08-10] ingest | установка Memory Compiler (собственная работа)

Источники: `~/Projects/claude-memory-compiler/{README,AGENTS}.md`, гист
Karpathy, фактическая установка на машине.

Создано: `concepts/memory-architecture`. Обновлено: `index.md`,
`concepts/agent-workflow` (добавлен третий слой памяти).

Примечания:
- В `.claude/settings.json` хуки уже были прописаны, но с чужими путями
  `/Users/user/Projects/...` — то есть **не работали**. Починено на `$HOME`.
- В команды добавлен `export PATH="/opt/homebrew/bin:$PATH"`: при
  урезанном PATH `uv` не находился, а провал хука тихий.
- Проверено: SessionStart отдаёт валидный JSON, SessionEnd корректно
  парсит stdin и логирует SKIP на несуществующем транскрипте.
  Полный проход с вызовом LLM не гонялся — сработает штатно при
  завершении реальной сессии.

## [2026-08-10] ingest | PROJECT_MEMORY.md + CLAUDE.md

Первичное засеивание вики при установке паттерна LLM Wiki.

Создано 11 страниц: `entities/{24clima,ryhor-baranchuk}`,
`concepts/{seo-monitoring-system,protected-seo-elements,i18n-dual-route-tree,service-pricing,mobile-app-like,design-system-package,agent-workflow}`,
`sources/project-memory`, `synthesis/gotchas`, плюс `index.md`.

Примечания:
- Знание взято из журнала сессий (406 строк) и корневого `CLAUDE.md`;
  утверждения про код не перепроверялись построчно — при расхождении
  побеждает проверка в репозитории.
- Не заингещены: `DESIGN.md`, `docs/**`, скиллы `.agents/skills/**` —
  вынесены в раздел «Пробелы» индекса.
- Добавлен факт вне `PROJECT_MEMORY.md`: локальный
  `SUPABASE_SERVICE_ROLE_KEY` пуст (проверено 2026-08-10 при попытке
  прочитать `seo_gsc_daily` по REST — 401 «Invalid API key»).

