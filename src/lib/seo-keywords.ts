/**
 * Семантическое ядро для SEO (Панама: чистка, ремонт, обслуживание кондиционеров).
 * Ключевые запросы по категориям и локалям для мета-тегов и контента.
 */

import type { Locale } from "@/i18n/config";

/** Районы и зоны обслуживания (Панама) для гео-ключевых слов */
export const PANAMA_AREAS = [
  "Ciudad de Panamá",
  "Panama City",
  "Costa del Este",
  "Punta Pacífica",
  "Albrook",
  "Clayton",
  "Panamá Pacífico",
  "San Francisco",
  "El Cangrejo",
  "Obarrio",
  "Bella Vista",
  "Condado del Rey",
  "Costa Verde",
  "Vista Mar",
] as const;

/** Ключевые слова для главной страницы по локалям */
export const HOME_KEYWORDS: Record<Locale, string[]> = {
  es: [
    "aire acondicionado Panamá",
    "servicio aire acondicionado Ciudad de Panamá",
    "limpieza aire acondicionado Panamá",
    "mantenimiento aire acondicionado Panamá",
    "reparación aire acondicionado Panamá",
    "instalación aire acondicionado Panamá",
    "técnico aire acondicionado Panama",
    "carga gas refrigerante Panamá",
    "limpieza profunda aire acondicionado",
    "mantenimiento preventivo aire acondicionado",
    "servicio 24 horas aire acondicionado Panamá",
    "precio limpieza aire acondicionado Panamá",
    "costo reparación aire acondicionado",
    "mejor técnico aire acondicionado Ciudad de Panamá",
    "Costa del Este aire acondicionado",
    "Punta Pacífica servicio aire acondicionado",
    "Albrook Clayton mantenimiento AC",
    "emergencia aire acondicionado 24 horas Panamá",
  ],
  en: [
    "air conditioning Panama",
    "AC service Panama City",
    "air conditioning cleaning Panama",
    "AC maintenance Panama",
    "air conditioning repair Panama",
    "AC installation Panama",
    "HVAC technician Panama",
    "refrigerant recharge",
    "deep cleaning air conditioning",
    "preventive maintenance",
    "24/7 AC service",
    "Ciudad de Panamá",
  ],
  ru: [
    "кондиционер Панама",
    "обслуживание кондиционеров Панама",
    "чистка кондиционера",
    "ремонт кондиционеров Панама-Сити",
    "установка кондиционера",
    "заправка кондиционера",
    "техник по кондиционерам",
    "профилактика кондиционера",
  ],
};

/** Ключевые слова по услугам (slug) и локалям */
export const SERVICE_KEYWORDS: Record<
  string,
  Record<Locale, string[]>
> = {
  cleaning: {
    es: [
      "limpieza aire acondicionado Panamá",
      "limpieza profunda aire acondicionado Panamá",
      "limpieza de filtros aire acondicionado",
      "limpieza de aires acondicionados Ciudad de Panamá",
      "mantenimiento y limpieza aire acondicionado",
      "desinfección aire acondicionado Panamá",
      "tratamiento antibacteriano AC",
      "limpieza split minisplit Panamá",
      "precio limpieza aire acondicionado Panamá",
      "costo limpieza aire acondicionado Ciudad de Panamá",
      "limpieza aire acondicionado Costa del Este",
      "limpieza interna aire acondicionado",
      "limpieza de ductos aire acondicionado",
    ],
    en: [
      "air conditioning cleaning Panama",
      "deep cleaning AC",
      "AC filter cleaning",
      "air conditioner cleaning Panama City",
      "maintenance and cleaning",
      "AC disinfection",
      "split minisplit cleaning",
    ],
    ru: [
      "чистка кондиционера Панама",
      "глубокая чистка кондиционера",
      "чистка фильтров",
      "обслуживание кондиционеров",
      "дезинфекция кондиционера",
    ],
  },
  maintenance: {
    es: [
      "mantenimiento aire acondicionado Panamá",
      "mantenimiento preventivo aire acondicionado Panamá",
      "mantenimiento cada 3 meses aire acondicionado",
      "mantenimiento y limpieza aires acondicionados",
      "servicio técnico mantenimiento AC Ciudad de Panamá",
      "mantenimiento split minisplit Panamá",
      "precio mantenimiento aire acondicionado Panamá",
      "mantenimiento aire acondicionado Costa del Este",
      "contrato mantenimiento aire acondicionado",
    ],
    en: [
      "air conditioning maintenance Panama",
      "preventive maintenance AC",
      "AC service every 3 months",
      "maintenance and cleaning",
      "HVAC maintenance Panama City",
    ],
    ru: [
      "обслуживание кондиционеров Панама",
      "профилактическое обслуживание",
      "техническое обслуживание кондиционера",
    ],
  },
  repair: {
    es: [
      "reparación aire acondicionado Panamá",
      "reparar aire acondicionado Ciudad de Panamá",
      "servicio técnico aire acondicionado Panamá",
      "aire acondicionado no enfría",
      "aire acondicionado no prende",
      "aire acondicionado gotea hace ruido",
      "técnico aire acondicionado 24 horas Panamá",
      "reparación urgente aire acondicionado",
      "costo reparación aire acondicionado Panamá",
      "reparación split minisplit Panamá",
      "reparación aire acondicionado mismo día",
    ],
    en: [
      "air conditioning repair Panama",
      "AC repair Panama City",
      "HVAC technician",
      "AC not cooling",
      "AC not turning on",
      "24 hour repair",
      "emergency AC repair",
    ],
    ru: [
      "ремонт кондиционеров Панама",
      "не охлаждает не включается",
      "техник по кондиционерам",
      "срочный ремонт кондиционера",
    ],
  },
  installation: {
    es: [
      "instalación aire acondicionado Panamá",
      "instalar aire acondicionado Ciudad de Panamá",
      "instalación split minisplit Panamá",
      "instalación y mantenimiento aire acondicionado",
      "precio instalación aire acondicionado Panamá",
      "instalación aire acondicionado Costa del Este",
      "instalación minisplit Panamá",
      "monto instalación aire acondicionado",
    ],
    en: [
      "air conditioning installation Panama",
      "AC installation Panama City",
      "split minisplit installation",
      "install air conditioner",
    ],
    ru: [
      "установка кондиционера Панама",
      "монтаж кондиционера",
      "установка сплит-системы",
    ],
  },
  "gas-recharge": {
    es: [
      "carga gas refrigerante Panamá",
      "recarga de gas aire acondicionado Panamá",
      "aire acondicionado no enfría falta gas",
      "detección fugas refrigerante Panamá",
      "servicio carga gas aire acondicionado",
      "precio carga gas refrigerante Ciudad de Panamá",
      "recarga gas R410A R22 Panamá",
      "carga gas refrigerante Costa del Este",
    ],
    en: [
      "refrigerant recharge Panama",
      "AC gas recharge",
      "AC not cooling recharge",
      "leak detection",
    ],
    ru: [
      "заправка кондиционера Панама",
      "заправка газом хладагент",
      "не холодит заправка",
    ],
  },
  emergency: {
    es: [
      "servicio aire acondicionado 24 horas Panamá",
      "reparación urgente aire acondicionado Panamá",
      "técnico aire acondicionado 24/7 Ciudad de Panamá",
      "emergencia aire acondicionado Panamá",
      "servicio aire acondicionado mismo día",
      "técnico aire acondicionado urgente Panamá",
      "reparación aire acondicionado 24 horas",
      "emergencia AC Costa del Este Punta Pacífica",
    ],
    en: [
      "24 hour AC service Panama",
      "emergency air conditioning repair",
      "24/7 HVAC technician",
      "same day AC service",
    ],
    ru: [
      "кондиционер срочно 24 часа",
      "экстренный ремонт кондиционера",
      "круглосуточный выезд",
    ],
  },
};

export function getHomeKeywords(locale: Locale): string[] {
  return HOME_KEYWORDS[locale] ?? HOME_KEYWORDS.es;
}

export function getServiceKeywords(
  serviceSlug: string,
  locale: Locale
): string[] {
  const byService = SERVICE_KEYWORDS[serviceSlug];
  if (!byService) return getHomeKeywords(locale);
  return byService[locale] ?? byService.es ?? getHomeKeywords(locale);
}
