import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, defaultLocale } from "@/i18n/config";
import { TiendaHomePage, generateTiendaHomeMetadata } from "@/features/tienda/pages/HomePage";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.filter((l) => l !== defaultLocale).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateTiendaHomeMetadata(locale);
}

type SearchParams = { category?: string; brand?: string; sort?: string; btu_min?: string; btu_max?: string; include_pro?: string };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  return <TiendaHomePage locale={locale} searchParams={sp} />;
}
