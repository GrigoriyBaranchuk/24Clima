/**
 * SEO monitoring config — the single source of truth for what the ingestion
 * crons track. Kept small ON PURPOSE: DataForSEO is pay-per-request, so the
 * keyword list directly controls weekly spend. Add keywords deliberately.
 *
 * Used by:
 *  - /api/sync-dataforseo  (rankings + AI mentions per keyword; on-page per URL)
 *  - /api/sync-seo         (PSI per URL; GSC-derived URLs can extend MONITORED_URLS)
 *  - scripts/seo-digest.ts (labels)
 */

import { SERVICE_SLUGS } from "@/lib/services";

/** Domain we measure visibility for (no protocol — DataForSEO target form). */
export const TARGET_DOMAIN = "24clima.com";

/** Production origin for building absolute URLs. */
export const SITE_ORIGIN = "https://24clima.com";

/**
 * Bounded keyword set for rank tracking + AI-mention tracking (Spanish, Panama).
 * Drawn from the highest-intent head terms in seo-keywords.ts. Cap ~15 to keep
 * weekly DataForSEO cost predictable. The agent surfaces NEW opportunities from
 * `seo_rankings`; promote a discovered keyword here only if it's worth paying to
 * track weekly.
 */
export const TRACKED_KEYWORDS: readonly string[] = [
  "servicio aire acondicionado Panamá",
  "limpieza aire acondicionado Panamá",
  "mantenimiento aire acondicionado Panamá",
  "reparación aire acondicionado Panamá",
  "instalación aire acondicionado Panamá",
  "aire acondicionado no enfría",
  "técnico aire acondicionado 24 horas Panamá",
  "recarga de gas aire acondicionado Panamá",
  "limpieza aire acondicionado Costa del Este",
  "reparación aire acondicionado Ciudad de Panamá",
  "precio limpieza aire acondicionado Panamá",
  "instalación split minisplit Panamá",
] as const;

/**
 * Key URLs audited by PageSpeed Insights (CWV) and DataForSEO on-page.
 * Service paths are derived from SERVICE_SLUGS (single source of truth — no
 * drift if a slug changes). The digest can recommend additions from GSC top
 * pages. Keep to pages that actually drive conversions/traffic.
 */
export const MONITORED_PATHS: readonly string[] = [
  "/",
  ...SERVICE_SLUGS.map((s) => `/servicios/${s}`),
  "/diagnostico",
  "/consejos-y-guias",
  "/alquiler-aire-acondicionado-eventos",
  "/en",
];

export function monitoredUrls(): string[] {
  return MONITORED_PATHS.map((p) => `${SITE_ORIGIN}${p === "/" ? "" : p}`);
}

/** Defaults; overridable via env for DataForSEO calls. */
export const DEFAULT_LOCATION_CODE = 2591; // Panama
export const DEFAULT_LANGUAGE_CODE = "es";

/** Hard cap so a config edit can never blow up weekly DataForSEO spend. */
export const MAX_TRACKED_KEYWORDS = 20;
