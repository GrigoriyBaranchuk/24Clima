import type { ProductDetail } from "../../lib/api-client";
import { sortVariants, variantSku } from "../../lib/variants";
import { tiendaProductUrl, tiendaCategoryUrl, tiendaHomeUrl } from "../../lib/tienda-url";
import { markdownToPlainText } from "@/lib/markdown-plain-text";

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
 * schema.org Product (or ProductGroup + hasVariant when the product has presentations)
 * + Offer + BreadcrumbList (+ FAQPage when the product has FAQ).
 * Server component: renders inline <script type="application/ld+json">. All URLs use
 * tiendaUrl (as-needed locale scheme, /tienda prefix, trailing slash).
 */
export function ProductJsonLd({ product, locale, homeLabel }: Props) {
  const url = tiendaProductUrl(locale, product.slug);
  const images = (product.images ?? []).map((im) => im.url).filter(Boolean);
  // Catalog descriptions arrive as markdown; schema.org description is plain Text.
  const plainDescription = markdownToPlainText(
    product.description ?? product.short_description ?? "",
  );
  /**
   * One schema.org Offer for `price` at `offerUrl` — the base product, or one
   * variant. Only ever called with a real price, so availability is InStock.
   */
  function buildOffer(price: string, offerUrl: string): Record<string, unknown> {
    return {
      "@type": "Offer",
      price: String(price),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: offerUrl,
      seller: { "@type": "Organization", name: "24Clima" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PA",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          cutoffTime: "12:00:00-05:00",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PA",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        merchantReturnLink: "https://24clima.com/tienda/devoluciones/",
        returnFees: "https://schema.org/FreeReturn",
      },
      ...(product.warranty_months != null
        ? {
            warranty: {
              "@type": "WarrantyPromise",
              durationOfWarranty: {
                "@type": "QuantitativeValue",
                value: product.warranty_months,
                unitCode: "MON",
              },
            },
          }
        : {}),
    };
  }

  const variants = sortVariants(product.variants);
  const productLd: Record<string, unknown> = variants.length
    ? {
        // Google Search Central: do NOT use AggregateOffer for a set of variants —
        // a ProductGroup with hasVariant is the documented shape.
        "@context": "https://schema.org",
        "@type": "ProductGroup",
        name: product.name,
        url,
        productGroupID: product.sku,
        variesBy: ["https://schema.org/size"],
        ...(images.length ? { image: images } : {}),
        ...(plainDescription ? { description: plainDescription } : {}),
        ...(product.brand ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
        hasVariant: variants.map((v) => {
          const sku = variantSku(product.sku, v);
          const variantUrl = `${url}?variant=${v.id}`;
          return {
            "@type": "Product",
            name: `${product.name} — ${v.label_es}`,
            sku,
            mpn: sku,
            size: v.label_es,
            url: variantUrl,
            ...(images.length ? { image: images } : {}),
            offers: buildOffer(v.price, variantUrl),
          };
        }),
      }
    : {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.sku,
        mpn: product.sku,
        url,
        ...(images.length ? { image: images } : {}),
        ...(plainDescription ? { description: plainDescription } : {}),
        ...(product.brand ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
      };
  if (!variants.length && product.price != null) {
    productLd.offers = buildOffer(String(product.price), url);
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
            acceptedAnswer: { "@type": "Answer", text: markdownToPlainText(f.a) },
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
