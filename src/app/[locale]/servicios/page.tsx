import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale, getLocalePrefix, defaultLocale } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomNav from "@/components/BottomNav";
import ServicesGrid from "@/components/ServicesGrid";
import Services from "@/components/Services";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildBreadcrumbJsonLd, localePath, getLabels } from "@/lib/breadcrumb-helper";
import { SERVICE_SLUGS, SLUG_TO_TRANSLATION_KEY } from "@/lib/services";

const titles: Record<string, string> = {
  es: "Servicios de Aire Acondicionado en Panamá | 24clima",
  en: "AC Services in Panama | 24clima — Air Conditioning Specialists",
  ru: "Услуги по кондиционерам в Панаме | 24clima",
};

const descriptions: Record<string, string> = {
  es: "Limpieza, mantenimiento, reparación, instalación, carga de gas y emergencias 24/7 de aire acondicionado en Ciudad de Panamá. Técnicos certificados.",
  en: "Cleaning, maintenance, repair, installation, gas recharge and 24/7 emergency air conditioning service in Panama City. Certified technicians.",
  ru: "Чистка, обслуживание, ремонт, установка, заправка газа и экстренная служба 24/7 кондиционеров в Панама-Сити. Сертифицированные техники.",
};

// Default locale (es) is served at /servicios — no static param needed.
// Other locales (en, ru) get their own static params.
export function generateStaticParams() {
  return locales.filter((l) => l !== defaultLocale).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const prefix = getLocalePrefix(locale as Locale);
  const baseUrl = `https://24clima.com${prefix}/servicios/`;

  return {
    metadataBase: new URL("https://24clima.com"),
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : locale === "en" ? "en_US" : "es_ES",
      url: baseUrl,
      siteName: "24clima",
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        "x-default": "https://24clima.com/servicios/",
        es: "https://24clima.com/servicios/",
        en: "https://24clima.com/en/servicios/",
        ru: "https://24clima.com/ru/servicios/",
      },
    },
  };
}

function getServicesJsonLd(locale: string) {
  const prefix = getLocalePrefix(locale as Locale);
  const baseUrl = `https://24clima.com${prefix}/servicios/`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: titles[locale] || titles.es,
    url: baseUrl,
    itemListElement: SERVICE_SLUGS.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://24clima.com${prefix}/servicios/${slug}/`,
      name: SLUG_TO_TRANSLATION_KEY[slug],
    })),
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const labels = getLabels(locale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: labels.home, url: localePath(locale, "/") },
    { name: labels.services || "Servicios", url: localePath(locale, "/servicios/") },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getServicesJsonLd(locale)) }}
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
          <Breadcrumbs segments={[{ label: labels.services || "Servicios" }]} />
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
