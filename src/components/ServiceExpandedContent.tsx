import { Check, ChevronRight } from "lucide-react";
import { SERVICE_CONTENT } from "@/lib/service-content";
import type { ServiceSlug } from "@/lib/services";
import { SLUG_TO_TRANSLATION_KEY } from "@/lib/services";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  service: ServiceSlug;
  locale: SupportedLocale;
};

/**
 * ServiceExpandedContent — расширенный контент для страниц услуг.
 *
 * Рендерит три секции, увеличивающие объём страницы до 800–1200 слов:
 *  1. Intro paragraph — зачем услуга нужна в тропическом климате Панамы
 *  2. «¿Por qué elegir 24clima?» — buyer benefits с конкретикой
 *  3. «¿Cómo funciona?» — пошаговый процесс
 *
 * Каждая секция содержит извлекаемые факты для AI-поисковиков (GEO).
 */
export default function ServiceExpandedContent({ service, locale }: Props) {
  const translationKey = SLUG_TO_TRANSLATION_KEY[service];
  if (!translationKey) return null;

  const content = SERVICE_CONTENT[service];
  if (!content) return null;

  return (
    <>
      {/* Intro */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {content.intro[locale]}
          </p>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-8">
            {content.whyUsTitle[locale]}
          </h2>
          <ul className="space-y-5" role="list">
            {content.whyUsPoints.map((point, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7BC043]/15 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-[#7BC043]" aria-hidden="true" />
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  {point[locale]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-10">
            {content.howTitle[locale]}
          </h2>
          <ol className="space-y-8" role="list">
            {content.howSteps.map((step, i) => (
              <li key={i} className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-lg font-bold">
                    {i + 1}
                  </div>
                  {i < content.howSteps.length - 1 && (
                    <div className="w-px h-full bg-gray-200 mx-auto mt-2" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="text-lg font-semibold text-[#1e3a5f] flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-[#7BC043]" aria-hidden="true" />
                    {step.title[locale]}
                  </h3>
                  <p className="mt-2 text-base text-gray-700 leading-relaxed">
                    {step.text[locale]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
