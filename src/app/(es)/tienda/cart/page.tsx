import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaCartPage, generateTiendaCartMetadata } from "@/features/tienda/pages/CartPage";

export function generateMetadata(): Promise<Metadata> {
  return generateTiendaCartMetadata("es");
}

export default async function Page({ searchParams }: { searchParams: Promise<{ add?: string }> }) {
  setRequestLocale("es");
  const sp = await searchParams;
  return <TiendaCartPage locale="es" searchParams={sp} />;
}
