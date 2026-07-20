import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaAccountPage, generateTiendaAccountMetadata } from "@/features/tienda/pages/AccountPage";

export function generateMetadata(): Promise<Metadata> {
  return generateTiendaAccountMetadata("es");
}

export default async function Page() {
  setRequestLocale("es");
  return <TiendaAccountPage locale="es" />;
}
