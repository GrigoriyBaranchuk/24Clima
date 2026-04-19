import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ArticleHero from "@/components/ArticleHero";
import ArticleRenderer from "@/components/ArticleRenderer";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { supabase } from "@/lib/supabase";
import {
  normalizeSlug,
} from "@/lib/slug";
import { resolveImageUrls, stripForMetaDescription } from "@/lib/articles";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import AuthorBio from "@/components/AuthorBio";
import { EXPERT } from "@/lib/author-data";
import { BUSINESS_DATA } from "@/lib/business-data";
import { buildBreadcrumbJsonLd, localePath, getLabels } from "@/lib/breadcrumb-helper";
import Breadcrumbs from "@/components/Breadcrumbs";

type SupportedLocale = "es" | "en" | "ru";
function toSupportedLocale(locale: string): SupportedLocale {
  return locale === "en" || locale === "ru" ? locale : "es";
}

export const dynamic = "force-dynamic";

const BASE = "https://24clima.com";

function getLocalePath(locale: string, path: string): string {
  const prefix = locale === "es" ? "" : `/${locale}`;
  return `${BASE}${prefix}${path}`;
}

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

  const trySlugs = [safeSlug, `/${safeSlug}`, slug];
  for (const s of trySlugs) {
    const { data, error } = await supabase
      .from("articles")
      .select("slug, title_ru, title_es, title_en, content_ru, content_es, content_en, image_urls, created_at")
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

const DEFAULT_OG_IMAGE = "https://24clima.com/uploads/page1-opt.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticleForLocale(slug, locale);
  if (!article) return { title: "24clima" };

  const description = stripForMetaDescription(article.content);
  const canonicalUrl = getLocalePath(locale, `/consejos-y-guias/${slug}/`);
  const imageUrls = resolveImageUrls(article.image_urls);
  const ogImage = imageUrls[0] || DEFAULT_OG_IMAGE;

  return {
    title: `${article.title} | 24clima`,
    description,
    openGraph: {
      title: `${article.title} | 24clima`,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: article.created_at || undefined,
      images: [{ url: ogImage, width: 712, height: 500, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | 24clima`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
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
  const canonicalUrl = getLocalePath(locale, `/consejos-y-guias/${slug}/`);
  const ogImage = imageUrls[0] || "https://24clima.com/uploads/page1-opt.webp";

  const supportedLocale = toSupportedLocale(locale);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: stripForMetaDescription(article.content),
    image: imageUrls.length ? imageUrls : [ogImage],
    datePublished: article.created_at || undefined,
    dateModified: article.created_at || undefined,
    author: {
      "@type": "Person",
      "@id": EXPERT.id,
      name: EXPERT.name,
      jobTitle: EXPERT.jobTitle[supportedLocale],
      image: `${BASE}${EXPERT.image}`,
      worksFor: {
        "@id": BUSINESS_DATA.organizationId,
        "@type": "HVACBusiness",
        name: BUSINESS_DATA.name,
        url: BUSINESS_DATA.url,
      },
      sameAs: EXPERT.sameAs,
    },
    reviewedBy: {
      "@type": "Person",
      "@id": EXPERT.id,
      name: EXPERT.name,
    },
    publisher: {
      "@id": BUSINESS_DATA.organizationId,
      "@type": "HVACBusiness",
      name: BUSINESS_DATA.name,
      url: BUSINESS_DATA.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    url: canonicalUrl,
  };

  const labels = getLabels(locale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: labels.home, url: localePath(locale, "/") },
    { name: labels.blog, url: localePath(locale, "/consejos-y-guias/") },
    { name: article.title, url: canonicalUrl },
  ]);

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ReadingProgressBar />
      <Header />
      <main id="main-content" className="article-reading-bg min-h-screen pt-24">
        <article>
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <Breadcrumbs
              segments={[
                { label: labels.blog, href: "/consejos-y-guias" },
                { label: article.title },
              ]}
              variant="light"
            />
          </div>
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-12 lg:py-16 -mt-4">
            <ArticleHero>
              <div className="p-8 lg:p-12">
                <Link
                  href="/consejos-y-guias"
                  scroll={false}
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
            </ArticleHero>
          </div>

          <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-8 lg:py-12 -mt-12 relative z-10">
            <ArticleRenderer content={article.content} imageUrls={imageUrls} stacked />
          </div>

          <div className="container mx-auto px-4 lg:px-8 max-w-3xl pb-12 lg:pb-16">
            <AuthorBio locale={supportedLocale} includeJsonLd={false} />
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
