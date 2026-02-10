# 24Clima — Project Documentation

Documentation for developers (including juniors and interns). 24clima company website: air conditioning services in Panama, cleaning cost calculator, multi-language support (ES/EN/RU).

---

## Table of Contents

1. [What This Project Is](#1-what-this-project-is)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [How to Run the Project](#4-how-to-run-the-project)
5. [Cost Calculator](#5-cost-calculator)
6. [Localization (i18n)](#6-localization-i18n)
7. [SEO and Indexing](#7-seo-and-indexing)
8. [Deploying to Vercel](#8-deploying-to-vercel)
9. [Security and Privacy](#9-security-and-privacy)

---

## 1. What This Project Is

- **Site:** [24clima.com](https://24clima.com)
- **Purpose:** Landing page for AC installation, cleaning, repair, and maintenance in Panama City.
- **Main features:**
  - Cleaning cost calculator (number of units + package).
  - Service descriptions and common problems (not cooling, leaking, noisy, etc.).
  - Contact and WhatsApp CTAs.
  - Three languages: Spanish (default), English, Russian.

---

## 2. Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | Framework (App Router, static export). |
| **React 18** | UI. |
| **TypeScript** | Typing and safety. |
| **Tailwind CSS** | Styling. |
| **next-intl** | Multi-language (locales). |
| **Vercel** | Hosting and deploy. |

- Package manager: `bun` (or `npm`/`yarn`).
- Linting: ESLint, Biome.

---

## 3. Project Structure

```
24clima_calculator_ver55/
├── public/                 # Static assets
│   ├── robots.txt         # Crawler rules (indexing allowed)
│   ├── sitemap.xml        # Sitemap for Google etc.
│   ├── favicon.svg
│   ├── images/
│   └── uploads/           # Service images
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout (minimal)
│   │   ├── page.tsx       # Redirect / → /es/
│   │   ├── globals.css
│   │   └── [locale]/      # Locale-based pages
│   │       ├── layout.tsx # Metadata, fonts, JSON-LD, scripts
│   │       ├── page.tsx   # Home (Hero, Calculator, Services, Contact...)
│   │       └── servicios/
│   │           └── [service]/page.tsx  # Service pages (cleaning, repair...)
│   ├── components/
│   │   ├── Calculator.tsx # Cleaning cost calculator
│   │   ├── Header.tsx, Footer.tsx, Hero.tsx
│   │   ├── Services.tsx, CleaningPackages.tsx, Contact.tsx
│   │   ├── GoogleAnalytics.tsx, MetaPixel.tsx
│   │   └── ui/            # UI kit (buttons, cards, etc.)
│   ├── i18n/
│   │   ├── config.ts      # locales: es, en, ru
│   │   ├── request.ts
│   │   └── routing.ts
│   └── lib/
│       ├── constants.ts   # WhatsApp, social links, company name
│       └── utils.ts
├── messages/              # Translations
│   ├── es.json
│   ├── en.json
│   └── ru.json
├── next.config.js         # next-intl, output: 'export', trailingSlash
├── vercel.json            # Security headers, region
└── docs/
    ├── README.ru.md       # Russian documentation
    └── README.en.md       # This file
```

**Important:** The app uses **static export** (`output: 'export'`). There are no server API routes; all pages are generated at build time.

---

## 4. How to Run the Project

### Requirements

- Node.js 18+
- Prefer [Bun](https://bun.sh) (or npm/yarn)

### Install dependencies

```bash
bun install
# or: npm install
```

### Development

```bash
bun run dev
# or: npm run dev
```

Open `http://localhost:3000`. The root `/` redirects to `/es/`.

### Build (same as Vercel)

```bash
bun run build
# or: npm run build
```

Static output goes to `out/`. You can serve it with any static host.

### Lint and type check

```bash
bun run lint
# or: npm run lint
```

---

## 5. Cost Calculator

**File:** `src/components/Calculator.tsx`

### Purpose

The user selects:
- **Number of units:** buttons 1–5 or custom input 1–99.
- **Package:** Basic, Recommended, Premium.

The component computes total price and savings (for multi-unit discounts) and provides a WhatsApp CTA with a pre-filled message.

### Calculation logic (do not change without agreement)

- Per-unit prices are in the `PRICING` object by package and position (first unit higher, then lower).
- `priceBreakdown` is the array of per-unit prices.
- `total` is the sum of `priceBreakdown`.
- `savings` is the difference between “full” price (quantity × base price) and `total`.

Translation keys live in `messages/*.json` under `calculator` and `packages`.

### UX

- Quantity block and “or enter” input are centered on mobile and desktop.
- Responsive layout via Tailwind (`sm:`, `lg:`).

---

## 6. Localization (i18n)

- **Library:** next-intl.
- **Locales:** `es` (default), `en`, `ru`, defined in `src/i18n/config.ts`.
- **Translation files:** `messages/es.json`, `messages/en.json`, `messages/ru.json`. Key structure is the same across files.
- **Usage:** `useTranslations("calculator")`, `t("quantity")`, etc. In server components use `getTranslations`.
- **URLs:** `/es/`, `/en/`, `/ru/`. Service pages: `/es/servicios/cleaning/`, etc.

To add a language: add the locale in `config.ts`, create `messages/xx.json` following the existing structure, and update `generateStaticParams` and metadata if needed.

---

## 7. SEO and Indexing

- **robots.txt:** `public/robots.txt` allows indexing (`Allow: /`) and points to `Sitemap: https://24clima.com/sitemap.xml`.
- **sitemap.xml:** `public/sitemap.xml` lists main and service pages for all locales.
- **Metadata:** In `src/app/[locale]/layout.tsx`: `title`, `description`, `keywords`, `openGraph`, `canonical`, `robots: { index: true, follow: true }`.
- **JSON-LD:** HVACBusiness and WebSite structured data for search engines and AI agents.
- **Google Search Console:** After deploy, add the 24clima.com property and submit the sitemap URL: `https://24clima.com/sitemap.xml`.

---

## 8. Deploying to Vercel

- Connect the repo to Vercel; build command is `next build`; output is static export.
- Configure the 24clima.com domain in the Vercel project (Domains).
- See `vercel.json` for security headers and region.

---

## 9. Security and Privacy

- No user passwords or secrets are stored in the app. Company contact data is in `src/lib/constants.ts`.
- `vercel.json` sets headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- Analytics (Google Analytics, Meta Pixel) use env vars on Vercel; do not commit keys to the repo.

---

If something is unclear, check similar components and `messages/*.json`, or ask your team lead/mentor.
