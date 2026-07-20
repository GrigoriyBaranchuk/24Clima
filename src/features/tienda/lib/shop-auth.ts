/**
 * Shop (storefront) auth token. Stored in localStorage.
 * Ported verbatim from apps/shop-web/src/lib/shop-auth.ts.
 */

const SHOP_TOKEN_KEY = "24clima_shop_token";

export function getShopToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SHOP_TOKEN_KEY);
}

export function setShopToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SHOP_TOKEN_KEY, token);
}

export function clearShopToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SHOP_TOKEN_KEY);
}

export function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("auth-changed"));
}
