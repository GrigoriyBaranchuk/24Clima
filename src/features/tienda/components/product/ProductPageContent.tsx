"use client";

import { useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { LocalizedTiendaLink } from "../LocalizedTiendaLink";
import { ReviewForm } from "./ReviewForm";
import type { ProductDetail } from "../../lib/api-client";
import { pickDefaultVariant, sortVariants, variantSku } from "../../lib/variants";
import { WhatsAppCta } from "@24clima/design/components";

/* Catalog descriptions/FAQ arrive as markdown. Headings are demoted to h3 so the
   section's own h2 stays the only h2; review texts stay plain (user-generated). */
const MARKDOWN_HEADINGS = { h1: "h3", h2: "h3" } as const;
const PROSE_COLORS =
  "prose prose-sm max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary";

function ProductMarkdown({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`${PROSE_COLORS} ${className ?? ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_HEADINGS}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

type Props = {
  product: ProductDetail;
  addToCartLabel: string;
  askWhatsAppLabel: string;
  descriptionLabel: string;
  specsTitle: string;
  faqTitle: string;
  deliveryLabel: string;
  deliveryRegionLabel: string;
  returnsLabel: string;
  warrantyLabel?: string;
  professionalLabel: string;
  whatsappNumber: string;
  whatsappOrderText: string;
  /** Label of the presentation picker ("Presentación"). */
  variantsLabel: string;
  /** Per-variant WhatsApp text, keyed by variant id (server-rendered, localized). */
  whatsappOrderTextByVariant?: Record<string, string>;
  /** Deep link `?variant=<id>`: which presentation the page opens on. */
  initialVariantId?: string | null;
  /** Canonical product URL — the WhatsApp text carries it with `?variant=` appended. */
  productUrl: string;
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
    returnsLabel,
    warrantyLabel,
    professionalLabel,
    whatsappNumber,
    whatsappOrderText,
    variantsLabel,
    whatsappOrderTextByVariant,
    initialVariantId,
    productUrl,
    reviewsTitle,
    reviewOutOfLabel,
    reviewCountLabel,
    locale,
  } = props;
  const images = product.images?.length ? product.images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Presentations (variants). A product without them renders exactly as before.
  const variants = sortVariants(product.variants);
  const fallbackVariant = pickDefaultVariant(variants);
  const [variantId, setVariantId] = useState<string | null>(
    (initialVariantId && variants.some((v) => v.id === initialVariantId)
      ? initialVariantId
      : fallbackVariant?.id) ?? null
  );
  const selectedVariant = variants.find((v) => v.id === variantId) ?? fallbackVariant;

  /** Switch presentation and mirror it into the URL — no navigation, shareable link. */
  function selectVariant(id: string) {
    setVariantId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", id);
    window.history.replaceState(null, "", url.toString());
  }

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displaySku = selectedVariant ? variantSku(product.sku, selectedVariant) : product.sku;
  // The message names the presentation and links to the deep link that opens on it,
  // so the owner sees on WhatsApp exactly what the customer was looking at.
  const whatsappText = selectedVariant
    ? `${whatsappOrderTextByVariant?.[selectedVariant.id] ?? whatsappOrderText}\n${productUrl}?variant=${selectedVariant.id}`
    : whatsappOrderText;
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
            <p className="text-sm text-muted-foreground">{displaySku}</p>
            {product.is_b2b_only && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                {professionalLabel}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-foreground">{product.name}</h1>
          {variants.length > 0 && (
            <div className="mt-4">
              <p id="variant-label" className="text-sm font-medium text-foreground">
                {variantsLabel}
              </p>
              <div
                role="radiogroup"
                aria-labelledby="variant-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {variants.map((v) => {
                  const active = v.id === selectedVariant?.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => selectVariant(v.id)}
                      className={`min-h-[44px] rounded-lg border px-4 py-2 text-sm transition-colors ${
                        active
                          ? "border-primary bg-primary/10 font-medium text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {v.label_es} · ${v.price}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {displayPrice != null && (
            <p className="mt-4 text-2xl font-semibold text-primary">${displayPrice}</p>
          )}
          {product.short_description && (
            <p className="mt-4 text-muted-foreground">{product.short_description}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <LocalizedTiendaLink
              href={{
                pathname: "/cart",
                query: {
                  add: product.id,
                  ...(selectedVariant ? { variant: selectedVariant.id } : {}),
                },
              }}
              className="inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              {addToCartLabel}
            </LocalizedTiendaLink>
            <WhatsAppCta
              href={"https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(whatsappText)}
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
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <LocalizedTiendaLink
                href="/devoluciones"
                className="text-sm text-foreground underline-offset-2 hover:underline hover:text-primary"
              >
                {returnsLabel}
              </LocalizedTiendaLink>
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
          <ProductMarkdown text={product.description} className="mt-4" />
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
                <ProductMarkdown text={f.a} className="mt-2 prose-p:my-1 prose-ul:my-2 prose-ol:my-2" />
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
