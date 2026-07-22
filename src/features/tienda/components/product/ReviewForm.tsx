"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { api } from "../../lib/api-client";

type Props = {
  slug: string;
  locale: string;
};

const MAX_TEXT = 2000;

/**
 * "Leave a review" form. Always visible on the product page (unlike the reviews
 * list, which renders only when reviews exist). Reviews are published ONLY after
 * owner moderation, so on success we say so honestly instead of showing the review.
 */
export function ReviewForm({ slug, locale }: Props) {
  const t = useTranslations("tienda.product");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — humans leave empty
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim().length > 0 && rating > 0 && !submitting;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.submitReview(slug, {
        author_name: name.trim(),
        rating,
        text: text.trim() ? text.trim() : null,
        locale,
        website,
      });
      setDone(true);
    } catch {
      setError(t("reviewFormError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-foreground">{t("reviewFormTitle")}</h2>
      {done ? (
        <p className="mt-4 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          {t("reviewFormSuccess")}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 max-w-xl space-y-5">
          {error && (
            <p className="rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
          )}
          <div>
            <label htmlFor="review-name" className="block text-sm font-medium text-foreground">
              {t("reviewFormName")} *
            </label>
            <input
              id="review-name"
              name="review-name"
              type="text"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-foreground">{t("reviewFormRating")} *</span>
            <div className="mt-1 inline-flex" role="radiogroup" aria-label={t("reviewFormRating")}>
              {[1, 2, 3, 4, 5].map((v) => {
                const active = (hover || rating) >= v;
                return (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={rating === v}
                    aria-label={String(v)}
                    onClick={() => setRating(v)}
                    onMouseEnter={() => setHover(v)}
                    onMouseLeave={() => setHover(0)}
                    className="p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        active ? "fill-primary text-primary" : "fill-none text-muted-foreground/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label htmlFor="review-text" className="block text-sm font-medium text-foreground">
              {t("reviewFormText")}
            </label>
            <textarea
              id="review-text"
              name="review-text"
              rows={4}
              maxLength={MAX_TEXT}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
            />
          </div>
          {/* Honeypot: hidden from humans, catches bots. */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
            <label htmlFor="review-website">Website</label>
            <input
              id="review-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg border border-border bg-card px-6 py-2.5 font-medium text-foreground hover:bg-muted disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {submitting ? t("reviewFormSubmitting") : t("reviewFormSubmit")}
          </button>
        </form>
      )}
    </section>
  );
}
