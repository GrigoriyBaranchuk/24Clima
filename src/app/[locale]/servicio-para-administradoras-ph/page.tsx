import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { locales, type Locale, getLocalePrefix } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNav from "@/components/BottomNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import PropertyManagementContent from "@/components/PropertyManagementContent";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-helper";

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
  const canonical = `https://24clima.com${prefix}/servicio-para-administradoras-ph/`;
  const t = await getTranslations({ locale: locale as Locale, namespace: "propertyManagement" });

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
        "x-default": "https://24clima.com/servicio-para-administradoras-ph/",
        es: "https://24clima.com/servicio-para-administradoras-ph/",
        en: "https://24clima.com/en/servicio-para-administradoras-ph/",
        ru: "https://24clima.com/ru/servicio-para-administradoras-ph/",
      },
    },
  };
}

export default async function PHAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = getLocalePrefix(locale as Locale);
  const canonical = `https://24clima.com${prefix}/servicio-para-administradoras-ph/`;
  const t = await getTranslations({ locale: locale as Locale, namespace: "propertyManagement" });

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("metaTitle"),
    description: t("metaDescription"),
    serviceType: "HVAC maintenance for Propiedad Horizontal (condo) administrators",
    url: canonical,
    areaServed: [
      { "@type": "City", name: "Ciudad de Panamá" },
      { "@type": "Place", name: "Costa del Este" },
      { "@type": "Place", name: "Punta Pacífica" },
      { "@type": "Place", name: "Avenida Balboa" },
      { "@type": "Place", name: "Marbella" },
      { "@type": "Place", name: "Obarrio" },
    ],
    provider: {
      "@type": "HVACBusiness",
      name: "24clima",
      url: "https://24clima.com",
      telephone: "+507-6828-2120",
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Administradoras de Propiedad Horizontal y juntas directivas",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4, 5].map((i) => ({
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
        <PropertyManagementContent />
      </main>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
    </>
  );
}
