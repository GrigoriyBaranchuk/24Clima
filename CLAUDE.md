# 24Clima.com — Основной сайт

## Stack
- Next.js + TypeScript
- Tailwind CSS + Biome
- Supabase (база данных)
- Vercel (деплой)

## Структура
- src/ — исходный код
- components.json — UI компоненты
- supabase/ — схема и миграции
- public/ — статика
- docs/ — документация

## Контекст
Сайт HVAC/R компании WOW Soluciones Panama (24clima.com).
Owner: Ryhor Baranchuk (ryhor@24clima.com, +507 6828-2120).
Язык контента: испанский. Язык разработки: русский/английский.

## Дизайн-система (общая с shop.24clima.com)

Токены (цвета, шрифты, радиусы) и Tailwind-preset живут в пакете
`@24clima/design` → приватный репо `~/Projects/24clima-design`
(github.com/GrigoriyBaranchuk/24clima-design). Значения токенов НЕ менять
в globals.css/tailwind.config — только в пакете, затем новый тег и bump
зависимости в обоих проектах (workflow — в README пакета).

## Важные файлы для AI

- `DESIGN.md` — бренд-бук мобильной версии (Apple-style). ЧИТАЙ ПЕРЕД ДИЗАЙН-ИЗМЕНЕНИЯМИ.
- `PROJECT_MEMORY.md` — история проекта, что делали, что работает. ОБНОВЛЯЙ ПОСЛЕ РАБОТЫ.
- `docs/design-references/apple-DESIGN-reference.md` — референс Apple Design System
- `docs/claude-seo-README.md` — документация SEO-скилла claude-seo
- `.cursor/rules/` — правила для Cursor AI

## Текущая задача

Мобильный редизайн: сделать мобильную версию как нативное приложение (app-like).
Подход: responsive (один URL, разный CSS для mobile/desktop).
Десктопная версия НЕ меняется.
SEO/GEO элементы НЕ трогаем (JSON-LD, meta, canonical, robots, sitemap).
