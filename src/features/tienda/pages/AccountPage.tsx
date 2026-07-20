import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AccountView } from "../components/account/AccountView";
import { TiendaShell } from "../components/TiendaShell";
import { BASE } from "../lib/tienda-url";

/** Private surface — never index. */
export async function generateTiendaAccountMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tienda.account" });
  return {
    metadataBase: new URL(BASE),
    title: `${t("title")} | 24Clima Shop`,
    robots: { index: false, follow: true },
  };
}

export async function TiendaAccountPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "tienda.account" });
  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        <AccountView />
      </div>
    </TiendaShell>
  );
}
