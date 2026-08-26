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
  priceRange: "$$",
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
  /**
   * Unidad del precio cuando no es «por servicio» (UN/CEFACT, ej. "MTK" = m²).
   * Si está presente, el JSON-LD emite UnitPriceSpecification en lugar de
   * PriceSpecification — así el precio por m² no se lee como precio total.
   */
  priceUnitCode?: string;
  /** Etiqueta legible de la unidad: "m²". */
  priceUnitText?: string;
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
  gypsum: {
    minPrice: 35,
    maxPrice: 65,
    currency: "USD",
    warrantyDays: 365,
    priceUnitCode: "MTK",
    priceUnitText: "m²",
    note: "Precio por m² de cielo raso liso listo para pintar: estructura, lámina, cinta, pasta y lijado. Condiciones del precio desde: área mínima 20 m², altura hasta 3 m, sin demolición y con lámina estándar. Cajón con luz LED desde $25 por metro lineal. Lámina MR o firecode, paredes y acabados con niveles se cotizan aparte.",
  },
  "aire-acondicionado-por-ductos": {
    minPrice: 6000,
    maxPrice: 20000,
    currency: "USD",
    warrantyDays: 365,
    note: "Instalación completa llave en mano: fan coil, ductos, difusores lineales, puertas de acceso y cielo raso de gypsum. Precio según m², tonelaje y puntos de aire. Visita y cotización gratis.",
  },
} as const;

/**
 * Helper: separador de miles usado en la copia visible del sitio.
 * Ej: 6000 → "6 000" (espacio duro, para que el monto no se parta de línea).
 */
export function formatPrice(amount: number): string {
  return amount.toLocaleString("en-US").replace(/,/g, "\u00a0");
}

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
          es: "Instalación back-to-back (split/minisplit 9.000–24.000 BTU)",
          en: "Back-to-back installation (split/minisplit 9,000–24,000 BTU)",
          ru: "Установка back-to-back (сплит/минисплит 9 000–24 000 BTU)",
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
  "carga-de-gas": {
    rows: [
      {
        concept: {
          es: "Recarga completa de gas refrigerante (R-410A)",
          en: "Full refrigerant recharge (R-410A)",
          ru: "Полная заправка хладагентом (R-410A)",
        },
        price: { es: "desde $120", en: "from $120", ru: "от $120" },
        detail: {
          es: "Incluye detección y reparación de la fuga. El precio final depende del BTU del equipo y la longitud de la tubería (hasta $210)",
          en: "Includes leak detection and repair. Final price depends on unit BTU and piping length (up to $210)",
          ru: "Включает поиск и устранение утечки. Итоговая цена зависит от BTU и длины трассы (до $210)",
        },
      },
      {
        concept: {
          es: "Equipos inverter — carga completa por peso",
          en: "Inverter units — full charge by weight",
          ru: "Инверторные блоки — полная заправка по весу",
        },
        price: { es: "incluido", en: "included", ru: "включено" },
        detail: {
          es: "Los equipos inverter no se rellenan: requieren vacío y carga completa por peso con balanza de precisión",
          en: "Inverter units can't be topped up: they require vacuum and a full charge by weight with a precision scale",
          ru: "Инверторные блоки не дозаправляются: требуется вакуумирование и полная заправка по весу",
        },
      },
    ],
    footnote: {
      es: "Garantía de 60 días. No recargamos sin encontrar y reparar primero la causa de la pérdida de gas — recargar con fuga es tirar el dinero.",
      en: "60-day warranty. We don't recharge without first finding and repairing the cause of the gas loss — recharging with a leak is throwing money away.",
      ru: "Гарантия 60 дней. Не заправляем, пока не найдена и не устранена причина утечки — заправка с утечкой означает выброшенные деньги.",
    },
  },
  gypsum: {
    rows: [
      {
        concept: {
          es: "Cielo raso de gypsum liso, listo para pintar",
          en: "Smooth gypsum ceiling, ready to paint",
          ru: "Ровный гипсокартонный потолок под покраску",
        },
        price: { es: "desde $35/m²", en: "from $35/m²", ru: "от $35/м²" },
        detail: {
          es: "Estructura metálica, lámina, cinta, pasta y lijado incluidos",
          en: "Metal framing, board, tape, joint compound, and sanding included",
          ru: "Металлический каркас, лист, лента, шпаклёвка и шлифовка включены",
        },
      },
      {
        concept: {
          es: "Cajón perimetral con luz LED",
          en: "Perimeter cove with LED strip",
          ru: "Периметральный короб под LED-ленту",
        },
        price: {
          es: "desde $25/ml",
          en: "from $25 per linear meter",
          ru: "от $25/пог. м",
        },
        detail: {
          es: "Por metro lineal de cajón, con espacio para la tira LED",
          en: "Per linear meter of cove, with a channel for the LED strip",
          ru: "За погонный метр короба, с нишей под LED-ленту",
        },
      },
      {
        concept: {
          es: "Paredes y divisiones de gypsum",
          en: "Gypsum walls and partitions",
          ru: "Стены и перегородки из гипсокартона",
        },
        price: {
          es: "cotización gratis",
          en: "free quote",
          ru: "бесплатный расчёт",
        },
        detail: {
          es: "Según metraje, altura y tipo de lámina (estándar, MR o firecode)",
          en: "Based on area, height, and board type (standard, MR, or firecode)",
          ru: "По площади, высоте и типу листа (стандарт, MR или firecode)",
        },
      },
      {
        concept: {
          es: "Niveles, nichos y acabados especiales",
          en: "Multi-level ceilings, niches, and special finishes",
          ru: "Многоуровневые потолки, ниши и особые решения",
        },
        price: {
          es: "cotización gratis",
          en: "free quote",
          ru: "бесплатный расчёт",
        },
        detail: {
          es: "Medimos en sitio y entregamos el precio cerrado antes de empezar",
          en: "We measure on site and give you a fixed price before starting",
          ru: "Замер на объекте и фиксированная цена до начала работ",
        },
      },
    ],
    footnote: {
      es: "El precio desde $35/m² aplica a partir de 20 m², con altura hasta 3 m, sin demolición del cielo raso existente y con lámina estándar de 1/2″. La lámina MR (baños y cocinas) y la firecode de 5/8″ tienen recargo. Garantía de 365 días sobre juntas y estructura.",
      en: "The $35/m² starting price applies from 20 m² up, with ceiling height up to 3 m, no demolition of the existing ceiling, and standard 1/2″ board. MR board (bathrooms and kitchens) and 5/8″ firecode carry a surcharge. 365-day warranty on joints and framing.",
      ru: "Цена от $35/м² действует от 20 м², при высоте до 3 м, без демонтажа существующего потолка и со стандартным листом 1/2″. Влагостойкий лист MR (санузлы и кухни) и огнестойкий 5/8″ — с доплатой. Гарантия 365 дней на швы и каркас.",
    },
  },
  "aire-acondicionado-por-ductos": {
    rows: [
      {
        concept: {
          es: "Visita técnica y cotización",
          en: "Site visit and quote",
          ru: "Выезд на объект и расчёт",
        },
        price: { es: "gratis", en: "free", ru: "бесплатно" },
        detail: {
          es: "Medimos el espacio y confirmamos el tonelaje y los puntos de aire, sin compromiso",
          en: "We measure the space and confirm tonnage and air outlets, no obligation",
          ru: "Замеряем помещение и подтверждаем мощность и число точек, без обязательств",
        },
      },
      {
        concept: {
          es: "Apartamento, una zona (hasta 40 m²)",
          en: "Apartment, one zone (up to 40 m²)",
          ru: "Квартира, одна зона (до 40 м²)",
        },
        price: { es: "desde $6 000", en: "from $6,000", ru: "от $6 000" },
        detail: {
          es: "Fan coil, ductos, difusores lineales, drenaje y puertas de acceso",
          en: "Fan coil, ducts, linear diffusers, drainage, and access doors",
          ru: "Фанкойл, воздуховоды, линейные диффузоры, дренаж и лючки доступа",
        },
      },
      {
        concept: {
          es: "Apartamento completo (100–150 m²)",
          en: "Full apartment (100–150 m²)",
          ru: "Квартира целиком (100–150 м²)",
        },
        price: {
          es: "$9 000 – $20 000",
          en: "$9,000 – $20,000",
          ru: "$9 000 – $20 000",
        },
        detail: {
          es: "El monto depende del tonelaje, la cantidad de puntos de aire y el metraje de cielo raso",
          en: "The amount depends on tonnage, number of air outlets, and ceiling area",
          ru: "Сумма зависит от мощности, числа точек подачи и площади потолка",
        },
      },
      {
        concept: {
          es: "Cielo raso de gypsum alrededor del sistema",
          en: "Gypsum ceiling around the system",
          ru: "Гипсокартонный потолок вокруг системы",
        },
        price: { es: "incluido", en: "included", ru: "включено" },
        detail: {
          es: "Una sola cuadrilla y un solo contrato para el clima y el cielo raso",
          en: "One crew and one contract for both the cooling system and the ceiling",
          ru: "Одна бригада и один договор на климат и потолок",
        },
      },
    ],
    footnote: {
      es: "Rango real de obras entregadas en Ciudad de Panamá: $6 000 – $20 000 por vivienda. El precio final depende de los m², el tonelaje y la cantidad de puntos de aire; la visita y la cotización son gratis. Garantía de 365 días sobre la instalación.",
      en: "Real range of jobs delivered in Panama City: $6,000 – $20,000 per home. The final price depends on square meters, tonnage, and the number of air outlets; the visit and quote are free. 365-day warranty on the installation.",
      ru: "Реальный диапазон сданных объектов в Панама-Сити: $6 000 – $20 000 за квартиру. Итоговая цена зависит от площади, мощности и числа точек подачи; выезд и расчёт бесплатны. Гарантия 365 дней на монтаж.",
    },
  },
};
