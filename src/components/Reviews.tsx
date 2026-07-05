import RevealOnDesktop from "@/components/RevealOnDesktop";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Reviews() {
  const t = await getTranslations("reviews");

  let reviews: {
    id: string;
    author_name: string;
    author_photo_url: string | null;
    text: string;
    rating: number;
    time: string;
  }[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("reviews")
      .select("id, author_name, author_photo_url, text, rating, time")
      .order("time", { ascending: false })
      .limit(12);
    if (data) reviews = data;
  }

  if (reviews.length === 0) return null;

  // JSON-LD с aggregateRating/review здесь не размещаем: рейтинг о самих себе
  // (self-serving review) не даёт rich results и конфликтует с @id #organization
  return (
    <section
      className="py-16 lg:py-24 section-gradient"
      aria-labelledby="reviews-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <h2
          id="reviews-heading"
          className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] text-center mb-12"
        >
          {t("title")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((r, index) => (
            <RevealOnDesktop
              key={r.id}
              animation="fade-up"
              delay={(index % 3) * 80}
              className="h-full"
            >
              <article className="h-full bg-white rounded-2xl border border-gray-200 shadow-md p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  {r.author_photo_url ? (
                    <img
                      src={r.author_photo_url}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#7BC043]/20 flex items-center justify-center text-[#1e3a5f] font-semibold">
                      {(r.author_name || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#1e3a5f]">
                      {r.author_name}
                    </p>
                    <div
                      className="flex gap-0.5"
                      aria-label={`${r.rating} de 5 estrellas`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${r.rating >= star ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-4">
                  {r.text}
                </p>
              </article>
            </RevealOnDesktop>
          ))}
        </div>
      </div>
    </section>
  );
}
