import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaCategoryPage, generateTiendaCategoryMetadata } from "@/features/tienda/pages/CategoryPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return generateTiendaCategoryMetadata(locale, slug);
}

type SearchParams = { sort?: string; q?: string; btu_min?: string; btu_max?: string; include_pro?: string };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  return <TiendaCategoryPage locale={locale} slug={slug} searchParams={sp} />;
}
