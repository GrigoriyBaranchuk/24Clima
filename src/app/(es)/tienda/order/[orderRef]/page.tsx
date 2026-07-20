import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaOrderPage, generateTiendaOrderMetadata } from "@/features/tienda/pages/OrderPage";

export function generateMetadata(): Promise<Metadata> {
  return generateTiendaOrderMetadata("es");
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ orderRef: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  setRequestLocale("es");
  const { orderRef } = await params;
  const sp = await searchParams;
  return <TiendaOrderPage locale="es" orderRef={orderRef} searchParams={sp} />;
}
