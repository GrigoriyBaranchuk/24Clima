import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";
import { defaultLocale } from "./src/i18n/config";

const intlMiddleware = createMiddleware(routing);

const PRODUCTION_HOST = "24clima.com";

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  // www → non-www (301) — только в продакшене
  if (url.hostname === `www.${PRODUCTION_HOST}`) {
    const target = new URL(request.url);
    target.hostname = PRODUCTION_HOST;
    target.protocol = "https:";
    return NextResponse.redirect(target, { status: 301 });
  }

  // /es/ и /es/* → / и /* (301) — консолидация canonical для испанского
  if (pathname === `/${defaultLocale}` || pathname === `/${defaultLocale}/` || pathname.startsWith(`/${defaultLocale}/`)) {
    const newPath = pathname === `/${defaultLocale}` || pathname === `/${defaultLocale}/`
      ? "/"
      : pathname.slice(`/${defaultLocale}`.length) || "/";
    const target = request.nextUrl.clone();
    target.pathname = newPath;
    return NextResponse.redirect(target, { status: 301 });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
