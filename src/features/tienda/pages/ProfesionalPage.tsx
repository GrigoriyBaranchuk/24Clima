import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { api } from "../lib/api-client";
import type { ProductsResponse } from "../lib/api-client";
import { ProductCard } from "../components/product/ProductCard";
import { TiendaShell } from "../components/TiendaShell";
import { BASE, tiendaProfesionalUrl, tiendaLangAlternates } from "../lib/tienda-url";

export async function generateTiendaProfesionalMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tienda.profesional" });
  return {
    metadataBase: new URL(BASE),
    title: `${t("title")} | 24Clima Shop`,
    description: t("metaDescription"),
    robots: { index: true, follow: true },
    alternates: {
      canonical: tiendaProfesionalUrl(locale),
      languages: tiendaLangAlternates("/profesional"),
    },
  };
}

async function getProProductsSafe(sort: string, q: string | undefined, locale: string): Promise<ProductsResponse> {
  try {
    return await api.getProductsCached({ pro: "only", sort, q, limit: 24, locale });
  } catch (e) {
    console.error("[tienda/profesional] products fetch failed, rendering empty list:", e);
    return { items: [], total: 0 };
  }
}

type SearchParams = { sort?: string; q?: string };

export async function TiendaProfesionalPage({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: SearchParams;
}) {
  const { sort = "newest", q } = searchParams;
  const t = await getTranslations({ locale, namespace: "tienda.profesional" });
  const tHome = await getTranslations({ locale, namespace: "tienda.home" });
  const tBadge = await getTranslations({ locale, namespace: "tienda.badge" });
  const data = await getProProductsSafe(sort, q, locale);

  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t("intro")}</p>
        </section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              btuLabel={tHome("btuLabel")}
              professionalLabel={tBadge("professional")}
            />
          ))}
        </div>
        {data.items.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">{tHome("noProducts")}</p>
        )}
      </div>
    </TiendaShell>
  );
}
