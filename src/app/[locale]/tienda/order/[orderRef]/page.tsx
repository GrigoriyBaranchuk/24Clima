import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaOrderPage, generateTiendaOrderMetadata } from "@/features/tienda/pages/OrderPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateTiendaOrderMetadata(locale);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; orderRef: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale, orderRef } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  return <TiendaOrderPage locale={locale} orderRef={orderRef} searchParams={sp} />;
}
