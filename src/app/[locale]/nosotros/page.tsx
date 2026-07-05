import BottomNav from "@/components/BottomNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NosotrosCTA from "@/components/NosotrosCTA";
import Reviews from "@/components/Reviews";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhyUs from "@/components/WhyUs";
import { type Locale, getLocalePrefix, locales } from "@/i18n/config";
import {
  buildBreadcrumbJsonLd,
  getLabels,
  localePath,
} from "@/lib/breadcrumb-helper";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

const titles: Record<string, string> = {
  en: "About Us | 24clima — Air Conditioning Service in Panama",
  ru: "О нас | 24clima — Обслуживание кондиционеров в Панаме",
};

const descriptions: Record<string, string> = {
  en: "Meet the 24clima team. Experience, professionalism and commitment to quality in AC cleaning, maintenance, repair and installation in Panama City.",
  ru: "Команда 24clima. Опыт, профессионализм и качество в чистке, обслуживании, ремонте и установке кондиционеров в Панама-Сити.",
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
  const baseUrl = `https://24clima.com${prefix}/nosotros/`;

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
        es: "https://24clima.com/nosotros/",
        en: "https://24clima.com/en/nosotros/",
        ru: "https://24clima.com/ru/nosotros/",
      },
    },
  };
}

function getAboutJsonLd(locale: string) {
  const prefix = getLocalePrefix(locale as Locale);
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    url: `https://24clima.com${prefix}/nosotros/`,
    mainEntity: {
      "@type": "Organization",
      name: "24clima",
      url: "https://24clima.com",
      areaServed: { "@type": "City", name: "Ciudad de Panamá" },
    },
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const labels = getLabels(locale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: labels.home, url: localePath(locale, "/") },
    { name: labels.about, url: localePath(locale, "/nosotros/") },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getAboutJsonLd(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id="main-content" className="pt-14 lg:pt-20">
        <div className="container mx-auto px-4 lg:px-8 pt-2">
          <Breadcrumbs segments={[{ label: labels.about }]} />
        </div>
        <WhyUs />
        <Reviews />
        <NosotrosCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
    </>
  );
}
