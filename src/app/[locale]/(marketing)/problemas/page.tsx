import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale, getLocalePrefix } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProblemsContent from "@/components/ProblemsContent";

const titles: Record<string, string> = {
  es: "Problemas comunes del aire acondicionado | 24clima",
  en: "Common AC Problems | 24clima — Air Conditioning in Panama",
  ru: "Частые проблемы кондиционеров | 24clima — Панама",
};

const descriptions: Record<string, string> = {
  es: "¿Tu aire acondicionado no enfría, gotea o hace ruido? Diagnóstico y solución rápida por técnicos certificados en Ciudad de Panamá.",
  en: "Is your AC not cooling, leaking or making noise? Fast diagnosis and repair by certified technicians in Panama City.",
  ru: "Кондиционер не охлаждает, течёт или шумит? Быстрая диагностика и ремонт сертифицированными специалистами в Панама-Сити.",
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
  return {
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    alternates: {
      canonical: `https://24clima.com${locale === "es" ? "" : `/${locale}`}/problemas`,
    },
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProblemasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main id="main-content" className="pt-14 lg:pt-20">
        <ProblemsContent />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
