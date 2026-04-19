import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { locales, type Locale, getLocalePrefix } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthorBio from "@/components/AuthorBio";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import { Button } from "@/components/ui/button";
import { Stethoscope, AlertTriangle, ChevronRight, Lightbulb, Phone, Thermometer, Droplets, Volume2, Zap, Wind, DollarSign } from "lucide-react";
import { DIAGNOSTIC_SYMPTOMS, DIAGNOSTICO_PAGE_CONTENT as CONTENT, type DiagnosticIconName } from "@/lib/diagnostico-data";

const DIAGNOSTIC_ICONS: Record<DiagnosticIconName, React.ComponentType<{ className?: string }>> = {
  Thermometer, Droplets, Volume2, Zap, Wind, DollarSign,
};
import { EXPERT } from "@/lib/author-data";
import { buildBreadcrumbJsonLd, localePath, getLabels } from "@/lib/breadcrumb-helper";
import Breadcrumbs from "@/components/Breadcrumbs";

const BASE = "https://24clima.com";

type SupportedLocale = "es" | "en" | "ru";

const titles: Record<string, string> = {
  en: "AC Problem Diagnosis — Self-Diagnosis Guide | 24clima",
  ru: "Диагностика проблем кондиционера — Руководство | 24clima",
};

const descriptions: Record<string, string> = {
  en: "AC not cooling, leaking, or noisy? Self-diagnosis guide with step-by-step solutions. 6 common problems, causes, and when to call an HVAC technician. ★5.0.",
  ru: "Кондиционер не охлаждает, течёт или шумит? Руководство по самодиагностике с пошаговыми решениями. 6 частых проблем, причины и когда звонить мастеру. ★5.0.",
};

const severityLabelMap: Record<SupportedLocale, Record<string, string>> = {
  es: { low: "Fácil de resolver", medium: "Dificultad media", high: "Requiere técnico" },
  en: { low: "Easy fix", medium: "Moderate", high: "Needs technician" },
  ru: { low: "Легко решить", medium: "Средняя сложность", high: "Нужен мастер" },
};

const severityColor = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const whatsAppSymptomMsg: Record<SupportedLocale, (symptom: string) => string> = {
  es: (s) => `Hola, mi aire acondicionado ${s}. ¿Pueden ayudarme?`,
  en: (s) => `Hello, my air conditioner ${s}. Can you help?`,
  ru: (s) => `Здравствуйте, мой кондиционер ${s}. Можете помочь?`,
};

const whatsAppGenericMsg: Record<SupportedLocale, string> = {
  es: "Hola, tengo un problema con mi aire acondicionado que no aparece en la guía. ¿Pueden ayudarme?",
  en: "Hello, I have an AC problem not listed in the guide. Can you help?",
  ru: "Здравствуйте, у меня проблема с кондиционером, которой нет в руководстве. Можете помочь?",
};

const ctaButtonFinal: Record<SupportedLocale, string> = {
  es: "Enviar foto/video por WhatsApp",
  en: "Send photo/video via WhatsApp",
  ru: "Отправить фото/видео в WhatsApp",
};

export function generateStaticParams() {
  return locales.filter((l) => l !== "es").map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const prefix = getLocalePrefix(locale as Locale);
  const baseUrl = `${BASE}${prefix}/diagnostico/`;

  return {
    metadataBase: new URL(BASE),
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      url: baseUrl,
      siteName: "24clima",
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        "x-default": `${BASE}/diagnostico/`,
        es: `${BASE}/diagnostico/`,
        en: `${BASE}/en/diagnostico/`,
        ru: `${BASE}/ru/diagnostico/`,
      },
    },
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function DiagnosticoPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);

  const locale: SupportedLocale =
    rawLocale === "es" || rawLocale === "en" || rawLocale === "ru"
      ? rawLocale
      : "en";

  const labels = getLabels(locale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: labels.home, url: localePath(locale, "/") },
    {
      name: locale === "es" ? "Diagnóstico" : locale === "ru" ? "Диагностика" : "Diagnosis",
      url: localePath(locale, "/diagnostico/"),
    },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DIAGNOSTIC_SYMPTOMS.map((symptom) => ({
      "@type": "Question",
      name: symptom.title[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: `${symptom.description[locale]} ${symptom.causes.map((c) => c.text[locale]).join(" ")} ${symptom.callPro[locale]}`,
      },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: CONTENT.title[locale],
    description: CONTENT.subtitle[locale],
    step: DIAGNOSTIC_SYMPTOMS.map((symptom, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: symptom.title[locale],
      text: `${symptom.description[locale]} ${symptom.diyTips.map((t) => t[locale]).join(" ")}`,
    })),
    author: {
      "@type": "Person",
      "@id": EXPERT.id,
      name: EXPERT.name,
    },
  };

  const slMap = severityLabelMap[locale];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="hero-gradient py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <Breadcrumbs segments={[{ label: labels.diagnosis }]} variant="light" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="w-16 h-16 bg-[#7BC043]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Stethoscope className="w-8 h-8 text-[#7BC043]" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {CONTENT.title[locale]}
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              {CONTENT.subtitle[locale]}
            </p>
          </div>
        </section>

        {/* Quick Nav */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {DIAGNOSTIC_SYMPTOMS.map((symptom) => (
                <a
                  key={symptom.id}
                  href={`#${symptom.id}`}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-[#1e3a5f]/10 text-sm font-medium text-[#1e3a5f] transition-colors text-center"
                >
                  {(() => { const Icon = DIAGNOSTIC_ICONS[symptom.icon]; return <Icon className="w-4 h-4 flex-shrink-0" />; })()}
                  <span className="line-clamp-2">{symptom.title[locale]}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Symptoms */}
        {DIAGNOSTIC_SYMPTOMS.map((symptom, index) => {
          const SymptomIcon = DIAGNOSTIC_ICONS[symptom.icon];
          return (
          <section
            key={symptom.id}
            id={symptom.id}
            className={`py-12 md:py-16 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            itemScope
            itemType="https://schema.org/Question"
          >
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
                  <SymptomIcon className="w-7 h-7 text-[#1e3a5f]" />
                </div>
                <div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#1e3a5f]"
                    itemProp="name"
                  >
                    {symptom.title[locale]}
                  </h2>
                  <p className="mt-2 text-gray-700 leading-relaxed" itemProp="text">
                    {symptom.description[locale]}
                  </p>
                </div>
              </div>

              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                {/* Causes */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    {CONTENT.causesTitle[locale]}
                  </h3>
                  <div className="space-y-3" itemProp="text">
                    {symptom.causes.map((cause, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                      >
                        <span
                          className={`flex-shrink-0 px-2 py-1 rounded-md text-xs font-semibold ${severityColor[cause.severity]}`}
                        >
                          {slMap[cause.severity]}
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {cause.text[locale]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DIY Tips */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#7BC043]" />
                    {CONTENT.diyTitle[locale]}
                  </h3>
                  <ul className="space-y-3">
                    {symptom.diyTips.filter((tip) => tip[locale]).map((tip, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <ChevronRight className="w-5 h-5 text-[#7BC043] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">{tip[locale]}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call Pro */}
                <div className="p-5 rounded-2xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10">
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    {CONTENT.callProTitle[locale]}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {symptom.callPro[locale]}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
                  >
                    <TrackedWhatsAppLink
                      href={`https://wa.me/50768282120?text=${encodeURIComponent(
                        whatsAppSymptomMsg[locale](symptom.title[locale].toLowerCase())
                      )}`}
                      eventName="Lead"
                    >
                      <ChevronRight className="w-4 h-4 mr-1" />
                      {CONTENT.ctaButton[locale]}
                    </TrackedWhatsAppLink>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );  })}

        {/* Author Bio */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <AuthorBio locale={locale} variant="card" includeJsonLd={false} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-[#1e3a5f] to-[#0d2240]">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {CONTENT.ctaTitle[locale]}
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              {CONTENT.ctaText[locale]}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold"
            >
              <TrackedWhatsAppLink
                href={`https://wa.me/50768282120?text=${encodeURIComponent(whatsAppGenericMsg[locale])}`}
                eventName="Lead"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {ctaButtonFinal[locale]}
              </TrackedWhatsAppLink>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
