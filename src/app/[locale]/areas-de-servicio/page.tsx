import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { locales, type Locale, getLocalePrefix } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import { SERVICE_AREAS } from "@/lib/areas-data";
import { BUSINESS_DATA } from "@/lib/business-data";
import { buildBreadcrumbJsonLd, localePath, getLabels } from "@/lib/breadcrumb-helper";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import { Button } from "@/components/ui/button";

const BASE = "https://24clima.com";

type SupportedLocale = "es" | "en" | "ru";

const titles: Record<string, string> = {
  en: "AC Service Areas in Panama City | 24/7 Coverage — 24clima",
  ru: "Зоны обслуживания кондиционеров в Панаме | 24/7 — 24clima",
};

const descriptions: Record<string, string> = {
  en: "Air conditioning service in 10+ zones of Panama City: Costa del Este, Punta Pacífica, Clayton, Albrook, San Francisco and more. Arrival in <2h. ★5.0.",
  ru: "Обслуживание кондиционеров в 10+ районах Панама-Сити: Costa del Este, Punta Pacífica, Clayton, Albrook, San Francisco и др. Приезд менее 2ч. ★5.0.",
};

const heroTitle: Record<SupportedLocale, string> = {
  es: "Servicio de Aire Acondicionado en Ciudad de Panamá",
  en: "Air Conditioning Service in Panama City",
  ru: "Обслуживание кондиционеров в Панама-Сити",
};

const heroSubtitle: Record<SupportedLocale, string> = {
  es: "Cobertura en 10+ zonas de la ciudad. Maestro HVAC con 9+ años de experiencia. Llegada en menos de 2 horas. Servicio 24/7/365.",
  en: "Coverage in 10+ city zones. HVAC Master with 9+ years of experience. Arrival in under 2 hours. Service 24/7/365.",
  ru: "Покрытие 10+ районов города. Мастер HVAC с опытом 9+ лет. Приезд менее чем за 2 часа. Сервис 24/7/365.",
};

const zonesHeading: Record<SupportedLocale, string> = {
  es: "Nuestras zonas de cobertura",
  en: "Our coverage zones",
  ru: "Наши зоны покрытия",
};

const arrivalLabel: Record<SupportedLocale, string> = {
  es: "Tiempo de llegada:",
  en: "Arrival time:",
  ru: "Время приезда:",
};

const requestLabel: Record<SupportedLocale, string> = {
  es: "Solicitar servicio en",
  en: "Request service in",
  ru: "Заказать в",
};

const ctaTitle: Record<SupportedLocale, string> = {
  es: "¿No ve su zona? Contáctenos",
  en: "Don't see your area? Contact us",
  ru: "Не видите свой район? Свяжитесь с нами",
};

const ctaText: Record<SupportedLocale, string> = {
  es: "Cubrimos toda la zona metropolitana de Ciudad de Panamá. Escríbanos y confirmamos la cobertura en su área.",
  en: "We cover the entire metropolitan area of Panama City. Write to us and we'll confirm coverage in your area.",
  ru: "Мы обслуживаем всю столичную зону Панама-Сити. Напишите нам, и мы подтвердим покрытие в вашем районе.",
};

const ctaButton: Record<SupportedLocale, string> = {
  es: "Consultar cobertura por WhatsApp",
  en: "Check coverage via WhatsApp",
  ru: "Узнать покрытие через WhatsApp",
};

const whatsAppZoneMsg: Record<SupportedLocale, (zone: string) => string> = {
  es: (z) => `Hola, necesito servicio de aire acondicionado en ${z}.`,
  en: (z) => `Hello, I need air conditioning service in ${z}.`,
  ru: (z) => `Здравствуйте, мне нужен сервис кондиционера в ${z}.`,
};

const whatsAppCoverageMsg: Record<SupportedLocale, string> = {
  es: "Hola, quiero confirmar si tienen cobertura en mi zona.",
  en: "Hello, I want to confirm if you have coverage in my area.",
  ru: "Здравствуйте, хочу уточнить, обслуживаете ли вы мой район.",
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
  const baseUrl = `${BASE}${prefix}/areas-de-servicio/`;

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
        "x-default": `${BASE}/areas-de-servicio/`,
        es: `${BASE}/areas-de-servicio/`,
        en: `${BASE}/en/areas-de-servicio/`,
        ru: `${BASE}/ru/areas-de-servicio/`,
      },
    },
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function AreasPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);

  const locale: SupportedLocale =
    rawLocale === "es" || rawLocale === "en" || rawLocale === "ru"
      ? rawLocale
      : "en";

  const labels = getLabels(locale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: labels.home, url: localePath(locale, "/") },
    { name: labels.serviceAreas, url: localePath(locale, "/areas-de-servicio/") },
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
      <main className="pt-20">
        {/* Hero */}
        <section className="hero-gradient py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="w-16 h-16 bg-[#7BC043]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-[#7BC043]" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {heroTitle[locale]}
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              {heroSubtitle[locale]}
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
              {zonesHeading[locale]}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {SERVICE_AREAS.map((area) => {
                const msg = encodeURIComponent(whatsAppZoneMsg[locale](area.name));
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
                          {arrivalLabel[locale]} {area.responseTime}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4" itemProp="description">
                          {area.description[locale]}
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
                            {requestLabel[locale]} {area.name.split(" (")[0]}
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
              {ctaTitle[locale]}
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              {ctaText[locale]}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold"
            >
              <TrackedWhatsAppLink
                href={`https://wa.me/50768282120?text=${encodeURIComponent(whatsAppCoverageMsg[locale])}`}
                eventName="Lead"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {ctaButton[locale]}
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
