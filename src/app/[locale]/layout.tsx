import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    es: "24clima | Servicio de Aire Acondicionado en Panamá - Instalación, Mantenimiento y Reparación",
    en: "24clima | Air Conditioning Service in Panama - Installation, Maintenance and Repair",
    ru: "24clima | Обслуживание кондиционеров в Панаме - Установка, Обслуживание и Ремонт",
  };

  const descriptions: Record<string, string> = {
    es: "Técnicos profesionales de aire acondicionado en Panamá. Instalación, mantenimiento preventivo, limpieza profunda, reparación y carga de gas refrigerante. Atención 24/7 en Ciudad de Panamá.",
    en: "Professional air conditioning technicians in Panama. Installation, preventive maintenance, deep cleaning, repair and refrigerant gas recharge. 24/7 service in Panama City.",
    ru: "Профессиональные техники по кондиционерам в Панаме. Установка, профилактика, глубокая очистка, ремонт и заправка хладагентом. Круглосуточное обслуживание в Панама-Сити.",
  };

  return {
    metadataBase: new URL("https://24clima.com"),
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    robots: { index: true, follow: true },
    keywords: [
      "air conditioning Panama",
      "AC service Panama",
      "aire acondicionado Panamá",
      "кондиционер Панама",
    ],
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_PA" : locale === "ru" ? "ru_RU" : "en_US",
      url: "https://24clima.com",
      siteName: "24clima",
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
    },
    alternates: {
      canonical: "https://24clima.com",
      languages: {
        es: "https://24clima.com",
        en: "https://24clima.com/en",
        ru: "https://24clima.com/ru",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="geo.region" content="PA" />
        <meta name="geo.placename" content="Ciudad de Panamá" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HVACBusiness",
              "@id": "https://24clima.com/#organization",
              name: "24clima",
              description: "Servicio de aire acondicionado en Panamá",
              url: "https://24clima.com",
              telephone: "+507-6828-2120",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Ciudad de Panamá",
                addressCountry: "PA",
              },
              areaServed: ["Ciudad de Panamá", "Costa del Este", "Punta Pacífica"],
            }),
          }}
        />
        {/* AI/LLM discovery: rich summary for crawlers and AI agents */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "24clima",
              url: "https://24clima.com",
              description: "24clima — professional air conditioning service in Panama City: installation, maintenance, deep cleaning, repair, refrigerant recharge. 24/7. Calculator for cleaning cost. Languages: Spanish, English, Russian.",
              inLanguage: ["es", "en", "ru"],
              potentialAction: {
                "@type": "ContactAction",
                target: { "@type": "EntryPoint", urlTemplate: "https://wa.me/50768282120" },
                contactOption: "https://schema.org/TollFree",
              },
            }),
          }}
        />
        <meta name="author" content="24clima" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Краткое описание для AI/LLM и поисковых систем — не отображается визуально */}
        <p className="sr-only" aria-hidden="true" data-ai-summary="true">
          24clima — professional air conditioning service in Panama City: installation, maintenance, deep cleaning, repair, refrigerant recharge. 24/7. Online cost calculator for AC cleaning. Languages: Spanish, English, Russian. Contact: WhatsApp +507 6828 2120.
        </p>
        <GoogleAnalytics />
        <MetaPixel />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
