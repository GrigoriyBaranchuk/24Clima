import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaCheckoutPage, generateTiendaCheckoutMetadata } from "@/features/tienda/pages/CheckoutPage";

export function generateMetadata(): Promise<Metadata> {
  return generateTiendaCheckoutMetadata("es");
}

export default async function Page() {
  setRequestLocale("es");
  return <TiendaCheckoutPage locale="es" />;
}
