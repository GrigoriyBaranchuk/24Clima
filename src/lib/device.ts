import { headers } from "next/headers";

/**
 * Server-side mobile detection via User-Agent.
 *
 * Used in Server Components to skip rendering desktop-only sections on
 * mobile UA — saves ~30% of HTML payload and avoids shipping unused JS.
 *
 * Caveats:
 * - Forces the page to render dynamically (no static prerender).
 * - On Googlebot Smartphone returns true → mobile HTML is indexed for
 *   mobile-first indexing, which is what we want.
 * - On responsive desktop tools (DevTools shrunk window) returns false,
 *   so desktop HTML is delivered + Tailwind hides it via CSS.
 *
 * Dev override: in development, the request can carry the
 * `x-force-mobile` header (set by middleware when ?_mobile=1 is in URL)
 * to force-render the mobile variant for QA without owning a phone.
 */
export async function isMobileDevice(): Promise<boolean> {
  const h = await headers();
  if (process.env.NODE_ENV !== "production" && h.get("x-force-mobile") === "1") {
    return true;
  }
  const ua = h.get("user-agent") || "";
  return /Mobile|Android|iPhone|iPad|IEMobile|BlackBerry/i.test(ua);
}
