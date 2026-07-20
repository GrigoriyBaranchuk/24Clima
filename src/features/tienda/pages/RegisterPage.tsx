import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { RegisterForm } from "../components/account/RegisterForm";
import { TiendaShell } from "../components/TiendaShell";
import { BASE } from "../lib/tienda-url";

/** Private surface — never index. */
export async function generateTiendaRegisterMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tienda.account" });
  return {
    metadataBase: new URL(BASE),
    title: `${t("registerTitle")} | 24Clima Shop`,
    robots: { index: false, follow: true },
  };
}

export async function TiendaRegisterPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "tienda.account" });
  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">{t("registerTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("registerIntro")}</p>
        <RegisterForm />
      </div>
    </TiendaShell>
  );
}
