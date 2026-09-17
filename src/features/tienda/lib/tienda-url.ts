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
 * Locales whose /tienda pages Google may index. The Russian shop exists for the
 * owner's own use, not for search: it is the same Panamanian catalog in a third
 * language, which is thin-content duplication and dilutes the es/en pages. So ru
 * is noindex (owner decision Q5) — and a noindex page must not be advertised as
 * an hreflang alternate either, hence one list feeding both.
 */
export const TIENDA_INDEXED_LOCALES: readonly Locale[] = locales.filter((l) => l !== "ru");

/** Robots directive for a /tienda page: ru is noindex, still followed. */
export function tiendaRobots(locale: string): { index: boolean; follow: boolean } {
  return { index: locale !== "ru", follow: true };
}

/**
 * hreflang alternates map for a tienda-relative `path`, in the site's as-needed
 * scheme: { "x-default": es, es, en }. Mirrors sitemap.ts / servicios pages,
 * minus the noindexed ru shop (see TIENDA_INDEXED_LOCALES).
 */
export function tiendaLangAlternates(path = ""): Record<string, string> {
  const entries = TIENDA_INDEXED_LOCALES.map((l) => [l, tiendaUrl(l, path)] as const);
  return {
    "x-default": tiendaUrl(defaultLocale, path),
    ...Object.fromEntries(entries),
  };
}
