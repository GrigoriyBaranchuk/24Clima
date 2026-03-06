import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";
import { OLD_SERVICE_SLUG_TO_NEW } from "./src/lib/services";

const intlMiddleware = createMiddleware(routing);
const PRODUCTION_HOST = "24clima.com";

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // 1. www → non-www (308 Permanent Redirect)
  if (url.hostname === `www.${PRODUCTION_HOST}`) {
    const target = new URL(request.url);
    target.hostname = PRODUCTION_HOST;
    target.protocol = "https:";
    return NextResponse.redirect(target, { status: 308 });
  }

  // 2. /es/* → /* (301) — испанский только в корне, без сегмента /es/
  if (pathname === "/es" || pathname === "/es/" || pathname.startsWith("/es/")) {
    const newPath = pathname.replace(/^\/es\/?/, "/") || "/";
    const target = new URL(newPath, request.url);
    target.search = url.search;
    return NextResponse.redirect(target, { status: 301 });
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
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/(es|en|ru)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
