import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { api } from "../lib/api-client";
import type { ProductsResponse } from "../lib/api-client";
import { CategoryFilters } from "../components/category/CategoryFilters";
import { CategoryActiveFiltersBar } from "../components/category/ActiveFiltersBar";
import { ProductCard } from "../components/product/ProductCard";
import { TiendaShell } from "../components/TiendaShell";
import { BASE, tiendaCategoryUrl, tiendaLangAlternates } from "../lib/tienda-url";

const AIR_CONDITIONING_SLUG = "aire-acondicionado";

export function generateTiendaCategoryMetadata(locale: string, slug: string): Metadata {
  return {
    metadataBase: new URL(BASE),
    robots: { index: true, follow: true },
    alternates: {
      canonical: tiendaCategoryUrl(locale, slug),
      languages: tiendaLangAlternates(`/category/${slug}`),
    },
  };
}

async function getCategoryProductsSafe(
  slug: string,
  sort: string,
  q: string | undefined,
  btuMin: number | null,
  btuMax: number | null,
  locale: string,
  pro: "exclude" | "include" | "only"
): Promise<ProductsResponse> {
  try {
    return await api.getProductsCached({
      category_slug: slug,
      sort,
      q,
      limit: 24,
      btu_min: btuMin ?? undefined,
      btu_max: btuMax ?? undefined,
      locale,
      pro,
    });
  } catch (e) {
    console.error("[tienda/category] products fetch failed, rendering empty list:", e);
    return { items: [], total: 0 };
  }
}

type SearchParams = { sort?: string; q?: string; btu_min?: string; btu_max?: string; include_pro?: string };

export async function TiendaCategoryPage({
  locale,
  slug,
  searchParams,
}: {
  locale: string;
  slug: string;
  searchParams: SearchParams;
}) {
  const { sort = "newest", q, btu_min: btuMinParam, btu_max: btuMaxParam, include_pro: includeProParam } = searchParams;
  const includePro = includeProParam === "1";
  const btuMin = btuMinParam != null && btuMinParam !== "" ? parseInt(btuMinParam, 10) : null;
  const btuMax = btuMaxParam != null && btuMaxParam !== "" ? parseInt(btuMaxParam, 10) : null;
  const validBtuMin = btuMin != null && !Number.isNaN(btuMin) ? btuMin : null;
  const validBtuMax = btuMax != null && !Number.isNaN(btuMax) ? btuMax : null;
  const t = await getTranslations({ locale, namespace: "tienda.category" });
  const tHome = await getTranslations({ locale, namespace: "tienda.home" });
  const tFilters = await getTranslations({ locale, namespace: "tienda.filters" });
  const tBadge = await getTranslations({ locale, namespace: "tienda.badge" });
  const data = await getCategoryProductsSafe(
    slug,
    sort,
    q,
    validBtuMin,
    validBtuMax,
    locale,
    includePro ? "include" : "exclude"
  );
  const translatedTitle = t.has(slug) ? t(slug) : slug;
  const title = translatedTitle !== slug ? translatedTitle : slug.replace(/-/g, " ");
  const showBtuFilter = slug === AIR_CONDITIONING_SLUG;
  const sortLabels: Record<string, string> = {
    newest: tHome("sortNewest"),
    price_asc: tHome("sortPriceAsc"),
    price_desc: tHome("sortPriceDesc"),
    name_asc: tHome("sortNameAsc"),
    name_desc: tHome("sortNameDesc"),
  };
  const sortLabel = sortLabels[sort] ?? tHome("sortNewest");
  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground capitalize">{title}</h1>
        <CategoryFilters
          currentBtuMin={validBtuMin}
          currentBtuMax={validBtuMax}
          currentIncludePro={includePro}
          showBtu={showBtuFilter}
          preserveParams={{ sort: sort !== "newest" ? sort : undefined, q: q ?? undefined }}
          labels={{
            filterBtu: tHome("filterBtu"),
            btuMin: tHome("btuMin"),
            btuMax: tHome("btuMax"),
            showPro: tFilters("showPro"),
          }}
        />
        <CategoryActiveFiltersBar
          btuMin={validBtuMin}
          btuMax={validBtuMax}
          sort={sort}
          sortLabel={sortLabel}
          labels={{
            filterBtu: tHome("filterBtu"),
            filterSort: tHome("filterSort"),
            clearFilter: tHome("clearFilter"),
          }}
          preserveParams={{ sort: sort !== "newest" ? sort : undefined, q: q ?? undefined }}
        />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <p className="py-12 text-center text-muted-foreground">{t("noProducts")}</p>
        )}
      </div>
    </TiendaShell>
  );
}
