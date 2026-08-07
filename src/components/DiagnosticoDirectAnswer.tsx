import { SERVICE_PRICING } from "@/lib/business-data";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  locale: SupportedLocale;
};

const repairMin = SERVICE_PRICING.reparacion.minPrice;

const LABEL: Record<SupportedLocale, string> = {
  es: "Respuesta rápida",
  en: "Quick answer",
  ru: "Краткий ответ",
};

/**
 * Факты совпадают с DIAGNOSTIC_SYMPTOMS и FAQPage JSON-LD этой же страницы
 * («¿Por qué el aire acondicionado no enfría?») — прямой ответ для
 * AI Overview по запросу «aire acondicionado no enfría».
 */
const TEXT: Record<SupportedLocale, string> = {
  es: `Las causas más comunes por las que un aire acondicionado no enfría en Panamá son: filtros sucios, bajo nivel de refrigerante (fuga de gas), serpentín congelado o compresor dañado. Revise primero el filtro y el modo del control remoto; si el problema persiste, se necesita revisión profesional — desde $${repairMin} con diagnóstico incluido y llegada en menos de 2 horas.`,
  en: `The most common reasons an air conditioner doesn't cool in Panama are: dirty filters, low refrigerant (gas leak), a frozen coil, or a damaged compressor. Check the filter and remote-control mode first; if the problem persists, you need a professional inspection — from $${repairMin} with diagnosis included and arrival in under 2 hours.`,
  ru: `Самые частые причины, почему кондиционер не холодит в Панаме: грязные фильтры, низкий уровень хладагента (утечка газа), обмерзший испаритель или неисправный компрессор. Сначала проверьте фильтр и режим на пульте; если проблема осталась — нужна профессиональная диагностика: от $${repairMin}, диагностика включена, приезд менее чем за 2 часа.`,
};

/** Прямой ответ в начале страницы диагностики (server component). */
export default function DiagnosticoDirectAnswer({ locale }: Props) {
  return (
    <section className="bg-[#7BC043]/5 border-b border-[#7BC043]/20">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F9D58] mb-2">
          {LABEL[locale]}
        </p>
        <p className="text-gray-800 leading-relaxed">{TEXT[locale]}</p>
      </div>
    </section>
  );
}
