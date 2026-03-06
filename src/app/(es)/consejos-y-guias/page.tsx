import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import ParallaxHero from "@/components/ParallaxHero";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/lib/supabase";
import { resolveImageUrls, stripMarkdownForPreview } from "@/lib/articles";
import { normalizeSlug } from "@/lib/slug";
import { Link } from "@/i18n/routing";
import TipsList from "../../[locale]/consejos-y-guias/TipsList";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations({ locale: "es", namespace: "tips" });
  return {
    title: `${t("title")} | 24clima`,
    description: t("subtitle"),
    alternates: {
      canonical: "https://24clima.com/consejos-y-guias/",
      languages: {
        "x-default": "https://24clima.com/consejos-y-guias/",
        es: "https://24clima.com/consejos-y-guias/",
        en: "https://24clima.com/en/consejos-y-guias/",
        ru: "https://24clima.com/ru/consejos-y-guias/",
      },
    },
  };
}

export default async function TipsPage() {
  setRequestLocale("es");

  let articles: { id: string; slug: string; title: string; content: string; image_urls: string[] }[] = [];

  try {
    const { data } = supabase
      ? await supabase
          .from("articles")
          .select("id, slug, title_ru, title_es, title_en, content_ru, content_es, content_en, image_urls")
          .order("created_at", { ascending: false })
      : { data: null };

    if (data) {
      const filtered = data.filter((a) => (a.title_es || a.content_es) ?? false);
      articles = filtered.map((a) => ({
        id: a.id,
        slug: normalizeSlug(a.slug ?? ""),
        title: a.title_es ?? a.title_ru ?? "",
        content: stripMarkdownForPreview(a.content_es ?? a.content_ru ?? ""),
        image_urls: resolveImageUrls(a.image_urls),
      }));
    }
  } catch {
    // Supabase not configured or error
  }

  const t = await getTranslations("tips");

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <ParallaxHero>
          <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center sm:text-left mb-4">
                  {t("title")}
                </h1>
                <p className="text-lg text-white/80 text-center sm:text-left max-w-2xl">
                  {t("subtitle")}
                </p>
              </div>
              <Link
                href="/consejos-y-guias/admin"
                scroll={false}
                className="shrink-0 text-center px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-base font-medium transition-colors border border-white/30"
              >
                {t("adminLink")}
              </Link>
            </div>
          </div>
        </ParallaxHero>

        <section className="py-16 lg:py-24 section-gradient-parallax -mt-8 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <TipsList articles={articles} locale="es" />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
