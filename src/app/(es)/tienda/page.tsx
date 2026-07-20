import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaHomePage, generateTiendaHomeMetadata } from "@/features/tienda/pages/HomePage";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return generateTiendaHomeMetadata("es");
}

type SearchParams = { category?: string; brand?: string; sort?: string; btu_min?: string; btu_max?: string; include_pro?: string };

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  setRequestLocale("es");
  const sp = await searchParams;
  return <TiendaHomePage locale="es" searchParams={sp} />;
}
