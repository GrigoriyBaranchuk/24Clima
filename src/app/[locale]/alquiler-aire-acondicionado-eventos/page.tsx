import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { locales, type Locale, getLocalePrefix } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNav from "@/components/BottomNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventCoolingContent from "@/components/EventCoolingContent";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-helper";
import { WHATSAPP_DISPLAY } from "@/lib/constants";

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
  const canonical = `https://24clima.com${prefix}/alquiler-aire-acondicionado-eventos/`;
  const t = await getTranslations({ locale: locale as Locale, namespace: "eventCooling" });

  return {
    metadataBase: new URL("https://24clima.com"),
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      url: canonical,
      siteName: "24clima",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
    alternates: {
      canonical,
      languages: {
        "x-default": "https://24clima.com/alquiler-aire-acondicionado-eventos/",
        es: "https://24clima.com/alquiler-aire-acondicionado-eventos/",
        en: "https://24clima.com/en/alquiler-aire-acondicionado-eventos/",
        ru: "https://24clima.com/ru/alquiler-aire-acondicionado-eventos/",
      },
    },
  };
}

export default async function EventCoolingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = getLocalePrefix(locale as Locale);
  const canonical = `https://24clima.com${prefix}/alquiler-aire-acondicionado-eventos/`;
  const t = await getTranslations({ locale: locale as Locale, namespace: "eventCooling" });

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("metaTitle"),
    description: t("metaDescription"),
    serviceType: "Temporary event cooling and portable air conditioning rental",
    url: canonical,
    areaServed: [
      { "@type": "City", name: "Ciudad de Panamá" },
      { "@type": "Place", name: "Costa del Este" },
      { "@type": "Place", name: "ATLAPA" },
      { "@type": "Place", name: "Centro de Convenciones de Panamá" },
      { "@type": "Place", name: "Panamá Oeste" },
      { "@type": "Place", name: "Arraiján" },
    ],
    provider: {
      "@type": "HVACBusiness",
      name: "24clima",
      url: "https://24clima.com",
      telephone: "+507-6828-2120",
    },
    audience: {
      "@type": "Audience",
      audienceType:
        "Organizadores de eventos, ferias, bodas, conferencias y eventos corporativos",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4, 5, 6].map((i) => ({
      "@type": "Question",
      name: t(`faq${i}Q` as "faq1Q"),
      acceptedAnswer: { "@type": "Answer", text: t(`faq${i}A` as "faq1A") },
    })),
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: locale === "ru" ? "Главная" : "Home", url: `https://24clima.com${prefix}/` },
    { name: locale === "ru" ? "Услуги" : "Services", url: `https://24clima.com${prefix}/servicios/` },
    { name: t("breadcrumb"), url: canonical },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main id="main-content">
        <div className="container mx-auto px-4 lg:px-8 pt-2">
          <Breadcrumbs segments={[{ label: t("breadcrumb") }]} />
        </div>
        <EventCoolingContent />
      </main>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
      <span className="sr-only" aria-hidden="true">
        24clima · {WHATSAPP_DISPLAY}
      </span>
    </>
  );
}
