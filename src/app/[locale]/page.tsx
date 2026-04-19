import { Suspense } from "react";
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
import ScrollReveal from "@/components/ScrollReveal";
import SectionSkeleton from "@/components/SectionSkeleton";

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
      <main id="main-content">
        <Hero />
        <ScrollReveal>
          <Calculator />
        </ScrollReveal>
        <ScrollReveal>
          <CleaningPackages />
        </ScrollReveal>
        <ScrollReveal>
          <Suspense fallback={<SectionSkeleton />}>
            <Services />
          </Suspense>
        </ScrollReveal>
        <ScrollReveal animation="fade-in">
          <StatsSection locale={locale === "en" || locale === "ru" ? locale : "es"} />
        </ScrollReveal>
        <ScrollReveal>
          <Problems />
        </ScrollReveal>
        <ScrollReveal>
          <HomeCtaBlocks />
        </ScrollReveal>
        <ScrollReveal>
          <Suspense fallback={<SectionSkeleton />}>
            <BlogPromo locale={locale} />
          </Suspense>
        </ScrollReveal>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
