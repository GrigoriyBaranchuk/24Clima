import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { normalizeSlug } from "@/lib/slug";
import { locales, defaultLocale, getLocalePrefix } from "@/i18n/config";

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

const serviceKeys = [
  "cleaning",
  "maintenance",
  "repair",
  "installation",
  "gas-recharge",
  "emergency",
] as const;

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
    for (const service of serviceKeys) {
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

  return entries;
}
