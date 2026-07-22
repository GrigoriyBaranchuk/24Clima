import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { normalizeSlug } from "@/lib/slug";
import { locales, defaultLocale, getLocalePrefix } from "@/i18n/config";
import { SERVICE_SLUGS } from "@/lib/services";
import { api as tiendaApi } from "@/features/tienda/lib/api-client";
import type { Category as TiendaCategory, SitemapItem as TiendaSitemapItem } from "@/features/tienda/lib/api-client";
import {
  tiendaHomeUrl,
  tiendaProfesionalUrl,
  tiendaDevolucionesUrl,
  tiendaCategoryUrl,
  tiendaProductUrl,
  tiendaLangAlternates,
} from "@/features/tienda/lib/tienda-url";

const BASE = "https://24clima.com";

function localeUrl(locale: string, path: string): string {
  const prefix = getLocalePrefix(locale as "es" | "en" | "ru");
  return `${BASE}${prefix}${path}`;
}

function langAlternates(path: string): Record<string, string> {
  const entries = locales.map((l) => [l, localeUrl(l, path)]);
  const xDefault = localeUrl(defaultLocale, path);
  return { "x-default": xDefault, ...Object.fromEntries(entries) };
}


type ArticleForSitemap = { slug: string; title_es: string | null; title_en: string | null; content_es: string | null; content_en: string | null };

async function getArticlesWithLocales(): Promise<ArticleForSitemap[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("articles")
    .select("slug, title_es, title_en, content_es, content_en")
    .order("updated_at", { ascending: false });
  if (!data) return [];
  return data as ArticleForSitemap[];
}

function articleHasLocale(a: ArticleForSitemap, locale: string): boolean {
  if (locale === "ru") return true;
  if (locale === "es") return !!(a.title_es || a.content_es);
  if (locale === "en") return !!(a.title_en || a.content_en);
  return false;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage — все локали с hreflang (es без префикса)
  for (const locale of locales) {
    entries.push({
      url: localeUrl(locale, "/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: { languages: langAlternates("/") },
    });
  }

  // Nosotros — все локали
  for (const locale of locales) {
    entries.push({
      url: localeUrl(locale, "/nosotros/"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: langAlternates("/nosotros/") },
    });
  }

  // Contacto — все локали
  for (const locale of locales) {
    entries.push({
      url: localeUrl(locale, "/contacto/"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: langAlternates("/contacto/") },
    });
  }

  // Areas de servicio — все локали
  for (const locale of locales) {
    entries.push({
      url: localeUrl(locale, "/areas-de-servicio/"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: langAlternates("/areas-de-servicio/") },
    });
  }

  // Diagnóstico — все локали
  for (const locale of locales) {
    entries.push({
      url: localeUrl(locale, "/diagnostico/"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: langAlternates("/diagnostico/") },
    });
  }

  // Tips list — все локали
  for (const locale of locales) {
    entries.push({
      url: localeUrl(locale, "/consejos-y-guias/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: { languages: langAlternates("/consejos-y-guias/") },
    });
  }

  // Services — все локали и все услуги
  for (const locale of locales) {
    for (const service of SERVICE_SLUGS) {
      const path = `/servicios/${service}/`;
      entries.push({
        url: localeUrl(locale, path),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
        alternates: { languages: langAlternates(path) },
      });
    }
  }

  // PH segment: property-manager landing + maintenance contract landing.
  // No priority/changeFrequency — Google ignores both (per skill rule).
  for (const locale of locales) {
    const phPath = "/servicio-para-administradoras-ph/";
    entries.push({
      url: localeUrl(locale, phPath),
      lastModified: now,
      alternates: { languages: langAlternates(phPath) },
    });
    const contractPath = "/contrato-mantenimiento-aire-acondicionado/";
    entries.push({
      url: localeUrl(locale, contractPath),
      lastModified: now,
      alternates: { languages: langAlternates(contractPath) },
    });
    const eventCoolingPath = "/alquiler-aire-acondicionado-eventos/";
    entries.push({
      url: localeUrl(locale, eventCoolingPath),
      lastModified: now,
      alternates: { languages: langAlternates(eventCoolingPath) },
    });
  }

  // Tips articles — только для локалей, где есть контент
  const articles = await getArticlesWithLocales();
  for (const a of articles) {
    const slug = normalizeSlug(a.slug ?? "");
    if (!slug) continue;
    const availableLocales = locales.filter((l) => articleHasLocale(a, l));
    const articleLangAlternates =
      availableLocales.length > 1
        ? { "x-default": localeUrl(defaultLocale, `/consejos-y-guias/${slug}/`), ...Object.fromEntries(availableLocales.map((l) => [l, localeUrl(l, `/consejos-y-guias/${slug}/`)])) }
        : undefined;
    for (const locale of availableLocales) {
      entries.push({
        url: localeUrl(locale, `/consejos-y-guias/${slug}/`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: articleLangAlternates ? { languages: articleLangAlternates } : undefined,
      });
    }
  }

  // Tienda returns policy — static content page, not gated behind the catalog API.
  for (const locale of locales) {
    entries.push({
      url: tiendaDevolucionesUrl(locale),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: { languages: tiendaLangAlternates("/devoluciones") },
    });
  }

  // Tienda (shop) section — home, profesional, categories, products fetched from
  // the shop API. Gated behind a successful catalog fetch: if the backend is cold
  // or down we log and skip ALL tienda entries, leaving the marketing sitemap
  // unchanged (never throw). Cart/checkout/account are intentionally excluded
  // (noindex conversion/private surfaces). Per-locale alternates via tiendaUrl.
  try {
    const [tiendaCategories, tiendaProducts]: [TiendaCategory[], TiendaSitemapItem[]] =
      await Promise.all([tiendaApi.getCategoriesCached(), tiendaApi.getSitemap()]);

    for (const locale of locales) {
      entries.push({
        url: tiendaHomeUrl(locale),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
        alternates: { languages: tiendaLangAlternates("") },
      });
      entries.push({
        url: tiendaProfesionalUrl(locale),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: { languages: tiendaLangAlternates("/profesional") },
      });
    }

    for (const c of tiendaCategories) {
      const path = `/category/${c.slug}`;
      for (const locale of locales) {
        entries.push({
          url: tiendaCategoryUrl(locale, c.slug),
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.7,
          alternates: { languages: tiendaLangAlternates(path) },
        });
      }
    }

    for (const p of tiendaProducts) {
      const lastModified = p.updated_at ? new Date(p.updated_at) : now;
      const path = `/product/${p.slug}`;
      for (const locale of locales) {
        entries.push({
          url: tiendaProductUrl(locale, p.slug),
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.6,
          alternates: { languages: tiendaLangAlternates(path) },
        });
      }
    }
  } catch (e) {
    console.error("[sitemap] tienda catalog API fetch failed, emitting marketing sitemap only:", e);
  }

  return entries;
}
