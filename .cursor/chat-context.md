# Контекст чата — проект 24clima (24clima_calculator_ver55)

## Проект
- **Сайт:** 24clima.com — услуги по кондиционерам в Панаме
- **Стек:** Next.js 15, React 18, TypeScript, Tailwind, next-intl (es/en/ru), Vercel
- **Репозиторий:** github.com:GrigoriyBaranchuk/24Clima.git

## Что сделано в чате

### SEO и индексация
- robots.txt (Allow: /, Sitemap), sitemap.xml
- Canonical самоссылающийся по локалям; alternates.languages с trailing slash
- Страницы услуг: canonical + alternates
- Семантическое ядро: src/lib/seo-keywords.ts (HOME_KEYWORDS, SERVICE_KEYWORDS по es/en/ru)
- AI/LLM: JSON-LD WebSite, sr-only блок с кратким описанием

### UX
- Калькулятор: блок «Сколько кондиционеров» и «или введите» по центру (мобильная и десктоп)

### Метрики
- Google Analytics: ID G-TQK90D11ME в src/components/GoogleAnalytics.tsx
- Яндекс.Метрика: ID 106804843 в src/components/YandexMetrika.tsx (strategy: afterInteractive)

### Контакты
- Instagram: https://www.instagram.com/24clima?igsh=... (в src/lib/constants.ts)

### WhatsApp
- Предзаполненные сообщения на языке пользователя (Calculator, CleaningPackages, Problems)
- Новые ключи: packages.whatsappOrderMessage, whatsappMessages.problemIntro

### Советы и Руководства (Tips) + Админка
- Публичная страница: /[locale]/consejos-y-guias/ — список статей HVAC
- Статья: /[locale]/consejos-y-guias/[slug]/ (динамический URL)
- Админка: /[locale]/consejos-y-guias/admin/ — вход (Supabase Auth), редактор статей, загрузка изображений
- Slug: ввод вручную (не из title); normalizeSlug() — trim слешей, lowercase; fallback для slug с ведущим слешем в БД
- Ссылки: href={`/consejos-y-guias/${slug}/`} — с trailing slash
- Контент: whitespace-pre-line для переносов; или HTML в content
- Supabase: Publishable key (sb_publishable_...), не Secret key
- Автоперевод RU→ES/EN при сохранении (API /api/translate, GOOGLE_TRANSLATE_API_KEY)
- output: 'export' отключён для API routes и динамических страниц
- Инструкция: docs/SETUP_TIPS_ADMIN.md

### Layout (Next.js)
- Корневой layout: ОБЯЗАТЕЛЬНО <html> и <body> (Next.js requirement)
- [locale] layout: возвращает <div>, не вложенные html/body
- Head (favicon, meta, JSON-LD) в корневом layout; globals.css импорт там же

### Dev / Debug
- npm run dev без --turbopack (EMFILE)
- Internal Server Error → проверить html/body в корневом layout
- 404 на статью → trailing slash в Link; slug в БД

### Lint
- tsconfig.lint.json + скрипт lint без .next/types

### Документация
- docs/README.ru.md, docs/README.en.md — описание проекта, семантическое ядро, Tips

## Важные пути
- src/lib/supabase.ts — клиент Supabase (null если env не заданы)
- src/lib/seo-keywords.ts — семантическое ядро
- src/app/[locale]/consejos-y-guias/ — Tips, TipsList, [slug], admin
- supabase/migrations/001_articles.sql — схема articles

## Что нужно настроить
- Supabase: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, миграция, bucket article-images, пользователь Auth
- GOOGLE_TRANSLATE_API_KEY (опционально) для автоперевода
