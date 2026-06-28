# 24Clima.com — Память проекта

> Этот файл — общая память для всех AI-сессий (Cowork, Cursor, Claude Code).
> Обновляй его после каждой значимой работы.

---

## Проект

**Сайт:** https://24clima.com
**Компания:** WOW Soluciones Panama (бренд 24clima)
**Отрасль:** HVAC/R (кондиционеры, холодильное оборудование)
**Владелец:** Ryhor Baranchuk (ryhor@24clima.com, +507 6828-2120)
**Регион:** Панама (Латинская Америка)

## Стек

- **Framework:** Next.js 15.3.6 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS 3.4.17 + tailwindcss-animate + @tailwindcss/typography
- **UI:** shadcn/ui (Button, Card, Sheet, Badge, Dropdown)
- **i18n:** next-intl 4.8.2 (es/en/ru), defaultLocale: es
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Deploy:** Vercel (auto-deploy on push to main)
- **Package manager:** bun (primary), npm (fallback)
- **Linting:** Biome + ESLint
- **Icons:** lucide-react
- **Markdown:** react-markdown + remark-gfm (для блога)

## Структура проекта

```
src/
├── app/
│   ├── [locale]/           # Роуты по локалям (es/en/ru)
│   │   ├── page.tsx        # Главная (Hero, Calculator, Services...)
│   │   ├── contacto/       # Контакты
│   │   ├── nosotros/       # О нас
│   │   ├── servicios/[service]/  # Услуги
│   │   ├── diagnostico/    # Диагностика
│   │   ├── areas-de-servicio/    # Зоны обслуживания
│   │   └── consejos-y-guias/     # Блог
│   └── api/                # API routes (contact, translate, sync-reviews)
├── components/             # ~41 компонент
│   ├── ui/                 # shadcn/ui примитивы
│   ├── Header.tsx          # Навигация + мобильное меню (Sheet)
│   ├── Hero.tsx            # Баннер с CTA
│   ├── Footer.tsx          # Футер (responsive grid)
│   ├── Calculator.tsx      # Калькулятор цен (264 строки)
│   ├── Services.tsx        # Сетка услуг
│   ├── Contact.tsx         # Контакты + форма
│   ├── WhatsAppButton.tsx  # Плавающая кнопка WhatsApp
│   ├── Reviews.tsx         # Google отзывы
│   └── ...
├── i18n/                   # Конфигурация локализации
├── lib/                    # Утилиты (supabase, seo, constants)
└── hooks/                  # React хуки
messages/                   # Файлы переводов (es.json, en.json, ru.json)
public/                     # Статика (images, uploads)
docs/                       # Документация
.cursor/rules/              # Правила для Cursor AI
```

## Дизайн-система

**Цвета:**
- Brand green: `#7BC043` (основной CTA)
- Brand navy: `#1e3a5f` (хедер, hero фон)
- WhatsApp green: `#25D366`
- Dark navy варианты для градиентов

**Шрифты:**
- Inter (--font-inter) — sans-serif, основной
- Lora (--font-lora) — serif, акценты

**Breakpoints:**
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
- Навигация переключается на lg (1024px)

## Текущее состояние мобильной версии

**Что работает:**
- Mobile-first подход в Tailwind (responsive prefixes)
- Гамбургер-меню через Sheet (shadcn/ui)
- Адаптивные размеры текста (3xl → 6xl)
- Touch-friendly кнопки (min h-12)
- WhatsApp CTA на всех устройствах
- Скрытие второстепенных элементов на мобильных
- prefers-reduced-motion поддержка
- Skip-to-content ссылка

**Что нужно улучшить:**
- Нет SafeArea для notch (iPhone)
- Нет swipe-жестов
- Нет bottom navigation (app-like)
- Формы можно оптимизировать для мобильных
- Нет dark mode (закомментирован в globals.css)
- Нет PWA (Service Worker, manifest)

---

## История работы

### Сессия 6 — 2026-04-29 — Mobile performance overhaul

**Цель:** ускорить отклик мобильной версии без изменения визуального дизайна. План из 9 пунктов с приоритезацией по выгоде.

**Результат — все 9 пунктов внедрены, дизайн нетронут.**

| # | Что сделано | Файлы |
|---|---|---|
| 1 | `Hero`, `Footer`, `Services`, `ServicesGrid` переведены на **Server Components** (async + `getTranslations`). onClick (metaPixelEvent) вынесен в `TrackedWhatsAppLink` (client island) | `src/components/{Hero,Footer,Services,ServicesGrid}.tsx` |
| 2 | **UA-detection через `headers()`** — desktop-only блоки (CleaningPackages, StatsSection, Problems, HomeCtaBlocks, BlogPromo, Footer) НЕ рендерятся в HTML на mobile UA | `src/lib/device.ts`, оба `page.tsx`, `middleware.ts` |
| 3 | `ScrollReveal` загружается только на desktop UA через `RevealOnDesktop` server-обёртку | `src/components/RevealOnDesktop.tsx` |
| 4 | Calculator разделён на `CalculatorMobile` + `CalculatorDesktop`. Server-orchestrator `Calculator.tsx` выбирает вариант. Hybrid logic: на mobile UA только Mobile, на desktop UA оба + CSS fallback по viewport (lg:) | `src/components/Calculator{,Mobile,Desktop}.tsx`, `src/lib/calculator-pricing.ts` |
| 5 | JSON-LD проверен — уже минифицирован (`JSON.stringify` без indent во всех 12+ местах) | (no changes needed) |
| 6 | `next.config.js`: `formats: ["image/avif", "image/webp"]` + `minimumCacheTTL: 60 days` | `next.config.js` |
| 7 | GA + Yandex Metrika отложены до first user interaction (click/touch/scroll/keydown) или 3s idle. Meta Pixel оставлен на `lazyOnload` (важен для конверсий) | `src/components/LazyAnalytics.tsx` |
| 8 | `next.config.js`: `compress: true`, `poweredByHeader: false`, `productionBrowserSourceMaps: false` | `next.config.js` |
| 9 | Service Worker (manual, no deps): stale-while-revalidate для HTML, cache-first для static/images. PWA готов | `public/sw.js`, `src/components/ServiceWorkerRegister.tsx` |

**Промежуточные баги, которые попутно починил:**
- `MISSING_MESSAGE: calculator.perUnit` → переключил на `tPackages("perUnit")`
- 404 на `/uploads/ryhor-baranchuk-opt.webp` → положил временную заглушку (нужна реальная фотография)
- BottomNav контраст: `text-gray-400` → `text-gray-700`, `font-medium` → `font-semibold`, `strokeWidth: 2`
- Calculator viewport-mismatch: на desktop UA + узкий viewport показывался desktop calculator; теперь рендерятся оба + CSS-переключатель по `lg:`
- Build error `next/headers in pages/ directory` — webpack cache повреждён после структурных изменений; решается `rm -rf .next`

**Промежуточные UI правки сделанные ранее в Сессии 5:**
- Главная — single screen (`fixed inset-0` на mobile + `Footer` обёрнут `hidden lg:block`)
- Hero: «Llamar» → «Nosotros» (Link → /nosotros)
- Calculator: chevron + Apple-style dropdown тарифов с зелёным чекмарком
- `GoogleRatingCard.tsx` (mobile-only) — 5★ + ссылка на Google Maps
- BottomNav: 5 элементов (Inicio · Servicios · WA FAB · Blog · Problemas)
- Новые страницы `/servicios` (mobile-list через `ServicesGrid` + desktop `<Services />`)
- `messages/{es,en,ru}.json` — ключи `common.blog` + `services.<X>.shortTitle`

**SEO-чеклист (10/10 сохранено):**
- h1 на каждой странице
- JSON-LD: HVACBusiness, WebSite, Service, FAQPage, BreadcrumbList, ItemList — все целы и минифицированы
- meta title/description/canonical/hreflang — не тронуты
- data-ai-summary в layout
- aria-* на новых интерактивных элементах
- skip-to-main-content
- next/image, font-size 16px на inputs

**TypeScript на финале:** `npx tsc --noEmit` → exit 0.

**Что должен сделать пользователь после deploy:**
1. `Ctrl+C` → `rm -rf .next` → `bun dev` (для middleware и `.next` cache reset)
2. ~~Заменить временную фотографию автора~~ ✅ DONE — реальное фото загружено (см. ниже)
3. Production benchmark: `bun run build && bun start` → Lighthouse Mobile + Slow 4G

**Добавлено в финале сессии:**
- Реальное фото автора Ryhor Baranchuk в `public/uploads/ryhor-baranchuk-opt.webp`
  - Источник: `~/Downloads/IMG_7285.jpg` (155 KB, 934×924 JPEG)
  - Конвертировано через ffmpeg: 600×600 center-crop WebP, 33.9 KB
  - Лицо в центре, на фоне кондиционер + манометры — сильный E-E-A-T сигнал
  - Используется в `AuthorBio` (блог), JSON-LD `Person.image`, OpenGraph

**Известный нюанс:** `?_mobile=1` query (для тестирования mobile-варианта на desktop) работает только в development (защищено `process.env.NODE_ENV !== "production"`).

---

### Сессия 1 — Начальная разработка
- Создан сайт на Next.js 15 + Tailwind + Supabase
- Реализована мультиязычность (es/en/ru)
- Основные страницы: главная, услуги, контакты, о нас, блог
- Калькулятор цен на услуги
- Google отзывы (sync с Supabase)
- SEO оптимизация (meta, schema, keywords)
- Деплой на Vercel

### Сессия 2 — SEO и оптимизация
- docs/SEO_quick_fixes_prompt.md — план SEO
- docs/ENTERPRISE_OPTIMIZATION_REPORT.md — отчёт оптимизации
- .cursor/rules/ — 8 файлов правил для AI-разработки

### Сессия 3 — 2026-04-27 — Мобильный редизайн (планирование)
- **Цель:** Сделать мобильную версию как нативное приложение (app-like)
- **Подход:** Responsive design (один URL, разный CSS для mobile < 1024px)
- **Выбранный стиль:** Apple-style (вариант A) + кнопка «Escribenos» из Airbnb-style (вариант C)
- **Референс:** Apple DESIGN.md из awesome-design-md (https://github.com/VoltAgent/awesome-design-md)
- **SEO-скилл:** claude-seo (https://github.com/AgriciDaniel/claude-seo) — 21 sub-skill для SEO/GEO
- Создан PROJECT_MEMORY.md
- Создан DESIGN.md — полный бренд-бук мобильной версии
- Обновлён CLAUDE.md с контекстом мобильного редизайна
- Сохранён Apple DESIGN.md как референс в docs/design-references/
- Сохранён claude-seo README в docs/
- Проведён полный аудит SEO/GEO (25 элементов задокументировано)
- Создано 3 мокапа для выбора стиля (Apple, Stripe, Airbnb)
- Утверждён план из 6 фаз (Fase 0-5)

**Десктопная версия НЕ меняется!** Все изменения только для < 1024px.

**SEO-элементы которые НЕЛЬЗЯ трогать:**
1. JSON-LD: HVACBusiness, Service, Article, FAQPage, BreadcrumbList
2. Meta: title, description, keywords, OG, Twitter cards
3. Canonical URLs + hreflang alternates (es/en/ru)
4. robots.txt (с AI-краулерами), sitemap.ts
5. Middleware redirects (www→non-www, /es/→/, old slugs)
6. Semantic HTML: main#main-content, article, nav, header, footer, aria-*
7. data-ai-summary в layout (GEO)
8. GA4, Yandex Metrika, Meta Pixel tracking
9. E-E-A-T сигналы (author-data.ts, expert credentials)
10. Геолокационные мета-теги (geo.region, ICBM)

**План (6 фаз):**
- Fase 0: DESIGN.md + SEO checklist ✅ DONE
- Fase 1: Bottom navigation (BottomNav.tsx, Header mobile) ✅ DONE
- Fase 2: Hero + главная (app-like layout) ✅ DONE
- Fase 3: Внутренние страницы (услуги, контакты, блог) ✅ DONE
- Fase 4: Footer + анимации + жесты + «Escribenos» ✅ DONE
- Fase 5: SEO/GEO аудит + тестирование ✅ DONE

### Сессия 5 — 2026-04-28 — Мобильная главная: single-screen + новые страницы

**Цель:** убрать прокрутку с главной (фит в один экран), Hero с правильными CTA, Apple-style dropdown тарифов в калькуляторе, Google Maps плашка вместо отзывов, новый bottom nav (Inicio, Servicios, WA, Blog, Problemas).

**Изменения:**
- `messages/{es,en,ru}.json` — добавлен ключ `common.blog` (Blog / Блог).
- `src/components/BottomNav.tsx` — Tips → Blog (FileText), Contact → Problemas (AlertTriangle, → /problemas).
- `src/components/Hero.tsx` — кнопка «Llamar» (tel:) заменена на «Nosotros» (Link → /nosotros, иконка Users).
- `src/components/Calculator.tsx` — переделан мобильный dropdown тарифов в Apple-sheet стиле: список с границей, чекмарк на выбранном, цена под названием. Калькулятор увеличен (p-5, текст 17/22/26px).
- `src/components/GoogleRatingCard.tsx` — НОВЫЙ. Mobile-only плашка: Google «G» + 5★ + ссылка на https://maps.app.goo.gl/HRgdnx2fS25pu48fA.
- `src/components/ServicesGrid.tsx` — НОВЫЙ. Mobile-only список услуг (6 карточек) для страницы /servicios. Иконка с градиентом + title + description + chevron.
- `src/app/[locale]/page.tsx` — переписан: на mobile только Hero + Services + Calculator + GoogleRatingCard в `h-[100dvh] overflow-hidden`. Все остальные блоки (CleaningPackages, Stats, Problems, HomeCtaBlocks, BlogPromo) обёрнуты в `hidden lg:block` — десктоп сохранён без изменений.
- `src/app/[locale]/servicios/page.tsx` — НОВАЯ страница (раньше был только /servicios/[service]/). Meta + canonical + hreflang + JSON-LD ItemList + Breadcrumbs. На mobile показывает ServicesGrid, на desktop — `<Services />`.
- `src/app/[locale]/problemas/page.tsx` — уже существовала, используется как есть (BottomNav теперь ведёт сюда).

**SEO-чеклист (10/10 сохранено):**
- [x] h1 на каждой странице (Hero, ServicesGrid, ProblemsContent)
- [x] JSON-LD: HVACBusiness, Service, Article, FAQPage сохранены; добавлены ItemList + BreadcrumbList на /servicios
- [x] Meta title/description: добавлены для /servicios (es/en/ru), все остальные не тронуты
- [x] Canonical URLs + hreflang alternates сохранены
- [x] data-ai-summary в layout не тронут
- [x] aria-label на новых интерактивных элементах (Google card, dropdown тарифов, services list)
- [x] skip-to-main-content сохранён в Header
- [x] GA4 / Yandex / Meta Pixel tracking сохранены (metaPixelEvent на новых CTA)
- [x] next/image не нарушен; новых изображений не добавлено
- [x] Input font-size: новых input полей нет

**Десктопная версия НЕ изменена.** Все правки — под `lg:hidden` или специальным mobile order.

**TypeScript:** `npx tsc --noEmit` → exit 0, ошибок нет.

---

### Сессия 4 — 2026-04-27 — Мобильный редизайн (реализация)
- **Ветка:** `mobile-redesign`
- **TypeScript:** компилируется без ошибок
- **SEO аудит:** 10/10 элементов сохранены

**Созданные файлы:**
- `src/components/BottomNav.tsx` — мобильная навигация (4 таба + WhatsApp FAB)

**Изменённые файлы (21):**
- `src/components/Header.tsx` — компактный мобильный хедер (h-14, без гамбургера)
- `src/components/WhatsAppButton.tsx` — только desktop (lg:flex)
- `src/components/Hero.tsx` — компактный hero на мобильных (60vh, 2xl title, pill CTA)
- `src/components/Calculator.tsx` — компактные отступы, rounded-full CTA
- `src/components/Services.tsx` — 2x2 grid на мобильных, полные карточки на desktop
- `src/components/CleaningPackages.tsx` — горизонтальный scroll на мобильных
- `src/components/Problems.tsx` — уменьшенные заголовки и отступы
- `src/components/HomeCtaBlocks.tsx` — компактные карточки на мобильных
- `src/components/StatsSection.tsx` — горизонтальный scroll, меньше текст
- `src/components/BlogPromo.tsx` — горизонтальный scroll карточек
- `src/components/Contact.tsx` — компактные отступы и типографика
- `src/components/Footer.tsx` — скрытые навигационные колонки на мобильных, pb-20 для BottomNav
- 8 файлов page.tsx — добавлен BottomNav + адаптивный pt (pt-14 lg:pt-20)

**Принципы мобильного дизайна:**
- Breakpoint: `lg:` (1024px) разделяет mobile/desktop
- Desktop полностью НЕ изменён
- Apple-style типографика: font-semibold, letter-spacing -0.2/-0.3px
- Touch targets: min 44x44px, active:scale-95
- Horizontal scroll: snap-x для карточек (CleaningPackages, BlogPromo, Stats)
- Pill buttons: rounded-full на мобильных CTA

---

## Важные заметки

- **Язык контента:** испанский (es — основной), английский, русский
- **Язык разработки/общения:** русский
- **Основной CTA:** WhatsApp (+507 6828-2120)
- **Целевая аудитория:** жители Панамы, нуждающиеся в кондиционировании
- **Ключевой конверсионный путь:** Сайт → WhatsApp → Заказ услуги
- **Деплой:** push в main → автодеплой на Vercel

## Файлы для AI-контекста

- `CLAUDE.md` — краткое описание проекта (для Claude/Cowork)
- `PROJECT_MEMORY.md` — этот файл (полная память проекта)
- `DESIGN.md` — бренд-бук мобильной версии (Apple-style, 24clima-adapted)
- `docs/design-references/apple-DESIGN-reference.md` — оригинал Apple DESIGN.md
- `docs/claude-seo-README.md` — документация SEO-скилла
- `.cursor/rules/` — правила для Cursor AI
- `docs/` — документация разработчика

## Сессия 2026-06-06 — Panamá Oeste + аренда холода для мероприятий

**Задача 1 — Гео-расширение (SEO/GEO):** добавлены 9 зон Panamá Oeste в `src/lib/areas-data.ts` (Arraiján, Nuevo Arraiján, Vista Alegre, Costa Verde, La Chorrera, El Espino, La Floresta, Vacamonte, Playa Dorada Residences) с es/en/ru-описаниями, GeoCoordinates и responseTime. Синхронизировано: `business-data.ts` areaServed, `layout.tsx` HVACBusiness areaServed (+ «Panamá Oeste»), on-page копи и meta на обоих вариантах `areas-de-servicio` (hero/CTA/description). Бизнес-факт: появился сотрудник на западе → честный городской уровень выезда. Costa Verde + Playa Dorada Residences — приоритет `<1.5h`.

**Задача 2 — Landing аренды холода (лид-ген):** `/alquiler-aire-acondicionado-eventos/` (роуты `(es)` + `[locale]`, компонент `EventCoolingContent.tsx`, namespace `eventCooling` в es/en/ru, запись в `sitemap.ts`, JSON-LD Service+FAQPage+BreadcrumbList). Статус: лид-ген, парка техники нет — тест спроса. Бриф составлен с codex (целевые сегменты + честное позиционирование «без переобещаний»).

**SEO-гейт:** seo-reviewer → flag-with-conditions; все 3 условия закрыты (areaServed синхронизирован до 9, data-ai-summary обновлён, NAP-span на `[locale]`). `tsc` чисто, `bun run build` зелёный, все JSON-LD валидны.

## Сессия 2026-06-27 — Система SEO/GEO/AI-мониторинга + админ-дашборд

Цель: непрерывный feedback-loop для SEO + интерфейс для владельца. План ревьюился через codex (24 находки, ~20 учтены) + claude-api skill. Полная wiki-страница: `memory/wiki/concepts/seo-monitoring-system.md`.

**Часть A — Бэкенд мониторинга (гибрид):**
- `004_seo_monitoring.sql` — 9 таблиц `seo_*` (RLS, без select-политики; ключи NOT NULL; `seo_sync_runs` различает «0» vs «API упал»; CWV field/lab раздельно).
- `src/app/api/sync-seo/route.ts` (Google, daily) — JWT SA (`google-auth-library`), GSC пагинация `startRow` + `encodeURIComponent` + окно 10д, GA4 organic, PSI mobile, `?preflight=1`.
- `src/app/api/sync-dataforseo/route.ts` (weekly) — AI mentions + rankings + on_page/instant_pages + backlinks; трекинг `cost`.
- `src/lib/seo-tracking.ts` (keywords/URLs из `SERVICE_SLUGS`), `scripts/seo-digest.ts` + `.github/workflows/{seo-dataforseo,seo-digest}.yml` (недельный дайджест в GitHub issue), playbook `.agents/skills/24clima-seo-guide/references/monitoring-playbook.md`. Исправлен невалидный YAML в `SKILL.md`.

**Часть B — Админ-дашборд `/consejos-y-guias/admin/seo`:**
- Интерактивный агент в бэкенде сайта (`@anthropic-ai/sdk`, `claude-opus-4-8`, смена на sonnet в `src/lib/seo-agent.ts`); автономные PR — в Claude Code routine.
- `005_seo_recommendations.sql`; `src/lib/seo-aggregate.ts` (общий считатель, юзают дайджест+дашборд+агент).
- 5 роутов `src/app/api/admin/seo/{metrics,sync,analyze,recommendations,chat}` — все под `requireAdmin`. `analyze`=structured output; `chat`=streaming; `sync`=прокси через `CRON_SECRET`.
- Страница + `src/components/admin/seo/*` (recharts, кнопки, ревью рекомендаций, чат). Логин = Supabase auth (`ADMIN_EMAILS`). Добавлен `admin/layout.tsx` noindex (защищает обе админ-страницы). Не в sitemap.

**Статус:** `lint` + `build` зелёные. **НЕ закоммичено, НЕ запушено** (ждёт явного OK). Документация: `docs/seo-monitoring.md`.

**TODO (человек, до запуска):** 1) Google Cloud (3 API + SA + GSC/GA4 доступ + GA4 property id + PSI key → base64). 2) DataForSEO login/pass (location 2591/es). 3) Env: `GOOGLE_SA_KEY_BASE64`, `GSC_SITE_URL`, `GA4_PROPERTY_ID`, `PAGESPEED_API_KEY`, `DATAFORSEO_LOGIN/PASSWORD`, `ANTHROPIC_API_KEY`. 4) Применить миграции `004` + `005`. 5) GitHub secrets: `CRON_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. 6) Проверить `…/api/sync-seo?preflight=1` + зайти на `…/admin/seo`. 7) Промотить playbook-агента в `/schedule` routine (после 1-2 недель данных).
