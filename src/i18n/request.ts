import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./config";

// Import all messages explicitly for reliable builds
import esMessages from "../../messages/es.json";
import enMessages from "../../messages/en.json";
import ruMessages from "../../messages/ru.json";

const messages: Record<Locale, typeof esMessages> = {
  es: esMessages,
  en: enMessages,
  ru: ruMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as Locale],
  };
});
