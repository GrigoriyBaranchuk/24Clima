"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Truck, ShieldCheck } from "lucide-react";
import { LocalizedTiendaLink } from "../LocalizedTiendaLink";
import { ReviewForm } from "./ReviewForm";
import type { ProductDetail } from "../../lib/api-client";
import { WhatsAppCta } from "@24clima/design/components";

type Props = {
  product: ProductDetail;
  addToCartLabel: string;
  askWhatsAppLabel: string;
  descriptionLabel: string;
  specsTitle: string;
  faqTitle: string;
  deliveryLabel: string;
  deliveryRegionLabel: string;
  warrantyLabel?: string;
  professionalLabel: string;
  whatsappNumber: string;
  whatsappOrderText: string;
  reviewsTitle: string;
  reviewOutOfLabel: string;
  reviewCountLabel: string;
  locale: string;
};

/** Five stars, `filled` of them in brand green (no second accent colour — see DESIGN.md). */
function Stars({ filled }: { filled: number }) {
  const n = Math.max(0, Math.min(5, Math.round(filled)));
  return (
    <span className="inline-flex" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < n ? "fill-primary text-primary" : "fill-none text-muted-foreground/40"}`}
        />
      ))}
    </span>
  );
}

export function ProductPageContent(props: Props) {
  const {
    product,
    addToCartLabel,
    askWhatsAppLabel,
    descriptionLabel,
    specsTitle,
    faqTitle,
    deliveryLabel,
    deliveryRegionLabel,
    warrantyLabel,
    professionalLabel,
    whatsappNumber,
    whatsappOrderText,
    reviewsTitle,
    reviewOutOfLabel,
    reviewCountLabel,
    locale,
  } = props;
  const images = product.images?.length ? product.images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex];
  const faq = product.faq?.filter((f) => f.q && f.a) ?? [];
  // Reviews render ONLY when the backend supplies them — never a default/fake rating.
  const reviews = (product.reviews ?? []).filter((r) => r.author && r.rating);
  const ratingAvg = product.rating_avg;
  const showReviews = reviews.length > 0 && ratingAvg != null;
  const dateFmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" });
  const formatReviewDate = (d: string | null): string | null => {
    if (!d) return null;
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? null : dateFmt.format(parsed);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt ?? product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">—</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((im, idx) => (
                <button
                  key={im.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedIndex === idx ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  <Image src={im.url} alt={im.alt ?? ""} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">{product.sku}</p>
            {product.is_b2b_only && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                {professionalLabel}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-foreground">{product.name}</h1>
          {product.price != null && (
            <p className="mt-4 text-2xl font-semibold text-primary">${product.price}</p>
          )}
          {product.short_description && (
            <p className="mt-4 text-muted-foreground">{product.short_description}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <LocalizedTiendaLink
              href={{ pathname: "/cart", query: { add: product.id } }}
              className="inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              {addToCartLabel}
            </LocalizedTiendaLink>
            <WhatsAppCta
              href={"https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappOrderText)}
              size="lg"
            >
              {askWhatsAppLabel}
            </WhatsAppCta>
          </div>
          <div className="mt-6 space-y-3 rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="text-sm">
                <p className="text-foreground">{deliveryLabel}</p>
                <p className="mt-1 text-muted-foreground">{deliveryRegionLabel}</p>
              </div>
            </div>
            {warrantyLabel && (
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm text-foreground">{warrantyLabel}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {product.attributes.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">{specsTitle}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full max-w-2xl border-collapse text-sm">
              <tbody>
                {product.attributes.map((a) => (
                  <tr key={a.attribute_code} className="border-b border-border">
                    <th
                      scope="row"
                      className="py-2 pr-4 text-left font-medium text-muted-foreground align-top"
                    >
                      {a.attribute_name}
                    </th>
                    <td className="py-2 text-foreground">
                      {a.value}
                      {a.unit ? ` ${a.unit}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {product.description && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">{descriptionLabel}</h2>
          <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{product.description}</p>
        </section>
      )}

      {faq.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">{faqTitle}</h2>
          <div className="mt-4 space-y-2">
            {faq.map((f, i) => (
              <details
                key={i}
                className="rounded-lg border border-border bg-card px-4 py-3"
              >
                <summary className="cursor-pointer font-medium text-foreground">{f.q}</summary>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {showReviews && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">{reviewsTitle}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Stars filled={ratingAvg} />
            <span className="text-lg font-semibold text-foreground">{reviewOutOfLabel}</span>
            <span className="text-sm text-muted-foreground">{reviewCountLabel}</span>
          </div>
          <ul className="mt-6 space-y-4">
            {reviews.map((r, i) => {
              const when = formatReviewDate(r.date);
              return (
                <li key={i} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Stars filled={r.rating} />
                      <span className="font-medium text-foreground">{r.author}</span>
                    </div>
                    {when && (
                      <time dateTime={r.date ?? undefined} className="text-xs text-muted-foreground">
                        {when}
                      </time>
                    )}
                  </div>
                  {r.text && (
                    <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{r.text}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Always visible — anyone can leave a review (published only after moderation). */}
      <ReviewForm slug={product.slug} locale={locale} />
    </div>
  );
}
