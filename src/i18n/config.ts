export const locales = ["es", "en", "ru"] as const;
export const defaultLocale = "es" as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  ru: "Русский",
};

export const localeFlags: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇺🇸",
  ru: "🇷🇺",
};

/** URL path prefix: es = "" (default), en = "/en", ru = "/ru" (localePrefix: "as-needed") */
export function getLocalePrefix(locale: Locale): string {
  if (locale === defaultLocale) return "";
  return `/${locale}`;
}
