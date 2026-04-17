import { getTranslations } from "next-intl/server";
import { ExternalLink, BookOpen } from "lucide-react";
import { SERVICE_CITATIONS } from "@/lib/service-citations";
import type { ServiceSlug } from "@/lib/services";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  service: ServiceSlug;
  locale: SupportedLocale;
};

/**
 * ServiceCitations — bloque «Fuentes y referencias» con 2+ citas a autoridades
 * oficiales (EPA, DOE, ENERGY STAR, ASHRAE, CDC).
 *
 * Impacto SEO/GEO:
 *  - Princeton (2024): citar fuentes autoritarias incrementa hasta +40% la
 *    visibilidad en motores generativos (ChatGPT, Perplexity, Google AI Overview).
 *  - E-E-A-T (Trustworthiness + Authoritativeness): enlaces a `.gov` / `.org`
 *    refuerzan la credibilidad del dominio.
 *
 * Detalles técnicos:
 *  - `rel="noopener noreferrer nofollow ugc"` — seguridad + ahorro de «link juice»
 *    (no queremos transferir autoridad a la fuente, solo citarla).
 *  - Microdata `itemtype="https://schema.org/CreativeWork"` para cada cita.
 */
export default async function ServiceCitations({ service, locale }: Props) {
  const citations = SERVICE_CITATIONS[service] ?? [];
  if (citations.length === 0) return null;

  const t = await getTranslations("citations");

  return (
    <section
      className="py-12 md:py-16 bg-white"
      aria-labelledby="citations-heading"
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="p-6 md:p-8 border-l-4 border-[#1e3a5f] bg-blue-50/40 rounded-r-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#1e3a5f]" aria-hidden="true" />
            </div>
            <h2
              id="citations-heading"
              className="text-xl md:text-2xl font-semibold text-[#1e3a5f]"
            >
              {t("title")}
            </h2>
          </div>

          <p className="text-sm md:text-base text-gray-600 mb-5">
            {t("intro")}
          </p>

          <ul className="space-y-5" role="list">
            {citations.map((c, i) => (
              <li
                key={i}
                className="text-sm md:text-base leading-relaxed"
                itemScope
                itemType="https://schema.org/CreativeWork"
              >
                <blockquote
                  className="text-gray-800 border-l-2 border-gray-300 pl-4 italic"
                  itemProp="description"
                >
                  “{c.claim[locale]}”
                </blockquote>
                <div className="mt-2 pl-4">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow ugc"
                    className="inline-flex items-center gap-1 text-[#1e3a5f] hover:text-[#7BC043] underline underline-offset-2 font-medium"
                    itemProp="url"
                  >
                    <span itemProp="publisher">— {c.source}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
