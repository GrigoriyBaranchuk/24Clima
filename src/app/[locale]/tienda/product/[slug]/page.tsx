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

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <TiendaProductPage locale={locale} slug={slug} />;
}
