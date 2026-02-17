import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";
import { locales, defaultLocale, type Locale } from "./src/i18n/config";

// Browser language to locale mapping
const languageToLocale: Record<string, Locale> = {
  es: "es",
  en: "en",
  ru: "ru",
  "es-ES": "es",
  "es-MX": "es",
  "es-AR": "es",
  "es-CO": "es",
  "es-PA": "es",
  "es-419": "es",
  "en-US": "en",
  "en-GB": "en",
  "en-AU": "en",
  "en-CA": "en",
  "ru-RU": "ru",
  "ru-UA": "ru",
};

function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, quality = "q=1"] = lang.trim().split(";");
      const q = parseFloat(quality.replace("q=", "")) || 1;
      return { code: code.trim(), q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of languages) {
    if (languageToLocale[code]) return languageToLocale[code];
    const baseCode = code.split("-")[0];
    if (languageToLocale[baseCode]) return languageToLocale[baseCode];
  }

  return defaultLocale;
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) ||
      pathname === `/${locale}` ||
      pathname === `/${locale}/`
  );

  if (!pathnameHasLocale && (pathname === "/" || pathname === "")) {
    const acceptLanguage = request.headers.get("accept-language");
    const detectedLocale = getPreferredLocale(acceptLanguage);
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}/`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
