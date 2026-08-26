import { Link } from "@/i18n/routing";
import type { ServiceSlug } from "@/lib/services";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  service: ServiceSlug;
  locale: SupportedLocale;
};

interface IntentNote {
  title: Record<SupportedLocale, string>;
  text: Record<SupportedLocale, string>;
  linkHref: string;
  linkLabel: Record<SupportedLocale, string>;
}

/**
 * Google muestra resultados casi idénticos para «limpieza» y «mantenimiento
 * aire acondicionado Panamá» — este bloque separa las intenciones y
 * enlaza la página hermana.
 */
const INTENT_NOTES: Partial<Record<ServiceSlug, IntentNote>> = {
  limpieza: {
    title: {
      es: "¿Limpieza profunda o mantenimiento preventivo?",
      en: "Deep cleaning or preventive maintenance?",
      ru: "Глубокая чистка или профилактика?",
    },
    text: {
      es: "La limpieza profunda (desde $29.99) desmonta el equipo y lava el evaporador, la turbina y el drenaje — se recomienda 1–2 veces al año. El mantenimiento preventivo (desde $50) es una revisión trimestral más ligera: filtros, presión de gas, electricidad y lubricación. Si su equipo huele mal o enfría poco, empiece por la limpieza; para protegerlo todo el año, combine ambos.",
      en: "Deep cleaning (from $29.99) disassembles the unit and washes the evaporator, turbine, and drain — recommended 1–2 times a year. Preventive maintenance (from $50) is a lighter quarterly check: filters, gas pressure, electrics, and lubrication. If your unit smells bad or cools poorly, start with a cleaning; to protect it year-round, combine both.",
      ru: "Глубокая чистка (от $29.99) — это разборка блока и мойка испарителя, турбины и дренажа, рекомендуется 1–2 раза в год. Профилактика (от $50) — более лёгкий квартальный осмотр: фильтры, давление газа, электрика и смазка. Если кондиционер пахнет или плохо холодит — начните с чистки; для круглогодичной защиты сочетайте обе услуги.",
    },
    linkHref: "/servicios/mantenimiento",
    linkLabel: {
      es: "Ver mantenimiento preventivo",
      en: "See preventive maintenance",
      ru: "Подробнее о профилактике",
    },
  },
  mantenimiento: {
    title: {
      es: "¿Mantenimiento preventivo o limpieza profunda?",
      en: "Preventive maintenance or deep cleaning?",
      ru: "Профилактика или глубокая чистка?",
    },
    text: {
      es: "El mantenimiento preventivo (desde $50) es una revisión trimestral: filtros, presión de gas, inspección eléctrica y lubricación — evita averías y mantiene la eficiencia. La limpieza profunda (desde $29.99) va más allá: desmonta el equipo y lava el evaporador y la turbina con espuma antibacterial. Si nunca ha limpiado su equipo a fondo, empiece por ahí; luego el plan trimestral lo mantiene en forma.",
      en: "Preventive maintenance (from $50) is a quarterly check: filters, gas pressure, electrical inspection, and lubrication — it prevents breakdowns and keeps efficiency up. Deep cleaning (from $29.99) goes further: it disassembles the unit and washes the evaporator and turbine with antibacterial foam. If your unit has never been deep-cleaned, start there; then the quarterly plan keeps it in shape.",
      ru: "Профилактика (от $50) — квартальный осмотр: фильтры, давление газа, электрика и смазка; предотвращает поломки и сохраняет эффективность. Глубокая чистка (от $29.99) идёт дальше: разборка блока и мойка испарителя и турбины антибактериальной пеной. Если глубокой чистки ещё не было — начните с неё, а квартальный план поддержит результат.",
    },
    linkHref: "/servicios/limpieza",
    linkLabel: {
      es: "Ver limpieza profunda",
      en: "See deep cleaning",
      ru: "Подробнее о чистке",
    },
  },
  reparacion: {
    title: {
      es: "¿Reparación o recarga de gas refrigerante?",
      en: "Repair or refrigerant gas recharge?",
      ru: "Ремонт или заправка хладагентом?",
    },
    text: {
      es: "La reparación (desde $35, diagnóstico incluido) cubre fallas eléctricas y mecánicas: capacitor, contactor, tarjeta electrónica, motor del ventilador, compresor o drenaje tapado. Pero si el equipo enciende y solo enfría poco, la causa suele ser una fuga o falta de gas refrigerante — eso se resuelve con una carga completa (desde $120) que incluye detección y reparación de la fuga. Si no puede esperar, el servicio de emergencia 24/7 tiene una tarifa fija de $40 por la llamada y el técnico llega en menos de 2 horas.",
      en: "A repair (from $35, diagnosis included) covers electrical and mechanical faults: capacitor, contactor, electronic board, fan motor, compressor or a blocked drain. But if the unit turns on and simply cools poorly, the cause is usually a leak or a lack of refrigerant gas — that is solved with a full recharge (from $120) which includes leak detection and repair. If you can't wait, the 24/7 emergency service has a flat $40 call-out fee and the technician arrives in under 2 hours.",
      ru: "Ремонт (от $35, диагностика включена) — это электрические и механические неисправности: конденсатор, пускатель, плата, мотор вентилятора, компрессор или забитый дренаж. Но если блок включается и просто слабо холодит, причина обычно в утечке или нехватке хладагента — это решает полная заправка (от $120) с поиском и устранением утечки. Если ждать нельзя, аварийный выезд 24/7 стоит фиксированные $40 за вызов, техник приезжает менее чем за 2 часа.",
    },
    linkHref: "/servicios/carga-de-gas",
    linkLabel: {
      es: "Ver recarga de gas refrigerante",
      en: "See refrigerant gas recharge",
      ru: "Подробнее о заправке хладагентом",
    },
  },
  instalacion: {
    title: {
      es: "¿Instalación de split a la vista o sistema oculto por ductos?",
      en: "Visible split installation or a concealed ducted system?",
      ru: "Монтаж настенного сплита или скрытая канальная система?",
    },
    text: {
      es: "La instalación de un split o minisplit a la vista (back-to-back desde $200) es la opción rápida y económica: el equipo queda montado en la pared y se hace en pocas horas, con garantía de 90 días. Si lo que quiere es que no se vea ningún equipo — solo difusores lineales en el cielo raso —, entonces hablamos de un sistema de aire acondicionado por ductos con fan coil y gypsum, desde $6 000. Conviene decidirlo antes de cerrar el cielo raso: después obliga a abrirlo de nuevo.",
      en: "Installing a visible split or minisplit (back-to-back from $200) is the fast, economical option: the unit goes on the wall and the job takes a few hours, with a 90-day warranty. If you want no equipment in sight — only linear diffusers in the ceiling — then you need a ducted air conditioning system with fan coil and gypsum, from $6,000. Best decided before the ceiling is closed: afterwards it has to be opened again.",
      ru: "Монтаж настенного сплита или минисплита (back-to-back от $200) — быстрый и недорогой вариант: блок вешается на стену, работа занимает несколько часов, гарантия 90 дней. Если же нужно, чтобы техники не было видно — только линейные диффузоры в потолке, — речь идёт о канальной системе с фанкойлом и гипсокартоном, от $6 000. Решать это лучше до закрытия потолка: потом его придётся вскрывать заново.",
    },
    linkHref: "/servicios/aire-acondicionado-por-ductos",
    linkLabel: {
      es: "Ver aire acondicionado por ductos",
      en: "See ducted air conditioning",
      ru: "Подробнее о канальном кондиционере",
    },
  },
  gypsum: {
    title: {
      es: "¿Solo el cielo raso o también esconder el aire acondicionado?",
      en: "Just the ceiling, or hide the air conditioning too?",
      ru: "Только потолок или ещё и спрятать кондиционер?",
    },
    text: {
      es: "El cielo raso de gypsum (desde $35/m²) cubre estructura, lámina, cinta, pasta y lijado listo para pintar: es la opción cuando el aire acondicionado ya está resuelto o va a la vista. Si además quiere que el equipo desaparezca, lo correcto es decidirlo antes de cerrar el cielo raso: el sistema de ductos con fan coil, difusores lineales y el gypsum alrededor va desde $6 000 y lo hace la misma cuadrilla, en un solo contrato.",
      en: "A gypsum ceiling (from $35/m²) covers framing, board, tape, compound and sanding ready to paint: that's the option when the air conditioning is already sorted or stays visible. If you also want the unit to disappear, decide it before the ceiling is closed: the ducted system with fan coil, linear diffusers and the gypsum around it starts at $6,000 and is done by the same crew, under one contract.",
      ru: "Потолок из гипсокартона (от $35/м²) — это каркас, лист, лента, шпаклёвка и шлифовка под покраску: вариант, когда с кондиционером уже всё решено или он остаётся на виду. Если хочется, чтобы техника исчезла, решать это надо до закрытия потолка: канальная система с фанкойлом, линейными диффузорами и гипсокартоном вокруг стоит от $6 000 и делается той же бригадой по одному договору.",
    },
    linkHref: "/servicios/aire-acondicionado-por-ductos",
    linkLabel: {
      es: "Ver aire acondicionado por ductos",
      en: "See ducted air conditioning",
      ru: "Подробнее о канальном кондиционере",
    },
  },
  "aire-acondicionado-por-ductos": {
    title: {
      es: "¿Sistema de ductos o solo cielo raso de gypsum?",
      en: "Ducted system or just a gypsum ceiling?",
      ru: "Канальная система или только потолок из гипсокартона?",
    },
    text: {
      es: "El aire acondicionado oculto (desde $6 000) incluye fan coil, ductos, difusores lineales, drenaje, puertas de acceso y el cielo raso de gypsum que lo envuelve: se contrata cuando quiere que el equipo no se vea. Si su aire acondicionado ya está instalado y lo único que busca es una superficie lisa, cajones con luz LED o niveles, entonces lo que necesita es la instalación de gypsum sola, desde $35/m².",
      en: "Concealed air conditioning (from $6,000) includes the fan coil, ducts, linear diffusers, drainage, access doors and the gypsum ceiling around it: you book it when you want the equipment out of sight. If your AC is already installed and all you want is a smooth surface, LED coves or stepped levels, then plain gypsum installation is what you need, from $35/m².",
      ru: "Скрытый кондиционер (от $6 000) — это фанкойл, воздуховоды, линейные диффузоры, дренаж, лючки доступа и гипсокартонный потолок вокруг: заказывают, когда технику не должно быть видно. Если кондиционер уже стоит и нужна только ровная поверхность, короба под LED или уровни — вам подойдёт отдельный монтаж гипсокартона, от $35/м².",
    },
    linkHref: "/servicios/gypsum",
    linkLabel: {
      es: "Ver instalación de gypsum",
      en: "See gypsum installation",
      ru: "Подробнее о гипсокартоне",
    },
  },
};

/** Bloque estático de desambiguación de intención (server component). */
export default function ServiceIntentNote({ service, locale }: Props) {
  const note = INTENT_NOTES[service];
  if (!note) return null;

  return (
    <section className="py-12 bg-gray-50" aria-labelledby="intent-note-heading">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h2 id="intent-note-heading" className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-4">
          {note.title[locale]}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">{note.text[locale]}</p>
        <Link
          href={note.linkHref}
          className="font-semibold text-[#0F9D58] hover:underline"
        >
          {note.linkLabel[locale]} →
        </Link>
      </div>
    </section>
  );
}
