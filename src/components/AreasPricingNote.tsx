import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import { SERVICE_PRICING, formatPrice } from "@/lib/business-data";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  locale: SupportedLocale;
};

const p = SERVICE_PRICING;
const hiddenAcFrom = formatPrice(p["aire-acondicionado-oculto"].minPrice);

/**
 * Цены одинаковы во всех зонах + время прибытия по ключевым районам.
 * Времена совпадают с SERVICE_AREAS (карточки ниже на этой же странице);
 * цены — из SERVICE_PRICING. Цель: цитируемость по гео-запросам вида
 * «limpieza aire acondicionado Costa del Este».
 */
const TEXT: Record<SupportedLocale, string> = {
  es: `Los precios son los mismos en todas las zonas de cobertura: limpieza profunda desde $${p.limpieza.minPrice} por split, mantenimiento desde $${p.mantenimiento.minPrice}, reparación desde $${p.reparacion.minPrice}, recarga de gas desde $${p["carga-de-gas"].minPrice}, instalación back-to-back $${p.instalacion.minPrice}, cielo raso de gypsum desde $${p.gypsum.minPrice}/m² y aire acondicionado oculto por ductos desde $${hiddenAcFrom}. Tiempo de llegada: Costa del Este y Punta Pacífica en menos de 1.5 horas, centro de Ciudad de Panamá en menos de 2 horas, Panamá Oeste según la zona.`,
  en: `Prices are the same in every coverage area: deep cleaning from $${p.limpieza.minPrice} per split, maintenance from $${p.mantenimiento.minPrice}, repair from $${p.reparacion.minPrice}, gas recharge from $${p["carga-de-gas"].minPrice}, back-to-back installation $${p.instalacion.minPrice}, gypsum ceilings from $${p.gypsum.minPrice}/m², and concealed ducted air conditioning from $${hiddenAcFrom}. Arrival time: Costa del Este and Punta Pacífica in under 1.5 hours, downtown Panama City in under 2 hours, Panamá Oeste depending on the area.`,
  ru: `Цены одинаковы во всех зонах обслуживания: глубокая чистка от $${p.limpieza.minPrice} за сплит, профилактика от $${p.mantenimiento.minPrice}, ремонт от $${p.reparacion.minPrice}, заправка газа от $${p["carga-de-gas"].minPrice}, установка back-to-back $${p.instalacion.minPrice}, гипсокартонные потолки от $${p.gypsum.minPrice}/м², скрытый канальный кондиционер от $${hiddenAcFrom}. Время прибытия: Costa del Este и Punta Pacífica — менее 1,5 часов, центр Панама-Сити — менее 2 часов, Panamá Oeste — по зоне.`,
};

const CTA: Record<SupportedLocale, string> = {
  es: "Solicitar servicio por WhatsApp",
  en: "Request service on WhatsApp",
  ru: "Заказать через WhatsApp",
};

const CTA_MSG: Record<SupportedLocale, string> = {
  es: "Hola, necesito servicio de aire acondicionado en mi zona.",
  en: "Hi, I need air conditioning service in my area.",
  ru: "Hola, necesito servicio de aire acondicionado en mi zona.",
};

/** Extractable-блок цен и времени прибытия + CTA (server component). */
export default function AreasPricingNote({ locale }: Props) {
  const msg = encodeURIComponent(CTA_MSG[locale]);
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-8">
        <p className="text-gray-800 leading-relaxed mb-4">{TEXT[locale]}</p>
        <TrackedWhatsAppLink
          href={`https://wa.me/50768282120?text=${msg}`}
          eventName="Lead"
          className="inline-flex items-center gap-2 font-semibold text-[#0F9D58] hover:underline"
        >
          {CTA[locale]} →
        </TrackedWhatsAppLink>
      </div>
    </section>
  );
}
