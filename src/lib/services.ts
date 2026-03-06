/**
 * URL slug'и услуг — везде испанские для SEO (Панама).
 * Маппинг slug → ключ перевода (messages) для заголовков и контента.
 */

export const SERVICE_SLUGS = [
  "limpieza",
  "mantenimiento",
  "reparacion",
  "instalacion",
  "carga-de-gas",
  "emergencia",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** URL slug (испанский) → ключ в messages (services.cleaning, services.gasRecharge и т.д.) */
export const SLUG_TO_TRANSLATION_KEY: Record<ServiceSlug, string> = {
  limpieza: "cleaning",
  mantenimiento: "maintenance",
  reparacion: "repair",
  instalacion: "installation",
  "carga-de-gas": "gasRecharge",
  emergencia: "emergency",
};

/** Ключ перевода → URL slug (для генерации ссылок) */
export const TRANSLATION_KEY_TO_SLUG: Record<string, ServiceSlug> = {
  cleaning: "limpieza",
  maintenance: "mantenimiento",
  repair: "reparacion",
  installation: "instalacion",
  gasRecharge: "carga-de-gas",
  emergency: "emergencia",
};

export function getTranslationKey(slug: string): string | undefined {
  return SLUG_TO_TRANSLATION_KEY[slug as ServiceSlug];
}

export function isServiceSlug(slug: string): slug is ServiceSlug {
  return SERVICE_SLUGS.includes(slug as ServiceSlug);
}

/** Старые английские slug'и → новые испанские (для 301 редиректов) */
export const OLD_SERVICE_SLUG_TO_NEW: Record<string, ServiceSlug> = {
  cleaning: "limpieza",
  maintenance: "mantenimiento",
  repair: "reparacion",
  installation: "instalacion",
  "gas-recharge": "carga-de-gas",
  emergency: "emergencia",
};
