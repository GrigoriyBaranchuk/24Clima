import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { CLIENT_SHELL_NAMESPACES, pickMessages } from "@/i18n/client-messages";
import { getHomeKeywords } from "@/lib/seo-keywords";
import LazyAnalytics from "@/components/LazyAnalytics";
import MetaPixel from "@/components/MetaPixel";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ScrollToHash from "@/components/ScrollToHash";
import GoogleReviewsBadge from "@/components/GoogleReviewsBadge";
import DesktopWhatsAppFab from "@/components/DesktopWhatsAppFab";

// Только latin: это дерево роутов отдаёт исключительно испанский, и все его
// символы (включая ñ/á/¿) лежат в latin-подмножестве. Кириллица нужна только
// в ветке [locale] (ru) — там свой Inter.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Lora объявлена НЕ здесь, а в consejos-y-guias/layout.tsx: сериф используется
// только в блоге (TipsList `font-serif`, ArticleRenderer `.article-content`),
// а объявление в корневом layout заставляло каждую страницу сайта
// предзагружать два лишних woff2.

export const viewport: Viewport = {
  viewportFit: "cover",
};

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
    <div lang="es" className={`${inter.variable} font-sans antialiased`}>
      <p className="sr-only" aria-hidden="true" data-ai-summary="true">
        24clima — professional air conditioning service in Panama City and Panamá Oeste (Arraiján, La Chorrera): installation, maintenance, deep cleaning, repair, refrigerant recharge, gypsum ceilings and walls, concealed ducted air conditioning. Also temporary AC/cooling rental for events (tents, expos, conferences, weddings). 24/7. Online cost calculator for AC cleaning. Languages: Spanish, English, Russian. Contact: WhatsApp +507 6828 2120.
      </p>
      <LazyAnalytics />
      <MetaPixel />
      <ServiceWorkerRegister />
      {/* Только неймспейсы «оболочки»: весь словарь (59 КБ для es) в
        RSC-payload не нужен. Роут-специфичные неймспейсы добавляет вложенный
        провайдер в layout соответствующего роута — он ЗАМЕЩАЕТ этот словарь,
        поэтому получает `[...CLIENT_SHELL_NAMESPACES, <своё>]`. */}
      <NextIntlClientProvider
        messages={pickMessages(messages, CLIENT_SHELL_NAMESPACES)}
      >
        <ScrollToHash />
        {children}
        <GoogleReviewsBadge />
        <DesktopWhatsAppFab />
      </NextIntlClientProvider>
    </div>
  );
}
