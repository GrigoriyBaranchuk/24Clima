"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

const FAQ_KEYS = [1, 2, 3, 4, 5] as const;

type ServiceFAQProps = {
  translationKey: string;
  pageUrl: string;
};

export default function ServiceFAQ({
  translationKey,
  pageUrl,
}: ServiceFAQProps) {
  const t = useTranslations("services");
  const prefix = `${translationKey}.faq`;

  const items = FAQ_KEYS.map((i) => ({
    q: t(`${prefix}${i}Q`),
    a: t(`${prefix}${i}A`),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
    url: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section
        className="py-16 lg:py-24 section-gradient"
        aria-labelledby="faq-heading"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] text-center mb-10"
          >
            {t("faqSectionTitle")}
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {items.map((item, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 70}>
                <details className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 list-none cursor-pointer px-5 py-4 text-left font-medium text-[#1e3a5f] hover:bg-gray-50 transition-colors [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <ChevronDown className="w-5 h-5 shrink-0 text-[#0F9D58] transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-4 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                    {item.a}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
