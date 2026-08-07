import { Link } from "@/i18n/routing";
import { MapPin } from "lucide-react";
import { SERVICE_AREAS } from "@/lib/areas-data";
import type { ServiceSlug } from "@/lib/services";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  service: ServiceSlug;
  locale: SupportedLocale;
};

/** Solo en las páginas de servicios comerciales prioritarios. */
const TARGET_SERVICES: ServiceSlug[] = ["instalacion", "mantenimiento", "limpieza"];

const TITLE: Record<SupportedLocale, string> = {
  es: "Zonas de cobertura en Ciudad de Panamá",
  en: "Coverage areas in Panama City",
  ru: "Зоны обслуживания в Панама-Сити",
};

const SUBTITLE: Record<SupportedLocale, string> = {
  es: "Llegada en menos de 2 horas en la zona metropolitana y Panamá Oeste:",
  en: "Arrival in under 2 hours across the metro area and Panamá Oeste:",
  ru: "Прибытие менее чем за 2 часа по агломерации и Panamá Oeste:",
};

const LINK_LABEL: Record<SupportedLocale, string> = {
  es: "Ver todas las zonas y tiempos de llegada",
  en: "See all areas and arrival times",
  ru: "Все зоны и время прибытия",
};

/**
 * Lista estática de zonas de cobertura (server component).
 * Los nombres provienen de SERVICE_AREAS (misma fuente que /areas-de-servicio),
 * el enlace apunta al hub — no existen páginas individuales por zona.
 */
export default function ServiceCoverageAreas({ service, locale }: Props) {
  if (!TARGET_SERVICES.includes(service)) return null;

  return (
    <section className="py-16 bg-white" aria-labelledby="coverage-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <h2
          id="coverage-heading"
          className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] text-center mb-4"
        >
          {TITLE[locale]}
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">{SUBTITLE[locale]}</p>
        <ul className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto mb-8 list-none">
          {SERVICE_AREAS.map((area) => (
            <li
              key={area.slug}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-[#1e3a5f]"
            >
              {area.name}
            </li>
          ))}
        </ul>
        <p className="text-center">
          <Link
            href="/areas-de-servicio"
            className="inline-flex items-center gap-2 font-semibold text-[#0F9D58] hover:underline"
          >
            <MapPin className="w-4 h-4" />
            {LINK_LABEL[locale]} →
          </Link>
        </p>
      </div>
    </section>
  );
}
