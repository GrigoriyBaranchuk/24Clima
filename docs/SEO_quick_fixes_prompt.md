# Промт для выполнения быстрых SEO-правок на сайте 24clima.com

> **Инструкция для Cursor:** Ты работаешь с Next.js проектом 24clima.com. Выполни все правки ниже строго по инструкции, не меняя ничего лишнего в коде.

## Контекст проекта

Сайт 24clima.com — сервис обслуживания кондиционеров в Панаме. Построен на **Next.js** с TypeScript, i18n через `next-intl` (языки: es, en, ru), деплой на Vercel. Структура метаданных — через `generateMetadata()` в файлах `layout.tsx` и `page.tsx`.

---

## Что нужно сделать: 10 правок в 6 файлах

---

### ПРАВКА 1 — Сократить Title главной страницы
**Файл:** `src/app/[locale]/layout.tsx`

**Проблема:** Title слишком длинный (92 символа), Google обрезает после 60.

**Найди объект `titles` и замени значения на:**
```
es: "24clima | Servicio de Aire Acondicionado en Panamá"
en: "24clima | Air Conditioning Service in Panama"
ru: "24clima | Обслуживание кондиционеров в Панаме"
```

**Проверка результата:** Каждый title — не более 60 символов. Содержит бренд 24clima, основной запрос и страну.

---

### ПРАВКА 2 — Сократить Meta Description главной страницы
**Файл:** `src/app/[locale]/layout.tsx`

**Проблема:** Description ~190 символов, нужно 150–160.

**Найди объект `descriptions` и замени значения на:**
```
es: "Técnicos de aire acondicionado en Panamá. Limpieza, mantenimiento, reparación e instalación. Atención 24/7 en Ciudad de Panamá y alrededores."

en: "Professional AC technicians in Panama. Cleaning, maintenance, repair and installation. 24/7 service in Panama City and surrounding areas."

ru: "Профессиональные техники по кондиционерам в Панаме. Чистка, обслуживание, ремонт, установка. Работаем 24/7 в Панама-Сити и окрестностях."
```

**Проверка результата:** Каждый description — от 130 до 160 символов. Содержит основные услуги, геолокацию и призыв к действию.

---

### ПРАВКА 3 — Добавить og:image и twitter:image на главную страницу
**Файл:** `src/app/[locale]/layout.tsx`

**Проблема:** Поле `og:image` отсутствует — при шаринге в соцсетях ссылка выглядит без картинки.

**В объекте `openGraph` добавь поле `images`:**
```typescript
images: [
  {
    url: "https://24clima.com/uploads/page1-opt.webp",
    width: 712,
    height: 500,
    alt: "24clima - Servicio de Aire Acondicionado en Panamá",
  },
],
```

**Также добавь в return объект `twitter`:**
```typescript
twitter: {
  card: "summary_large_image",
  title: titles[locale] || titles.es,
  description: descriptions[locale] || descriptions.es,
  images: ["https://24clima.com/uploads/page1-opt.webp"],
},
```

**Проверка результата:** В объекте метаданных присутствуют `openGraph.images` и `twitter`. При проверке через [opengraph.xyz](https://www.opengraph.xyz) отображается превью с картинкой техника.

---

### ПРАВКА 4 — Добавить og:image и twitter на страницы услуг
**Файл:** `src/app/[locale]/servicios/[service]/page.tsx`

**Проблема:** Страницы услуг не имеют og:image. В файле уже есть объект `serviceImages` с путями к картинкам для каждой услуги.

**Найди функцию `generateMetadata`. В объекте `return` измени поле `openGraph` — добавь `images`, и добавь отдельный объект `twitter`:**

```typescript
// В generateMetadata, после const imageUrl = ... (нужно добавить эту переменную в generateMetadata так же как она используется в компоненте):
const imageUrl = serviceImages[translationKey as TranslationKey];
const imageFullUrl = `https://24clima.com${imageUrl}`;

return {
  title: `${title} | 24clima`,
  description,
  keywords,
  openGraph: {
    title: `${title} | 24clima`,
    description,
    url: canonicalUrl,
    images: [
      {
        url: imageFullUrl,
        width: 712,
        height: 500,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | 24clima`,
    description,
    images: [imageFullUrl],
  },
  alternates: { ... }, // оставить как есть
};
```

**Важно:** объект `serviceImages` уже определён в этом же файле — используй его.

**Проверка результата:** Каждая страница услуги имеет своё уникальное og:image, соответствующее услуге.

---

### ПРАВКА 5 — Расширить Title страниц услуг
**Файл:** `messages/es.json`, `messages/en.json`, `messages/ru.json`

**Проблема:** Заголовки услуг слишком короткие (10–24 символа) и не содержат геолокацию и ключевые слова.

**Замени значения поля `title` для каждой услуги во всех трёх языковых файлах:**

**es.json:**
```json
"cleaning":      { "title": "Limpieza Profunda de Aire Acondicionado en Panamá" }
"maintenance":   { "title": "Mantenimiento Preventivo de Aire Acondicionado en Panamá" }
"repair":        { "title": "Reparación de Aire Acondicionado en Ciudad de Panamá" }
"installation":  { "title": "Instalación de Aire Acondicionado en Panamá" }
"gasRecharge":   { "title": "Carga de Gas Refrigerante para Aire Acondicionado en Panamá" }
"emergency":     { "title": "Servicio de Emergencia de Aire Acondicionado 24/7 en Panamá" }
```

**en.json:**
```json
"cleaning":      { "title": "Air Conditioner Deep Cleaning Service in Panama" }
"maintenance":   { "title": "Preventive Air Conditioner Maintenance in Panama" }
"repair":        { "title": "Air Conditioner Repair Service in Panama City" }
"installation":  { "title": "Professional Air Conditioner Installation in Panama" }
"gasRecharge":   { "title": "AC Refrigerant Gas Recharge Service in Panama" }
"emergency":     { "title": "24/7 Emergency Air Conditioner Service in Panama" }
```

**ru.json:**
```json
"cleaning":      { "title": "Глубокая чистка кондиционера в Панаме" }
"maintenance":   { "title": "Профилактическое обслуживание кондиционера в Панаме" }
"repair":        { "title": "Ремонт кондиционера в Панама-Сити" }
"installation":  { "title": "Профессиональная установка кондиционера в Панаме" }
"gasRecharge":   { "title": "Заправка кондиционера хладагентом в Панаме" }
"emergency":     { "title": "Экстренный ремонт кондиционера 24/7 в Панаме" }
```

**Проверка результата:** Каждый title содержит название услуги + "aire acondicionado/air conditioner/кондиционер" + геолокацию. Длина 45–65 символов.

---

### ПРАВКА 6 — Расширить Description страниц услуг
**Файл:** `messages/es.json`, `messages/en.json`, `messages/ru.json`

**Проблема:** Описания услуг слишком короткие (42–69 символов). Нужно 140–155 символов.

**Замени значения поля `description` для каждой услуги:**

**es.json:**
```json
"cleaning":     "description": "Limpieza profesional de aire acondicionado en Ciudad de Panamá. Elimina hongos, bacterias y malos olores. Mejora el rendimiento del equipo. Servicio disponible 24/7."
"maintenance":  "description": "Mantenimiento preventivo de aires acondicionados en Panamá. Evita averías costosas, prolonga la vida del equipo y garantiza un aire limpio. Técnicos certificados."
"repair":       "description": "Reparación de aires acondicionados en Ciudad de Panamá. Diagnóstico rápido, repuestos originales y garantía en el trabajo. Atendemos cualquier marca y modelo."
"installation": "description": "Instalación profesional de aires acondicionados en Panamá. Incluye cableado, soportes, prueba de funcionamiento y limpieza del área. Técnicos certificados."
"gasRecharge":  "description": "Carga de gas refrigerante para aires acondicionados en Panamá. Si tu equipo no enfría correctamente, recargamos con gas original. Servicio rápido y garantizado."
"emergency":    "description": "Servicio de emergencia de aire acondicionado 24/7 en Ciudad de Panamá. Atendemos fallas críticas en cualquier momento, incluyendo fines de semana y feriados."
```

**en.json:**
```json
"cleaning":     "description": "Professional air conditioner cleaning in Panama City. Removes mold, bacteria and bad odors. Improves equipment performance and air quality. Available 24/7."
"maintenance":  "description": "Preventive air conditioner maintenance in Panama. Avoids costly repairs, extends equipment life and ensures clean air. Certified technicians available daily."
"repair":       "description": "Air conditioner repair in Panama City. Fast diagnosis, original parts and work guarantee. We service any brand and model across Panama City and surrounding areas."
"installation": "description": "Professional air conditioner installation in Panama. Includes wiring, brackets, functional test and area cleanup. Certified technicians with years of experience."
"gasRecharge":  "description": "AC refrigerant gas recharge in Panama. If your unit is not cooling properly, we recharge with original refrigerant gas. Fast, guaranteed service across Panama City."
"emergency":    "description": "24/7 emergency air conditioner service in Panama City. We handle critical failures at any time, including weekends and holidays. Call us now for immediate assistance."
```

**ru.json:**
```json
"cleaning":     "description": "Профессиональная чистка кондиционера в Панама-Сити. Удаляем плесень, бактерии и запахи. Улучшаем работу оборудования и качество воздуха. Работаем 24/7."
"maintenance":  "description": "Профилактическое обслуживание кондиционеров в Панаме. Предотвращаем поломки, продлеваем срок службы и обеспечиваем чистый воздух. Сертифицированные техники."
"repair":       "description": "Ремонт кондиционеров в Панама-Сити. Быстрая диагностика, оригинальные запчасти и гарантия на работу. Обслуживаем любые марки и модели по всему городу."
"installation": "description": "Профессиональная установка кондиционеров в Панаме. Включает монтаж, подключение, тестирование и уборку. Сертифицированные техники с многолетним опытом."
"gasRecharge":  "description": "Заправка кондиционера хладагентом в Панаме. Если оборудование не охлаждает — заправим оригинальным газом. Быстро и с гарантией по всему Панама-Сити."
"emergency":    "description": "Экстренный ремонт кондиционера 24/7 в Панама-Сити. Выезжаем при критических поломках в любое время, включая выходные и праздники. Звоните немедленно."
```

**Проверка результата:** Каждый description содержит ключевые слова, геолокацию и призыв к действию. Длина 140–165 символов.

---

### ПРАВКА 7 — Убрать ссылки Privacy Policy и Terms of Service из футера
**Файл:** `src/components/Footer.tsx`

**Проблема:** Две ссылки с `href="#"` — пустые якоря, вредят SEO и UX.

**Найди строки (примерно line 154–159):**
```tsx
<a href="#" className="hover:text-white transition-colors">
  {t("privacyPolicy")}
</a>
<a href="#" className="hover:text-white transition-colors">
  {t("termsOfService")}
</a>
```

**Удали эти два блока `<a>` целиком** вместе с обёрткой (если они в `<li>` или `<div>` — удали весь элемент).

**Проверка результата:** В футере нет ссылок с `href="#"`. Проверить в браузере — ссылки на Privacy Policy и Terms of Service исчезли.

---

### ПРАВКА 8 — Добавить Web Manifest
**Создай новый файл:** `public/manifest.webmanifest`

**Содержимое файла:**
```json
{
  "name": "24clima - Aire Acondicionado en Panamá",
  "short_name": "24clima",
  "description": "Servicio profesional de aire acondicionado en Panamá. Instalación, mantenimiento y reparación 24/7.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e3a5f",
  "theme_color": "#1e3a5f",
  "lang": "es",
  "icons": [
    {
      "src": "/images/logo.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

**Проверка результата:** Файл доступен по URL `https://24clima.com/manifest.webmanifest`.

---

### ПРАВКА 9 — Добавить ссылку на manifest и apple-touch-icon в `<head>`
**Файл:** `src/app/layout.tsx` (корневой layout, не locale layout)

**В блоке `<head>` после строки `<link rel="icon" href="/favicon.svg" ...>` добавь:**
```tsx
<link rel="manifest" href="/manifest.webmanifest" />
<link rel="apple-touch-icon" href="/images/logo.svg" />
```

**Проверка результата:** В исходном коде страницы присутствуют теги `<link rel="manifest">` и `<link rel="apple-touch-icon">`.

---

### ПРАВКА 10 — Сократить meta keywords
**Файл:** `src/lib/seo-keywords.ts`

**Проблема:** В `getHomeKeywords()` возвращается 18+ ключевых фраз — это воспринимается как спам.

**Найди функцию `getHomeKeywords` и сократи список для каждого языка до 5–7 самых важных фраз:**

```typescript
// es — оставить только:
"servicio aire acondicionado Panamá",
"limpieza aire acondicionado Panamá",
"mantenimiento aire acondicionado Panamá",
"reparación aire acondicionado Panamá",
"instalación aire acondicionado Panamá",
"técnico aire acondicionado Ciudad de Panamá",
"servicio 24 horas aire acondicionado"

// en — оставить только:
"air conditioning service Panama",
"AC cleaning Panama City",
"air conditioner maintenance Panama",
"AC repair Panama",
"air conditioner installation Panama",
"24/7 AC service Panama",
"HVAC technician Panama City"

// ru — оставить только:
"обслуживание кондиционеров Панама",
"чистка кондиционера Панама-Сити",
"ремонт кондиционера Панама",
"установка кондиционера Панама",
"заправка кондиционера Панама",
"техник кондиционер Панама 24 часа"
```

**Проверка результата:** `getHomeKeywords('es')` возвращает массив из 7 или меньше строк.

---

## Общая проверка после всех правок

После внесения всех изменений:

1. **Запусти проект** командой `bun dev` или `npm run dev`
2. **Открой главную страницу** в браузере → правой кнопкой → "Просмотр кода страницы"
3. Убедись, что в `<head>` присутствуют:
   - `<title>` не длиннее 60 символов
   - `<meta name="description">` длиной 130–160 символов
   - `<meta property="og:image">` с URL картинки
   - `<meta name="twitter:card" content="summary_large_image">`
   - `<link rel="manifest">`
   - `<link rel="apple-touch-icon">`
   - **Нет** `<meta name="keywords">` с длинным списком
4. **Открой страницу услуги**, например `/servicios/limpieza/` → убедись, что title содержит "en Panamá" и description длиннее 130 символов
5. **Открой футер** → убедись, что ссылки Privacy Policy и Terms of Service исчезли
6. **Проверь [opengraph.xyz](https://www.opengraph.xyz)** — вставь URL сайта и убедись, что отображается превью с картинкой

---

## Файлы которые нужно изменить (итого)

| Файл | Правки |
|------|--------|
| `src/app/[locale]/layout.tsx` | 1, 2, 3 (title, description, og:image, twitter) |
| `src/app/[locale]/servicios/[service]/page.tsx` | 4 (og:image и twitter для услуг) |
| `messages/es.json` | 5, 6 (title и description всех услуг) |
| `messages/en.json` | 5, 6 (title и description всех услуг) |
| `messages/ru.json` | 5, 6 (title и description всех услуг) |
| `src/components/Footer.tsx` | 7 (убрать пустые ссылки) |
| `public/manifest.webmanifest` | 8 (создать новый файл) |
| `src/app/layout.tsx` | 9 (добавить manifest и apple-touch-icon) |
| `src/lib/seo-keywords.ts` | 10 (сократить keywords) |
