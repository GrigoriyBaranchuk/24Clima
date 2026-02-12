/**
 * Семантическое ядро для SEO (Панама: чистка, ремонт, обслуживание кондиционеров).
 * Ключевые запросы по категориям и локалям для мета-тегов и контента.
 */

import type { Locale } from "@/i18n/config";

/** Ключевые слова для главной страницы по локалям */
export const HOME_KEYWORDS: Record<Locale, string[]> = {
  es: [
    "aire acondicionado Panamá",
    "servicio aire acondicionado Ciudad de Panamá",
    "limpieza aire acondicionado Panamá",
    "mantenimiento aire acondicionado",
    "reparación aire acondicionado Panamá",
    "instalación aire acondicionado",
    "técnico aire acondicionado Panama",
    "carga gas refrigerante",
    "limpieza profunda aire acondicionado",
    "mantenimiento preventivo",
    "servicio 24 horas aire acondicionado",
    "Costa del Este",
    "Punta Pacífica",
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
      "limpieza profunda aire acondicionado",
      "limpieza de filtros",
      "limpieza de aires acondicionados Ciudad de Panamá",
      "mantenimiento y limpieza",
      "desinfección aire acondicionado",
      "tratamiento antibacteriano",
      "limpieza split minisplit",
      "precio limpieza aire acondicionado",
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
      "mantenimiento preventivo",
      "mantenimiento cada 3 meses",
      "mantenimiento y limpieza aires",
      "servicio técnico mantenimiento",
      "Ciudad de Panamá",
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
      "reparar aire acondicionado",
      "servicio técnico aire acondicionado",
      "aire acondicionado no enfría",
      "aire acondicionado no prende",
      "aire gotea hace ruido",
      "técnico 24 horas",
      "reparación urgente",
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
      "instalar aire acondicionado",
      "instalación split minisplit",
      "instalación y mantenimiento",
      "Ciudad de Panamá instalación",
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
      "recarga de gas aire acondicionado",
      "aire acondicionado no enfría gas",
      "detección fugas",
      "servicio carga gas",
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
      "servicio aire acondicionado 24 horas",
      "reparación urgente aire acondicionado",
      "técnico 24/7 Panamá",
      "emergencia aire acondicionado",
      "servicio mismo día",
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
