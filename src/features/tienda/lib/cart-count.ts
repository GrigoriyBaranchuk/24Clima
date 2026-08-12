/**
 * Client-side mirror of the cart item count for the header badge.
 *
 * The badge must NEVER call the cart API: GET /v1/cart/items creates a new
 * guest cart (+ cookie) server-side when none exists, so a fetch on every
 * /tienda page view would leave a cart row per visitor. Instead, every code
 * path that already knows the cart (CartSummary fetch/mutations, checkout)
 * publishes the count here; the badge only reads and listens.
 *
 * Staleness is accepted: the count updates on the next cart/checkout visit.
 */

const STORAGE_KEY = "tienda-cart-count";

/** Already dispatched by CartSummary after mutations; the badge listens to it. */
export const CART_UPDATED_EVENT = "cart-updated";

export function readCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const n = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

export function publishCartCount(count: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(count));
  } catch {
    // Private mode / quota — the event still updates badges on this page.
  }
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}
