import { SERVICE_PRICING, formatPrice } from "@/lib/business-data";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  locale: SupportedLocale;
};

const p = SERVICE_PRICING;
const hiddenAcFrom = formatPrice(p["aire-acondicionado-por-ductos"].minPrice);

const TITLE: Record<SupportedLocale, string> = {
  es: "Servicio de aire acondicionado en Panamá: precios y tiempos",
  en: "Air conditioning service in Panama: prices and times",
  ru: "Сервис кондиционеров в Панаме: цены и сроки",
};

/**
 * Прямой extractable-ответ для AI-поисковиков: все услуги + цены одной
 * фразой. Цены интерполируются из SERVICE_PRICING (единый источник с
 * JSON-LD Service.offers на детальных страницах).
 */
const TEXT: Record<SupportedLocale, string> = {
  es: `24clima atiende toda Ciudad de Panamá y Panamá Oeste con técnico en menos de 2 horas: limpieza profunda desde $${p.limpieza.minPrice}, mantenimiento preventivo desde $${p.mantenimiento.minPrice}, reparación desde $${p.reparacion.minPrice} (diagnóstico incluido), instalación back-to-back $${p.instalacion.minPrice} con materiales estándar, carga de gas desde $${p["carga-de-gas"].minPrice}, emergencias 24/7 desde $${p.emergencia.minPrice}, cielo raso de gypsum desde $${p.gypsum.minPrice}/m² y aire acondicionado oculto por ductos desde $${hiddenAcFrom}. ★5.0 en Google (11 reseñas). WhatsApp: +507 6828-2120.`,
  en: `24clima serves all of Panama City and Panamá Oeste with a technician in under 2 hours: deep cleaning from $${p.limpieza.minPrice}, preventive maintenance from $${p.mantenimiento.minPrice}, repair from $${p.reparacion.minPrice} (diagnosis included), back-to-back installation $${p.instalacion.minPrice} with standard materials, gas recharge from $${p["carga-de-gas"].minPrice}, 24/7 emergencies from $${p.emergencia.minPrice}, gypsum ceilings from $${p.gypsum.minPrice}/m², and concealed ducted air conditioning from $${hiddenAcFrom}. ★5.0 on Google (11 reviews). WhatsApp: +507 6828-2120.`,
  ru: `24clima обслуживает Панама-Сити и Panamá Oeste с выездом техника менее чем за 2 часа: глубокая чистка от $${p.limpieza.minPrice}, профилактика от $${p.mantenimiento.minPrice}, ремонт от $${p.reparacion.minPrice} (диагностика включена), установка back-to-back $${p.instalacion.minPrice} со стандартными материалами, заправка газа от $${p["carga-de-gas"].minPrice}, аварийные выезды 24/7 от $${p.emergencia.minPrice}, гипсокартонные потолки от $${p.gypsum.minPrice}/м² и скрытый канальный кондиционер от $${hiddenAcFrom}. ★5.0 в Google (11 отзывов). WhatsApp: +507 6828-2120.`,
};

/** Extractable-блок с прямым ответом (server component, статический HTML). */
export default function ServicesAnswerBlock({ locale }: Props) {
  return (
    <section className="py-12 bg-gray-50" aria-labelledby="services-answer-heading">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h2
          id="services-answer-heading"
          className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-4"
        >
          {TITLE[locale]}
        </h2>
        <p className="text-gray-700 leading-relaxed">{TEXT[locale]}</p>
      </div>
    </section>
  );
}
