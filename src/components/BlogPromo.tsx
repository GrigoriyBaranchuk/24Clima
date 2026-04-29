import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/supabase";
import { resolveImageUrls, stripMarkdownForPreview } from "@/lib/articles";
import { normalizeSlug } from "@/lib/slug";
import { BookOpen } from "lucide-react";

type BlogPromoProps = { locale: string };

export default async function BlogPromo({ locale }: BlogPromoProps) {
  const t = await getTranslations("tips");

  let articles: { slug: string; title: string; content: string; image_urls: string[] }[] = [];

  try {
    if (supabase) {
      const { data } = await supabase
        .from("articles")
        .select("slug, title_ru, title_es, title_en, content_ru, content_es, content_en, image_urls")
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) {
        const filtered =
          locale === "ru"
            ? data
            : data.filter((a) => {
                if (locale === "es") return (a.title_es || a.content_es) ?? false;
                if (locale === "en") return (a.title_en || a.content_en) ?? false;
                return true;
              });

        articles = filtered.slice(0, 3).map((a) => {
          const title =
            (locale === "es" && a.title_es) ||
            (locale === "en" && a.title_en) ||
            a.title_ru;
          const content =
            (locale === "es" && a.content_es) ||
            (locale === "en" && a.content_en) ||
            a.content_ru;
          return {
            slug: normalizeSlug(a.slug ?? ""),
            title: title ?? a.title_ru ?? "",
            content: stripMarkdownForPreview(content ?? a.content_ru ?? ""),
            image_urls: resolveImageUrls(a.image_urls),
          };
        });
      }
    }
  } catch {
    // Supabase not configured or error
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-8 lg:py-24 section-gradient" aria-labelledby="blog-promo-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-4 lg:mb-10">
          <BookOpen className="w-5 lg:w-8 h-5 lg:h-8 text-[#0F9D58]" aria-hidden />
          <h2 id="blog-promo-heading" className="text-xl lg:text-3xl font-semibold text-[#1e3a5f]" style={{ letterSpacing: "-0.2px" }}>
            {t("title")}
          </h2>
        </div>
        <p className="text-center text-[13px] lg:text-base text-gray-600 mb-6 lg:mb-12 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 lg:pb-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible max-w-5xl mx-auto" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/consejos-y-guias/${article.slug}`}
              scroll={false}
              className="group block bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden hover:shadow-xl hover:border-[#7BC043]/30 transition-all duration-300 min-w-[75vw] lg:min-w-0 snap-center"
            >
              {article.image_urls[0] ? (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={article.image_urls[0]}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#1e3a5f]/10 to-[#0F9D58]/10 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-[#0F9D58]/50" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-[#1e3a5f] line-clamp-2 mb-2 group-hover:text-[#0F9D58] transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {article.content}
                </p>
                <span className="inline-block mt-3 text-[#0F9D58] font-medium text-sm">
                  {t("readMore")} →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/consejos-y-guias"
            scroll={false}
            className="inline-flex items-center justify-center rounded-xl bg-[#1e3a5f] text-white px-6 py-3 font-medium hover:bg-[#0d2240] transition-colors"
          >
            {t("title")}
          </Link>
        </div>
      </div>
    </section>
  );
}
