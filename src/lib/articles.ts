import { supabase } from "./supabase";

const BUCKET = "article-images";

export type ArticleRow = {
  id: string;
  slug: string;
  title_ru: string;
  title_es: string | null;
  title_en: string | null;
  content_ru: string;
  content_es: string | null;
  content_en: string | null;
  image_urls: string[] | null;
  created_at: string;
  updated_at: string;
};

export type LocalizedFields = {
  title: string;
  content: string;
};

/**
 * Resolves image URL: if full URL return as-is, else get Supabase Storage public URL.
 */
export function resolveImageUrl(pathOrUrl: string): string {
  const trimmed = (pathOrUrl ?? "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (!supabase) return trimmed;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(trimmed);
  return data.publicUrl;
}

/**
 * Resolves all image_urls to public URLs.
 */
export function resolveImageUrls(pathsOrUrls: string[] | null | undefined): string[] {
  const arr = pathsOrUrls ?? [];
  return arr.map(resolveImageUrl).filter(Boolean);
}

/**
 * Get localized title and content based on locale.
 */
export function getLocalizedFields(
  article: ArticleRow,
  locale: string
): LocalizedFields {
  const title =
    (locale === "es" && article.title_es) ||
    (locale === "en" && article.title_en) ||
    article.title_ru;
  const content =
    (locale === "es" && article.content_es) ||
    (locale === "en" && article.content_en) ||
    article.content_ru;
  return { title: title ?? article.title_ru, content: content ?? article.content_ru };
}

/**
 * Strip markdown/HTML for plain text preview (first ~150 chars).
 */
export function stripMarkdownForPreview(text: string, maxLen = 150): string {
  if (!text) return "";
  let plain = text
    .replace(/<[^>]*>/g, "")
    .replace(/\[\[IMAGE_\d+\]\]/g, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length > maxLen) plain = plain.slice(0, maxLen) + "...";
  return plain;
}

/**
 * Strip markdown/HTML for SEO description (no tags, ~155 chars).
 */
export function stripForMetaDescription(text: string, maxLen = 155): string {
  if (!text) return "";
  return stripMarkdownForPreview(text, maxLen).replace(/\s+/g, " ").trim();
}
