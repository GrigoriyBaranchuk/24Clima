import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { locales, type Locale, getLocalePrefix } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNav from "@/components/BottomNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import MaintenanceContractContent from "@/components/MaintenanceContractContent";
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
  const canonical = `https://24clima.com${prefix}/contrato-mantenimiento-aire-acondicionado/`;
  const t = await getTranslations({ locale: locale as Locale, namespace: "maintenanceContract" });

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
        "x-default": "https://24clima.com/contrato-mantenimiento-aire-acondicionado/",
        es: "https://24clima.com/contrato-mantenimiento-aire-acondicionado/",
        en: "https://24clima.com/en/contrato-mantenimiento-aire-acondicionado/",
        ru: "https://24clima.com/ru/contrato-mantenimiento-aire-acondicionado/",
      },
    },
  };
}

export default async function MaintenanceContractPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const prefix = getLocalePrefix(locale as Locale);
  const canonical = `https://24clima.com${prefix}/contrato-mantenimiento-aire-acondicionado/`;
  const t = await getTranslations({ locale: locale as Locale, namespace: "maintenanceContract" });

  const tierKeys = [
    { suffix: "Basic", priceUnit: 15 },
    { suffix: "Standard", priceUnit: 22 },
    { suffix: "Premium", priceUnit: 35 },
  ] as const;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("metaTitle"),
    description: t("metaDescription"),
    serviceType: "Air conditioning maintenance contract — per-unit pricing",
    url: canonical,
    areaServed: { "@type": "City", name: "Ciudad de Panamá" },
    provider: {
      "@type": "HVACBusiness",
      name: "24clima",
      url: "https://24clima.com",
      telephone: "+507-6828-2120",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("h1"),
      itemListElement: tierKeys.map(({ suffix, priceUnit }) => ({
        "@type": "Offer",
        name: t(`tier${suffix}Name` as "tierBasicName"),
        description: t(`tier${suffix}Description` as "tierBasicDescription"),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: priceUnit,
          priceCurrency: "USD",
          unitText: "per AC unit per month",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "AC unit" },
        },
        availability: "https://schema.org/InStock",
      })),
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: locale === "ru" ? "Главная" : "Home", url: `https://24clima.com${prefix}/` },
    { name: locale === "ru" ? "Услуги" : "Services", url: `https://24clima.com${prefix}/servicios/` },
    { name: t("breadcrumb"), url: canonical },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main id="main-content">
        <div className="container mx-auto px-4 lg:px-8 pt-2">
          <Breadcrumbs segments={[{ label: t("breadcrumb") }]} />
        </div>
        <MaintenanceContractContent />
      </main>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
    </>
  );
}
