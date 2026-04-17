import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale, getLocalePrefix } from "@/i18n/config";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { buildBreadcrumbJsonLd, localePath, getLabels } from "@/lib/breadcrumb-helper";

const titles: Record<string, string> = {
  en: "Contact | 24clima — Air Conditioning Service in Panama",
  ru: "Контакты | 24clima — Обслуживание кондиционеров в Панаме",
};

const descriptions: Record<string, string> = {
  en:
    "Contact 24clima via WhatsApp or phone. Air conditioning service in Panama City. Fast response and free quote.",
  ru:
    "Свяжитесь с 24clima по WhatsApp или телефону. Сервис кондиционеров в Панама-Сити. Быстрый ответ и бесплатная оценка.",
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
  const baseUrl = `https://24clima.com${prefix}/contacto/`;

  return {
    metadataBase: new URL("https://24clima.com"),
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
        "x-default": "https://24clima.com/",
        es: "https://24clima.com/contacto/",
        en: "https://24clima.com/en/contacto/",
        ru: "https://24clima.com/ru/contacto/",
      },
    },
  };
}

function getContactJsonLd(locale: string) {
  const prefix = getLocalePrefix(locale as Locale);
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    url: `https://24clima.com${prefix}/contacto/`,
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
}

type Props = { params: Promise<{ locale: string }> };

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const labels = getLabels(locale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: labels.home, url: localePath(locale, "/") },
    { name: labels.contact, url: localePath(locale, "/contacto/") },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getContactJsonLd(locale)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main>
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
