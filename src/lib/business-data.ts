/**
 * Datos estructurados centralizados sobre 24clima.
 * Fuente única para schema.org JSON-LD, metadatos y contenido.
 *
 * Última actualización: 2026-04-14
 */

import type { ServiceSlug } from "@/lib/services";

export const BUSINESS_DATA = {
  name: "24clima",
  legalName: "24clima",
  url: "https://24clima.com",
  organizationId: "https://24clima.com/#organization",
  telephone: "+507-6828-2120",
  whatsapp: "https://wa.me/50768282120",
  email: "info@24clima.com",
  founded: "2024",
  priceRange: "$29.99 - $600",
  address: {
    addressLocality: "Ciudad de Panamá",
    addressRegion: "Panamá",
    addressCountry: "PA",
  },
  geo: { latitude: 9.0820, longitude: -79.4761 },
  rating: { value: "5.0", count: 11 },
  hours: "24/7",
  areaServed: [
    "Ciudad de Panamá",
    "Costa del Este",
    "Punta Pacífica",
    "San Francisco",
    "Clayton",
    "Albrook",
    "Panamá Pacífico",
    "El Cangrejo",
    "Obarrio",
    "Bella Vista",
    // Panamá Oeste
    "Arraiján",
    "Nuevo Arraiján",
    "Vista Alegre",
    "Costa Verde",
    "La Chorrera",
    "El Espino",
    "La Floresta",
    "Vacamonte",
    "Playa Dorada Residences",
  ],
  expert: {
    name: "Ryhor Baranchuk",
    jobTitle: "Maestro HVAC",
    experienceYears: 9,
    training: "Alemania",
  },
} as const;

export interface ServicePricing {
  minPrice: number;
  maxPrice: number;
  currency: "USD";
  /** Duración de la garantía en días. */
  warrantyDays: number;
  /** Nota libre en español para schema.org description / FAQ. */
  note?: string;
}

/**
 * Precios y garantías reales por servicio (URL slugs en español).
 * Confirmado por el propietario 2026-04-13.
 */
export const SERVICE_PRICING: Record<ServiceSlug, ServicePricing> = {
  limpieza: {
    minPrice: 29.99,
    maxPrice: 211.94,
    currency: "USD",
    warrantyDays: 60,
    note: "Split ≤24 000 BTU desde $29.99/unidad al limpiar 2 o más; 1 split = $35. Casete desde $60. Central desde $50. Máximo facturado $211.94 (6 unidades tarifa recomendada).",
  },
  mantenimiento: {
    minPrice: 50,
    maxPrice: 80,
    currency: "USD",
    warrantyDays: 60,
    note: "Mantenimiento preventivo HVAC. Máximo $80 para casete.",
  },
  reparacion: {
    minPrice: 35,
    maxPrice: 210,
    currency: "USD",
    warrantyDays: 90,
    note: "Incluye diagnóstico. Repuestos se cotizan aparte.",
  },
  instalacion: {
    minPrice: 200,
    maxPrice: 600,
    currency: "USD",
    warrantyDays: 90,
    note: "Instalación back-to-back incluye soporte exterior, bases de goma y conexión a toma eléctrica existente. Extras: +$50 acometida desde tablero; +$20/m de tubería (back-to-back); +$25/m en par manguera. Usamos sólo tuberías propias.",
  },
  "carga-de-gas": {
    minPrice: 120,
    maxPrice: 210,
    currency: "USD",
    warrantyDays: 60,
    note: "Equipos inverter requieren carga completa por peso (no se rellenan). Incluye detección y reparación de fuga. Precio depende de BTU y longitud de tubería.",
  },
  emergencia: {
    minPrice: 40,
    maxPrice: 40,
    currency: "USD",
    warrantyDays: 60,
    note: "Tarifa fija de $40 por llamada de urgencia 24/7. El costo del trabajo realizado (reparación/carga/limpieza) se factura aparte según tarifa estándar. La garantía hereda del tipo de trabajo efectuado.",
  },
} as const;

/**
 * Helper: ISO 8601 duration string for warrantyDays (schema.org QuantitativeValue).
 * Ej: 60 días → "P60D".
 */
export function warrantyDurationISO(days: number): string {
  return `P${days}D`;
}

interface LocalizedText {
  es: string;
  en: string;
  ru: string;
}

export interface PricingTableRow {
  concept: LocalizedText;
  /** Precio como texto de display: "$200", "+$50", "$20/m" — o localizado. */
  price: string | LocalizedText;
  detail?: LocalizedText;
}

export interface ServicePricingTable {
  rows: PricingTableRow[];
  /** Nota bajo la tabla: qué incluye el precio y contexto de mercado. */
  footnote: LocalizedText;
}

/**
 * Tablas de precios visibles para páginas de servicios.
 * Los montos deben coincidir con SERVICE_PRICING (misma fuente que el
 * JSON-LD Service.offers) — al cambiar precios, actualizar ambos.
 * Solo servicios donde la página no tiene otro módulo de precios
 * (limpieza ya tiene CleaningPackages + Calculator).
 */
export const SERVICE_PRICING_TABLES: Partial<Record<ServiceSlug, ServicePricingTable>> = {
  instalacion: {
    rows: [
      {
        concept: {
          es: "Instalación back-to-back (split 9.000–24.000 BTU)",
          en: "Back-to-back installation (split 9,000–24,000 BTU)",
          ru: "Установка back-to-back (сплит 9 000–24 000 BTU)",
        },
        price: "$200",
        detail: {
          es: "Incluye soporte exterior, bases de goma, conexión a toma eléctrica existente y materiales estándar",
          en: "Includes outdoor bracket, rubber bases, connection to existing outlet, and standard materials",
          ru: "Включает кронштейн, виброопоры, подключение к существующей розетке и стандартные материалы",
        },
      },
      {
        concept: {
          es: "Acometida eléctrica desde el tablero",
          en: "Electrical feed from the breaker panel",
          ru: "Электролиния от щитка",
        },
        price: "+$50",
      },
      {
        concept: {
          es: "Tubería adicional (back-to-back)",
          en: "Additional piping (back-to-back)",
          ru: "Дополнительная трасса (back-to-back)",
        },
        price: "+$20/m",
        detail: {
          es: "Usamos únicamente tuberías propias de cobre",
          en: "We use only our own copper piping",
          ru: "Используем только собственные медные трубы",
        },
      },
      {
        concept: {
          es: "Tubería en par manguera",
          en: "Piping in line-set hose",
          ru: "Трасса в термофлексе",
        },
        price: "+$25/m",
      },
      {
        concept: {
          es: "Instalación con canalización / multi-split",
          en: "Ducted / multi-split installation",
          ru: "Канальная установка / мульти-сплит",
        },
        price: { es: "cotización gratis", en: "free quote", ru: "бесплатный расчёт" },
        detail: {
          es: "Visitamos su espacio o analizamos fotos y planos, sin compromiso",
          en: "We visit your space or review photos and plans, no obligation",
          ru: "Осмотр помещения или расчёт по фото и плану, без обязательств",
        },
      },
    ],
    footnote: {
      es: "Precio cerrado con garantía de 90 días por escrito. Compare qué incluye: en el mercado panameño una instalación «básica» de $65–140 suele cubrir solo la mano de obra — materiales, soportes y acometida se cobran aparte.",
      en: "Fixed price with a written 90-day warranty. Compare what's included: in the Panamanian market, a $65–140 “basic” installation usually covers labor only — materials, brackets, and wiring are charged separately.",
      ru: "Финальная цена с письменной гарантией 90 дней. Сравнивайте, что включено: на рынке Панамы «базовая» установка за $65–140 обычно покрывает только работу — материалы, кронштейны и проводка оплачиваются отдельно.",
    },
  },
  mantenimiento: {
    rows: [
      {
        concept: {
          es: "Mantenimiento preventivo de split (por visita)",
          en: "Preventive split maintenance (per visit)",
          ru: "Профилактика сплит-системы (за визит)",
        },
        price: "$50",
        detail: {
          es: "Limpieza de filtros, revisión de gas, inspección eléctrica y lubricación",
          en: "Filter cleaning, gas check, electrical inspection, and lubrication",
          ru: "Чистка фильтров, проверка газа, электрики и смазка",
        },
      },
      {
        concept: {
          es: "Mantenimiento de casete",
          en: "Cassette unit maintenance",
          ru: "Профилактика кассетного блока",
        },
        price: "$80",
      },
      {
        concept: {
          es: "Plan anual — 4 visitas trimestrales",
          en: "Annual plan — 4 quarterly visits",
          ru: "Годовой план — 4 квартальных визита",
        },
        price: { es: "$50/visita", en: "$50/visit", ru: "$50/визит" },
        detail: {
          es: "Frecuencia recomendada por ASHRAE para el clima tropical de Panamá",
          en: "Frequency recommended by ASHRAE for Panama's tropical climate",
          ru: "Частота, рекомендованная ASHRAE для тропического климата Панамы",
        },
      },
    ],
    footnote: {
      es: "Garantía de 60 días sobre cada visita. Incluye informe del estado del equipo y recomendaciones. Sin costos ocultos: usted conoce el precio total antes de comenzar.",
      en: "60-day warranty on every visit. Includes an equipment status report and recommendations. No hidden costs: you know the total price before we start.",
      ru: "Гарантия 60 дней на каждый визит. Включает отчёт о состоянии оборудования и рекомендации. Без скрытых платежей: итоговая цена известна до начала работ.",
    },
  },
};
