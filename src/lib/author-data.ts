/**
 * Perfil del experto que respalda el contenido editorial y técnico de 24clima.
 * Usado en Person JSON-LD (E-E-A-T) y en el componente AuthorBio.
 *
 * Última actualización: 2026-04-14
 */

import { BUSINESS_DATA } from "@/lib/business-data";

export const EXPERT = {
  id: "https://24clima.com/#ryhor-baranchuk",
  name: "Ryhor Baranchuk",
  jobTitle: {
    es: "Maestro HVAC / Técnico en aire acondicionado",
    en: "HVAC Master Technician",
    ru: "Мастер HVAC / Техник по кондиционерам",
  },
  /** Años de experiencia (actualizar anualmente). */
  experienceYears: 9,
  /** Descripción del perfil para AuthorBio visible (por idioma). */
  bio: {
    es: "Maestro HVAC con más de 9 años de experiencia práctica instalando, manteniendo y reparando sistemas de aire acondicionado. Formación técnica realizada en Alemania. Responsable técnico de 24clima en Panamá, con más de 300 clientes atendidos en Ciudad de Panamá, Costa del Este, Punta Pacífica, San Francisco, Clayton y Albrook. Especializado en sistemas inverter, cassette y centrales, con enfoque en eficiencia energética y durabilidad en clima tropical.",
    en: "HVAC Master Technician with over 9 years of hands-on experience installing, servicing and repairing air conditioning systems. Technical training completed in Germany. Technical lead at 24clima in Panama, with 300+ clients served across Panama City, Costa del Este, Punta Pacífica, San Francisco, Clayton and Albrook. Specialist in inverter, cassette and central systems, focused on energy efficiency and durability in tropical climates.",
    ru: "Мастер HVAC с опытом более 9 лет. Установка, обслуживание и ремонт кондиционеров. Техническое обучение пройдено в Германии. Технический руководитель 24clima в Панаме, обслужил 300+ клиентов в Сьюдад-де-Панама, Коста-дель-Эсте, Пунта-Пасифика, Сан-Франциско, Клейтон и Альбрук. Специализация: инверторные, кассетные и центральные системы, энергоэффективность в тропическом климате.",
  },
  /** Línea corta para tarjetas/hero. */
  tagline: {
    es: "Maestro HVAC · 9+ años · Formado en Alemania",
    en: "HVAC Master · 9+ years · Trained in Germany",
    ru: "Мастер HVAC · 9+ лет опыта · Обучение в Германии",
  },
  image: "/uploads/ryhor-baranchuk-opt.webp",
  /** Alma mater — entrenamiento técnico. */
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Formación técnica HVAC en Alemania",
    address: { "@type": "PostalAddress", addressCountry: "DE" },
  },
  /** Áreas de conocimiento para schema.org knowsAbout. */
  knowsAbout: [
    "Aire acondicionado split",
    "Sistemas inverter",
    "Aire acondicionado tipo casete",
    "Aire acondicionado central",
    "Instalación HVAC",
    "Mantenimiento preventivo HVAC",
    "Reparación de compresores",
    "Refrigerantes R410A, R32, R22",
    "Eficiencia energética en clima tropical",
    "Detección de fugas de gas refrigerante",
  ],
  /** Perfiles públicos (sameAs) para reforzar identidad en buscadores e IA. */
  sameAs: [
    "https://www.instagram.com/24clima",
  ],
  worksFor: {
    "@id": BUSINESS_DATA.organizationId,
    "@type": "HVACBusiness",
    name: BUSINESS_DATA.name,
    url: BUSINESS_DATA.url,
  },
} as const;

/** Person JSON-LD para schema.org (usable en cualquier página). */
export function getPersonJsonLd(locale: "es" | "en" | "ru" = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": EXPERT.id,
    name: EXPERT.name,
    jobTitle: EXPERT.jobTitle[locale],
    description: EXPERT.bio[locale],
    image: `${BUSINESS_DATA.url}${EXPERT.image}`,
    worksFor: EXPERT.worksFor,
    alumniOf: EXPERT.alumniOf,
    knowsAbout: EXPERT.knowsAbout,
    sameAs: EXPERT.sameAs,
  };
}
