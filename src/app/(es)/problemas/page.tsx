import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProblemsContent from "@/components/ProblemsContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://24clima.com"),
  title: "Problemas comunes del aire acondicionado | 24clima",
  description:
    "¿Tu aire acondicionado no enfría, gotea o hace ruido? Diagnóstico y solución rápida por técnicos certificados en Ciudad de Panamá.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_PA",
    url: "https://24clima.com/problemas/",
    siteName: "24clima",
    title: "Problemas comunes del aire acondicionado | 24clima",
    description:
      "¿Tu aire acondicionado no enfría, gotea o hace ruido? Diagnóstico y solución rápida por técnicos certificados en Ciudad de Panamá.",
  },
  alternates: {
    canonical: "https://24clima.com/problemas/",
    languages: {
      "x-default": "https://24clima.com/",
      es: "https://24clima.com/problemas/",
      en: "https://24clima.com/en/problemas/",
      ru: "https://24clima.com/ru/problemas/",
    },
  },
};

export default function ProblemasPage() {
  setRequestLocale("es");

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
