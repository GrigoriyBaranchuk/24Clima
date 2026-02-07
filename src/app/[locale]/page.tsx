import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
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
        <Problems />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
