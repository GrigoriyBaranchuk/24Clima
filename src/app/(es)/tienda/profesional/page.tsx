import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { TiendaProfesionalPage, generateTiendaProfesionalMetadata } from "@/features/tienda/pages/ProfesionalPage";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return generateTiendaProfesionalMetadata("es");
}

type SearchParams = { sort?: string; q?: string };

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  setRequestLocale("es");
  const sp = await searchParams;
  return <TiendaProfesionalPage locale="es" searchParams={sp} />;
}
