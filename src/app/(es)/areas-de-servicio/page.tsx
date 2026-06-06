import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import { SERVICE_AREAS } from "@/lib/areas-data";
import { BUSINESS_DATA } from "@/lib/business-data";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-helper";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import { Button } from "@/components/ui/button";

const BASE = "https://24clima.com";
const CANONICAL = `${BASE}/areas-de-servicio/`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: "Zonas de Servicio AC en Panamá | Cobertura 24/7 — 24clima",
  description:
    "Servicio de aire acondicionado en Ciudad de Panamá y Panamá Oeste: Costa del Este, Punta Pacífica, Clayton, Arraiján, La Chorrera y más. Respuesta rápida. ★5.0.",
  alternates: {
    canonical: CANONICAL,
    languages: {
      "x-default": CANONICAL,
      es: CANONICAL,
      en: `${BASE}/en/areas-de-servicio/`,
      ru: `${BASE}/ru/areas-de-servicio/`,
    },
  },
};

export default function AreasPage() {
  setRequestLocale("es");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: `${BASE}/` },
    { name: "Zonas de servicio", url: CANONICAL },
  ]);

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": BUSINESS_DATA.organizationId,
    name: BUSINESS_DATA.name,
    url: BUSINESS_DATA.url,
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "City",
      name: area.name,
      geo: {
        "@type": "GeoCoordinates",
        latitude: area.geo.latitude,
        longitude: area.geo.longitude,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="hero-gradient py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <Breadcrumbs segments={[{ label: "Zonas de servicio" }]} variant="light" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="w-16 h-16 bg-[#7BC043]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-[#7BC043]" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Servicio de Aire Acondicionado en Ciudad de Panamá
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Cobertura en la ciudad y Panamá Oeste (Arraiján, La Chorrera y más).
              Maestro HVAC con 9+ años de experiencia. Servicio 24/7/365.
            </p>
          </div>
        </section>

        {/* Google Maps Embed */}
        <section className="bg-gray-100">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-8">
            <iframe
              title="Zona de cobertura 24clima — Ciudad de Panamá"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63136.98!2d-79.55!3d9.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca8f1dbe80363%3A0xaba25df1f042c10e!2sPanama%20City!5e0!3m2!1ses!2spa!4v1"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: "1rem" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* Zones List */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] text-center mb-10">
              Nuestras zonas de cobertura
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {SERVICE_AREAS.map((area) => {
                const msg = encodeURIComponent(
                  `Hola, necesito servicio de aire acondicionado en ${area.name}.`
                );
                return (
                  <article
                    key={area.slug}
                    className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    itemScope
                    itemType="https://schema.org/Place"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-lg font-semibold text-[#1e3a5f] mb-1"
                          itemProp="name"
                        >
                          {area.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-[#7BC043] font-medium mb-3">
                          <Clock className="w-3.5 h-3.5" />
                          Tiempo de llegada: {area.responseTime}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4" itemProp="description">
                          {area.description.es}
                        </p>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="text-[#1e3a5f] border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5"
                        >
                          <TrackedWhatsAppLink
                            href={`https://wa.me/50768282120?text=${msg}`}
                            eventName="Lead"
                          >
                            <ChevronRight className="w-4 h-4 mr-1" />
                            Solicitar servicio en {area.name.split(" (")[0]}
                          </TrackedWhatsAppLink>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-[#1e3a5f] to-[#0d2240]">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              ¿No ve su zona? Contáctenos
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Cubrimos la zona metropolitana de Ciudad de Panamá y Panamá Oeste.
              Escríbanos y confirmamos la cobertura en su área.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold"
            >
              <TrackedWhatsAppLink
                href={`https://wa.me/50768282120?text=${encodeURIComponent("Hola, quiero confirmar si tienen cobertura en mi zona.")}`}
                eventName="Lead"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar cobertura por WhatsApp
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
