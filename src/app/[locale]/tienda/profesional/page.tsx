import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, defaultLocale } from "@/i18n/config";
import { TiendaProfesionalPage, generateTiendaProfesionalMetadata } from "@/features/tienda/pages/ProfesionalPage";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.filter((l) => l !== defaultLocale).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateTiendaProfesionalMetadata(locale);
}

type SearchParams = { sort?: string; q?: string };

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
  return <TiendaProfesionalPage locale={locale} searchParams={sp} />;
}
