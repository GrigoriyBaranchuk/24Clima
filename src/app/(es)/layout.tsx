import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://24clima.com"),
  title: "Aire Acondicionado Panamá ★5.0 | 24/7 — 24clima",
  description: "Servicio HVAC profesional en Ciudad de Panamá. Maestro certificado, 9+ años. Limpieza desde $29.99, reparación, instalación. ★5.0 (11 reseñas Google). 24/7.",
  robots: { index: true, follow: true },
  keywords: getHomeKeywords("es"),
  openGraph: {
    type: "website",
    locale: "es_PA",
    url: "https://24clima.com/",
    siteName: "24clima",
    title: "Aire Acondicionado Panamá ★5.0 | 24/7 — 24clima",
    description: "Servicio HVAC profesional en Ciudad de Panamá. Maestro certificado, 9+ años. Limpieza desde $29.99, reparación, instalación. ★5.0 (11 reseñas Google). 24/7.",
    images: [
      {
        url: "https://24clima.com/uploads/page1-opt.webp",
        width: 712,
        height: 500,
        alt: "24clima — Aire acondicionado profesional en Panamá",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aire Acondicionado Panamá ★5.0 | 24/7 — 24clima",
    description: "Servicio HVAC profesional en Ciudad de Panamá. Maestro certificado, 9+ años. Limpieza desde $29.99, reparación, instalación. ★5.0 (11 reseñas Google). 24/7.",
    images: ["https://24clima.com/uploads/page1-opt.webp"],
  },
  alternates: {
    canonical: "https://24clima.com/",
    languages: {
      "x-default": "https://24clima.com/",
      es: "https://24clima.com/",
      en: "https://24clima.com/en/",
      ru: "https://24clima.com/ru/",
    },
  },
};

export default async function EsRootLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale("es");
  const messages = await getMessages();

  return (
    <div lang="es" className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
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
