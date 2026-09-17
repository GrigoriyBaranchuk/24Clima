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
 * Values of ONE axis that still lead to a real variant, given what is picked on
 * the other axes. Values keep the backend's order. This is the strict rule:
 * `availableValues` relaxes it for the size axis, `reconcileSelection` never does.
 */
function reachableValues(
  variants: ProductVariant[],
  axes: VariantAxis[],
  selection: VariantSelection,
  axis: VariantAxis
): string[] {
  const others = axes.filter((a) => a.key !== axis.key && selection[a.key] != null);
  const reachable = new Set(
    variants
      .filter((v) => {
        const opts = variantOptions(v);
        return others.every((a) => opts[a.key] === selection[a.key]);
      })
      .map((v) => variantOptions(v)[axis.key])
  );
  return axis.values.filter((value) => reachable.has(value));
}

/**
 * Per axis, the pills that must stay clickable.
 *
 * The size axis (`is_size` — the tube diameter) is the shopper's MAIN filter, so
 * every value any variant carries stays clickable there whatever is picked
 * elsewhere: a diameter is never crossed out because of an insulation or a
 * length. Clicking one drags the other axes along instead (see
 * `reconcileSelection`). The remaining axes grey out as before — against the
 * picked size AND against each other.
 */
export function availableValues(
  variants: ProductVariant[],
  axes: VariantAxis[],
  selection: VariantSelection
): Record<string, string[]> {
  const sizeKey = sizeAxisOf(axes)?.key;
  const result: Record<string, string[]> = {};
  for (const axis of axes) {
    // The empty selection is what makes the size axis ignore the other picks.
    result[axis.key] = reachableValues(variants, axes, axis.key === sizeKey ? {} : selection, axis);
  }
  return result;
}

/**
 * Pick `value` on `axisKey` and repair the rest: the clicked axis is pinned, the
 * others are visited in the backend's order and replaced ONLY where their current
 * value is no longer reachable, in which case they slide to their first available
 * one. So clicking a diameter keeps the insulation and the length whenever that
 * combination exists, and clicking anything else leaves the diameter alone as
 * long as it still fits (the picker disables the values where it would not). The
 * returned selection resolves to a variant as long as any variant carries `value`
 * on `axisKey`.
 *
 * Note the strict `reachableValues` here: the size axis is relaxed for DISPLAY
 * only — repairing it against the real grid is what keeps a click off an empty cell.
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
    const options = reachableValues(variants, axes, next, axis);
    const current = selection[axis.key];
    const chosen = current != null && options.includes(current) ? current : options[0];
    if (chosen != null) next[axis.key] = chosen;
  }
  return next;
}

/**
 * First variant carrying `value` on `axisKey`, in the catalog's own order — the
 * safety net for a payload with holes, where a reconciled selection still points
 * at a cell the backend never sent. A click must never be dead.
 */
export function firstVariantWith(
  variants: ProductVariant[],
  axisKey: string,
  value: string
): ProductVariant | null {
  return variants.find((v) => variantOptions(v)[axisKey] === value) ?? null;
}
