/**
 * Google Merchant Center feed — the pure part: product → RSS `<item>` strings.
 *
 * Kept out of the route handler so it can be exercised without a server (see
 * scripts/check-tienda.ts). The route only fetches the catalog and wraps these
 * items in the channel envelope.
 *
 * Three rules the shape of a row depends on:
 *
 * 1. Variants. A product with presentations is submitted as ONE ROW PER VARIANT,
 *    tied together by `g:item_group_id` (= the base SKU). Google needs each
 *    buyable price/SKU as its own offer; a single row with the cheapest price is
 *    a price mismatch as soon as the shopper picks another size.
 * 2. Authorship. Text written by the listing bot must be declared as
 *    machine-generated: `g:structured_title` / `g:structured_description` with
 *    `digital_source_type = trained_algorithmic_media`, and then `g:title` /
 *    `g:description` must NOT be sent (sending both is a spec violation).
 *    A product whose copy has no provenance (older rows, no `copy_source`) is
 *    treated as human-written — that is what it was before this field existed.
 * 3. Images. Generated marketing cards and infographics are OUR artwork with
 *    burnt-in text and prices; Google rejects promotional overlays. Only clean
 *    product photography goes in, and a product left with no clean photo is
 *    dropped from the feed rather than submitted with a card.
 */

import type { ProductDetail, ProductImage, ProductVariant } from "./api-client";
import { sortVariants, usableAxes, variantOptions, variantSku } from "./variants";
import { tiendaProductUrl } from "./tienda-url";
import { markdownToPlainText } from "@/lib/markdown-plain-text";

/** The feed carries the Spanish catalog (the Panamanian storefront). */
export const FEED_LOCALE = "es";
const MAX_ADDITIONAL_IMAGES = 10;
const MAX_DESCRIPTION = 5000;
/** Google truncates a title past 150 characters. */
const MAX_TITLE = 150;

/** Escape the five XML-significant characters so values can't break the markup. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Plain-text description for the feed, capped — Google rejects HTML in g:description. */
function toPlainText(input: string): string {
  return markdownToPlainText(input).slice(0, MAX_DESCRIPTION);
}

function tag(name: string, value: string): string {
  return `<${name}>${escapeXml(value)}</${name}>`;
}

/**
 * A generated card / infographic, i.e. artwork with text and prices burnt in.
 * `kind` values starting with "card" plus "infographic"; an unknown/absent kind
 * is a plain photo (that is all the catalog held before cards existed).
 */
function isGeneratedArtwork(image: ProductImage): boolean {
  const kind = image.kind?.toLowerCase().trim();
  if (!kind) return false;
  return kind.startsWith("card") || kind === "infographic";
}

/**
 * Clean product photos, in display order. `image_url` is used only when the
 * product carries no image rows at all (an older payload with no `kind` data) —
 * once rows exist, they are the authority on what is a photo and what is a card.
 */
export function feedImages(product: ProductDetail): string[] {
  const rows = product.images ?? [];
  if (rows.length > 0) {
    return rows
      .filter((im) => !isGeneratedArtwork(im))
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((im) => im.url)
      .filter((u): u is string => Boolean(u));
  }
  return product.image_url ? [product.image_url] : [];
}

/** Title/description tags, marked as machine-generated when the bot wrote them. */
function textTags(product: ProductDetail, title: string, description: string): string[] {
  const cappedTitle = title.slice(0, MAX_TITLE);
  if (product.copy_source === "ai") {
    const parts = [
      "<g:structured_title>" +
        tag("g:digital_source_type", "trained_algorithmic_media") +
        tag("g:content", cappedTitle) +
        "</g:structured_title>",
    ];
    if (description) {
      parts.push(
        "<g:structured_description>" +
          tag("g:digital_source_type", "trained_algorithmic_media") +
          tag("g:content", description) +
          "</g:structured_description>"
      );
    }
    return parts;
  }
  const parts = [tag("g:title", cappedTitle)];
  if (description) parts.push(tag("g:description", description));
  return parts;
}

const SHIPPING_TAG =
  "<g:shipping>" +
  tag("g:country", "PA") +
  tag("g:service", "Entrega el mismo día (Ciudad de Panamá)") +
  tag("g:price", "0 USD") +
  "</g:shipping>";

/** One `g:product_detail` block: the value of a secondary axis. */
function productDetailTag(sectionAndAttribute: string, value: string): string {
  return (
    "<g:product_detail>" +
    tag("g:section_name", sectionAndAttribute) +
    tag("g:attribute_name", sectionAndAttribute) +
    tag("g:attribute_value", value) +
    "</g:product_detail>"
  );
}

function renderItem(parts: string[]): string {
  return `    <item>\n${parts.map((p) => `      ${p}`).join("\n")}\n    </item>`;
}

/**
 * Feed rows for one product: one per variant, or a single row for a product
 * without variants. Empty when the product cannot be submitted — no price, or no
 * photo that is not a generated card (logged, since that is a data problem worth
 * seeing in the route's logs).
 */
export function buildFeedItems(product: ProductDetail): string[] {
  const variants = sortVariants(product.variants);
  // Nothing buyable: not a data problem worth a log line, just skip it.
  if (variants.length === 0 && product.price == null) return [];
  const images = feedImages(product);
  if (images.length === 0) {
    console.warn(
      `[merchant-feed] ${product.sku}: no clean product image (cards/infographics only) — skipped`
    );
    return [];
  }
  const [mainImage, ...restImages] = images;
  const additionalImages = restImages.slice(0, MAX_ADDITIONAL_IMAGES);
  const link = tiendaProductUrl(FEED_LOCALE, product.slug);
  const description = toPlainText(product.description ?? product.short_description ?? "");
  const axes = usableAxes(product.variant_axes, variants);
  // With several axes the diameter is the "size"; the rest become product details.
  const sizeAxis = axes.length >= 2 ? (axes.find((a) => a.key === "diametro") ?? axes[0]) : null;

  /** Everything after the identity/title/link block: shared by both shapes. */
  function commonTags(price: string, sku: string): string[] {
    const parts = [tag("g:image_link", mainImage)];
    for (const img of additionalImages) parts.push(tag("g:additional_image_link", img));
    parts.push(tag("g:price", `${Number(price).toFixed(2)} USD`));
    parts.push(tag("g:availability", "in_stock"));
    parts.push(tag("g:condition", "new"));
    if (product.brand?.name) parts.push(tag("g:brand", product.brand.name));
    parts.push(tag("g:mpn", sku));
    parts.push(SHIPPING_TAG);
    return parts;
  }

  function variantItem(variant: ProductVariant): string {
    const sku = variantSku(product.sku, variant);
    const opts = variantOptions(variant);
    const size = (sizeAxis ? opts[sizeAxis.key] : null) ?? variant.label_es;
    const parts: string[] = [
      tag("g:id", sku),
      tag("g:item_group_id", product.sku),
      ...textTags(product, `${product.name} — ${variant.label_es}`, description),
      tag("g:link", `${link}?variant=${variant.id}`),
      ...commonTags(variant.price, sku),
      tag("g:size", size),
    ];
    // Secondary axes ("Presentación") have no dedicated Google attribute — they
    // ride along as product details so the row still states what it is.
    if (sizeAxis) {
      for (const axis of axes) {
        if (axis.key === sizeAxis.key) continue;
        const value = opts[axis.key];
        if (value) parts.push(productDetailTag(axis.label_es, value));
      }
    }
    return renderItem(parts);
  }

  if (variants.length > 0) return variants.map(variantItem);

  return [
    renderItem([
      tag("g:id", product.sku),
      ...textTags(product, product.name, description),
      tag("g:link", link),
      ...commonTags(String(product.price), product.sku),
    ]),
  ];
}

/** Wrap rendered `<item>` blocks in the RSS 2.0 channel envelope. */
export function buildFeed(items: string[]): string {
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
