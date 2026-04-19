export const locales = ["es", "en", "ru"] as const;
export const defaultLocale = "es" as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  ru: "Русский",
};

/** ISO country codes for flag rendering (use FlagIcon component instead of emoji) */
export const localeCountryCodes: Record<Locale, string> = {
  es: "ES",
  en: "US",
  ru: "RU",
};

/** URL path prefix: es = "" (default), en = "/en", ru = "/ru" (localePrefix: "as-needed") */
export function getLocalePrefix(locale: Locale): string {
  if (locale === defaultLocale) return "";
  return `/${locale}`;
}
