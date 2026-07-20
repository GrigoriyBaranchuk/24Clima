import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaCategoryPage, generateTiendaCategoryMetadata } from "@/features/tienda/pages/CategoryPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return generateTiendaCategoryMetadata("es", slug);
}

type SearchParams = { sort?: string; q?: string; btu_min?: string; btu_max?: string; include_pro?: string };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  setRequestLocale("es");
  const { slug } = await params;
  const sp = await searchParams;
  return <TiendaCategoryPage locale="es" slug={slug} searchParams={sp} />;
}
