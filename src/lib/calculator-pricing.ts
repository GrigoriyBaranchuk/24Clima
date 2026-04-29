/**
 * Pricing logic for the cleaning calculator.
 * Shared between CalculatorMobile and CalculatorDesktop so we don't ship
 * duplicate constants.
 */

export type PackageType = "basic" | "recommended" | "premium";

/** Per-unit price by position in the order (index = unit index). */
export const PRICING: Record<PackageType, number[]> = {
  basic: [35.0, 29.99, 29.99, 29.99, 29.99],
  recommended: [39.99, 37.99, 34.99, 34.99, 34.99],
  premium: [49.99, 47.99, 42.99, 39.99, 39.99],
};

/** Base price (1 unit) — used for "savings" calc. */
export const BASE_PRICES: Record<PackageType, number> = {
  basic: 35.0,
  recommended: 39.99,
  premium: 49.99,
};

/**
 * Compute per-unit prices for `quantity` cleanings under `packageType`.
 *
 * Special rule for "basic": when 2+ units are ordered every unit gets
 * the bulk price (i.e. the second-position price applied to all).
 */
export function computeBreakdown(
  packageType: PackageType,
  quantity: number,
): number[] {
  const prices: number[] = [];
  const pricingArray = PRICING[packageType];

  if (packageType === "basic" && quantity >= 2) {
    const bulkPrice = pricingArray[1];
    for (let i = 0; i < quantity; i++) prices.push(bulkPrice);
  } else {
    for (let i = 0; i < quantity; i++) {
      const idx = Math.min(i, pricingArray.length - 1);
      prices.push(pricingArray[idx]);
    }
  }
  return prices;
}
