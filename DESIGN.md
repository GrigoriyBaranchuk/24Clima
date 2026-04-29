# 24clima — Mobile Design System (DESIGN.md)

> Бренд-бук мобильной версии сайта 24clima.com
> Основан на Apple Design System, адаптирован под HVAC-бренд в Панаме.
> Используй этот файл как единственный источник правды для дизайна мобильной версии.

---

## 1. Visual Theme & Atmosphere

Мобильная версия 24clima выглядит как **нативное iOS-приложение для сервиса кондиционеров**. UI минималистичный — контент и CTA на первом плане, хром отступает. Основное ощущение: профессионализм, надёжность, скорость обслуживания.

**Ключевые характеристики:**
- App-like навигация: bottom tab bar вместо гамбургер-меню
- Карточный интерфейс: услуги, калькулятор, отзывы — всё в карточках
- WhatsApp-first CTA: центральная плавающая кнопка «Escribenos» (как FAB в Material Design)
- Два режима поверхностей: navy-gradient hero ↔ white/light-gray контент
- Минимальные тени — только на карточках услуг для глубины
- Touch-friendly: все интерактивные элементы min 44×44px

**Чего НЕ должно быть:**
- Гамбургер-меню на мобильных (заменено на bottom nav)
- Декоративных градиентов (кроме hero)
- Теней на кнопках
- Анимаций, нарушающих prefers-reduced-motion

---

## 2. Color Palette & Roles

### Brand Colors
```
--24c-navy:          #1e3a5f    /* Основной бренд — хедер, hero, акценты */
--24c-navy-dark:     #152d4a    /* Тёмный вариант для градиентов */
--24c-navy-light:    #2a4f7a    /* Светлый вариант для ховеров */
--24c-green:         #7BC043    /* Основной CTA, активные элементы, успех */
--24c-green-dark:    #6aad38    /* Ховер/нажатие на зелёных кнопках */
--24c-green-light:   #8dd44f    /* Лёгкий акцент */
```

### WhatsApp & Communication
```
--24c-whatsapp:      #25D366    /* WhatsApp кнопка — основной конверсионный цвет */
--24c-whatsapp-dark: #1da851    /* Ховер/нажатие WhatsApp */
--24c-phone:         #0066cc    /* Ссылки «Llamar» (звонок) */
```

### Surfaces (светлая тема)
```
--24c-bg-primary:    #ffffff    /* Основной фон контента */
--24c-bg-secondary:  #f5f5f7    /* Фон карточек, секций (Apple parchment) */
--24c-bg-tertiary:   #fafafc    /* Вложенные элементы внутри карточек */
```

### Text
```
--24c-text-primary:  #1d1d1f    /* Заголовки, основной текст */
--24c-text-secondary:#6e6e73    /* Описания, подписи */
--24c-text-tertiary: #aeaeb2    /* Плейсхолдеры, неактивные элементы */
--24c-text-on-dark:  #ffffff    /* Текст на тёмных поверхностях */
--24c-text-on-dark-muted: rgba(255,255,255,0.7)  /* Вторичный текст на тёмных */
```

### Borders
```
--24c-border-light:  #e5e5ea    /* Разделители карточек */
--24c-border-subtle: #f0f0f0    /* Тонкие разделители внутри секций */
```

### Service Category Colors (для иконок)
```
--24c-service-install:   bg: #E6F1FB, icon: #185FA5  /* Установка — синий */
--24c-service-cleaning:  bg: #EAF3DE, icon: #3B6D11  /* Чистка — зелёный */
--24c-service-repair:    bg: #FAEEDA, icon: #854F0B  /* Ремонт — янтарный */
--24c-service-diagnostic:bg: #FBEAF0, icon: #993556  /* Диагностика — розовый */
--24c-service-gas:       bg: #E1F5EE, icon: #0F6E56  /* Заправка — teal */
--24c-service-emergency: bg: #FCEBEB, icon: #A32D2D  /* Экстренный — красный */
```

### Rating
```
--24c-star:          #EF9F27    /* Цвет звёзд рейтинга */
```

---

## 3. Typography Rules

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-serif: 'Lora', Georgia, serif;  /* Только для акцентных цитат */
```

### Hierarchy (Mobile)
| Token | Size | Weight | Line Height | Letter Spacing | Использование |
|-------|------|--------|-------------|----------------|---------------|
| hero-title | 24px | 600 | 1.2 | -0.3px | Hero заголовок на мобильном |
| section-title | 20px | 600 | 1.25 | -0.2px | Заголовки секций (Servicios, Precios) |
| card-title | 16px | 600 | 1.3 | -0.1px | Заголовки карточек |
| body | 15px | 400 | 1.5 | -0.1px | Основной текст |
| body-strong | 15px | 600 | 1.5 | -0.1px | Выделенный текст (цены) |
| caption | 13px | 400 | 1.4 | 0 | Подписи, описания |
| caption-strong | 13px | 600 | 1.4 | 0 | Активные табы, метки |
| label | 11px | 500 | 1.2 | 0.5px | Метки секций (uppercase) |
| tab-label | 10px | 500 | 1.0 | 0 | Подписи bottom nav |
| fine-print | 12px | 400 | 1.3 | 0 | Юридический текст, футер |

### Принципы
- Все заголовки: weight 600, отрицательный letter-spacing (Apple-tight)
- Body: 15px (не 14px и не 16px) — оптимально для мобильного чтения
- Weight 500 используется ТОЛЬКО для labels и tab-label
- Serif (Lora) — только для цитат клиентов в отзывах
- Input font-size: 16px (предотвращает авто-зум на iOS)

---

## 4. Component Stylings

### Bottom Navigation (НОВЫЙ компонент)
```
Видимость: только mobile (< lg / 1024px)
Высота: 56px + safe-area-inset-bottom
Фон: --24c-bg-primary (белый)
Граница сверху: 0.5px solid --24c-border-light
Элементы: 4 таба + центральная FAB кнопка WhatsApp

Табы:
  - Иконка: 20px, stroke
  - Подпись: tab-label (10px/500)
  - Неактивный: --24c-text-tertiary
  - Активный: --24c-green (иконка filled + текст)

Центральная FAB (WhatsApp):
  - Размер: 52×52px
  - Фон: --24c-whatsapp
  - Иконка: белая, 24px
  - Радиус: 50% (круг)
  - Позиция: выступает на 20px выше nav bar
  - Border: 3px solid --24c-bg-primary (белая обводка)
  - Подпись: «Escribenos» (caption-strong, --24c-whatsapp)
```

### Compact Header (мобильный)
```
Видимость: только mobile (< lg / 1024px)
Фон: --24c-navy (или gradient к --24c-navy-light)
Высота: 44px
Содержимое:
  - Слева: лого 24clima (32×32px, green icon + белый текст)
  - Справа: кнопка уведомлений (32px, circle, rgba белый 15%), языковой переключатель (pill)
Семантика: <header>, <nav>
```

### Hero Section (мобильный)
```
Фон: linear-gradient(180deg, --24c-navy, --24c-navy-light)
Padding: 20px 16px 24px
Содержимое:
  - Приветствие: caption, --24c-text-on-dark-muted
  - Заголовок: hero-title, --24c-text-on-dark
  - CTA группа: flex row, gap 8px
    - WhatsApp кнопка: flex 1, --24c-whatsapp фон, pill radius
    - Звонок кнопка: flex 1, rgba(255,255,255,0.15) фон, pill radius
Семантика: сохраняем <h1>, все aria-*, data-ai-summary
```

### Service Grid (мобильный)
```
Layout: grid 2×2 (grid-template-columns: repeat(2, 1fr))
Gap: 8px
Карточка услуги:
  - Фон: --24c-bg-secondary
  - Радиус: 14px
  - Padding: 12px
  - Alignment: center
  - Иконка: 36×36px контейнер, 10px radius, цвет из service-category-colors
  - Текст: caption-strong, center
  - Touch target: min 44×44px (весь контейнер кликабельный)
Семантика: сохраняем все ссылки на /servicios/
```

### Calculator Widget (мобильный)
```
Контейнер: карточка на --24c-bg-secondary, radius 14px, padding 14px
Заголовок: card-title + chevron справа
Описание: caption, --24c-text-secondary
Счётчик: flex row
  - Кнопки ±: 32×32px, radius 8px
  - Значение: body-strong, min-width 20px
  - Единицы: caption, --24c-text-secondary
  - Цена: section-title weight 600, --24c-green, align right
```

### Review Card (мобильный)
```
Контейнер: карточка на --24c-bg-secondary, radius 14px, padding 14px
Звёзды: flex row, 14px каждая, --24c-star fill
Рейтинг: caption-strong рядом со звёздами
Цитата: caption, italic, --24c-text-secondary, font-family serif
Автор: fine-print, --24c-text-tertiary
```

### Service Detail Page (мобильный)
```
Хедер: compact header с кнопкой назад
Баннер: gradient hero с названием услуги
Контент: карточный стек
  - Описание: карточка с body текстом
  - Цены: карточка с таблицей цен
  - FAQ: аккордеон внутри карточки
  - CTA: sticky bottom bar с ценой + кнопка WhatsApp
Семантика: article, h1, breadcrumbs, FAQ schema — ВСЁ СОХРАНЯЕМ
```

### Buttons
```
Primary (WhatsApp):
  Фон: --24c-whatsapp
  Текст: white, body-strong
  Радиус: pill (9999px)
  Padding: 12px 24px
  Active: transform scale(0.97)

Secondary (Outline):
  Фон: transparent
  Текст: --24c-text-on-dark (на тёмном) или --24c-navy (на светлом)
  Border: 1px solid rgba(255,255,255,0.3) или --24c-border-light
  Радиус: pill
  Padding: 12px 24px

Tertiary (Ghost):
  Фон: rgba(255,255,255,0.15) (на тёмном) или --24c-bg-secondary (на светлом)
  Текст: --24c-text-on-dark или --24c-text-primary
  Радиус: 10px
  Padding: 10px 16px
```

---

## 5. Layout Principles

### Spacing System
```
--space-xxs:  4px    /* Внутри иконок, мелкие gap */
--space-xs:   8px    /* Gap между элементами в группе */
--space-sm:   12px   /* Padding внутри карточек */
--space-md:   16px   /* Горизонтальный padding контента */
--space-lg:   20px   /* Вертикальные gap между секциями */
--space-xl:   24px   /* Padding внутри hero */
--space-xxl:  32px   /* Большие промежутки */
```

### Grid
- **Мобильный контент:** single column, padding 16px по бокам
- **Service grid:** 2 колонки, gap 8px
- **Карточки:** full-width, стек вертикально, gap 10-12px
- **Max-width на mobile:** 100vw (без ограничений, edge-to-edge)

### Safe Areas
```css
padding-bottom: calc(56px + env(safe-area-inset-bottom)); /* Для bottom nav */
padding-top: env(safe-area-inset-top); /* Для notch */
```

---

## 6. Depth & Elevation

| Уровень | Обработка | Где используется |
|---------|-----------|-----------------|
| Flat | Нет тени, нет border | Hero, секции, bottom nav фон |
| Subtle | 0.5px solid --24c-border-light | Разделители между секциями |
| Card | background --24c-bg-secondary, border-radius 14px | Карточки услуг, калькулятор, отзывы |
| Elevated | box-shadow: 0 1px 3px rgba(0,0,0,0.08) | Sticky header при скролле |
| FAB | box-shadow: 0 4px 12px rgba(37,211,102,0.3) | Кнопка WhatsApp в bottom nav |

**Философия:** Глубина создаётся сменой фона (navy ↔ white ↔ parchment), а не тенями. Тени — только для плавающих элементов (sticky bar, FAB).

---

## 7. Do's and Don'ts

### DO
- Используй bottom navigation вместо гамбургер-меню на мобильных
- Сохраняй WhatsApp как центральный конверсионный элемент
- Используй --24c-green ТОЛЬКО для CTA и активных состояний
- Все интерактивные элементы: min 44×44px touch target
- Карточки: radius 14px, фон --24c-bg-secondary, без явных borders
- Hero: navy gradient, white текст, два CTA (WhatsApp + Звонок)
- Сохраняй ВСЮ семантику: h1, article, nav, main#main-content, aria-*
- Inputs: font-size 16px (предотвращает iOS авто-зум)
- Анимации: уважай prefers-reduced-motion

### DON'T
- НЕ используй гамбургер-меню на мобильных (< 1024px)
- НЕ добавляй тени на кнопки (только на FAB и sticky элементы)
- НЕ меняй HTML-структуру SEO-элементов (JSON-LD, meta, canonical)
- НЕ удаляй data-ai-summary, aria-label, skip-link
- НЕ трогай robots.txt, sitemap.ts, middleware.ts
- НЕ используй второй акцентный цвет — navy + green единственная пара
- НЕ уменьшай body текст ниже 15px
- НЕ ломай heading hierarchy (h1 → h2 → h3)
- НЕ используй position: fixed для bottom nav (используй sticky + safe-area)

---

## 8. Responsive Behavior

### Breakpoints (совпадают с текущими Tailwind)
| Имя | Ширина | Режим | Навигация |
|-----|--------|-------|-----------|
| xs | < 640px | Mobile phone | Bottom nav + compact header |
| sm | 640-767px | Large phone | Bottom nav + compact header |
| md | 768-1023px | Tablet | Bottom nav + compact header |
| lg | 1024-1279px | Desktop | Standard desktop header (без изменений) |
| xl | 1280px+ | Large desktop | Standard desktop header (без изменений) |

### Стратегия переключения
```
< lg (1024px):  Мобильный режим
  - Bottom navigation bar (НОВЫЙ)
  - Compact header (лого + действия)
  - Карточный интерфейс
  - Hero компактный
  - Кнопка «Escribenos» в bottom nav
  - Footer компактный

≥ lg (1024px):  Десктопный режим
  - Текущий дизайн БЕЗ ИЗМЕНЕНИЙ
  - Горизонтальная навигация
  - Полноразмерный hero
  - WhatsApp плавающая кнопка (текущая)
```

### Tailwind-классы для переключения
```html
<!-- Десктоп: без изменений -->
<div class="hidden lg:flex">...десктопная навигация...</div>

<!-- Мобильный: новый дизайн -->
<div class="flex lg:hidden">...bottom nav...</div>
```

---

## 9. Agent Prompt Guide

При работе с этим проектом AI-агент должен:

1. **Читать DESIGN.md** перед любыми визуальными изменениями
2. **Читать PROJECT_MEMORY.md** для контекста проекта
3. **Проверять SEO-чеклист** после каждого изменения:
   - [ ] h1 на каждой странице сохранён
   - [ ] JSON-LD схемы не изменены
   - [ ] meta description/title не изменены
   - [ ] canonical URLs не изменены
   - [ ] hreflang alternates не изменены
   - [ ] Breadcrumbs работают
   - [ ] FAQ schema на страницах услуг
   - [ ] data-ai-summary в layout сохранён
   - [ ] aria-labels на интерактивных элементах
   - [ ] skip-to-main-content ссылка
   - [ ] GA4/Yandex/Meta tracking не нарушен
   - [ ] Images используют next/image с alt
   - [ ] Input font-size >= 16px на iOS

4. **Используй Tailwind responsive** (`lg:` prefix) для разделения мобильного и десктопного
5. **Не трогай** файлы: middleware.ts, sitemap.ts, robots.txt, next.config.js
6. **Создавай новые компоненты** (BottomNav.tsx) вместо радикального изменения существующих
7. **Тестируй** на viewport 375px (iPhone SE) и 390px (iPhone 14)

---

## Приложение: Файлы проекта для справки

| Файл | Назначение | Можно менять? |
|------|-----------|---------------|
| DESIGN.md | Этот бренд-бук | Да, при необходимости |
| PROJECT_MEMORY.md | История проекта | Обновлять после работы |
| CLAUDE.md | Контекст для AI | Обновлять при изменениях |
| src/components/Header.tsx | Навигация | Да (добавить mobile variant) |
| src/components/Hero.tsx | Баннер | Да (добавить mobile variant) |
| src/components/Footer.tsx | Футер | Да (компактный mobile) |
| src/components/WhatsAppButton.tsx | Плавающая кнопка | Заменить на FAB в bottom nav |
| src/app/[locale]/layout.tsx | Layout + meta | Только CSS/layout, НЕ meta |
| src/app/[locale]/page.tsx | Главная | Только CSS/layout, НЕ structure |
| tailwind.config.ts | Tailwind конфиг | Да (добавить кастомные цвета) |
| src/app/globals.css | Глобальные стили | Да (добавить mobile стили) |
