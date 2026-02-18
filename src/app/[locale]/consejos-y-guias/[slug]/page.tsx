import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParallaxHero from "@/components/ParallaxHero";
import ArticleRenderer from "@/components/ArticleRenderer";
import { supabase } from "@/lib/supabase";
import {
  normalizeSlug,
} from "@/lib/slug";
import { resolveImageUrls, stripForMetaDescription } from "@/lib/articles";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const BASE = "https://24clima.com";

type ArticleForLocale = {
  slug: string;
  title: string;
  content: string;
  image_urls: string[] | null;
  created_at: string;
};

async function fetchArticleForLocale(
  slug: string,
  locale: string
): Promise<ArticleForLocale | null> {
  if (!supabase) return null;
  const safeSlug = normalizeSlug(decodeURIComponent(slug ?? ""));

  const cols =
    locale === "es"
      ? "slug, title_es, content_es, title_ru, content_ru, image_urls, created_at"
      : locale === "en"
        ? "slug, title_en, content_en, title_ru, content_ru, image_urls, created_at"
        : "slug, title_ru, content_ru, image_urls, created_at";

  const trySlugs = [safeSlug, `/${safeSlug}`, slug];
  for (const s of trySlugs) {
    const { data, error } = await supabase
      .from("articles")
      .select(cols)
      .eq("slug", s)
      .single();
    if (!error && data) {
      const title =
        (locale === "es" && data.title_es) ||
        (locale === "en" && data.title_en) ||
        data.title_ru;
      const content =
        (locale === "es" && data.content_es) ||
        (locale === "en" && data.content_en) ||
        data.content_ru;
      if (!title || !content) return null;
      return {
        slug: data.slug ?? "",
        title: title ?? "",
        content: content ?? "",
        image_urls: data.image_urls ?? null,
        created_at: data.created_at ?? "",
      };
    }
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticleForLocale(slug, locale);
  if (!article) return { title: "24clima" };

  const description = stripForMetaDescription(article.content);

  return {
    title: `${article.title} | 24clima`,
    description,
    openGraph: {
      title: `${article.title} | 24clima`,
      description,
      url: `${BASE}/${locale}/consejos-y-guias/${slug}/`,
      type: "article",
    },
    alternates: {
      canonical: `${BASE}/${locale}/consejos-y-guias/${slug}/`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await fetchArticleForLocale(slug, locale);
  if (!article) notFound();

  const imageUrls = resolveImageUrls(article.image_urls);

  const t = await getTranslations("tips");
  const created = article.created_at
    ? new Date(article.created_at).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <article>
          <ParallaxHero>
            <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-16 lg:py-24">
              <Link
                href="/consejos-y-guias"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("backToList")}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {article.title}
              </h1>
              {created && (
                <time
                  dateTime={article.created_at}
                  className="block mt-4 text-white/70 text-sm"
                >
                  {created}
                </time>
              )}
            </div>
          </ParallaxHero>

          <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-12 lg:py-16 -mt-8 relative z-10">
            <ArticleRenderer content={article.content} imageUrls={imageUrls} className="text-gray-700" />
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
