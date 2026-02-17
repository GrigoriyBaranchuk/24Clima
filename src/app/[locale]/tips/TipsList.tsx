"use client";

import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
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
      <p className="text-center text-gray-500 py-12">{t("noArticles")}</p>
    );
  }

  return (
    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {articles.map((article) => (
        <Link key={article.id} href={`/tips/${article.slug}/`}>
          <Card className="card-hover border-0 shadow-lg overflow-hidden h-full">
            {article.image_urls[0] && (
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={article.image_urls[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-4">
              <h2 className="font-semibold text-[#1e3a5f] mb-2 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-gray-600 text-base line-clamp-3">
                {article.content.replace(/<[^>]*>/g, "").slice(0, 150)}...
              </p>
              <span className="text-[#7BC043] text-sm font-medium mt-2 inline-block">
                {t("readMore")} →
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
