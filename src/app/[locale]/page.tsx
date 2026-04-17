import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CleaningPackages from "@/components/CleaningPackages";
import Calculator from "@/components/Calculator";
import Services from "@/components/Services";
import Problems from "@/components/Problems";
import HomeCtaBlocks from "@/components/HomeCtaBlocks";
import BlogPromo from "@/components/BlogPromo";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Calculator />
        <CleaningPackages />
        <Services />
        <StatsSection locale={locale === "en" || locale === "ru" ? locale : "es"} />
        <Problems />
        <HomeCtaBlocks />
        <BlogPromo locale={locale} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
