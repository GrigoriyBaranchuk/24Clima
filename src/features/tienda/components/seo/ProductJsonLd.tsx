import type { ProductDetail } from "../../lib/api-client";
import { tiendaProductUrl, tiendaCategoryUrl, tiendaHomeUrl } from "../../lib/tienda-url";

type Props = {
  product: ProductDetail;
  locale: string;
  /** Localized breadcrumb label for the home node (e.g. "Inicio"). */
  homeLabel: string;
};

/** Serialize JSON-LD, neutralizing any "</script" sequence so the inline script can't be broken out of. */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * schema.org Product + Offer + BreadcrumbList (+ FAQPage when the product has FAQ).
 * Server component: renders inline <script type="application/ld+json">. All URLs use
 * tiendaUrl (as-needed locale scheme, /tienda prefix, trailing slash).
 */
export function ProductJsonLd({ product, locale, homeLabel }: Props) {
  const url = tiendaProductUrl(locale, product.slug);
  const images = (product.images ?? []).map((im) => im.url).filter(Boolean);
  const availability =
    product.price != null
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    url,
    ...(images.length ? { image: images } : {}),
    ...(product.description || product.short_description
      ? { description: product.description ?? product.short_description }
      : {}),
    ...(product.brand
      ? { brand: { "@type": "Brand", name: product.brand.name } }
      : {}),
  };
  if (product.price != null) {
    productLd.offers = {
      "@type": "Offer",
      price: String(product.price),
      priceCurrency: "USD",
      availability,
      url,
      seller: { "@type": "Organization", name: "24Clima" },
    };
  }

  // Ratings/reviews: emit ONLY when the backend actually reports reviews. Never
  // synthesize a default rating (see git d12f1a6: self-serving aggregateRating).
  const ratingCount = product.rating_count ?? 0;
  const ratingAvg = product.rating_avg;
  if (ratingCount > 0 && ratingAvg != null) {
    productLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingAvg,
      reviewCount: ratingCount,
      bestRating: "5",
      worstRating: "1",
    };
    const reviews = product.reviews ?? [];
    if (reviews.length > 0) {
      productLd.review = reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: "5",
          worstRating: "1",
        },
        ...(r.text ? { reviewBody: r.text } : {}),
        ...(r.date ? { datePublished: r.date } : {}),
      }));
    }
  }

  const breadcrumbItems: { name: string; item: string }[] = [
    { name: homeLabel, item: tiendaHomeUrl(locale) },
  ];
  if (product.category) {
    breadcrumbItems.push({
      name: product.category.name,
      item: tiendaCategoryUrl(locale, product.category.slug),
    });
  }
  breadcrumbItems.push({ name: product.name, item: url });

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.item,
    })),
  };

  const faq = product.faq?.filter((f) => f.q && f.a) ?? [];
  const faqLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(faqLd) }}
        />
      )}
    </>
  );
}
