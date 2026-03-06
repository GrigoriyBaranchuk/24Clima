import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CleaningPackages from "@/components/CleaningPackages";
import Calculator from "@/components/Calculator";
import Services from "@/components/Services";
import Problems from "@/components/Problems";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
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
        <Problems />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
