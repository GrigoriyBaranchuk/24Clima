"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type Article = {
  id: string;
  slug: string;
  title: string;
  content: string;
  image_urls: string[];
};

export default function TipsList({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const t = useTranslations("tips");

  if (articles.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12 font-serif">{t("noArticles")}</p>
    );
  }

  return (
    <div className="tips-newspaper w-full max-w-6xl mx-auto px-0">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/consejos-y-guias/${article.slug}/`}
          className="block tips-preview-bg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 hover:border-[#7BC043]/30"
        >
          {article.image_urls[0] && (
            <div className="aspect-video relative overflow-hidden">
              <img
                src={article.image_urls[0]}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
          <div className="p-6 lg:p-8 font-serif">
            <h2 className="font-semibold text-lg lg:text-xl text-[#e8f0f8] mb-3 line-clamp-2 leading-snug">
              {article.title}
            </h2>
            <p className="text-[#c8d6e3] text-base leading-relaxed line-clamp-3 mb-4">
              {article.content}
            </p>
            <span className="text-[#7BC043] font-medium text-base">
              {t("readMore")} →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
