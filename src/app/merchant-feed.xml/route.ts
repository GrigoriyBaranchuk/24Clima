/**
 * Google Merchant Center product feed — GET /merchant-feed.xml (no locale prefix).
 *
 * RSS 2.0 with the g: namespace, per the Google Shopping product data
 * specification (https://support.google.com/merchants/answer/7052112). Feeds the
 * Spanish (es) catalog of the shop-api backend served under 24clima.com/tienda.
 *
 * Data source: the shop-api sitemap endpoint (all active slugs, including B2B) →
 * per-product detail. B2B-only products ARE included — they are sold from the
 * /profesional storefront. What a product turns into (one row, or one row per
 * variant; human vs. AI-declared text; which images qualify) lives in
 * features/tienda/lib/merchant-feed.ts, which is pure and unit-checked.
 *
 * Caching: getSitemap()/getProductCached() use fetch `next.revalidate: 3600`, and
 * the Cache-Control header below (s-maxage=3600) caches the rendered feed at the
 * CDN, so the route refreshes at most hourly and never hammers the API per
 * request. `revalidate = 0` keeps the route OUT of build-time prerender: with
 * route-level ISR the build had to pull the whole catalog from the shop backend
 * and died on its cold starts (60s static-export budget, deploys failed).
 *
 * Availability: mirrors the JSON-LD logic (ProductJsonLd) — a price means in stock.
 *
 * Outage handling: if the catalog API is unreachable we answer 503 rather than a
 * valid-but-empty feed, so Google never mistakes "0 products" for the truth.
 */

import { api } from "@/features/tienda/lib/api-client";
import type { ProductDetail } from "@/features/tienda/lib/api-client";
import { buildFeed, buildFeedItems, FEED_LOCALE } from "@/features/tienda/lib/merchant-feed";

export const runtime = "nodejs";
export const revalidate = 0;

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

  const items = details.flatMap((p) => buildFeedItems(p));

  // Never publish an empty feed: an empty result almost certainly means a data
  // problem, and Google would treat "0 products" as authoritative.
  if (items.length === 0) {
    console.error("[merchant-feed] no submittable products — refusing empty feed");
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
