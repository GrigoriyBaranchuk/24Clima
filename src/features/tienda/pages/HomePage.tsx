import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { api } from "../lib/api-client";
import type { ProductsResponse, Category, Brand } from "../lib/api-client";
import { HomeFilters } from "../components/home/HomeFilters";
import { ActiveFiltersBar } from "../components/home/ActiveFiltersBar";
import { ProductCard } from "../components/product/ProductCard";
import { LocalizedTiendaLink } from "../components/LocalizedTiendaLink";
import { TiendaShell } from "../components/TiendaShell";
import { BASE, tiendaHomeUrl, tiendaLangAlternates } from "../lib/tienda-url";

const titles: Record<string, string> = {
  es: "24Clima Shop | Aire acondicionado y climatización — Panamá",
  en: "24Clima Shop | Air conditioning and HVAC — Panama",
  ru: "24Clima Shop | Кондиционеры и климат — Панама",
};
const descriptions: Record<string, string> = {
  es: "Tienda oficial 24Clima. Equipos de aire acondicionado, repuestos y materiales. B2C y B2B. Envíos en Panamá.",
  en: "Official 24Clima store. Air conditioning equipment, parts and materials. B2C and B2B. Shipping in Panama.",
  ru: "Официальный магазин 24Clima. Оборудование, запчасти и материалы. B2C и B2B. Доставка по Панаме.",
};

export function generateTiendaHomeMetadata(locale: string): Metadata {
  return {
    metadataBase: new URL(BASE),
    title: titles[locale] ?? titles.es,
    description: descriptions[locale] ?? descriptions.es,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : locale === "en" ? "en_US" : "es_PA",
      url: tiendaHomeUrl(locale),
      siteName: "24clima",
      title: titles[locale] ?? titles.es,
      description: descriptions[locale] ?? descriptions.es,
    },
    alternates: {
      canonical: tiendaHomeUrl(locale),
      languages: tiendaLangAlternates(""),
    },
  };
}

async function getProductsSafe(params: {
  category_slug?: string | null;
  brand_slug?: string | null;
  sort?: string;
  limit?: number;
  btu_min?: number | null;
  btu_max?: number | null;
  locale?: string;
  pro?: "exclude" | "include" | "only";
}): Promise<ProductsResponse> {
  try {
    return await api.getProductsCached({
      limit: params.limit ?? 24,
      sort: params.sort ?? "newest",
      category_slug: params.category_slug ?? undefined,
      brand_slug: params.brand_slug ?? undefined,
      btu_min: params.btu_min ?? undefined,
      btu_max: params.btu_max ?? undefined,
      locale: params.locale,
      pro: params.pro,
    });
  } catch (e) {
    console.error("[tienda/home] products fetch failed, rendering empty list:", e);
    return { items: [], total: 0 };
  }
}

async function getCategoriesSafe(): Promise<Category[]> {
  try {
    return await api.getCategoriesCached();
  } catch (e) {
    console.error("[tienda/home] categories fetch failed, rendering empty list:", e);
    return [];
  }
}

async function getBrandsSafe(): Promise<Brand[]> {
  try {
    return await api.getBrandsCached();
  } catch (e) {
    console.error("[tienda/home] brands fetch failed, rendering empty list:", e);
    return [];
  }
}

type SearchParams = {
  category?: string;
  brand?: string;
  sort?: string;
  btu_min?: string;
  btu_max?: string;
  include_pro?: string;
};

export async function TiendaHomePage({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: SearchParams;
}) {
  const { category, brand, sort: sortParam, btu_min: btuMinParam, btu_max: btuMaxParam, include_pro: includeProParam } = searchParams;
  const t = await getTranslations({ locale, namespace: "tienda.home" });
  const tFilters = await getTranslations({ locale, namespace: "tienda.filters" });
  const tBadge = await getTranslations({ locale, namespace: "tienda.badge" });
  const includePro = includeProParam === "1";
  const btuMin = btuMinParam != null && btuMinParam !== "" ? parseInt(btuMinParam, 10) : null;
  const btuMax = btuMaxParam != null && btuMaxParam !== "" ? parseInt(btuMaxParam, 10) : null;
  const validBtuMin = btuMin != null && !Number.isNaN(btuMin) ? btuMin : null;
  const validBtuMax = btuMax != null && !Number.isNaN(btuMax) ? btuMax : null;
  const [data, categories, brands] = await Promise.all([
    getProductsSafe({
      category_slug: category ?? null,
      brand_slug: brand ?? null,
      sort: sortParam ?? "newest",
      limit: 24,
      btu_min: validBtuMin,
      btu_max: validBtuMax,
      locale,
      pro: includePro ? "include" : "exclude",
    }),
    getCategoriesSafe(),
    getBrandsSafe(),
  ]);
  const sort = sortParam && /^(newest|name_asc|name_desc|price_asc|price_desc)$/.test(sortParam) ? sortParam : "newest";
  const categoryName = category ? (categories.find((c) => c.slug === category)?.name ?? null) : null;
  const brandName = brand ? (brands.find((b) => b.slug === brand)?.name ?? null) : null;
  const sortLabels: Record<string, string> = {
    newest: t("sortNewest"),
    price_asc: t("sortPriceAsc"),
    price_desc: t("sortPriceDesc"),
    name_asc: t("sortNameAsc"),
    name_desc: t("sortNameDesc"),
  };
  const sortLabel = sortLabels[sort] ?? t("sortNewest");
  return (
    <TiendaShell>
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </section>
        <section className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="shrink-0 lg:w-64">
            <HomeFilters
              categories={categories}
              brands={brands}
              currentCategory={category ?? null}
              currentBrand={brand ?? null}
              currentSort={sort}
              currentBtuMin={validBtuMin}
              currentBtuMax={validBtuMax}
              currentIncludePro={includePro}
              labels={{
                filterCategory: t("filterCategory"),
                filterBrand: t("filterBrand"),
                filterSort: t("filterSort"),
                filterAll: t("filterAll"),
                sortNewest: t("sortNewest"),
                sortPriceAsc: t("sortPriceAsc"),
                sortPriceDesc: t("sortPriceDesc"),
                sortNameAsc: t("sortNameAsc"),
                sortNameDesc: t("sortNameDesc"),
                filterBtu: t("filterBtu"),
                btuMin: t("btuMin"),
                btuMax: t("btuMax"),
                showPro: tFilters("showPro"),
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">{t("featured")}</h2>
            <ActiveFiltersBar
              categorySlug={category ?? null}
              categoryName={categoryName}
              brandSlug={brand ?? null}
              brandName={brandName}
              sort={sort}
              sortLabel={sortLabel}
              btuMin={validBtuMin}
              btuMax={validBtuMax}
              labels={{
                filterCategory: t("filterCategory"),
                filterBrand: t("filterBrand"),
                filterSort: t("filterSort"),
                filterBtu: t("filterBtu"),
                clearFilter: t("clearFilter"),
              }}
            />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.items.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  btuLabel={t("btuLabel")}
                  professionalLabel={tBadge("professional")}
                  noImageLabel={t("noProducts")}
                />
              ))}
            </div>
            {data.items.length === 0 && (
              <p className="text-muted-foreground">{t("noProducts")}</p>
            )}
            <div className="mt-8 text-center">
              <LocalizedTiendaLink
                href="/category/aire-acondicionado"
                className="inline-flex rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                {t("viewCatalog")}
              </LocalizedTiendaLink>
            </div>
          </div>
        </section>
      </div>
    </TiendaShell>
  );
}
