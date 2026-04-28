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
- Fase 1: Bottom navigation (BottomNav.tsx, Header mobile)
- Fase 2: Hero + главная (app-like layout)
- Fase 3: Внутренние страницы (услуги, контакты, блог)
- Fase 4: Footer + анимации + жесты + «Escribenos»
- Fase 5: SEO/GEO аудит + тестирование

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
