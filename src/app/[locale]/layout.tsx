import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { getHomeKeywords } from "@/lib/seo-keywords";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import YandexMetrika from "@/components/YandexMetrika";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
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
    keywords: getHomeKeywords(locale as Locale),
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_PA" : locale === "ru" ? "ru_RU" : "en_US",
      url: `https://24clima.com/${locale}/`,
      siteName: "24clima",
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
    },
    alternates: {
      canonical: `https://24clima.com/${locale}/`,
      languages: {
        es: "https://24clima.com/es/",
        en: "https://24clima.com/en/",
        ru: "https://24clima.com/ru/",
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
    <div lang={locale} className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
      {/* Краткое описание для AI/LLM и поисковых систем — не отображается визуально */}
      <p className="sr-only" aria-hidden="true" data-ai-summary="true">
        24clima — professional air conditioning service in Panama City: installation, maintenance, deep cleaning, repair, refrigerant recharge. 24/7. Online cost calculator for AC cleaning. Languages: Spanish, English, Russian. Contact: WhatsApp +507 6828 2120.
      </p>
      <GoogleAnalytics />
      <YandexMetrika />
      <MetaPixel />
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
