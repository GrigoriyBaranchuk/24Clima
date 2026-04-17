/**
 * Хелпер для генерации BreadcrumbList JSON-LD.
 *
 * Google рекомендует BreadcrumbList на всех страницах ≥ 2-го уровня:
 * https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 *
 * Использование:
 *   const schema = buildBreadcrumbJsonLd([
 *     { name: "Inicio", url: "https://24clima.com/" },
 *     { name: "Servicios", url: "https://24clima.com/servicios/" },
 *     { name: title, url: canonicalUrl },
 *   ]);
 *   // → <script type="application/ld+json" dangerouslySetInnerHTML={...} />
 */

const BASE = "https://24clima.com";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Строит BreadcrumbList JSON-LD объект.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Возвращает URL базы для указанной локали.
 *  - es (default) → "https://24clima.com/"
 *  - en / ru      → "https://24clima.com/en/" / "https://24clima.com/ru/"
 */
export function localeBase(locale: string): string {
  const prefix = locale === "es" ? "" : `/${locale}`;
  return `${BASE}${prefix}/`;
}

/**
 * Возвращает полный URL для пути в указанной локали.
 *  - localePath("es", "/servicios/limpieza/")  → "https://24clima.com/servicios/limpieza/"
 *  - localePath("en", "/servicios/limpieza/")   → "https://24clima.com/en/servicios/limpieza/"
 */
export function localePath(locale: string, path: string): string {
  const prefix = locale === "es" ? "" : `/${locale}`;
  return `${BASE}${prefix}${path}`;
}

/** Удобные labels для корневых страниц (es / en / ru). */
export const ROOT_LABELS: Record<string, { home: string; services: string; blog: string; about: string; contact: string; serviceAreas: string }> = {
  es: { home: "Inicio", services: "Servicios", blog: "Consejos y Guías", about: "Nosotros", contact: "Contacto", serviceAreas: "Zonas de servicio" },
  en: { home: "Home", services: "Services", blog: "Tips & Guides", about: "About Us", contact: "Contact", serviceAreas: "Service Areas" },
  ru: { home: "Главная", services: "Услуги", blog: "Советы и руководства", about: "О нас", contact: "Контакт", serviceAreas: "Зоны обслуживания" },
};

export function getLabels(locale: string) {
  return ROOT_LABELS[locale] ?? ROOT_LABELS.es;
}
