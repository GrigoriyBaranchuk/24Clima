import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";
import CleaningPackages from "@/components/CleaningPackages";
import Services from "@/components/Services";
import Problems from "@/components/Problems";
import HomeCtaBlocks from "@/components/HomeCtaBlocks";
import BlogPromo from "@/components/BlogPromo";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import SectionSkeleton from "@/components/SectionSkeleton";

export default async function Home() {
  setRequestLocale("es");

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
          <StatsSection locale="es" />
        </ScrollReveal>
        <ScrollReveal>
          <Problems />
        </ScrollReveal>
        <ScrollReveal>
          <HomeCtaBlocks />
        </ScrollReveal>
        <ScrollReveal>
          <Suspense fallback={<SectionSkeleton />}>
            <BlogPromo locale="es" />
          </Suspense>
        </ScrollReveal>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
