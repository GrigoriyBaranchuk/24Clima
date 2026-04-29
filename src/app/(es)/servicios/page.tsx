import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNav from "@/components/BottomNav";
import ServicesGrid from "@/components/ServicesGrid";
import Services from "@/components/Services";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBreadcrumbJsonLd, localePath, getLabels } from "@/lib/breadcrumb-helper";
import { SERVICE_SLUGS, SLUG_TO_TRANSLATION_KEY } from "@/lib/services";

export const metadata: Metadata = {
  metadataBase: new URL("https://24clima.com"),
  title: "Servicios de Aire Acondicionado en Panamá | 24clima",
  description:
    "Limpieza, mantenimiento, reparación, instalación, carga de gas y emergencias 24/7 de aire acondicionado en Ciudad de Panamá. Técnicos certificados.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_PA",
    url: "https://24clima.com/servicios/",
    siteName: "24clima",
    title: "Servicios de Aire Acondicionado en Panamá | 24clima",
    description:
      "Limpieza, mantenimiento, reparación, instalación, carga de gas y emergencias 24/7 de aire acondicionado en Ciudad de Panamá. Técnicos certificados.",
  },
  alternates: {
    canonical: "https://24clima.com/servicios/",
    languages: {
      "x-default": "https://24clima.com/servicios/",
      es: "https://24clima.com/servicios/",
      en: "https://24clima.com/en/servicios/",
      ru: "https://24clima.com/ru/servicios/",
    },
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Servicios de Aire Acondicionado en Panamá",
  url: "https://24clima.com/servicios/",
  itemListElement: SERVICE_SLUGS.map((slug, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://24clima.com/servicios/${slug}/`,
    name: SLUG_TO_TRANSLATION_KEY[slug],
  })),
};

export default function ServiciosPage() {
  setRequestLocale("es");

  const labels = getLabels("es");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: labels.home, url: localePath("es", "/") },
    { name: labels.services, url: localePath("es", "/servicios/") },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content" className="pt-12 lg:pt-20">
        {/* MOBILE — Apple-style services list */}
        <ServicesGrid />

        {/* DESKTOP — keep the existing rich grid + breadcrumb */}
        <div className="hidden lg:block container mx-auto px-4 lg:px-8 pt-2">
          <Breadcrumbs segments={[{ label: labels.services }]} />
        </div>
        <div className="hidden lg:block">
          <Services />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
    </>
  );
}
