import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { normalizeSlug } from "@/lib/slug";
import { locales } from "@/i18n/config";

const BASE = "https://24clima.com";

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

  // Homepage — все локали с hreflang
  for (const locale of locales) {
    entries.push({
      url: `${BASE}/${locale}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [`${l}`, `${BASE}/${l}/`])
        ) as Record<string, string>,
      },
    });
  }

  // Tips list — все локали
  for (const locale of locales) {
    entries.push({
      url: `${BASE}/${locale}/consejos-y-guias/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [`${l}`, `${BASE}/${l}/consejos-y-guias/`])
        ) as Record<string, string>,
      },
    });
  }

  // Services — все локали и все услуги
  for (const locale of locales) {
    for (const service of serviceKeys) {
      entries.push({
        url: `${BASE}/${locale}/servicios/${service}/`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [`${l}`, `${BASE}/${l}/servicios/${service}/`])
          ) as Record<string, string>,
        },
      });
    }
  }

  // Tips articles — только для локалей, где есть контент
  const articles = await getArticlesWithLocales();
  for (const a of articles) {
    const slug = normalizeSlug(a.slug ?? "");
    if (!slug) continue;
    const availableLocales = locales.filter((l) => articleHasLocale(a, l));
    const langAlternates = Object.fromEntries(
      availableLocales.map((l) => [`${l}`, `${BASE}/${l}/consejos-y-guias/${slug}/`])
    ) as Record<string, string>;
    for (const locale of availableLocales) {
      entries.push({
        url: `${BASE}/${locale}/consejos-y-guias/${slug}/`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: availableLocales.length > 1 ? { languages: langAlternates } : undefined,
      });
    }
  }

  return entries;
}
