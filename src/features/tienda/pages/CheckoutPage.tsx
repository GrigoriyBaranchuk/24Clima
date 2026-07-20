import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CheckoutForm } from "../components/checkout/CheckoutForm";
import { TiendaShell } from "../components/TiendaShell";
import { BASE } from "../lib/tienda-url";

/** Conversion/private surface — never index. */
export async function generateTiendaCheckoutMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tienda.checkout" });
  return {
    metadataBase: new URL(BASE),
    title: `${t("title")} | 24Clima Shop`,
    robots: { index: false, follow: true },
  };
}

export async function TiendaCheckoutPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "tienda.checkout" });
  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        <CheckoutForm />
      </div>
    </TiendaShell>
  );
}
