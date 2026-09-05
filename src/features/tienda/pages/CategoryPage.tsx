import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api } from "../lib/api-client";
import type { ProductsResponse, Category } from "../lib/api-client";
import { CategoryFilters } from "../components/category/CategoryFilters";
import { CategoryActiveFiltersBar } from "../components/category/ActiveFiltersBar";
import { ProductCard } from "../components/product/ProductCard";
import { LocalizedTiendaLink } from "../components/LocalizedTiendaLink";
import { TiendaShell } from "../components/TiendaShell";
import { BASE, tiendaCategoryUrl, tiendaLangAlternates } from "../lib/tienda-url";
import {
  categoryLabel,
  findCategoryBySlug,
  getAncestors,
  getChildren,
  isInSubtree,
  type CategoryTranslator,
} from "../lib/category-tree";

const AIR_CONDITIONING_SLUG = "aire-acondicionado";

async function getCategoriesSafe(): Promise<Category[]> {
  try {
    return await api.getCategoriesCached();
  } catch (e) {
    console.error("[tienda/category] categories fetch failed, rendering empty list:", e);
    return [];
  }
}

export async function generateTiendaCategoryMetadata(locale: string, slug: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tienda.category" });
  const categories = await getCategoriesSafe();
  const current = findCategoryBySlug(slug, categories);
  const label = current
    ? categoryLabel(t as unknown as CategoryTranslator, current)
    : t.has(slug)
      ? t(slug)
      : slug.replace(/-/g, " ");
  return {
    metadataBase: new URL(BASE),
    title: `${label} | 24Clima Shop`,
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

/** Chip-shaped link to a sibling / child category (ActiveFiltersBar chip, minus the clear button). */
function CategoryChip({
  slug,
  label,
  active,
}: {
  slug: string;
  label: string;
  active: boolean;
}) {
  const className = active
    ? "inline-flex items-center rounded-full border border-primary bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    : "inline-flex items-center rounded-full border border-border bg-muted/80 px-3 py-1.5 text-sm text-foreground transition hover:bg-muted";
  return (
    <LocalizedTiendaLink
      href={`/category/${slug}`}
      className={className}
      aria-current={active ? "true" : undefined}
    >
      {label}
    </LocalizedTiendaLink>
  );
}

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
  const tProduct = await getTranslations({ locale, namespace: "tienda.product" });
  const [data, categories] = await Promise.all([
    getCategoryProductsSafe(
      slug,
      sort,
      q,
      validBtuMin,
      validBtuMax,
      locale,
      includePro ? "include" : "exclude"
    ),
    getCategoriesSafe(),
  ]);
  const found = findCategoryBySlug(slug, categories);
  // An unknown slug used to render an empty page with HTTP 200 — that is a 404.
  // Guard on a non-empty list so an API outage (getCategoriesSafe → []) does not
  // turn every category URL into a 404.
  if (!found && categories.length > 0) notFound();
  const label = (c: { slug: string; name: string }) =>
    categoryLabel(t as unknown as CategoryTranslator, c);
  const current = found ?? { id: slug, name: slug.replace(/-/g, " "), slug, parent_id: null, sort_order: 0 };
  const title = label(current);
  const ancestors = getAncestors(slug, categories);
  const parent = ancestors.length > 0 ? ancestors[ancestors.length - 1] : null;
  // Root category → its children; leaf → all of its siblings, with a link back
  // to the parent ("all in <parent>"), which the backend rolls up anyway.
  const siblingsRoot = parent ?? current;
  const siblings = getChildren(siblingsRoot.slug, categories);
  const showSubcategories = siblings.length > 0;
  const showBtuFilter = isInSubtree(slug, AIR_CONDITIONING_SLUG, categories);
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
        <nav aria-label={t("breadcrumbShop")} className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <LocalizedTiendaLink href="/" className="transition hover:text-foreground">
            {t("breadcrumbShop")}
          </LocalizedTiendaLink>
          {ancestors.map((a) => (
            <span key={a.id} className="flex items-center gap-1.5">
              <span aria-hidden="true">›</span>
              <LocalizedTiendaLink
                href={`/category/${a.slug}`}
                className="transition hover:text-foreground"
              >
                {label(a)}
              </LocalizedTiendaLink>
            </span>
          ))}
          <span aria-hidden="true">›</span>
          <span className="text-foreground">{title}</span>
        </nav>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {showSubcategories && (
          <section className="mt-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("subcategories")}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip
                slug={siblingsRoot.slug}
                label={t("allIn", { name: label(siblingsRoot) })}
                active={siblingsRoot.slug === slug}
              />
              {siblings.map((c) => (
                <CategoryChip
                  key={c.id}
                  slug={c.slug}
                  label={label(c)}
                  active={c.slug === slug}
                />
              ))}
            </div>
          </section>
        )}
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
              seePresentationsLabel={tProduct("seePresentations")}
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
