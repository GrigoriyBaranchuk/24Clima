import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaProductPage, generateTiendaProductMetadata } from "@/features/tienda/pages/ProductPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return generateTiendaProductMetadata("es", slug);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  setRequestLocale("es");
  const { slug } = await params;
  const { variant } = await searchParams;
  return <TiendaProductPage locale="es" slug={slug} initialVariantId={variant} />;
}
