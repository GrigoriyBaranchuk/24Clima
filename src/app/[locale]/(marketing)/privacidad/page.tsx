import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, defaultLocale } from "@/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import {
  PrivacyPolicy,
  generatePrivacyMetadata,
} from "@/components/PrivacyPolicy";

export function generateStaticParams() {
  return locales
    .filter((l) => l !== defaultLocale)
    .map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePrivacyMetadata(locale);
}

export default async function Page({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main id="main-content" className="pt-14 lg:pt-20">
        <PrivacyPolicy locale={locale} />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
