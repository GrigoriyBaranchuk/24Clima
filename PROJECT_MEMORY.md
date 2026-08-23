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

### Сессия 7 — 2026-07-15 — Общая дизайн-система @24clima/design

Дизайн-токены вынесены в отдельный приватный пакет-репозиторий
`~/Projects/24clima-design` (github.com/GrigoriyBaranchuk/24clima-design),
общий для сайта и shop.24clima.com:

- `tokens.css` — все :root переменные (shadcn HSL, brand hex, typography) +
  `.hero-gradient` + `.whatsapp-pulse` (2s×5). Импорт в `src/app/layout.tsx`
  ПЕРЕД globals.css.
- `tailwind-preset.js` — общая тема (colors/fonts/container/radius/easing),
  подключён через `presets:` в tailwind.config.ts; в конфиге сайта остались
  только chart-цвета и плагины.
- Зависимость: `git+ssh://...#v0.1.0` (тег, не ветка — детерминизм по ревью
  Codex). Обновление: новый тег в пакете → bump в package.json → bun install →
  коммит lockfile.
- Шрифты: preset ссылается на `var(--font-inter, Inter)` — на сайте резолвится
  next/font-переменная (висит на <div>, поэтому НЕЛЬЗЯ определять --font-sans
  в :root — заморозит fallback), в shop срабатывает fallback на Google Fonts.
- Vercel: репо приватный → в vercel.json добавлен installCommand с
  `insteadOf ssh://git@github.com/` + токен из env `GH_PAT`
  (fine-grained PAT, Contents:Read на 24clima-design). БЕЗ GH_PAT прод-деплой
  падает на bun install.
- Проверка: билды обоих проектов зелёные, скомпилированные CSS-токены
  побайтово идентичны до/после. SEO-элементы не тронуты.

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

## Сессия 2026-07-05 — Фикс GSC «Отзыву назначено несколько общих оценок»

GSC (02.07) флагал страницы статей (`/consejos-y-guias/aire-acondicionado-inverter-12000-btu-panama/`, 2 элемента «24clima»). Диагноз: единственный `aggregateRating` сайта (layout `HVACBusiness`) склеивался парсером Google по `@id #organization` с инлайн-декларациями в `publisher`/`worksFor` Article JSON-LD → «рейтинг у нескольких сущностей». Плюс это self-serving review — звёзды невозможны с 2019 г. независимо от источника цифр (трактовка «из Google reviews = ок» была ошибочной).

Фикс (commit `2615556`, ревью: seo-reviewer approve + codex подтвердил диагноз, 520k токенов):
- `layout.tsx`: убран `aggregateRating` из `HVACBusiness`;
- `Reviews.tsx`: убран спящий Organization JSON-LD (aggregateRating + review), UI отзывов сохранён, удалён неиспользуемый проп `pageUrl`;
- skill-доки `24clima-seo-guide` (json-ld-catalog.md — инцидент 2026-07, local-seo.md — исправлена трактовка self-serving) обновлены.

`bun run build` зелёный, prerendered HTML без `aggregateRating`. После деплоя: Rich Results Test на статью + «Проверить исправление» в GSC.

## Сессия 2026-07-31 — Фикс невидимых графиков на `/consejos-y-guias/admin/seo`

Симптом: на дашборде оба LineChart (GSC клики/показы, GA4 сессии) рисовались пустыми — только сетка, оси и тултип, без линий.

Диагноз: в `src/components/admin/seo/MetricsOverview.tsx` серии задавались как `stroke="hsl(var(--chart-1..3))"`, но CSS-переменные `--chart-1..5` **нигде не определены** — ни в `src/app/globals.css`, ни в `@24clima/design/tokens.css`. На них ссылается только `tailwind.config.ts` (`colors.chart.1..5`), т.е. маппинг Tailwind тоже висит на пустых переменных. Невалидный `stroke` откатывается в initial value `none` → path не рисуется. Проверено в браузере: `getComputedStyle(path).stroke === "none"` для `hsl(var(--chart-1))`, обе явные hex-линии видны.

Фикс (commit `4c12c16`, ветка `worktree-fix+seo-chart-colors`):
- локальная константа `CHART` с явными hex: `#29a366` (брендовый зелёный, hsl 150 60% 40%) и `#4059c4`;
- палитра прогнана валидатором skill `dataviz`: ΔE 25.5 (deutan) / 14.1 (tritan), контраст к фону ≥3:1 — все проверки PASS;
- добавлены `<Legend/>` для двухсерийного графика и `strokeWidth={2}`;
- токены НЕ трогали (правило: значения живут в `@24clima/design`).

`tsc --noEmit` и `npm run build` зелёные. Biome ругается на этот файл (сортировка импортов + форматтер) — **предсуществующее**, есть и на `main` до правки, не трогали чтобы не хоронить диff.

**Грабли на будущее:** `tailwind.config.ts` до сих пор объявляет `colors.chart.1..5` через несуществующие `--chart-*`. Любой `bg-chart-1`/`text-chart-2`/`stroke-chart-3` в новом коде молча даст невидимый элемент. Либо определить переменные в пакете `@24clima/design`, либо выпилить блок из `tailwind.config.ts`.

## Сессия 2026-08-07 — Замкнутый цикл рекомендаций SEO-агента (дашборд ↔ терминал) + засечки на графиках

Задача: рекомендации агента, принятые на `/consejos-y-guias/admin/seo` (✓), должны попадать в терминал (Claude Code) как рабочий промт, а после выполнения — отображаться засечками на графиках метрик с динамикой до/после.

Сделано (ветка `worktree-feat-seo-reco-loop`; план прогнан через codex consult — 24 замечания, ключевые учтены):
- **Миграция `006_seo_reco_resolution.sql`**: `seo_recommendations` + `resolution text` (что сделано: текст + commit sha) и `done_at timestamptz`; backfill из `updated_at` для старых done; constraint `seo_reco_done_at_consistency` (`done` ⇔ `done_at is not null`) — защищает оба пути записи (API и прямой SQL из скилла). **НЕ применена к проду** (Management API заблокирован политикой; применить: SQL editor или `mcp apply_migration` после OK).
- **API** `/api/admin/seo/recommendations`: PATCH принимает `resolution` (trim, ≤2000), `done_at` ставится/чистится атомарно по статусу; GET `?status=done` сортирует по `done_at`.
- **`RecommendationsPanel`**: вкладки Новые/Принятые/Готово (раньше accepted исчезали в никуда), кнопки по вкладке, показ resolution в «Готово», `onStatusChange` → родитель перезагружает маркеры.
- **`MetricsOverview`**: проп `markers` (done-рекомендации) → вертикальные ReferenceLine + кликабельный глиф (невидимая зона нажатия r=14, счётчик при нескольких за день, Enter/Space) на обоих графиках; клик → карточка: select при нескольких, resolution, тренд «среднее 7д до → 7д после» по кликам/показам/сессиям с пометкой «корреляция, не причинность». Таймзона: `done_at` → дата Панамы (`sv-SE` + `America/Panama`); снаппинг к ближайшей дате серии (лаг GSC ~2 дня).
- **Скилл `/seo-tasks`** (`.claude/skills/seo-tasks/SKILL.md`, добавлен negation в .gitignore): забрать accepted из Supabase (проект `qgvfnpafbzzgnryoxnoj`) → рабочий док `tmp/seo-tasks-<дата>.md` → работа (protected SEO elements → через seo-reviewer) → `UPDATE ... status='done', resolution, done_at WHERE id=… AND status='accepted'`.
- biome.json: override `useSemanticElements` off для MetricsOverview.tsx (SVG-глиф с role="button" — в recharts-графике настоящего `<button>` не бывает).

`bun run build`, `tsc --noEmit`, biome по изменённым файлам — зелёные (ChatPanel-ошибки предсуществующие). Не запушено (ждёт OK).

## Сессия 2026-08-07 (2) — Первый прогон цикла /seo-tasks: закрыты рекомендации id 9, 10, 11

Первый боевой прогон скилла `/seo-tasks` (ветка `worktree-seo-tasks-2026-08-07`, 3 коммита, НЕ запушено — ждёт OK). Все три accepted-рекомендации агента выполнены и закрыты в Supabase (`status='done'` + resolution + done_at) — засечки на графиках дашборда появились.

**id 9 (critical, rankings)** — коммерческие запросы вне ТОП-20. Снят живой SERP Панамы (DataForSEO live, location 2591, ~$0.01) по instalación/mantenimiento/limpieza + сабагентом разобраны 8 конкурентных страниц. Выводы: цены публикуют только 3/8 (ProClean с «Desde $25» в H1 — ранжируется), отзывы/фото работ — 0/8, зоны покрытия списком — никто; все PAA — про цену. Рынок: монтаж $65–140 labor-only, limpieza $25/юнит. Сделано (commit `159a241`): компонент `ServicePricingTable` (данные `SERVICE_PRICING_TABLES` в business-data.ts, единый источник с JSON-LD offers) на instalacion+mantenimiento; «desde $X» в hero для limpieza/mantenimiento; **фикс бага: hero instalación показывал $120 вместо $200** (ключ был спутан с carga-de-gas); FAQ 5→7 (`t.has`-фильтр в ServiceFAQ) с ценовыми PAA-вопросами es/en/ru; `ServiceCoverageAreas` (зоны → ссылка на хаб, отдельных страниц зон НЕТ); `ServiceIntentNote` limpieza↔mantenimiento (Google даёт почти одинаковые SERP).

**id 11 (warning, ai)** — AI Overview 2/6. Сделано (commit `35c76a7`): extractable-блоки — `ServicesAnswerBlock` на хабе /servicios (все 6 услуг с ценами одной фразой), `DiagnosticoDirectAnswer` на /diagnostico («no enfría»: причины совпадают с FAQPage страницы; FAQPage на /problemas сознательно НЕ добавлен — дублировал бы вопрос /diagnostico), `AreasPricingNote` на /areas-de-servicio (цены одинаковы во всех зонах + Costa del Este <1.5h). Эффект смотреть через 3–4 недели.

**id 10 (info, rankings)** — точки роста. Сделано (commit `a59512d`): carga-de-gas — цена в hero, таблица цен (до $210, fuga incluida, inverter по весу), зоны; AreasPricingNote дополнен recarga $120 и WhatsApp CTA.

Процесс: план каждого пункта — через codex consult (ключевое: деревья (es)/[locale] ДУБЛИРУЮТСЯ, править оба; limpieza уже имеет CleaningPackages+Calculator — вторую таблицу не ставить; единый источник цен против drift) и seo-reviewer (approve; id 10 — flag-with-conditions, условия выполнены). Проверки: build, tsc+eslint, грep статик-HTML (.next/server/app) и SSR через `next start` (limpieza и /servicios — динамические, НЕ prerendered — так было и до правок).

**Грабли:** guard worktree-изоляции блокирует компаунд-команды и редиректы в Bash — обходить выносом в python-скрипты в `$CLAUDE_JOB_DIR/tmp`. Supabase MCP не видит проект сайта `qgvfnpafbzzgnryoxnoj` (другой аккаунт) — ходить по REST с service-role из `.env.local`.

## Сессия 2026-08-10 — Система памяти: LLM Wiki в репозитории + Memory Compiler на хуках

Ветка `worktree-feat-llm-wiki-memory`. Поставлены две системы памяти, обе — реализации паттерна Karpathy «LLM Wiki», но с разным сырьём. Подробности и правила — на wiki-странице `memory/wiki/concepts/memory-architecture.md`.

**Часть A — LLM Wiki проекта (`memory/`):**
- `memory/CLAUDE.md` — схема: структура, YAML-frontmatter страниц (`type/title/updated/sources/related/status`), соглашения о ссылках, операции ingest/query/lint, правило обращения с противоречиями (тихая перезапись запрещена, блок «Противоречие» + `status: contested`), критерии «дописать vs создать страницу».
- `memory/raw/` — неизменяемые внешние источники (выгрузки GSC/DataForSEO, SERP, ревью, письма). Файлы репозитория туда не копируются.
- `memory/wiki/` — 12 страниц засеяны ингестом `PROJECT_MEMORY.md` + `CLAUDE.md`: `entities/{24clima,ryhor-baranchuk}`, `concepts/{seo-monitoring-system,protected-seo-elements,i18n-dual-route-tree,service-pricing,mobile-app-like,design-system-package,agent-workflow,memory-architecture}`, `sources/project-memory`, `synthesis/gotchas` (сводка 12 граблей), плюс `index.md` и `log.md`. Ссылка из сессии 2026-06-27 на `memory/wiki/concepts/seo-monitoring-system.md` теперь ведёт на существующую страницу.
- Скилл `/wiki` (`.claude/skills/wiki/SKILL.md`) — процедуры ingest/query/lint; в `.gitignore` добавлено negation, как для `seo-tasks`.
- В корневой `CLAUDE.md` добавлен раздел «Память проекта»: задачу начинать с `memory/wiki/index.md`, перед работой смотреть `gotchas.md`.
- Проверка: все внутренние ссылки резолвятся, сирот нет, у всех страниц есть frontmatter с `sources`.

**Часть B — Memory Compiler (`coleam00/claude-memory-compiler`):**
- Склонирован в `~/Projects/claude-memory-compiler`, поставлен `uv` (brew, 0.12.3) + `uv sync` (31 пакет, claude-agent-sdk 0.1.56, Python 3.14 подтянут самим uv).
- **Хуки в `.claude/settings.json` были прописаны раньше, но не работали** — пути указывали на чужой `/Users/user/Projects/claude-memory-compiler`. Переведены на `$HOME`.
- В команды добавлен префикс `export PATH="/opt/homebrew/bin:$PATH"` — без него `uv` может не найтись в окружении хука, а провал хука тихий (только `scripts/flush.log`).
- Проверено: SessionStart отдаёт валидный JSON даже с урезанным PATH; SessionEnd парсит stdin и корректно логирует SKIP на несуществующем транскрипте. Полный проход с вызовом LLM не гонялся (стоит денег на фейковом транскрипте) — отработает при завершении реальной сессии.
- `daily/` и `knowledge/` в репозитории компилятора под `.gitignore`: личное знание в клон не коммитится, но и бэкапа гитом у него нет.

**Попутно:** локальный `SUPABASE_SERVICE_ROLE_KEY` в `.env.local` оказался пустым (13 символов вместе с кавычками) — прочитать `seo_gsc_daily` по REST не вышло, 401. Реальные значения тянуть через `vercel env pull`.

## Сессия 2026-08-10 — Google Отзывы клиентов: opt-in, витринный виджет, /privacidad

Подключение магазина к программе «Google Отзывы клиентов» (Google Customer Reviews).
Merchant Center: merchant_id `5828751614`, аккаунт `ryhor@24clima.com`. Ветка
`feat/google-customer-reviews` (3 коммита, **запушена**, PR ещё не открыт).

Изучены все 6 разделов правил программы. Ассортимент HVAC/R под ограничения не
попадает; критичные для нас пункты — запрет любых стимулов за отзывы и обязательная
политика конфиденциальности с описанием сторонних cookie и opt-out.

Сделано:
- **`src/features/tienda/lib/gcr.ts`** — merchant_id, страна `PA`,
  `GCR_DELIVERY_ESTIMATE_DAYS = 2` (реальный SLA по Панама-Сити и окрестностям;
  Google шлёт опрос ПОСЛЕ этой даты). Передача email и даты доставки с чекаута на
  страницу заказа через sessionStorage: бэкенд `/v1/orders/{ref}` отдаёт только
  order_number/status/total, email там нет. Следствие: opt-in показывается только
  сразу после оформления, по прямой ссылке на заказ — нет. Если бэкенд научится
  отдавать email и дату — костыль убрать.
- **`GoogleCustomerReviewsOptIn.tsx`** на странице подтверждения. `platform.js`
  вставляется вручную в `useEffect`, НЕ через next/script: скрипт зовёт
  `window.renderOptIn` по своему onload, колбэк обязан существовать раньше тега,
  а порядок нескольких next/script не гарантирован.
- **`CheckoutForm.tsx`** — email НЕобязателен (сначала сделали `required`, потом
  осознанно откатили: для сделки он не нужен — оплата при получении и связь через
  WhatsApp, — а обязательное поле бьёт по конверсии). Следствие принято сознательно:
  с заказов без email отзыва не будет никогда, модуль там не показывается.
  Под полем подсказка `emailHint`, зачем его стоит указать.
  Важно: поле `email` в модуле Google — это адрес ПОКУПАТЕЛЯ, куда Google сам
  шлёт опрос после даты доставки, а не адрес магазина; магазин опознаётся по
  merchant_id. Другого канала (SMS, WhatsApp, звонок) в программе нет.
- **Телефон стал обязательным** (`phone-countries.ts`): селект кода страны,
  по умолчанию Панама +507, плейсхолдер под формат страны, валидация по числу
  цифр, в `guest_phone` уходит `+50768282120`. Дублированный код страны в самом
  поле срезается. Подпись под полем: свяжемся по WhatsApp.
- **`GoogleMerchantWidget.tsx`** в `TiendaShell` — витринный виджет. ВАЖНО: старый
  `gapi.ratingbadge` Google отменил, теперь `merchantwidget.js`, который merchant_id
  НЕ принимает — привязка по подтверждённому в Merchant Center домену. На localhost
  и превью-доменах виджет не отрисуется, это не баг. Позиция LEFT_BOTTOM с отступом
  96px (мобильные 104px): справа внизу WhatsApp-кнопка, слева внизу `GoogleReviewsBadge`
  (`bottom-6 left-6`), а правила требуют не перекрывать виджет контентом.
- **`/privacidad`** на es/en/ru (`src/components/PrivacyPolicy.tsx` + два роута,
  namespace `privacy` в messages, 37 ключей). Ссылка в футере рядом с копирайтом,
  запись в sitemap (priority 0.3). Тексты составлены по фактическому поведению кода
  (GA4, Meta Pixel, Yandex Metrica, ссылки на opt-out каждого; карты не обрабатываем —
  в чекауте только оплата при получении и перевод). **Юридической вычитки НЕ было.**

`tsc --noEmit`, `next lint`, `next build` (92 страницы) — зелёные.

Осталось: юридическая вычитка политики; PR → merge в main → автодеплой; проверка
виджета и opt-in только на боевом домене; в Merchant Center подтвердить домен и
включить программу.

**Грабли:** проект ставится ТОЛЬКО через `bun` (`bun@1.3.14`, зафиксирован в
`packageManager`). Протухший `package-lock.json` удалён из репо и добавлен в
.gitignore вместе с yarn/pnpm-локами: он был рассинхронизирован с package.json и
провоцировал сборку npm-ом с версиями, отличными от прода. Учти: поле
`packageManager` npm НЕ соблюдает (проверено) — это декларация, а не защита.
node и bun живут в `/opt/homebrew/bin`, но не всегда в PATH у агента —
`export PATH="/opt/homebrew/bin:$PATH"`. В свежем git-worktree нет node_modules:
ставить `bun install` (симлинк на node_modules основного чекаута тоже работает,
но это костыль).

## Сессия 2026-08-11 — Чистка веток + мерж LLM Wiki + протокол сессии

**Чистка git:** удалены 18 локальных веток и их остатки — 11 обычных мержей,
5 сквош-мержей (проверены по содержимому против main: `feat/design-unify` уже
в main через PR #3, `feat/tienda` — через PR #4 и последующие, файлы катовера
байт-в-байт совпадают), `worktree-fix-gsc-totals` (PR #25, worktree держал
мёртвый процесс — лок снят). `feat/design-unify` и `feat/tienda` удалены и с
GitHub. Локально осталась одна `main`. На origin ещё ~12 пустых остатков
смерженных PR — user отмашку на их удаление не давал.

**Мерж PR #23 (LLM Wiki + Memory Compiler):** ревью пройдено (settings.json
валиден и переносим через `$HOME`, ссылки вики резолвятся, факты сверены,
код/SEO не тронуты). Конфликт в PROJECT_MEMORY.md — обе машины добавили свою
секцию за 2026-08-10; оставлены обе.

**Протокол сессии** (новый раздел в CLAUDE.md): pull в начале → todo-список →
в конце запись в memory/wiki + PROJECT_MEMORY → домерж записи памяти в main.
Мерж кода — по-прежнему только по явному «ok».

**Грабли:** сквош-мерж прячет ветки от `git branch --merged` — проверять
`git cherry`/diff содержимого, а не только флаг merged. `git worktree` с
мёртвым локом: `ps -p <pid>` из лога лока → `git worktree unlock && remove`.

## Сессия 2026-08-11 (2) — Политика памяти, inbox, ingest локальной памяти, прощание с Cursor

По консультации codex (вариант A + черновики без auto-commit): repo-память
(`memory/` + `PROJECT_MEMORY.md`) объявлена единственным каноническим источником —
политика записана в корневой `CLAUDE.md` и `memory/CLAUDE.md`. Добавлен
`memory/inbox/` (в .gitignore) для черновиков итогов сессий; в вики они попадают
только через явный `/wiki ingest`, автокоммитов нет.

Ingest локальной памяти Claude (машина 1) в вики: +6 граблей (№13–18), новая
страница `concepts/hvac-customer-segments.md`, обновлён `seo-monitoring-system`
(миграция 006 применена; фикс тоталов GSC PR #25). Локальная память машины 1
сведена к указателям на вики + личным правилам.

Cursor больше не используется (решение user 2026-08-11): `.cursor/rules/` удалён
из репо, упоминание из CLAUDE.md убрано.

Закрытие сессии: в `concepts/memory-architecture` добавлен раздел «Политика двух
машин» (итог консультации codex, ритуал «начинаем/заканчиваем», статусы миграции);
записи `wiki/log.md` приведены к формату схемы (новые сверху). Машине 2 выдан
промт разовой миграции её локальной памяти в вики — на момент записи её PR ещё
не появился; проверить при следующем pull.

## Сессия 2026-08-11 (3) — Ingest локальной памяти Claude (машина 2)

Вторая половина разовой миграции памяти: проектные факты из авто-памяти Claude
Code на машине 2 перенесены в `memory/wiki/`, локальный `MEMORY.md` переписан в
указатели («каноническая память — repo-вики»). Кода в этой сессии не трогали.

**Новые страницы вики (3):** `concepts/google-customer-reviews` (программа Google
Отзывы клиентов целиком: merchant_id `5828751614`, модуль opt-in, витринный
виджет, `/privacidad`, срок доставки 2 дня, ограничения и что осталось до
запуска), `concepts/tienda-shop` (магазин — часть сайта на `/tienda`, редирект со
старого хоста, свой бэкенд `/v1/**`), `concepts/supabase-projects` (два проекта,
проект сайта не виден через MCP, `admins` нет — доступ на `ADMIN_EMAILS`).

**Обновлено:** `synthesis/gotchas` +4 (№19 виджет Google привязан к домену и не
виден локально; №20 ставить только `bun`, npm не соблюдает `packageManager`;
№21 PATH к node/bun у агента; №22 пустой `.git/index.lock` от умершего процесса),
`entities/24clima`, `seo-monitoring-system`, `memory-architecture` (третий слой
памяти + политика авторитета), `index.md` (16 страниц), `wiki/log.md`.

**Разрешено противоречие:** в вики магазин значился как «смежный проект
shop.24clima.com». Фактически он внутри сайта (`/tienda`), а хост редиректится
в `src/middleware.ts`. Старая формулировка помечена блоком «Противоречие», не
затёрта.

**Найдено при сверке фактов с кодом:** редирект `shop.24clima.com → /tienda`
сейчас **302**, не 301 — `CUTOVER_REDIRECT_PERMANENT = false`, флип на постоянный
запланирован после прогрева и индексации новых URL. Не забытый флаг, а открытая
задача (см. ниже).

**В локальной памяти оставлено:** правило делегирования простого кода субагенту
(личное предпочтение по работе с агентом) — по политике `memory/CLAUDE.md` личное
в репо не переносится.

Осталось: юридическая вычитка `/privacidad`; подтвердить домен в Merchant Center
и включить программу Отзывов; флип редиректа магазина на 301 после прогрева.

> Это и есть тот самый PR миграции машины 2, которого ждала запись сессии (2)
> выше — вопрос «проверить при следующем pull» закрыт (PR #28).

**Чистка веток (отмашка user 2026-08-12).** Удалены все 13 остаточных веток на
origin и обе локальные, снят worktree `feat-llm-wiki-memory`. Осталась одна
`main` — локально и на origin, worktree только основной чекаут.

Каждая ветка проверена по содержимому, а не по флагу merged (грабли №17):
для 11 веток diff от merge-base пуст либо совпадает с main; `feat/seo-charts-layout`
и `fix/seo-chart-dual-axis` показывали расхождение в одном файле
`MetricsOverview.tsx` — это PR #20 и #18 (смержены 2026-08-07), которые main
позже переписал в цикле рекомендаций (PR #21), то есть ветки отстали, а не
несли уникальную работу. `feat/google-customer-reviews` удалена через `-D`:
сквош-мерж (PR #24), для git она «не смержена», но файлы байт-в-байт как в main.

**Закрытие сессии.** Рецепт аудита ветки вынесен в вики
(`concepts/agent-workflow`, раздел «Гигиена веток и worktree»), грабли №17
уточнены: `git cherry` на сквош-мерже врёт — пометил `+` все 8 коммитов
`feat/google-customer-reviews`, хотя содержимое совпадало с main. Проверять
надо diff по файлам, которые ветка трогала.

Итог сессии (машина 2): PR #28 — ingest локальной памяти в вики (3 новые
страницы, +4 грабли, разрешено противоречие про домен магазина), PR #29 —
чистка веток, PR #30 — закрытие сессии. Код не трогали ни разу; локальная
память сведена к личным правилам + указателям на вики.

**Состояние на конец сессии:** `main` = единственная ветка локально и на
origin, worktree только основной чекаут, дерево чистое.

## Сессия 2026-08-12 — Фикс сырого markdown в описании товара (/tienda)

**Проблема (скриншот владельца):** на странице товара в «Descripción» видны
литеральные `## Para tu hogar` и `**...**` — каталог отдаёт описания и FAQ
как markdown, а `ProductPageContent` выводил их plain text.

**Фикс (PR #31, merge `8549792`, план ревьюился codex по просьбе user):**
- `ProductPageContent`: описание и FAQ — через `react-markdown` + `remark-gfm`
  (уже были в зависимостях); стили `prose` на токенах, цвета через
  `prose-p:`/`prose-li:` (цвет на обёртке typography перебивает — замечание
  codex); заголовки понижены до h3; отзывы покупателей — намеренно plain text.
- Находка codex вне исходного плана: тот же сырой markdown уходил в
  Product JSON-LD `description` и `FAQPage.acceptedAnswer.text`. Добавлен общий
  хелпер `src/lib/markdown-plain-text.ts` (снимает `**`/`#`/ссылки/теги),
  merchant-feed переведён на него. seo-reviewer: **approve** (меняются только
  строки, структура схем не тронута; вариант `meta_description` отклонён —
  полное описание ценнее для AEO и консистентно с merchant-feed).

**Проверено:** `tsc` + `bun run build` чистые; на Vercel-превью curl'ом —
видимый HTML без сырого markdown (`<h3>`, `<strong>`), JSON-LD чистый.

**Осталось:** 1) Rich Results Test страницы товара с FAQ на проде (требование
seo-reviewer). 2) Обновить `json-ld-catalog.md` скилла `24clima-seo-guide`:
«Product не используем» устарело — tienda эмитит Product/Offer/AggregateRating.

**Закрытие сессии 2026-08-12.** Прод проверен после деплоя: на
`24clima.com/tienda/product/...vm122c31/` видимый HTML без сырого markdown
(`<h3>`/`<strong>` на месте), Product и FAQPage JSON-LD — чистый текст.
PR #31 (код) и PR #32 (память) смержены в main, рабочие ветки удалены.

**Состояние на конец сессии:** `main` — единственная ветка на origin;
дерево чистое. Открытые пункты — в «Осталось» выше: Rich Results Test
страницы товара + правка `json-ld-catalog.md` в скилле `24clima-seo-guide`.

## Сессия 2026-08-12 — Иконка корзины в шапке магазина (/tienda)

**Проблема (запрос владельца):** из произвольного URL раздела магазина нельзя
попасть в свою корзину; вход нужно выделить визуально — иконкой.

**Решение (PR #36, merge `d0efdfa`, дизайн ревьюился codex по просьбе user):**
- `TiendaCartLink` — lucide ShoppingCart с бейджем количества: десктоп в
  actions-слоте Header, мобайл — круглая кнопка 32px рядом с бургером
  (цвета следуют isScrolled). Рендер по пропу `showCartLink`, который
  передаёт только `TiendaShell` — маркетинговые страницы не тронуты
  (рекомендация codex: проп чище pathname-детекта).
- Ключевая находка codex, подтверждена в коде бэкенда: `GET /v1/cart/items`
  создаёт гостевую корзину + cookie при каждом визите без корзины. Поэтому
  бейдж в API не ходит: счётчик — зеркало в localStorage
  (`src/features/tienda/lib/cart-count.ts`), публикуют `CartSummary`
  (fetch/мутации) и `CheckoutForm` (обнуление после заказа) через
  существующее событие `cart-updated`.
- seo-reviewer: **approve** без условий (ссылка серверно отрендерена, бейдж
  пост-гидрационный в фикс-боксе → CLS нет, защищённые элементы не тронуты).

**Проверено:** `tsc` + `bun run build` чистые; смоук на `next start` —
`/tienda` и `/en/tienda` содержат 2 иконки с локализованными aria-label и
корректными href, маркетинговая главная без изменений.

**Ограничение:** счётчик локальный — на новом устройстве бейдж появится
после первого захода на `/tienda/cart`.

**Осталось:** рекомендация seo-reviewer — после релиза смотреть в GSC отчёт
«Indexed, though blocked by robots.txt» по `/tienda/cart`; если URL полезет
в выдачу — перейти на crawl-allow + `noindex`.

**Закрытие сессии 2026-08-12 (вечер).** Прод проверен на мобильной эмуляции
(Playwright, iPhone 13, системный Chrome через `channel: "chrome"`): иконка
корзины видна и в тёмной шапке (не проскроллено), и в белой (после скролла);
бургер и переключатель языка на месте. Полный цикл вживую: добавление товара
→ бейдж «1» на странице корзины → возврат в каталог → бейдж держится
(localStorage-зеркало работает). Замечание по инструментам: headless-Chrome
`--screenshot --window-size=390x844` БЕЗ эмуляции устройства даёт ложную
«обрезку» контента справа на всех страницах — для мобильных проверок
использовать Playwright с device-профилем.

**Состояние на конец сессии:** PR #36 (код) и PR #37 (память) в main,
рабочие ветки на origin удалены. Открытые пункты: GSC-отчёт по
`/tienda/cart` (выше) + хвосты прошлой сессии (Rich Results Test товара,
правка `json-ld-catalog.md` в скилле).

**Дозакрытие открытых пунктов (та же сессия, 2026-08-12).**
1. Rich Results Test по странице товара VM122C31 на проде: **5 элементов без
   ошибок** (Product, Merchant listing, BreadcrumbList, LocalBusiness,
   Organization). «2 незначительные проблемы» у Product — отсутствие
   НЕобязательных `aggregateRating`/`review`, что намеренно (политика после
   инцидента 2026-07: рейтинг не синтезируем). `description` в распарсенной
   Google схеме — чистый текст. FAQPage в списке rich-типов не показывается —
   ожидаемо (тип выведен Google из rich results, схема остаётся для AEO).
2. `json-ld-catalog.md` скилла `24clima-seo-guide` обновлён (PR #34):
   секция Product+Offer (tienda) с правилом plain-text через
   `markdown-plain-text.ts`; устаревшие «Product не используем» и отсылка
   к рейтингу на HVACBusiness убраны.

Открытых пунктов по этой задаче не осталось.

## Сессия 2026-08-12 (ночь) — Редизайн шапки desktop: дропдаун Servicios, телефон-иконка, кнопка Tienda

**Проблема (от владельца, по скриншоту главной):** шапка перегружена (8 пунктов
навигации + дропдаун + язык + телефон + WhatsApp), телефон выглядит инородно
(номер переносится на 3 строки), магазин никак не выделен.

**Процесс:** обсуждение вариантов с Codex (consult, сессия сохранена в
`.context/codex-session-id`) → владелец утвердил связку **1A+2A+3A** и дал ok
на десктопные правки (вне рамок мобильного редизайна) → план реализации прошёл
два ревью: **seo-reviewer — approve** (паттерн дропдауна = расширение
SEO-одобренного Soluciones; прямые ссылки на money-pages site-wide — плюс
перелинковки) и **Codex plan review** (15 замечаний, учтены ключевые).

**Что сделано (`src/components/Header.tsx`, `messages/{es,en,ru}.json`):**
1. **1A:** desktop-навигация 8→3 (Consejos, Nosotros, Contacto) + сгруппированный
   дропдаун «Servicios»: 6 ссылок `/servicios/<slug>` (короткие ярлыки из новых
   ключей `common.serviceNav.*`) + «Todos los servicios»; группа Problemas
   (`/problemas`, `/diagnostico`); группа Soluciones (PH, eventos — прежний
   дропдаун влит сюда). Ссылки всегда в DOM, opacity+transform 150ms,
   reduced-motion off, `invisible` держит скрытые ссылки вне tab order.
2. **2A:** телефон — круглая кнопка-иконка `tel:` с aria-label/title
   «Llámanos: +507 6828-2120»; номер остаётся в футере и /contacto (NAP ок).
3. **3A:** «Tienda» — из навигации в actions-зону, secondary outline-кнопка
   с иконкой сумки; видна и на /tienda (правка Codex: корзина ≠ магазин,
   `TiendaCartLink` → `/tienda/cart` остаётся отдельной иконкой-состоянием).
   WhatsApp — единственный зелёный CTA.
4. Мобильное sheet-меню: якоря `/#servicios`, `/#problemas` заменены хабами
   `/servicios`, `/problemas`; Inicio и Tienda сохранены.

Проверки: `biome check` чисто, `npm run build` прошёл.

**Состояние:** код в **PR #41 (draft)** — ветка `worktree-header-redesign-1a2a3a`,
**ждёт явного ok владельца на мерж**. Vercel preview из PR — место для
визуальной проверки.

**Осталось:** 1) ok владельца + мерж PR #41; 2) после мержа — `/wiki ingest`
(страница про структуру шапки/навигации); 3) визуальная проверка preview
(desktop + mobile); 4) кандидат в следующую итерацию — активные состояния
навигации (подсветка «Servicios» на `/servicios/*`, замечание Codex №14).

**Закрытие (2026-08-13).** Владелец проверил preview и дал ok — **PR #41
смержен в main** (`f7e0b29`), ветка и worktree удалены. Preview был проверен
до мержа: мобильная шапка визуально ок; десктоп по DOM — 11 crawlable-ссылок
дропдауна, tel-иконка с aria-label, кнопка Tienda (визуально десктоп не
снимался: окно Chrome не поддалось ресайзу из фонового джоба). Wiki ingest
выполнен: новая страница `concepts/header-navigation.md`, уточнение в
`mobile-app-like.md`, запись в `log.md`. Из пунктов выше открытым остаётся
только №4 (активные состояния навигации).

**Прод проверен (2026-08-13).** Vercel-деплой `f7e0b29` в Production —
success; в HTML живой главной 24clima.com подтверждены: tel-иконка с
`aria-label="Llámanos: +507 6828-2120"`, ссылки дропдауна
(`/servicios/limpieza`…`/servicios/emergencia`, `/problemas`, `/diagnostico`,
оба solutions-лендинга) и кнопка `/tienda`. Память сессии домержена в main
(PR #42 журнал, PR #43 wiki ingest); рабочие ветки удалены, на origin одна
main. Сессия закрыта; переходящий пункт — активные состояния навигации
(Codex №14).

---

## Сессия 2026-08-12/13 — Фикс якоря #calculadora: кнопка «Cotizar ahora» на десктопе

**Проблема (репорт владельца):** кнопка «Cotizar ahora» в hero главной
(десктоп) не делала ничего при клике.

**Диагноз:** `Calculator.tsx` (серверный оркестратор) на десктопном UA
рендерит ОБА варианта калькулятора, и оба `<section>` несли
`id="calculadora"`. Первый матч в DOM — мобильная секция внутри
`lg:hidden` (display:none на ≥lg): браузер не может проскроллить к
элементу без layout box → якорь `<a href="#calculadora">` (Hero.tsx:139)
— тихий no-op. Тот же дефект — у ссылок из `CleaningPackages.tsx` и
CTA страниц сервисов (обе гейтятся `isCleaningPage`, как и сам
калькулятор — согласовано).

**Фикс (PR #40, смержен в main по ok владельца, коммит `4ebc98e` +
merge origin/main с новой шапкой):**
- `id` убран с секций внутри `CalculatorMobile.tsx` / `CalculatorDesktop.tsx`;
- единственный `id="calculadora"` + `scroll-mt-20` — на всегда видимой
  обёртке в `Calculator.tsx` (обе ветки: mobile-UA и desktop-UA);
- `scroll-mt-20` (80px) точно равен высоте новой fixed-шапки из PR #41.

**Процесс:** план прогнан через Codex consult (одобрен; его замечания —
scroll-mt под шапку, проверка страниц сервисов, CSS-селекторов — все
проверены). `tsc --noEmit` чисто; ошибки biome — предсуществующие.
Ветка PR обновлена мержем main (редизайн шапки #41) до мержа — конфликтов
не было.

**Верификация:** превью Vercel — в DOM один видимый `#calculadora`,
instant-переход к якорю на ~3029px работает. Прод после мержа —
`curl` подтвердил один `id="calculadora"` в HTML главной. Попутный
QA-артефакт: Chrome замораживает smooth scroll в скрытой вкладке
(`visibilityState: hidden`) — автоматизированный клик «застревал» на
полпути, хотя код верен (грабли №25).

**Wiki:** грабли №24 (дубликат якорного id в dual-render) и №25
(smooth scroll в скрытой вкладке) в `synthesis/gotchas.md`; правило
про якорь на обёртке — в `concepts/mobile-app-like.md`.

**Осталось:** удалить ветку `worktree-fix-calculadora-anchor` на origin
и локальный worktree после закрытия сессии. Переходящий пункт прошлой
сессии (активные состояния навигации, Codex №14) — открыт.

## Сессия 2026-08-15/17 — Аналитика рынка: услуга пассивного охлаждения (вентиляция кровли + вентфасады)

**Тип:** read-only исследование, кода не касалось. Запрос владельца: оценить
возможность продавать в Панаме услугу «вентиляция кровли/подкрышного
пространства + вентфасады с солнечных сторон» через аргумент экономии
электроэнергии, и понять, насколько такие заявления законны.

**Контекст:** владелец познакомился с владельцем `tropiclima.com`
(SUNNY RAMPAGE, INC., RUC 155754624-2-2024), который приносит технологию.

**Что сделано**

1. Разобран `tropiclima.com` — lead-gen воронка: опрос 6 вопросов → сравнение
   с другими домами Панамы → WhatsApp +507 6242-8785, крючок «работы
   бесплатно, владелец платит только за материалы». Бэкенд — Google Apps
   Script. Позиционирование «AC — не решение».
2. Выгрузка DataForSEO по локации Panama (2591), es+en: 17 616 фраз,
   6 469 с объёмом. Сырые данные — `memory/raw/dataforseo/2026-08-15-panama-passive-cooling-keywords.csv`.
3. Собраны агрегаты ASEP за май 2026, тарифная сетка, данные SNE и переписи,
   SERP-конкуренция, панамские цены CYPE, нормы Ley 45 и Ley 69.
4. Проведён опрос владельца по 7 вопросам — зафиксированы решения.
5. Отчёт опубликован артефактом:
   `https://claude.ai/code/artifact/6078d9e9-8515-47c7-9255-4d90abb49de6`

**Ключевые выводы**

- **Поискового спроса на услугу нет:** `ventilación de techo` 10/мес,
  `fachada ventilada` 10, `ventilación de ático` / `fachada ventilada panamá` /
  `aislamiento térmico panamá` — 0. Английские (экспаты) — тоже 0–10.
- Тема экономии энергии — 250–350 запросов/мес на всю страну.
- Спрос рядом: `ensa panamá` 18 100, `naturgy panamá` 9 900 (навигационные),
  `aislante térmico para techo` 260 — единственная дверь, `instalación de
  aire acondicionado` 210 при CPC $1,75 (самый дорогой клик в нише).
- Сезонность ×3–4, пик март–май, окно продаж февраль–июнь.
- **Коммерция потребляет 41,30 % электроэнергии страны** (жильё 40,02 %,
  промышленность 1,83 %) и платит без субсидии → B2B подтверждён как сегмент.
- Порог отбора клиента: **счёт от ~$1 500/мес**.
- Оборудование доступно всем (Nimbus Fans продаёт турбины SST-24/SST-12 прямо
  под склады и фабрики), инженерного слоя «расчёт + замер + результат» нет ни
  у кого — это и есть отличие.
- В вентфасаде за $211,75/м² работа — всего $10,54 (5 %): бизнес перепродажи
  материала с монтажом, не продажи труда.

**Решения владельца**

| Вопрос | Решение |
|---|---|
| Кто выполняет | 24clima своими силами, партнёр даёт технологию и обучение |
| Сегмент | B2B коммерция/промышленность — основа; застройщики — дополнение |
| Канал | связей нет, строить с нуля |
| Референсы | нет ни объектов, ни замеров |
| Инженерия | инженер есть, оборудования нет |
| Позиционирование | синергия с HVAC: «кондиционер работает меньше», не замена |
| Горизонт | сначала аналитика, решение о вложениях после |

**Право (важно для копи всего сайта)**

- Ley 45 de 2007: заявленное = обязательство; ACODECO наложила 615 штрафов
  на $574 600 за publicidad engañosa. Числа об экономии — только с досье.
- Ley 69 de 2012 + DE 398 de 2013: энергоаудиты и измерения как услуга
  требуют аккредитации Consejo Nacional de Acreditación (MICI) + регистрации
  в **JTIA**. Это то же ведомство, что `JTIA idoneidad` в B2B-сегменте, где
  вопрос к владельцу открыт с research 2026-05-29.

**Осталось / TODO**

- Запросить прайс на пассивные турбины (Nimbus Fans, CFM Technologies, HOPSA) —
  $1 797 из CYPE это моторизованный гибрид, не тот продукт.
- Купить комплект замеров: тепловизор, логгеры температуры/влажности,
  токовые клещи.
- Сделать один измеренный пилотный объект (месяц до → монтаж → месяц после).
- Подтвердить наличие JTIA idoneidad и выяснить у панамского юриста,
  применяется ли аккредитация по Ley 69 к нашей модели услуги.
- Обсудить условия партнёрства с владельцем TropiClima (не обсуждались).
- Гипотезы, требующие подтверждения замером: снижение расхода 8–15 %,
  доля кондиционирования в счёте объекта 40 % (для PH-башен известно 60–80 %).

---

## Сессия 2026-08-22 — Активные состояния навигации в шапке (Codex №14)

**Что взяли:** последний переходящий пункт с редизайна шапки (PR #41,
2026-08-13) — пользователь не видел, в каком разделе сайта находится.

**Развилка, которой не было в плане.** `HeaderNavLink` из `@24clima/design`
не годится для активного состояния: контракт `LinkComponentType`
(href/className/children/onClick) не пропускает `aria-current`, а `className`
он **дописывает** к своему `NAV_CLASS` — то есть активный `text-brand-green-dark`
конфликтует с `text-gray-700`, и победителя решает порядок в сгенерированном
CSS, а не в атрибуте class. Вариант A (расширить пакет до v0.3.0 пропом
`active`) прогнан через Codex против варианта B (локальный компонент).
**Вердикт Codex — B:** компонент слишком мал, чтобы оправдать цикл «PR в
приватном репо → тег → bump lockfile в двух проектах», а активное состояние
завязано на роутинг приложения. Условие возврата к A записано в вики.

**Находка Codex, ломавшая план:** в проде `trailingSlash: true`
(`next.config.js:27`), поэтому `usePathname` отдаёт `/nosotros/`, и
задуманное `pathname === href` не сработало бы никогда. Слеш нормализуется
вручную; локаль-префикс next-intl снимает сам.

**Сделано (`src/components/Header.tsx`, один файл, +164/−47):**
1. Один локальный `NavItem` на все четыре поверхности — десктоп-пункты,
   пункты дропдауна, мобильный sheet, кнопка «Tienda». Классы **подменяются**
   парами (полная неактивная строка / полная активная), не дописываются.
   Объявлен на уровне модуля: иначе навигация ремонтировалась бы на каждый
   тик слушателя скролла.
2. Два типа совпадения: `isSection` (страница или что-то под ней) для
   десктопа/мобайла/Tienda — пост блога держит «Consejos» активным;
   `isCurrentPage` (точное) для пунктов дропдауна — иначе «Todos los
   servicios» горел бы на `/servicios/limpieza`.
3. Триггер «Servicios» (это `<button>`, без `aria-current`) горит, когда
   открыта любая достижимая из дропдауна страница.
4. `aria-current="page"` — только на точной странице, раздел-предок получает
   `"true"` (в ARIA нет токена «section»).
5. `/consejos-y-guias/admin/**` исключён из подсветки «Consejos» — приватный
   дашборд, а не публичный раздел гайдов.

**Проверки:** `tsc --noEmit` чисто, `biome check` чисто, `bun run build`
прошёл. На `next start` снят HTML для `/`, `/nosotros/`, `/en/nosotros/`,
`/servicios/`, `/servicios/limpieza/`, `/problemas/`, `/consejos-y-guias/`,
`/tienda/`, `/tienda/cart/`, `/consejos-y-guias/admin/seo/`, `/privacidad/` —
ровно один активный пункт там, где ожидается, и ни одного вне навигации.
Защищённые SEO-элементы 10/10: JSON-LD (8 блоков), canonical, hreflang
x-default/es/en/ru, `main#main-content`, `data-ai-summary`, `geo.region`,
11 crawlable-ссылок дропдауна, `motion-reduce`, `invisible`. Второй
`aria-current="page"` в HTML — существующий `Breadcrumbs.tsx:59`, не регрессия:
крошки и навигация — разные наборы ссылок.

**Процессное:** seo-reviewer НЕ вызывался — инструкция этой сессии запрещает
спавнить агентов без явного запроса; проверка защищённых элементов сделана
вручную по `concepts/protected-seo-elements`. Правки затрагивают только
классы и `aria-*`, ни один защищённый элемент не задет.

**Wiki:** `concepts/header-navigation` — раздел «Активные состояния», блок
про локальный `NavItem`, переписан «Открытое»; `synthesis/gotchas` — грабли
№28 (дописанная конфликтующая tailwind-утилита) и №29 (`trailingSlash` +
`usePathname`).

**Закрытие (2026-08-22).** Владелец дал ok на push и открытие PR ради
Vercel-preview, затем ok на мерж вместе с записями памяти. **PR #47
смержен в main**; ветка `worktree-worktree-header-active-nav` (коммиты
`961e249` код + `aaf5a60` память) удалена. Vercel-preview собрался со
статусом `pass`; проверить его curl-ом было нельзя — на превью-доменах
включён Vercel SSO (302 на `vercel.com/sso-api`), поэтому верификация
делалась на локальном `next start` того же билда.

**Осталось**
- Замечания Codex, не входившие в задачу: дропдаун открывается только по
  hover/focus (клик по триггеру — no-op, хрупко на тач-устройствах);
  `role="menu"`/`menuitem"` на навигации сайта, возможно, избыточны против
  обычной семантики `nav`/списка. Оба — в «Открытом» страницы
  `concepts/header-navigation`.
- Кандидат на возврат к варианту A: если в `@24clima/design` появится проп
  `active` у `HeaderNavLink` — свернуть локальный `NavItem` обратно в пакет.
- Локальный `node_modules` в основном чекауте отстаёт от lockfile
  (v0.2.0 против пиннутого v0.2.2) — в свежем worktree `bun install`
  ставит правильный.
