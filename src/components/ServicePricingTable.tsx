import { SERVICE_PRICING_TABLES } from "@/lib/business-data";
import type { ServiceSlug } from "@/lib/services";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  service: ServiceSlug;
  locale: SupportedLocale;
};

const SECTION_TITLE: Record<SupportedLocale, string> = {
  es: "Precios transparentes",
  en: "Transparent pricing",
  ru: "Прозрачные цены",
};

const CONCEPT_HEADER: Record<SupportedLocale, string> = {
  es: "Servicio",
  en: "Service",
  ru: "Услуга",
};

const PRICE_HEADER: Record<SupportedLocale, string> = {
  es: "Precio",
  en: "Price",
  ru: "Цена",
};

/**
 * Tabla de precios estática (server component, sin JS de cliente).
 * Renderiza solo para servicios con datos en SERVICE_PRICING_TABLES;
 * los montos coinciden con el JSON-LD Service.offers (misma fuente).
 */
export default function ServicePricingTable({ service, locale }: Props) {
  const table = SERVICE_PRICING_TABLES[service];
  if (!table) return null;

  return (
    <section className="py-16 lg:py-24 bg-white" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <h2
          id="pricing-heading"
          className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] text-center mb-10"
        >
          {SECTION_TITLE[locale]}
        </h2>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-[#1e3a5f]/15">
                <th scope="col" className="py-3 pr-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {CONCEPT_HEADER[locale]}
                </th>
                <th scope="col" className="py-3 text-sm font-semibold uppercase tracking-wide text-gray-500 text-right whitespace-nowrap">
                  {PRICE_HEADER[locale]}
                </th>
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 pr-4 align-top">
                    <p className="font-medium text-[#1e3a5f]">{row.concept[locale]}</p>
                    {row.detail && (
                      <p className="text-sm text-gray-600 mt-1">{row.detail[locale]}</p>
                    )}
                  </td>
                  <td className="py-4 align-top text-right font-bold text-[#1e3a5f] whitespace-nowrap">
                    {typeof row.price === "string" ? row.price : row.price[locale]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-gray-600 mt-6 leading-relaxed">{table.footnote[locale]}</p>
        </div>
      </div>
    </section>
  );
}
