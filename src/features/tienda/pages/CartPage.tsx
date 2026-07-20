import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CartSummary } from "../components/cart/CartSummary";
import { TiendaShell } from "../components/TiendaShell";
import { BASE } from "../lib/tienda-url";

/** Conversion/private surface — never index. */
export async function generateTiendaCartMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tienda.cart" });
  return {
    metadataBase: new URL(BASE),
    title: `${t("title")} | 24Clima Shop`,
    robots: { index: false, follow: true },
  };
}

export async function TiendaCartPage({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: { add?: string };
}) {
  const { add: addProductId } = searchParams;
  const t = await getTranslations({ locale, namespace: "tienda.cart" });
  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        <CartSummary addProductId={addProductId ?? undefined} />
      </div>
    </TiendaShell>
  );
}
