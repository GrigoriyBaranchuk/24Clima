import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, defaultLocale } from "@/i18n/config";
import { TiendaDevolucionesPage, generateTiendaDevolucionesMetadata } from "@/features/tienda/pages/DevolucionesPage";

export function generateStaticParams() {
  return locales.filter((l) => l !== defaultLocale).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateTiendaDevolucionesMetadata(locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TiendaDevolucionesPage locale={locale} />;
}
