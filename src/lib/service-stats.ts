/**
 * Статистика и ключевые метрики по каждой услуге.
 *
 * Цель: предоставить AI-поисковикам (ChatGPT, Perplexity, Google AI Overview)
 * извлекаемые факты прямо в HTML. Princeton (2024): статистика увеличивает
 * вероятность GEO-цитирования на +25–35%.
 *
 * Источники помечены:
 *  - "EPA Energy Star" / "DOE" / "ASHRAE" / "CDC" — внешние авторитеты
 *    (совпадают с SERVICE_CITATIONS из задачи #6).
 *  - "Datos 24clima" — внутренняя статистика компании.
 *
 * Клавиши: ServiceSlug (испанские URL-идентификаторы).
 */

import type { ServiceSlug } from "@/lib/services";

export interface ServiceStat {
  /** Значение метрики — крупное отображение: "15%", "24/7", "$29.99". */
  value: string;
  /** Подпись к метрике — es / en / ru. */
  label: {
    es: string;
    en: string;
    ru: string;
  };
  /** Необязательная ссылка на авторитетный источник. */
  source?: string;
}

export const SERVICE_STATS: Record<ServiceSlug, ServiceStat[]> = {
  limpieza: [
    {
      value: "5–15%",
      label: {
        es: "Pérdida de eficiencia con filtros sucios",
        en: "Efficiency loss with dirty filters",
        ru: "Потеря эффективности с грязными фильтрами",
      },
      source: "EPA Energy Star",
    },
    {
      value: "3 meses",
      label: {
        es: "Frecuencia recomendada en clima tropical",
        en: "Recommended frequency in tropical climates",
        ru: "Рекомендуемая частота в тропическом климате",
      },
      source: "ASHRAE",
    },
    {
      value: "20–25%",
      label: {
        es: "Ahorro energético después de limpieza profunda",
        en: "Energy savings after deep cleaning",
        ru: "Экономия энергии после глубокой чистки",
      },
      source: "Datos 24clima (n=300+)", // VERIFY — округлённая выборка
    },
    {
      value: "1–2 h",
      label: {
        es: "Duración del servicio",
        en: "Service duration",
        ru: "Длительность услуги",
      },
      source: "Datos 24clima",
    },
  ],
  mantenimiento: [
    {
      value: "30–50%",
      label: {
        es: "Mayor vida útil con mantenimiento regular",
        en: "Longer lifespan with regular maintenance",
        ru: "Увеличение срока службы при регулярном ТО",
      },
      source: "ASHRAE",
    },
    {
      value: "5–15%",
      label: {
        es: "Reducción del consumo eléctrico",
        en: "Reduction in electricity consumption",
        ru: "Снижение электропотребления",
      },
      source: "DOE",
    },
    {
      value: "4×/año",
      label: {
        es: "Programa anual recomendado",
        en: "Recommended annual program",
        ru: "Рекомендуемая годовая программа",
      },
      source: "Datos 24clima",
    },
  ],
  reparacion: [
    {
      value: "24/7",
      label: {
        es: "Disponibilidad de respuesta",
        en: "Response availability",
        ru: "Доступность выезда",
      },
      source: "Datos 24clima",
    },
    {
      value: "<2 h",
      label: {
        es: "Tiempo de respuesta promedio",
        en: "Average response time",
        ru: "Среднее время прибытия",
      },
      source: "Datos 24clima",
    },
    {
      value: "90 días",
      label: {
        es: "Garantía sobre la reparación",
        en: "Repair warranty",
        ru: "Гарантия на ремонт",
      },
    },
  ],
  instalacion: [
    {
      value: "25–40%",
      label: {
        es: "Ahorro energético con instalación correcta",
        en: "Energy savings with proper installation",
        ru: "Экономия энергии при правильном монтаже",
      },
      source: "EPA Energy Star",
    },
    {
      value: "3–6 h",
      label: {
        es: "Duración de instalación split",
        en: "Split installation duration",
        ru: "Время установки сплит-системы",
      },
      source: "Datos 24clima",
    },
    {
      value: "90 días",
      label: {
        es: "Garantía sobre la instalación",
        en: "Installation warranty",
        ru: "Гарантия на установку",
      },
    },
  ],
  "carga-de-gas": [
    {
      value: "EPA 608",
      label: {
        es: "Certificación requerida para manejo de refrigerantes",
        en: "Required certification for refrigerant handling",
        ru: "Обязательная сертификация для работы с хладагентами",
      },
      source: "EPA",
    },
    {
      value: "60 días",
      label: {
        es: "Garantía sobre la recarga",
        en: "Recharge warranty",
        ru: "Гарантия на заправку",
      },
    },
    {
      value: "R-410A",
      label: {
        es: "Refrigerante ecológico que utilizamos",
        en: "Eco-friendly refrigerant we use",
        ru: "Используемый экологичный хладагент",
      },
      source: "Datos 24clima",
    },
  ],
  emergencia: [
    {
      value: "24/7/365",
      label: {
        es: "Disponibilidad de emergencia",
        en: "Emergency availability",
        ru: "Круглосуточная доступность",
      },
      source: "Datos 24clima",
    },
    {
      value: "<2 h",
      label: {
        es: "Tiempo de llegada en zona metropolitana",
        en: "Arrival time in metropolitan area",
        ru: "Время прибытия в черте города",
      },
      source: "Datos 24clima",
    },
    {
      value: "10+",
      label: {
        es: "Zonas de cobertura en Ciudad de Panamá",
        en: "Coverage zones in Panama City",
        ru: "Зон обслуживания в Панама-Сити",
      },
      source: "Datos 24clima",
    },
  ],
};
