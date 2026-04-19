import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import WhyUs from "@/components/WhyUs";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import NosotrosCTA from "@/components/NosotrosCTA";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-helper";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  metadataBase: new URL("https://24clima.com"),
  title: "Nosotros | 24clima — Servicio de Aire Acondicionado en Panamá",
  description:
    "Conoce al equipo 24clima. Experiencia, profesionalismo y compromiso con la calidad en limpieza, mantenimiento, reparación e instalación de aire acondicionado en Ciudad de Panamá.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_PA",
    url: "https://24clima.com/nosotros/",
    siteName: "24clima",
    title: "Nosotros | 24clima — Servicio de Aire Acondicionado en Panamá",
    description:
      "Conoce al equipo 24clima. Experiencia, profesionalismo y compromiso con la calidad en limpieza, mantenimiento, reparación e instalación de aire acondicionado en Ciudad de Panamá.",
  },
  alternates: {
    canonical: "https://24clima.com/nosotros/",
    languages: {
      "x-default": "https://24clima.com/",
      es: "https://24clima.com/nosotros/",
      en: "https://24clima.com/en/nosotros/",
      ru: "https://24clima.com/ru/nosotros/",
    },
  },
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Nosotros | 24clima",
  description:
    "Conoce al equipo 24clima. Experiencia, profesionalismo y compromiso con la calidad en servicio de aire acondicionado en Panamá.",
  url: "https://24clima.com/nosotros/",
  mainEntity: {
    "@type": "Organization",
    name: "24clima",
    url: "https://24clima.com",
    areaServed: { "@type": "City", name: "Ciudad de Panamá" },
  },
};

export default function NosotrosPage() {
  setRequestLocale("es");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://24clima.com/" },
    { name: "Nosotros", url: "https://24clima.com/nosotros/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <div className="container mx-auto px-4 lg:px-8 pt-2">
          <Breadcrumbs segments={[{ label: "Nosotros" }]} />
        </div>
        <WhyUs />
        <Reviews />
        <NosotrosCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
