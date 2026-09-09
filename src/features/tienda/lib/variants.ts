import type { ProductVariant, VariantAxis } from "./api-client";

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

/* ------------------------------------------------------------------ *
 * Several axes: a product may vary by ANY number of dimensions — e.g. tube x
 * insulation x presentation for insulated copper tubing. The backend then sends
 * `variant_axes` (one of them flagged `is_size`), and each variant carries
 * `options` (axis key -> value). Everything below is pure, null-safe and
 * indifferent to how many axes there are, so an older payload (no axes, no
 * options) keeps the single-list behaviour.
 * ------------------------------------------------------------------ */

/** Current pick per axis, e.g. `{ tubo: '1/4"', aislamiento: '3/8"', presentacion: "Rollo 45 m" }`. */
export type VariantSelection = Record<string, string>;

/** A variant's axis values, never null. */
export function variantOptions(variant: ProductVariant): Record<string, string> {
  return variant.options ?? {};
}

/**
 * The axes we can actually drive the picker with: declared by the backend, with
 * values, and present in EVERY variant's `options`. Anything less and the caller
 * falls back to the flat list of `label_es` pills, which always works.
 */
export function usableAxes(
  axes: VariantAxis[] | null | undefined,
  variants: ProductVariant[]
): VariantAxis[] {
  const declared = (axes ?? []).filter((a) => a.key && a.values?.length);
  if (declared.length === 0 || variants.length === 0) return [];
  const complete = variants.every((v) => {
    const opts = variantOptions(v);
    return declared.every((a) => typeof opts[a.key] === "string" && opts[a.key] !== "");
  });
  return complete ? declared : [];
}

/**
 * The axis that is the product's SIZE — `g:size` in the Merchant feed and
 * schema.org `size` in JSON-LD. Backends since listing v2 flag it with
 * `is_size`; the two fallbacks keep older payloads (and the copper-tubing
 * family, whose size axis is the diameter) behaving exactly as before.
 * Returns null only when there are no axes at all.
 */
export function sizeAxisOf(axes: VariantAxis[]): VariantAxis | null {
  return axes.find((a) => a.is_size) ?? axes.find((a) => a.key === "diametro") ?? axes[0] ?? null;
}

/** Axis label in the reader's language; Spanish is the source of truth and the fallback. */
export function axisLabel(axis: VariantAxis, locale: string): string {
  if (locale === "en") return axis.label_en || axis.label_es;
  if (locale === "ru") return axis.label_ru || axis.label_es;
  return axis.label_es;
}

/** The variant matching every axis value in `selection`, or null if that cell is empty. */
export function resolveVariant(
  variants: ProductVariant[],
  selection: VariantSelection
): ProductVariant | null {
  const keys = Object.keys(selection);
  if (keys.length === 0) return null;
  return (
    variants.find((v) => {
      const opts = variantOptions(v);
      return keys.every((k) => opts[k] === selection[k]);
    }) ?? null
  );
}

/** What a variant is, as a selection: its values on the declared axes. */
export function selectionFromVariant(
  variant: ProductVariant | null,
  axes: VariantAxis[]
): VariantSelection {
  if (!variant) return {};
  const opts = variantOptions(variant);
  const selection: VariantSelection = {};
  for (const a of axes) {
    if (typeof opts[a.key] === "string") selection[a.key] = opts[a.key];
  }
  return selection;
}

/**
 * Per axis, the values that still lead to a real variant given what is picked on
 * the OTHER axes — exactly the pills that must stay clickable. Values keep the
 * backend's order.
 */
export function availableValues(
  variants: ProductVariant[],
  axes: VariantAxis[],
  selection: VariantSelection
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const axis of axes) {
    const others = axes.filter((a) => a.key !== axis.key && selection[a.key] != null);
    const reachable = new Set(
      variants
        .filter((v) => {
          const opts = variantOptions(v);
          return others.every((a) => opts[a.key] === selection[a.key]);
        })
        .map((v) => variantOptions(v)[axis.key])
    );
    result[axis.key] = axis.values.filter((value) => reachable.has(value));
  }
  return result;
}

/**
 * Pick `value` on `axisKey` and repair the rest: an axis whose current value is
 * no longer reachable falls back to its first available value, so the picker can
 * never land on an empty cell. The returned selection resolves to a variant as
 * long as any variant carries `value` on `axisKey`.
 */
export function reconcileSelection(
  variants: ProductVariant[],
  axes: VariantAxis[],
  selection: VariantSelection,
  axisKey: string,
  value: string
): VariantSelection {
  const next: VariantSelection = { [axisKey]: value };
  for (const axis of axes) {
    if (axis.key === axisKey) continue;
    const options = availableValues(variants, axes, next)[axis.key] ?? [];
    const current = selection[axis.key];
    const chosen = current != null && options.includes(current) ? current : options[0];
    if (chosen != null) next[axis.key] = chosen;
  }
  return next;
}
