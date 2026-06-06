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
