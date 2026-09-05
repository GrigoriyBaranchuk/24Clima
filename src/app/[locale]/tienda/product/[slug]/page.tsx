import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaProductPage, generateTiendaProductMetadata } from "@/features/tienda/pages/ProductPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return generateTiendaProductMetadata(locale, slug);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { variant } = await searchParams;
  return <TiendaProductPage locale={locale} slug={slug} initialVariantId={variant} />;
}
