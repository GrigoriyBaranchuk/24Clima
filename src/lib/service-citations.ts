/**
 * Citas y referencias externas de autoridades reconocidas por cada servicio.
 *
 * Objetivo: aumentar E-E-A-T (Trustworthiness) y visibilidad GEO (Generative
 * Engine Optimization). Según investigación de Princeton (2024), citar fuentes
 * autoritarias aumenta hasta +40% la probabilidad de ser citado por motores
 * de búsqueda generativos (ChatGPT, Perplexity, Google AI Overview, Claude).
 *
 * Reglas:
 * 1. Solo fuentes oficiales verificables: EPA, DOE, ENERGY STAR, ASHRAE, OSHA.
 * 2. URLs apuntan a páginas oficiales estables (no a PDFs internos ni noticias).
 * 3. Las afirmaciones (claim) son conservadoras y reflejan hechos ampliamente
 *    documentados por la fuente citada.
 * 4. Cada afirmación está traducida a es/en/ru para SEO multilingüe.
 *
 * Claves: ServiceSlug (español, mismo identificador que las URLs del sitio).
 */

import type { ServiceSlug } from "@/lib/services";

export interface Citation {
  /** Nombre visible de la autoridad/organización. */
  source: string;
  /** URL oficial de la fuente (estable, verificable). */
  url: string;
  /** Texto de la afirmación que respalda el servicio — una frase por idioma. */
  claim: {
    es: string;
    en: string;
    ru: string;
  };
}

export const SERVICE_CITATIONS: Record<ServiceSlug, Citation[]> = {
  limpieza: [
    {
      source: "ENERGY STAR (EPA/DOE)",
      url: "https://www.energystar.gov/saveathome/heating_cooling/maintenance",
      claim: {
        es:
          "Un filtro sucio puede aumentar el consumo energético de un sistema de aire acondicionado entre 5% y 15%.",
        en:
          "A dirty filter can increase an air conditioner's energy consumption by 5–15%.",
        ru:
          "Засорённый фильтр увеличивает энергопотребление кондиционера на 5–15%.",
      },
    },
    {
      source: "U.S. Department of Energy — Energy Saver",
      url: "https://www.energy.gov/energysaver/maintaining-your-air-conditioner",
      claim: {
        es:
          "El mantenimiento rutinario, incluida la limpieza de filtros y serpentines, es esencial para mantener la eficiencia del equipo y evitar averías prematuras.",
        en:
          "Routine maintenance, including cleaning filters and coils, is essential to preserve efficiency and prevent premature failures.",
        ru:
          "Регулярное обслуживание, включая чистку фильтров и теплообменников, необходимо для сохранения эффективности и предотвращения преждевременных поломок.",
      },
    },
  ],
  mantenimiento: [
    {
      source: "ASHRAE — Estándares técnicos HVAC",
      url: "https://www.ashrae.org/technical-resources",
      claim: {
        es:
          "ASHRAE recomienda inspecciones periódicas del sistema HVAC para asegurar eficiencia energética y calidad del aire interior, especialmente en climas cálidos y húmedos.",
        en:
          "ASHRAE recommends periodic HVAC inspections to ensure energy efficiency and indoor air quality, especially in hot and humid climates.",
        ru:
          "ASHRAE рекомендует периодические осмотры систем HVAC для поддержания энергоэффективности и качества воздуха, особенно в жарком и влажном климате.",
      },
    },
    {
      source: "ENERGY STAR — Heating & Cooling Maintenance",
      url: "https://www.energystar.gov/saveathome/heating_cooling/maintenance",
      claim: {
        es:
          "El mantenimiento programado ayuda a que un sistema de aire acondicionado conserve su eficiencia original durante toda su vida útil.",
        en:
          "Scheduled maintenance helps an AC system keep its original efficiency throughout its service life.",
        ru:
          "Плановое обслуживание помогает кондиционеру сохранять исходную эффективность на протяжении всего срока службы.",
      },
    },
  ],
  reparacion: [
    {
      source: "EPA — Sección 608 (Manejo de refrigerantes)",
      url: "https://www.epa.gov/section608",
      claim: {
        es:
          "Bajo la Sección 608 de la Ley de Aire Limpio de EE.UU., cualquier técnico que manipule refrigerantes debe estar certificado para prevenir emisiones que dañen la capa de ozono.",
        en:
          "Under Section 608 of the U.S. Clean Air Act, any technician handling refrigerants must be certified to prevent ozone-depleting emissions.",
        ru:
          "Согласно разделу 608 закона США Clean Air Act, техник, работающий с хладагентами, должен иметь сертификацию, чтобы не допускать выбросов, разрушающих озоновый слой.",
      },
    },
    {
      source: "U.S. Department of Energy — Energy Saver",
      url: "https://www.energy.gov/energysaver/central-air-conditioners",
      claim: {
        es:
          "Diagnosticar y reparar fugas y componentes defectuosos a tiempo evita daños mayores al compresor, que es la pieza más costosa del sistema.",
        en:
          "Diagnosing and repairing leaks and faulty components in time prevents major damage to the compressor, the system's most expensive part.",
        ru:
          "Своевременная диагностика и ремонт утечек и неисправных узлов предотвращает серьёзные повреждения компрессора — самой дорогой части системы.",
      },
    },
  ],
  instalacion: [
    {
      source: "ENERGY STAR — Room Air Conditioners",
      url: "https://www.energystar.gov/products/heating_cooling/air_conditioning/room",
      claim: {
        es:
          "Un aire acondicionado del tamaño correcto, instalado profesionalmente, consume significativamente menos energía que un equipo sobre-dimensionado o mal instalado.",
        en:
          "A correctly sized, professionally installed air conditioner uses significantly less energy than an oversized or poorly installed unit.",
        ru:
          "Правильно подобранный и профессионально установленный кондиционер потребляет значительно меньше энергии, чем устройство неподходящей мощности или смонтированное с ошибками.",
      },
    },
    {
      source: "U.S. Department of Energy — Central Air Conditioning",
      url: "https://www.energy.gov/energysaver/central-air-conditioners",
      claim: {
        es:
          "El DOE de EE.UU. recomienda que la instalación de equipos centrales siga las especificaciones del fabricante para lograr la eficiencia energética nominal.",
        en:
          "The U.S. DOE recommends that central AC installation follow manufacturer specifications to achieve rated energy efficiency.",
        ru:
          "Министерство энергетики США рекомендует выполнять монтаж центральных систем в соответствии с требованиями производителя для достижения паспортной эффективности.",
      },
    },
  ],
  "carga-de-gas": [
    {
      source: "EPA — Sección 608 (Refrigerantes)",
      url: "https://www.epa.gov/section608",
      claim: {
        es:
          "La carga de refrigerante debe ser realizada por un técnico certificado según la Sección 608 de la EPA; la manipulación sin certificación es ilegal en muchos países y daña el medio ambiente.",
        en:
          "Refrigerant recharge must be performed by an EPA Section 608 certified technician; unlicensed handling is illegal in many jurisdictions and harms the environment.",
        ru:
          "Заправку хладагента должен выполнять сертифицированный техник (EPA Section 608); работа без сертификации запрещена во многих странах и наносит вред окружающей среде.",
      },
    },
    {
      source: "ENERGY STAR — Heating & Cooling",
      url: "https://www.energystar.gov/saveathome/heating_cooling",
      claim: {
        es:
          "Un sistema con la carga de refrigerante correcta opera con mayor eficiencia y prolonga la vida útil del compresor.",
        en:
          "A system with the correct refrigerant charge operates more efficiently and extends compressor lifespan.",
        ru:
          "Система с правильным уровнем хладагента работает эффективнее и продлевает срок службы компрессора.",
      },
    },
  ],
  emergencia: [
    {
      source: "U.S. CDC — Extreme Heat",
      url: "https://www.cdc.gov/extreme-heat/index.html",
      claim: {
        es:
          "Los CDC de EE.UU. advierten que la exposición prolongada al calor extremo puede provocar enfermedades graves; mantener ambientes interiores frescos es una medida clave de prevención, en especial para adultos mayores y niños.",
        en:
          "The U.S. CDC warns that prolonged exposure to extreme heat can cause serious illness; keeping indoor spaces cool is a key preventive measure, especially for elders and children.",
        ru:
          "Центры по контролю заболеваний США (CDC) предупреждают, что длительное воздействие экстремальной жары опасно для здоровья; прохлада в помещениях — ключевая мера защиты, особенно для пожилых людей и детей.",
      },
    },
    {
      source: "ENERGY STAR — When to Repair or Replace",
      url: "https://www.energystar.gov/saveathome/heating_cooling",
      claim: {
        es:
          "Atender fallas súbitas del sistema de aire acondicionado con prontitud reduce el riesgo de daño al compresor y de interrupciones prolongadas del servicio.",
        en:
          "Addressing sudden AC failures promptly reduces the risk of compressor damage and extended downtime.",
        ru:
          "Быстрое устранение внезапных поломок кондиционера снижает риск повреждения компрессора и длительных простоев.",
      },
    },
  ],
};
