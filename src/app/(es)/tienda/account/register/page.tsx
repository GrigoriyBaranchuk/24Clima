import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaRegisterPage, generateTiendaRegisterMetadata } from "@/features/tienda/pages/RegisterPage";

export function generateMetadata(): Promise<Metadata> {
  return generateTiendaRegisterMetadata("es");
}

export default async function Page() {
  setRequestLocale("es");
  return <TiendaRegisterPage locale="es" />;
}
