import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
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
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
