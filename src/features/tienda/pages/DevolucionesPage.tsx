import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { WhatsAppCta } from "@24clima/design/components";
import { TiendaShell } from "../components/TiendaShell";
import { BASE, tiendaDevolucionesUrl, tiendaLangAlternates } from "../lib/tienda-url";

export async function generateTiendaDevolucionesMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tienda.devoluciones" });
  return {
    metadataBase: new URL(BASE),
    title: `${t("title")} | 24Clima Shop`,
    description: t("metaDescription"),
    robots: { index: true, follow: true },
    alternates: {
      canonical: tiendaDevolucionesUrl(locale),
      languages: tiendaLangAlternates("/devoluciones"),
    },
  };
}

const CONDITION_KEYS = [
  "conditionUnused",
  "conditionPackaging",
  "conditionComplete",
  "conditionProof",
] as const;

// Same shop WhatsApp number used on the product page.
const WHATSAPP_NUMBER = "50768282120";

export async function TiendaDevolucionesPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "tienda.devoluciones" });
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("whatsappMessage"))}`;

  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <article className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{t("intro")}</p>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">{t("periodTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("periodText")}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">{t("conditionsTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("conditionsIntro")}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              {CONDITION_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">{t("freeTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("freeText")}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">{t("refundTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("refundText")}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">{t("warrantyTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("warrantyText")}</p>
          </section>

          <section className="mt-10 rounded-lg border border-border bg-muted/40 p-6">
            <h2 className="text-xl font-semibold text-foreground">{t("contactTitle")}</h2>
            <p className="mt-3 text-muted-foreground">{t("contactText")}</p>
            <div className="mt-5">
              <WhatsAppCta href={whatsappHref} size="lg">
                {t("whatsappCta")}
              </WhatsAppCta>
            </div>
          </section>
        </article>
      </div>
    </TiendaShell>
  );
}
