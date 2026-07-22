import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaDevolucionesPage, generateTiendaDevolucionesMetadata } from "@/features/tienda/pages/DevolucionesPage";

export function generateMetadata(): Promise<Metadata> {
  return generateTiendaDevolucionesMetadata("es");
}

export default function Page() {
  setRequestLocale("es");
  return <TiendaDevolucionesPage locale="es" />;
}
