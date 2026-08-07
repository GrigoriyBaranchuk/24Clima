import { SERVICE_PRICING } from "@/lib/business-data";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  locale: SupportedLocale;
};

const p = SERVICE_PRICING;

/**
 * Цены одинаковы во всех зонах + время прибытия по ключевым районам.
 * Времена совпадают с SERVICE_AREAS (карточки ниже на этой же странице);
 * цены — из SERVICE_PRICING. Цель: цитируемость по гео-запросам вида
 * «limpieza aire acondicionado Costa del Este».
 */
const TEXT: Record<SupportedLocale, string> = {
  es: `Los precios son los mismos en todas las zonas de cobertura: limpieza profunda desde $${p.limpieza.minPrice} por split, mantenimiento desde $${p.mantenimiento.minPrice}, reparación desde $${p.reparacion.minPrice} e instalación back-to-back $${p.instalacion.minPrice}. Tiempo de llegada: Costa del Este y Punta Pacífica en menos de 1.5 horas, centro de Ciudad de Panamá en menos de 2 horas, Panamá Oeste según la zona.`,
  en: `Prices are the same in every coverage area: deep cleaning from $${p.limpieza.minPrice} per split, maintenance from $${p.mantenimiento.minPrice}, repair from $${p.reparacion.minPrice}, and back-to-back installation $${p.instalacion.minPrice}. Arrival time: Costa del Este and Punta Pacífica in under 1.5 hours, downtown Panama City in under 2 hours, Panamá Oeste depending on the area.`,
  ru: `Цены одинаковы во всех зонах обслуживания: глубокая чистка от $${p.limpieza.minPrice} за сплит, профилактика от $${p.mantenimiento.minPrice}, ремонт от $${p.reparacion.minPrice}, установка back-to-back $${p.instalacion.minPrice}. Время прибытия: Costa del Este и Punta Pacífica — менее 1,5 часов, центр Панама-Сити — менее 2 часов, Panamá Oeste — по зоне.`,
};

/** Extractable-блок цен и времени прибытия (server component). */
export default function AreasPricingNote({ locale }: Props) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-8">
        <p className="text-gray-800 leading-relaxed">{TEXT[locale]}</p>
      </div>
    </section>
  );
}
