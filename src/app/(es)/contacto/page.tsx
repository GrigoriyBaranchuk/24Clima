import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-helper";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  metadataBase: new URL("https://24clima.com"),
  title: "Contacto | 24clima — Servicio de Aire Acondicionado en Panamá",
  description:
    "Contacta a 24clima por WhatsApp, teléfono o visita. Servicio de aire acondicionado en Ciudad de Panamá. Respuesta rápida y cotización sin compromiso.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_PA",
    url: "https://24clima.com/contacto/",
    siteName: "24clima",
    title: "Contacto | 24clima — Servicio de Aire Acondicionado en Panamá",
    description:
      "Contacta a 24clima por WhatsApp, teléfono o visita. Servicio de aire acondicionado en Ciudad de Panamá. Respuesta rápida y cotización sin compromiso.",
  },
  alternates: {
    canonical: "https://24clima.com/contacto/",
    languages: {
      "x-default": "https://24clima.com/",
      es: "https://24clima.com/contacto/",
      en: "https://24clima.com/en/contacto/",
      ru: "https://24clima.com/ru/contacto/",
    },
  },
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contacto | 24clima",
  description: "Contacta a 24clima por WhatsApp, teléfono. Servicio de aire acondicionado en Panamá.",
  url: "https://24clima.com/contacto/",
  mainEntity: {
    "@type": "Organization",
    name: "24clima",
    url: "https://24clima.com",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+50768282120",
      contactType: "customer service",
      areaServed: "PA",
      availableLanguage: ["Spanish", "English", "Russian"],
    },
  },
};

export default function ContactoPage() {
  setRequestLocale("es");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://24clima.com/" },
    { name: "Contacto", url: "https://24clima.com/contacto/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content">
        <div className="container mx-auto px-4 lg:px-8 pt-2">
          <Breadcrumbs segments={[{ label: "Contacto" }]} />
        </div>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
