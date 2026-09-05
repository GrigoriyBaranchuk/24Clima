import type { ProductVariant } from "./api-client";

/**
 * Product presentations ("Rollo 45 m" / "Corte 15 m"): shared helpers for the grid
 * card, the product page and JSON-LD so the three never disagree about order,
 * which variant is the default one, or how a full SKU is spelled.
 */

/** Backend orders by (sort_order, label_es); re-sorted here so an older payload behaves too. */
export function sortVariants(variants?: ProductVariant[] | null): ProductVariant[] {
  return [...(variants ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order || a.label_es.localeCompare(b.label_es)
  );
}

/** The variant a page starts on: the flagged default, else the first one. */
export function pickDefaultVariant(variants: ProductVariant[]): ProductVariant | null {
  return variants.find((v) => v.is_default) ?? variants[0] ?? null;
}

/** Full SKU of a variant = base product SKU + "-" + suffix. */
export function variantSku(baseSku: string, variant: ProductVariant): string {
  return `${baseSku}-${variant.sku_suffix}`;
}
