/**
 * Оптимизированные title и description для страниц услуг.
 *
 * Принципы:
 *  - Title: 50–60 символов. Ключевое слово + USP (цена / рейтинг) + бренд.
 *  - Description: 150–160 символов. Ценность + цифры + социальное доказательство + CTA.
 *  - Цифры (★5.0, 24/7, $29.99) визуально выделяют сниппет в SERP → +15–25% CTR.
 *
 * Клавиши: translation key (cleaning, maintenance, etc.) — для совместимости
 * с getTranslationKey() из services.ts.
 */

export interface ServiceMeta {
  title: { es: string; en: string; ru: string };
  description: { es: string; en: string; ru: string };
}

export const SERVICE_SEO_META: Record<string, ServiceMeta> = {
  cleaning: {
    title: {
      es: "Limpieza Aire Acondicionado Panamá desde $29.99 | 24clima",
      en: "AC Cleaning Panama from $29.99 | 24clima",
      ru: "Чистка кондиционера в Панаме от $29.99 | 24clima",
    },
    description: {
      es: "Limpieza profunda desde $29.99 (2+ splits) en Costa del Este y Ciudad de Panamá. Garantía 60 días. Servicio en 1-2h. ★5.0 en Google. WhatsApp 24/7.",
      en: "Deep cleaning from $29.99 (2+ splits) in Costa del Este and Panama City. 60-day warranty. 1-2h service. ★5.0 on Google. WhatsApp 24/7.",
      ru: "Глубокая чистка от $29.99 (2+ сплита) в Costa del Este и Панама-Сити. Гарантия 60 дней. За 1-2ч. ★5.0 в Google. WhatsApp 24/7.",
    },
  },
  maintenance: {
    title: {
      es: "Mantenimiento AC Panamá ★5.0 | desde $50 — 24clima",
      en: "AC Maintenance Panama ★5.0 | from $50 — 24clima",
      ru: "Обслуживание кондиционеров Панама ★5.0 | от $50 — 24clima",
    },
    description: {
      es: "Mantenimiento preventivo HVAC desde $50. Ahorra 20-25% en energía. Maestro con 9+ años. Garantía 60 días. ★5.0 (11 reseñas Google).",
      en: "Preventive HVAC maintenance from $50. Save 20-25% on energy. 9+ years master. 60-day warranty. ★5.0 (11 Google reviews).",
      ru: "Профилактика HVAC от $50. Экономия 20-25% электроэнергии. Мастер 9+ лет. Гарантия 60 дней. ★5.0 (11 отзывов Google).",
    },
  },
  repair: {
    title: {
      es: "Reparación Aire Acondicionado Panamá 24/7 desde $35 | 24clima",
      en: "AC Repair Panama 24/7 from $35 | 24clima",
      ru: "Ремонт кондиционера Панама 24/7 от $35 | 24clima",
    },
    description: {
      es: "Técnico HVAC en <2h. Reparación desde $35. AC no enfría, no prende, gotea — diagnóstico incluido. Garantía 90 días. ★5.0.",
      en: "HVAC technician in <2h. Repair from $35. AC not cooling, not turning on, leaking — diagnosis included. 90-day warranty. ★5.0.",
      ru: "Техник HVAC за <2ч. Ремонт от $35. Не холодит, не включается, течёт — диагностика включена. Гарантия 90 дней. ★5.0.",
    },
  },
  installation: {
    title: {
      es: "Instalación Aire Acondicionado Panamá desde $200 | 24clima",
      en: "AC Installation Panama from $200 | 24clima",
      ru: "Установка кондиционера Панама от $200 | 24clima",
    },
    description: {
      es: "Instalación back-to-back de splits y minisplits desde $200. Maestro HVAC formado en Alemania. Garantía 90 días. Ciudad de Panamá y alrededores.",
      en: "Back-to-back installation of splits and minisplits from $200. HVAC master trained in Germany. 90-day warranty. Panama City & surroundings.",
      ru: "Монтаж back-to-back сплитов и минисплитов от $200. Мастер HVAC, обучение в Германии. Гарантия 90 дней. Панама-Сити.",
    },
  },
  gasRecharge: {
    title: {
      es: "Recarga Gas AC Panamá desde $120 | 24clima",
      en: "AC Gas Recharge Panama from $120 | 24clima",
      ru: "Заправка кондиционера Панама от $120 | 24clima",
    },
    description: {
      es: "Recarga completa de gas refrigerante desde $120 — detección de fuga incluida. Técnico certificado EPA. Garantía 60 días. ★5.0 en Google.",
      en: "Full refrigerant recharge from $120 — leak detection included. EPA-certified technician. 60-day warranty. ★5.0 on Google.",
      ru: "Полная заправка хладагентом от $120 — поиск утечки включён. Сертифицированный техник EPA. Гарантия 60 дней. ★5.0.",
    },
  },
  emergency: {
    title: {
      es: "Emergencia AC Panamá 24/7 ★5.0 | 24clima",
      en: "Emergency AC Panama 24/7 ★5.0 | 24clima",
      ru: "Аварийный ремонт AC Панама 24/7 ★5.0 | 24clima",
    },
    description: {
      es: "¿AC no funciona AHORA? Técnico en <2 horas, 24/7/365. Cobertura toda Ciudad de Panamá. Maestro HVAC certificado. WhatsApp directo.",
      en: "AC not working NOW? Technician in <2 hours, 24/7/365. Full Panama City coverage. Certified HVAC master. Direct WhatsApp.",
      ru: "Кондиционер не работает СЕЙЧАС? Техник за <2ч, 24/7/365. Вся Панама-Сити. Сертифицированный мастер HVAC. WhatsApp.",
    },
  },

  gypsum: {
    title: {
      es: "Cielo Raso de Gypsum en Panamá desde $35/m² | 24clima",
      en: "Gypsum Ceilings in Panama from $35/m² | 24clima",
      ru: "Потолки из гипсокартона в Панаме от $35/м² | 24clima",
    },
    description: {
      es: "Instalación de cielo raso y paredes de gypsum listo para pintar desde $35/m². Cajones LED, lámina MR. Garantía 365 días. Ciudad de Panamá y Panamá Oeste.",
      en: "Gypsum ceilings and walls installed ready to paint from $35/m². LED coves, MR board. 365-day warranty. Panama City and Panamá Oeste.",
      ru: "Монтаж гипсокартонных потолков и стен под покраску от $35/м². Короба под LED, влагостойкий лист MR. Гарантия 365 дней. Панама-Сити и Panamá Oeste.",
    },
  },
  hiddenAc: {
    title: {
      es: "Aire Acondicionado por Ductos en Panamá desde $6 000 | 24clima",
      en: "Ducted Air Conditioning in Panama from $6,000 | 24clima",
      ru: "Канальный кондиционер в Панаме от $6 000 | 24clima",
    },
    description: {
      es: "Sistema de ductos con fan coil, difusores lineales y cielo raso de gypsum, todo con un solo contratista, desde $6 000. Cotización gratis. Garantía 365 días.",
      en: "Ducted system with fan coil, linear diffusers and gypsum ceiling, all from one contractor, from $6,000. Free quote. 365-day warranty. Panama City.",
      ru: "Канальная система: фанкойл, линейные диффузоры и гипсокартонный потолок у одного подрядчика, от $6 000. Расчёт бесплатно. Гарантия 365 дней.",
    },
  },
};

/**
 * serviceType para el JSON-LD `Service` de cada página de servicio.
 *
 * Antes se reutilizaba el H1 (`services.<key>.title`), que es copia de venta
 * y no una categoría de servicio. Aquí va la categoría corta y localizada,
 * que es lo que espera schema.org. Clave: translation key, igual que arriba.
 */
export const SERVICE_TYPE: Record<string, { es: string; en: string; ru: string }> = {
  cleaning: {
    es: "Limpieza profunda de aire acondicionado",
    en: "Air conditioner deep cleaning",
    ru: "Глубокая чистка кондиционера",
  },
  maintenance: {
    es: "Mantenimiento preventivo de aire acondicionado",
    en: "Air conditioner preventive maintenance",
    ru: "Профилактическое обслуживание кондиционера",
  },
  repair: {
    es: "Reparación de aire acondicionado",
    en: "Air conditioner repair",
    ru: "Ремонт кондиционера",
  },
  installation: {
    es: "Instalación de aire acondicionado",
    en: "Air conditioner installation",
    ru: "Установка кондиционера",
  },
  gasRecharge: {
    es: "Carga de gas refrigerante",
    en: "Refrigerant gas recharge",
    ru: "Заправка хладагентом",
  },
  emergency: {
    es: "Servicio de emergencia de aire acondicionado 24/7",
    en: "24/7 air conditioning emergency service",
    ru: "Аварийный выезд по кондиционерам 24/7",
  },
  gypsum: {
    es: "Instalación de cielo raso de gypsum",
    en: "Gypsum ceiling installation",
    ru: "Монтаж гипсокартонного потолка",
  },
  hiddenAc: {
    es: "Instalación de aire acondicionado por ductos",
    en: "Ducted air conditioning installation",
    ru: "Монтаж канального кондиционера",
  },
};
