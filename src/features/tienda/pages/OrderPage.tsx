import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api } from "../lib/api-client";
import { TiendaShell } from "../components/TiendaShell";
import { BASE } from "../lib/tienda-url";

/**
 * Order confirmation surface. Not in the original A2 scope list, but the ported
 * CheckoutForm redirects here after a successful order, so it ships as a supporting
 * page to avoid a dead link. Private — never index.
 */
export async function generateTiendaOrderMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tienda.order" });
  return {
    metadataBase: new URL(BASE),
    title: `${t("orderNumber")} | 24Clima Shop`,
    robots: { index: false, follow: true },
  };
}

export async function TiendaOrderPage({
  locale,
  orderRef,
  searchParams,
}: {
  locale: string;
  orderRef: string;
  searchParams: { token?: string };
}) {
  const { token } = searchParams;
  const t = await getTranslations({ locale, namespace: "tienda.order" });
  let order;
  try {
    order = await api.getOrder(orderRef, token ?? undefined);
  } catch {
    notFound();
  }
  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">{t("orderNumber")} {order.order_number}</h1>
        <p className="mt-2 text-muted-foreground">{t("status")}: <strong className="text-foreground">{order.status}</strong></p>
        <p className="mt-2 text-lg font-semibold text-primary">${order.total}</p>
      </div>
    </TiendaShell>
  );
}
