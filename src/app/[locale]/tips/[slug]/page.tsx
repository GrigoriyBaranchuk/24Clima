import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParallaxImage from "@/components/ParallaxImage";
import ParallaxHero from "@/components/ParallaxHero";
import { supabase } from "@/lib/supabase";
import { normalizeSlug } from "@/lib/slug";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const safeSlug = normalizeSlug(decodeURIComponent(slug ?? ""));
  if (!supabase) return { title: "24clima" };
  let { data } = await supabase
    .from("articles")
    .select("title_ru, title_es, title_en")
    .eq("slug", safeSlug)
    .single();
  if (!data) {
    const fb = await supabase.from("articles").select("title_ru, title_es, title_en").eq("slug", `/${safeSlug}`).single();
    data = fb.data ?? null;
  }
  if (!data) return { title: "24clima" };
  const title =
    (locale === "es" && data.title_es) ||
    (locale === "en" && data.title_en) ||
    data.title_ru;
  return { title: `${title} | 24clima` };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const safeSlug = normalizeSlug(decodeURIComponent(slug ?? ""));
  if (!supabase) notFound();
  let { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", safeSlug)
    .single();
  if (error || !article) {
    const withSlash = `/${safeSlug}`;
    const fallback = await supabase.from("articles").select("*").eq("slug", withSlash).single();
    if (fallback.data) {
      article = fallback.data;
      error = null;
    }
  }
  if (error || !article) {
    const fallback = await supabase.from("articles").select("*").eq("slug", slug).single();
    if (fallback.data) {
      article = fallback.data;
      error = null;
    }
  }
  if (error || !article) notFound();

  const title =
    (locale === "es" && article.title_es) ||
    (locale === "en" && article.title_en) ||
    article.title_ru;
  const content =
    (locale === "es" && article.content_es) ||
    (locale === "en" && article.content_en) ||
    article.content_ru;
  const imageUrls = article.image_urls ?? [];

  const t = await getTranslations("tips");

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
            </div>
          </ParallaxHero>

          <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-12 lg:py-16 -mt-8 relative z-10">
            <div className="prose prose-lg prose-slate max-w-none article-content prose-headings:text-[#1e3a5f] prose-a:text-[#0F9D58] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
              {imageUrls.map((url: string, i: number) => (
                <ParallaxImage key={i} src={url} alt="" ratio={0.12} />
              ))}
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="text-gray-700"
              />
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
