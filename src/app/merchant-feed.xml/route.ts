/**
 * Google Merchant Center product feed — GET /merchant-feed.xml (no locale prefix).
 *
 * RSS 2.0 with the g: namespace, per the Google Shopping product data
 * specification (https://support.google.com/merchants/answer/7052112). Feeds the
 * Spanish (es) catalog of the shop-api backend served under 24clima.com/tienda.
 *
 * Data source: the shop-api sitemap endpoint (all active slugs, including B2B) →
 * per-product detail. Only products with a price are emitted. B2B-only products
 * ARE included — they are sold from the /profesional storefront.
 *
 * Caching: getSitemap()/getProductCached() use fetch `next.revalidate: 3600`, and
 * `export const revalidate = 3600` caches the rendered feed, so the route
 * refreshes at most hourly and never hammers the API per request.
 *
 * Availability: mirrors the JSON-LD logic (ProductJsonLd) — a price means in stock.
 *
 * Outage handling: if the catalog API is unreachable we answer 503 rather than a
 * valid-but-empty feed, so Google never mistakes "0 products" for the truth.
 */

import { api } from "@/features/tienda/lib/api-client";
import type { ProductDetail } from "@/features/tienda/lib/api-client";
import { tiendaProductUrl } from "@/features/tienda/lib/tienda-url";

export const runtime = "nodejs";
export const revalidate = 3600;

const FEED_LOCALE = "es";
const MAX_ADDITIONAL_IMAGES = 10;
const MAX_DESCRIPTION = 5000;

/** Escape the five XML-significant characters so values can't break the markup. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Plain-text description for the feed: strip HTML tags and the markdown emphasis
 * markers the catalog stores (**bold**, *italic*, leading #), collapse
 * whitespace, and cap length. Google rejects HTML in g:description.
 */
function toPlainText(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`]+/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_DESCRIPTION);
}

/** Ordered image URLs for a product: images[] sorted by sort_order, else image_url. */
function productImages(product: ProductDetail): string[] {
  const fromImages = (product.images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((im) => im.url)
    .filter((u): u is string => Boolean(u));
  if (fromImages.length) return fromImages;
  return product.image_url ? [product.image_url] : [];
}

function tag(name: string, value: string): string {
  return `<${name}>${escapeXml(value)}</${name}>`;
}

function buildItem(product: ProductDetail): string {
  const link = tiendaProductUrl(FEED_LOCALE, product.slug);
  const price = `${Number(product.price).toFixed(2)} USD`;
  const rawDescription = product.description ?? product.short_description ?? "";
  const description = toPlainText(rawDescription);
  const images = productImages(product);
  const [mainImage, ...restImages] = images;
  const additionalImages = restImages.slice(0, MAX_ADDITIONAL_IMAGES);

  const parts: string[] = [
    tag("g:id", product.sku),
    tag("g:title", product.name),
  ];
  if (description) parts.push(tag("g:description", description));
  parts.push(tag("g:link", link));
  if (mainImage) parts.push(tag("g:image_link", mainImage));
  for (const img of additionalImages) parts.push(tag("g:additional_image_link", img));
  parts.push(tag("g:price", price));
  parts.push(tag("g:availability", "in_stock"));
  parts.push(tag("g:condition", "new"));
  if (product.brand?.name) parts.push(tag("g:brand", product.brand.name));
  parts.push(tag("g:mpn", product.sku));
  parts.push(
    "<g:shipping>" +
      tag("g:country", "PA") +
      tag("g:service", "Entrega el mismo día (Ciudad de Panamá)") +
      tag("g:price", "0 USD") +
      "</g:shipping>"
  );

  return `    <item>\n${parts.map((p) => `      ${p}`).join("\n")}\n    </item>`;
}

function buildFeed(items: string[]): string {
  const channelMeta = [
    tag("title", "24Clima"),
    tag("link", "https://24clima.com/tienda"),
    tag(
      "description",
      "Aire acondicionado, refrigeración y herramientas HVAC/R con entrega en Panamá."
    ),
  ]
    .map((p) => `    ${p}`)
    .join("\n");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n' +
    "  <channel>\n" +
    channelMeta +
    "\n" +
    items.join("\n") +
    "\n  </channel>\n" +
    "</rss>\n"
  );
}

export async function GET(): Promise<Response> {
  let details: ProductDetail[];
  try {
    const sitemap = await api.getSitemap();
    // Fetch each product; tolerate a stray per-product failure (e.g. one 404),
    // but treat a total wipe-out as an outage below.
    const settled = await Promise.allSettled(
      sitemap.map((s) => api.getProductCached(s.slug, FEED_LOCALE))
    );
    details = settled
      .filter(
        (r): r is PromiseFulfilledResult<ProductDetail> => r.status === "fulfilled"
      )
      .map((r) => r.value);
    // Sitemap listed products but not a single detail resolved → backend outage.
    if (sitemap.length > 0 && details.length === 0) {
      throw new Error("all product detail fetches failed");
    }
  } catch (e) {
    console.error("[merchant-feed] catalog API unavailable:", e);
    return new Response("Service Unavailable", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const items = details
    .filter((p) => p.price != null)
    .map((p) => buildItem(p));

  // Never publish an empty feed: an empty result almost certainly means a data
  // problem, and Google would treat "0 products" as authoritative.
  if (items.length === 0) {
    console.error("[merchant-feed] no priced products to emit — refusing empty feed");
    return new Response("Service Unavailable", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(buildFeed(items), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
