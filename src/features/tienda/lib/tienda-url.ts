/**
 * Canonical URL builder for the shop section living under /tienda on 24clima.com.
 *
 * Rewritten for the site's as-needed locale scheme + trailingSlash:true (unlike the
 * shop app, which used localePrefix:"always" and no trailing slash):
 *   es  → https://24clima.com/tienda{path}/
 *   en  → https://24clima.com/en/tienda{path}/
 *   ru  → https://24clima.com/ru/tienda{path}/
 *
 * `path` is the tienda-relative path WITHOUT the /tienda prefix and WITHOUT a trailing
 * slash, e.g. "" (home), "/profesional", "/product/some-slug", "/category/aire-acondicionado".
 * All canonical / hreflang / openGraph / JSON-LD URLs in ported metadata go through here.
 */

import { locales, defaultLocale, getLocalePrefix, type Locale } from "@/i18n/config";

// Mirrors the BASE used by the site's sitemap.ts.
export const BASE = "https://24clima.com";

/** Absolute, trailing-slashed tienda URL for `locale` + tienda-relative `path`. */
export function tiendaUrl(locale: string, path = ""): string {
  const prefix = getLocalePrefix(locale as Locale);
  const clean = path === "/" ? "" : path;
  return `${BASE}${prefix}/tienda${clean}/`;
}

export function tiendaHomeUrl(locale: string): string {
  return tiendaUrl(locale, "");
}

export function tiendaProductUrl(locale: string, slug: string): string {
  return tiendaUrl(locale, `/product/${slug}`);
}

export function tiendaCategoryUrl(locale: string, slug: string): string {
  return tiendaUrl(locale, `/category/${slug}`);
}

export function tiendaProfesionalUrl(locale: string): string {
  return tiendaUrl(locale, "/profesional");
}

export function tiendaDevolucionesUrl(locale: string): string {
  return tiendaUrl(locale, "/devoluciones");
}

/**
 * hreflang alternates map for a tienda-relative `path`, in the site's as-needed
 * scheme: { "x-default": es, es, en, ru }. Mirrors sitemap.ts / servicios pages.
 */
export function tiendaLangAlternates(path = ""): Record<string, string> {
  const entries = locales.map((l) => [l, tiendaUrl(l, path)] as const);
  return {
    "x-default": tiendaUrl(defaultLocale, path),
    ...Object.fromEntries(entries),
  };
}
