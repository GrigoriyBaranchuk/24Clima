/**
 * Typed API client for 24Clima Shop API. Ported verbatim from
 * apps/shop-web/src/lib/api-client.ts — same-origin /api/v1 proxy logic preserved.
 *
 * In browser: if NEXT_PUBLIC_API_URL is set, use it; else use same-origin /api (rewrite to
 * backend) so that cart cookie (Set-Cookie) is same-origin and works for guests.
 * On server: NEXT_PUBLIC_API_URL, else API_PROXY_TARGET (the rewrite target), else
 * http://localhost:8000 (dev).
 */

import { getShopToken } from "./shop-auth";

function getBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (typeof window !== "undefined") return "";
  const proxyTarget = process.env.API_PROXY_TARGET?.trim();
  if (proxyTarget) return proxyTarget.replace(/\/$/, "");
  return "http://localhost:8000";
}

function buildUrl(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : `/api${p}`;
}

/** API error carrying the HTTP status so callers can tell a real 404 from an outage. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const t = getShopToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Public catalog: no auth, same response for guests and logged-in users (filters + product list). */
async function fetchCatalogApi<T>(
  path: string,
  opts?: RequestInit & { headers?: Record<string, string> }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts?.headers as Record<string, string> | undefined),
  };
  const url = buildUrl(path);
  const res = await fetch(url, { ...opts, headers, cache: "no-store", credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = Array.isArray(err.detail) ? err.detail.join(", ") : err.detail || res.statusText;
    if (res.status === 404) {
      throw new ApiError(`API returned 404. Check API URL (current: ${url}). ${msg}`, 404);
    }
    throw new ApiError(msg, res.status);
  }
  return res.json() as Promise<T>;
}

/**
 * Cached catalog fetch for ISR / on-demand revalidation. Unlike fetchCatalogApi it
 * omits `cache: "no-store"` and `credentials` — Next.js refuses to cache a response
 * for a request that sends credentials — and passes `next: { revalidate, tags }` so
 * pages can be time-revalidated and tag-invalidated. Server-only.
 */
async function fetchCatalogCached<T>(
  path: string,
  opts: { revalidate: number; tags?: string[] }
): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: opts.revalidate, tags: opts.tags },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = Array.isArray(err.detail) ? err.detail.join(", ") : err.detail || res.statusText;
    if (res.status === 404) {
      throw new ApiError(`API returned 404. Check API URL (current: ${url}). ${msg}`, 404);
    }
    throw new ApiError(msg, res.status);
  }
  return res.json() as Promise<T>;
}

export type Category = { id: string; name: string; slug: string; description: string | null; image_url: string | null; sort_order: number; parent_id: string | null };
export type Brand = { id: string; name: string; slug: string; logo_url: string | null };
export type ProductList = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  short_description: string | null;
  status: string;
  is_b2b_only: boolean;
  price: string | null;
  image_url: string | null;
  brand: Brand | null;
  category: Category | null;
  btu: number | null;
};
export type ProductDetail = ProductList & {
  description: string | null;
  warranty_months: number | null;
  meta_title: string | null;
  meta_description: string | null;
  images: { id: string; url: string; alt: string | null; sort_order: number }[];
  attributes: { attribute_code: string; attribute_name: string; value: string; unit: string | null }[];
  moq: number;
  pack_size: number;
  faq?: { q: string; a: string }[] | null;
};
export type ProductsResponse = { items: ProductList[]; total: number };
export type SitemapItem = { slug: string; updated_at: string | null; is_b2b_only: boolean };
export type CartItem = {
  id: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  product_slug: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  image_url: string | null;
  moq: number;
  pack_size: number;
  errors: string[];
};
export type Cart = { id: string; items: CartItem[]; item_count: number; subtotal: string; tax_amount: string; total: string };
export type CheckoutPreview = {
  subtotal: string;
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  total: string;
  currency: string;
  item_count: number;
  errors: string[];
};

export type UserMe = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  roles: string[];
  company_id: string | null;
  company_name: string | null;
};

async function fetchApi<T>(
  path: string,
  opts?: RequestInit & { headers?: Record<string, string> }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(opts?.headers as Record<string, string> | undefined),
  };
  const url = buildUrl(path);
  const res = await fetch(url, { ...opts, headers, cache: "no-store", credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = Array.isArray(err.detail) ? err.detail.join(", ") : err.detail || res.statusText;
    if (res.status === 404) {
      throw new Error(`API returned 404. Check API URL (current: ${url}). ${msg}`);
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export type ProductsParams = { category_slug?: string; brand_slug?: string; q?: string; sort?: string; limit?: number; offset?: number; btu_min?: number; btu_max?: number; locale?: string; pro?: "exclude" | "include" | "only" };

function buildProductsQuery(params?: ProductsParams): string {
  const sp = new URLSearchParams();
  if (params?.category_slug) sp.set("category_slug", params.category_slug);
  if (params?.brand_slug) sp.set("brand_slug", params.brand_slug);
  if (params?.q) sp.set("q", params.q);
  if (params?.sort) sp.set("sort", params.sort);
  if (params?.limit != null) sp.set("limit", String(params.limit));
  if (params?.offset != null) sp.set("offset", String(params.offset));
  if (params?.btu_min != null) sp.set("btu_min", String(params.btu_min));
  if (params?.btu_max != null) sp.set("btu_max", String(params.btu_max));
  if (params?.locale) sp.set("locale", params.locale);
  if (params?.pro) sp.set("pro", params.pro);
  return sp.toString();
}

function productPath(slug: string, locale?: string): string {
  const sp = new URLSearchParams();
  if (locale) sp.set("locale", locale);
  const qs = sp.toString();
  return `/v1/catalog/products/${slug}${qs ? `?${qs}` : ""}`;
}

export const api = {
  /** Catalog: public, no auth — same filters and list for guests and registered users. */
  getCategories: () => fetchCatalogApi<Category[]>(`/v1/catalog/categories`),
  getBrands: () => fetchCatalogApi<Brand[]>(`/v1/catalog/brands`),
  getProducts: (params?: ProductsParams) =>
    fetchCatalogApi<ProductsResponse>(`/v1/catalog/products?${buildProductsQuery(params)}`),
  getProduct: (slug: string, locale?: string) =>
    fetchCatalogApi<ProductDetail>(productPath(slug, locale)),

  // Cached (ISR) variants — server-only. Time-revalidated + tag-invalidated via /api/revalidate.
  /** Product detail: revalidate hourly, tag "product:{slug}" (invalidated on publish/update). */
  getProductCached: (slug: string, locale?: string) =>
    fetchCatalogCached<ProductDetail>(productPath(slug, locale), {
      revalidate: 3600,
      tags: ["catalog", `product:${slug}`],
    }),
  /** Product list: revalidate every 10 min, tag "catalog". */
  getProductsCached: (params?: ProductsParams) =>
    fetchCatalogCached<ProductsResponse>(`/v1/catalog/products?${buildProductsQuery(params)}`, {
      revalidate: 600,
      tags: ["catalog"],
    }),
  getCategoriesCached: () =>
    fetchCatalogCached<Category[]>(`/v1/catalog/categories`, { revalidate: 3600, tags: ["catalog"] }),
  getBrandsCached: () =>
    fetchCatalogCached<Brand[]>(`/v1/catalog/brands`, { revalidate: 3600, tags: ["catalog"] }),
  getSitemap: () =>
    fetchCatalogCached<SitemapItem[]>(`/v1/catalog/sitemap`, { revalidate: 3600, tags: ["catalog"] }),
  /** Cart: cookie cart_id is sent automatically (credentials: "include"). Headers kept for backward compat. */
  getCart: (cartId?: string | null, sessionId?: string | null) => {
    const h: Record<string, string> = {};
    if (cartId) h["X-Cart-Id"] = cartId;
    if (sessionId) h["X-Session-Id"] = sessionId;
    return fetchApi<Cart>("/v1/cart/items", { headers: h });
  },
  addCartItem: (productId: string, quantity: number, cartId?: string | null, sessionId?: string | null) => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (cartId) h["X-Cart-Id"] = cartId;
    if (sessionId) h["X-Session-Id"] = sessionId;
    return fetchApi<{ cart_id: string; item_id: string }>("/v1/cart/items", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity }),
      headers: h,
    });
  },
  updateCartItem: (itemId: string, quantity: number, cartId?: string | null) => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (cartId) h["X-Cart-Id"] = cartId;
    return fetchApi<{ cart_id: string; item_id?: string; removed?: boolean }>(`/v1/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
      headers: h,
    });
  },
  checkoutPreview: (cartId?: string | null, sessionId?: string | null) => {
    const h: Record<string, string> = {};
    if (cartId) h["X-Cart-Id"] = cartId;
    if (sessionId) h["X-Session-Id"] = sessionId;
    return fetchApi<CheckoutPreview>("/v1/checkout/preview", { method: "POST", headers: h });
  },
  createOrder: (shipping: {
    guest_email?: string | null;
    guest_phone?: string | null;
    guest_name?: string | null;
    shipping_address: string;
    shipping_region?: string | null;
    shipping_notes?: string | null;
    payment_method: string;
  }, cartId?: string | null, sessionId?: string | null, idempotencyKey?: string | null) => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (cartId) h["X-Cart-Id"] = cartId;
    if (sessionId) h["X-Session-Id"] = sessionId;
    return fetchApi<{ order_id: string; order_number: string; public_token: string; total: string; currency: string }>("/v1/checkout/orders", {
      method: "POST",
      body: JSON.stringify({ shipping, idempotency_key: idempotencyKey ?? undefined }),
      headers: h,
    });
  },
  getOrder: (orderRef: string, token?: string | null) => {
    const q = token ? `?token=${encodeURIComponent(token)}` : "";
    return fetchApi<{ order_number: string; status: string; total: string; items: unknown[] }>(`/v1/orders/${orderRef}${q}`);
  },
  register: (data: { email: string; password: string; full_name?: string | null; phone?: string | null }) =>
    fetchApi<{ message: string; email: string }>("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (email: string, password: string) =>
    fetchApi<{ access_token: string; refresh_token: string; token_type: string; expires_in: number }>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => fetchApi<UserMe>("/v1/auth/me"),
  /** Clear cart cookie on server so after logout the guest has an empty cart. Call with credentials. */
  logout: () =>
    fetch(buildUrl("/v1/auth/logout"), { method: "POST", credentials: "include" }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
    }),
};
