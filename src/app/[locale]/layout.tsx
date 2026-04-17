import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { locales, defaultLocale, type Locale, getLocalePrefix } from "@/i18n/config";
import { getHomeKeywords } from "@/lib/seo-keywords";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import YandexMetrika from "@/components/YandexMetrika";
import ScrollToHash from "@/components/ScrollToHash";

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
  return locales.filter((l) => l !== defaultLocale).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    es: "Aire Acondicionado Panamá ★5.0 | 24/7 — 24clima",
    en: "Air Conditioning Panama ★5.0 | 24/7 — 24clima",
    ru: "Кондиционеры в Панаме ★5.0 | 24/7 — 24clima",
  };

  const descriptions: Record<string, string> = {
    es: "Servicio HVAC profesional en Ciudad de Panamá. Maestro certificado, 9+ años. Limpieza desde $29.99, reparación, instalación. ★5.0 (11 reseñas Google). 24/7.",
    en: "Professional HVAC service in Panama City. Certified master, 9+ years. Cleaning from $29.99, repair, installation. ★5.0 (11 Google reviews). Available 24/7.",
    ru: "Профессиональный HVAC-сервис в Панама-Сити. Сертифицированный мастер, 9+ лет. Чистка от $29.99, ремонт, установка. ★5.0 (11 отзывов Google). 24/7.",
  };

  const prefix = getLocalePrefix(locale as Locale);
  const baseUrl = `https://24clima.com${prefix}`;
  const canonicalUrl = prefix ? `${baseUrl}/` : "https://24clima.com/";

  return {
    metadataBase: new URL("https://24clima.com"),
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    robots: { index: true, follow: true },
    keywords: getHomeKeywords(locale as Locale),
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_PA" : locale === "ru" ? "ru_RU" : "en_US",
      url: canonicalUrl,
      siteName: "24clima",
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      images: [
        {
          url: "https://24clima.com/uploads/page1-opt.webp",
          width: 712,
          height: 500,
          alt: "24clima - Servicio de Aire Acondicionado en Panamá",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.es,
      description: descriptions[locale] || descriptions.es,
      images: ["https://24clima.com/uploads/page1-opt.webp"],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": "https://24clima.com/",
        es: "https://24clima.com/",
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
  if (locale === defaultLocale) {
    redirect("/");
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
        <ScrollToHash />
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
