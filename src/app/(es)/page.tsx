import { setRequestLocale } from "next-intl/server";
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

export default async function Home() {
  setRequestLocale("es");

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Calculator />
        <CleaningPackages />
        <Services />
        <StatsSection locale="es" />
        <Problems />
        <HomeCtaBlocks />
        <BlogPromo locale="es" />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
