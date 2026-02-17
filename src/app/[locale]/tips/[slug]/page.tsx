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
import {
  getLocalizedFields,
  resolveImageUrls,
  stripForMetaDescription,
  type ArticleRow,
} from "@/lib/articles";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const BASE = "https://24clima.com";

async function fetchArticle(slug: string): Promise<ArticleRow | null> {
  if (!supabase) return null;
  const safeSlug = normalizeSlug(decodeURIComponent(slug ?? ""));
  let result = await supabase.from("articles").select("*").eq("slug", safeSlug).single();
  if (result.error || !result.data) {
    result = await supabase
      .from("articles")
      .select("*")
      .eq("slug", `/${safeSlug}`)
      .single();
  }
  if (!result.data) {
    result = await supabase.from("articles").select("*").eq("slug", slug).single();
  }
  return result.data as ArticleRow | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticle(slug);
  if (!article) return { title: "24clima" };

  const { title, content } = getLocalizedFields(article, locale);
  const description = stripForMetaDescription(content);

  return {
    title: `${title} | 24clima`,
    description,
    openGraph: {
      title: `${title} | 24clima`,
      description,
      url: `${BASE}/${locale}/tips/${slug}/`,
      type: "article",
    },
    alternates: {
      canonical: `${BASE}/${locale}/tips/${slug}/`,
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

  const article = await fetchArticle(slug);
  if (!article) notFound();

  const { title, content } = getLocalizedFields(article, locale);
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
                href="/tips"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("backToList")}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {title}
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
            <ArticleRenderer content={content} imageUrls={imageUrls} className="text-gray-700" />
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
