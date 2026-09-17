import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import MaintenanceContractContent from "@/components/MaintenanceContractContent";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-helper";

const CANONICAL = "https://24clima.com/contrato-mantenimiento-aire-acondicionado/";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "es", namespace: "maintenanceContract" });
  return {
    metadataBase: new URL("https://24clima.com"),
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "es_PA",
      url: CANONICAL,
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
      canonical: CANONICAL,
      languages: {
        "x-default": CANONICAL,
        es: CANONICAL,
        en: "https://24clima.com/en/contrato-mantenimiento-aire-acondicionado/",
        ru: "https://24clima.com/ru/contrato-mantenimiento-aire-acondicionado/",
      },
    },
  };
}

export default async function MaintenanceContractPage() {
  setRequestLocale("es");
  const t = await getTranslations({ locale: "es", namespace: "maintenanceContract" });

  // Per the SEO review: Offer.price + currency + name must match visible static text exactly.
  // These come from the same i18n source as the visible tier cards, guaranteed match.
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
    url: CANONICAL,
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
    { name: "Inicio", url: "https://24clima.com/" },
    { name: "Servicios", url: "https://24clima.com/servicios/" },
    { name: t("breadcrumb"), url: CANONICAL },
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
      <BottomNav />
    </>
  );
}
