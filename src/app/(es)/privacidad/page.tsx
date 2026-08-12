import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import {
  PrivacyPolicy,
  generatePrivacyMetadata,
} from "@/components/PrivacyPolicy";

export function generateMetadata(): Promise<Metadata> {
  return generatePrivacyMetadata("es");
}

export default function Page() {
  setRequestLocale("es");

  return (
    <>
      <Header />
      <main id="main-content" className="pt-14 lg:pt-20">
        <PrivacyPolicy locale="es" />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
