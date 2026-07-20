import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaProductPage, generateTiendaProductMetadata } from "@/features/tienda/pages/ProductPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return generateTiendaProductMetadata("es", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  setRequestLocale("es");
  const { slug } = await params;
  return <TiendaProductPage locale="es" slug={slug} />;
}
