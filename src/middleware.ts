import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { OLD_SERVICE_SLUG_TO_NEW } from "./lib/services";

const intlMiddleware = createMiddleware(routing);
const PRODUCTION_HOST = "24clima.com";

// Cutover: while the redirect is a 302 search engines keep the old shop URLs.
// флип на 301 после прогрева — once the new /tienda pages are warm/indexed,
// set this to true so the shop.24clima.com → 24clima.com/tienda hop is permanent.
const CUTOVER_REDIRECT_PERMANENT = false;

/**
 * Single-hop mapping of an old shop.24clima.com pathname onto the site's
 * /tienda/ tree (locale prefixes preserved, always trailing-slashed):
 *   "/" | ""            → /tienda/
 *   "/es" | "/es/..."   → strip /es (es is unprefixed on the site), then as below
 *   "/en" | "/en/..."   → /en/tienda/...   ("/ru" analog)
 *   any other path P    → /tienda{P}/
 * Query/search is preserved by the caller. No API paths reach here.
 */
function mapShopPathToTienda(pathname: string): string {
  let p = pathname;

  // es is unprefixed on the site — drop the /es segment first.
  if (p === "/es") p = "";
  else if (p.startsWith("/es/")) p = p.slice(3); // "/es/foo" → "/foo", "/es/" → "/"

  // Pull off an en/ru locale prefix so it survives onto the /tienda target.
  let locale = "";
  for (const loc of ["en", "ru"] as const) {
    if (p === `/${loc}`) {
      locale = `/${loc}`;
      p = "";
      break;
    }
    if (p.startsWith(`/${loc}/`)) {
      locale = `/${loc}`;
      p = p.slice(loc.length + 1); // "/en/category/y" → "/category/y"
      break;
    }
  }

  // Collapse the remainder to a clean slug path, then re-slash it under /tienda/.
  const rest = p.replace(/^\/+/, "").replace(/\/+$/, "");
  const tiendaPath = rest ? `/tienda/${rest}/` : `/tienda/`;
  return `${locale}${tiendaPath}`;
}

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // 0. Host-based cutover (runs FIRST — before www-normalization and every
  // other rule). Only the legacy shop host is affected; 24clima.com falls
  // straight through untouched. Matcher already excludes /api|_next|_vercel and
  // dotted files (sitemap.xml/robots.txt/llms.txt are redirected in vercel.json).
  //
  // We read the incoming Host header (not url.hostname): on Vercel the edge sets
  // it to the real requested host, and it's the value a forged-header local test
  // exercises — whereas nextUrl.hostname reflects the server bind address in dev.
  const host = (request.headers.get("host") ?? url.hostname)
    .split(":")[0]
    .toLowerCase();
  if (host === "shop.24clima.com" || host === "www.shop.24clima.com") {
    // Shop-host API traffic keeps hitting the same backend via the /api/v1
    // rewrite — never redirect it (defense-in-depth; matcher excludes /api too).
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }
    const target = new URL(
      `https://${PRODUCTION_HOST}${mapShopPathToTienda(pathname)}`,
    );
    target.search = url.search;
    return NextResponse.redirect(target, {
      status: CUTOVER_REDIRECT_PERMANENT ? 301 : 302,
    });
  }

  // Dev-only: ?_mobile=1 forces mobile rendering (for QA on desktop)
  // This sets x-force-mobile header which isMobileDevice() checks.
  const forceMobile = url.searchParams.get("_mobile") === "1";

  // 1. www → non-www (308 Permanent Redirect) — host normalization first.
  if (url.hostname === `www.${PRODUCTION_HOST}`) {
    const target = new URL(request.url);
    target.hostname = PRODUCTION_HOST;
    target.protocol = "https:";
    return NextResponse.redirect(target, { status: 308 });
  }

  // 1a. /api/* — pass through untouched (defense-in-depth). The matcher below
  // already excludes /api, and skipTrailingSlashRedirect (next.config.js) means
  // the framework does no slash handling either, so API paths must never be
  // slash-normalized or redirected here — that would mangle /api/v1 POSTs.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 1b. Canonical trailing-slash enforcement for PAGE paths (308).
  // next.config.js sets skipTrailingSlashRedirect, disabling Next's automatic
  // slash redirect, so we re-add it here for GET/HEAD navigations to extension-
  // less paths. It runs AFTER host normalization but BEFORE the locale redirects
  // below, so those always receive an already-slashed path and emit slashed
  // targets — no redirect chains.
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    !pathname.endsWith("/") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/_vercel") &&
    !(pathname.split("/").pop() ?? "").includes(".")
  ) {
    const target = new URL(`${pathname}/`, request.url);
    target.search = url.search;
    return NextResponse.redirect(target, { status: 308 });
  }

  // 2. /es/* → /* (308 Permanent Redirect)
  if (pathname === "/es" || pathname === "/es/" || pathname.startsWith("/es/")) {
    const newPath = pathname.replace(/^\/es\/?/, "/") || "/";
    const target = new URL(newPath, request.url);
    target.search = url.search;
    return NextResponse.redirect(target, { status: 308 });
  }

  // 3. Редирект старых английских slug'ов услуг на испанские (301)
  const serviciosMatch = pathname.match(/^(\/(en|ru))?\/servicios\/([^/]+)\/?$/);
  if (serviciosMatch) {
    const prefix = serviciosMatch[1] ?? ""; // "" для корня, "/en" или "/ru" для локали
    const oldSlug = serviciosMatch[3];
    const newSlug = OLD_SERVICE_SLUG_TO_NEW[oldSlug];
    if (newSlug && newSlug !== oldSlug) {
      const newPath = `${prefix}/servicios/${newSlug}/`;
      const target = new URL(newPath, request.url);
      target.search = url.search;
      return NextResponse.redirect(target, { status: 301 });
    }
  }

  // 4. /en/* и /ru/* → next-intl
  if (/^\/(en|ru)(\/|$)/.test(pathname)) {
    return intlMiddleware(request);
  }

  // 5. Остальное (/, /consejos-y-guias/, /servicios/... ) — отдаётся из app/(es)/
  if (forceMobile && process.env.NODE_ENV !== "production") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-force-mobile", "1");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/es",
    "/es/",
    "/es/:path*",
    "/(en|ru)/:path*",
    // Note: /api is explicitly excluded here (negative lookahead) so middleware
    // never runs for API paths — the 1a pass-through above is defense-in-depth.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
