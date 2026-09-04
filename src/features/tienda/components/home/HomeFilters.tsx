"use client";

import { useId, useMemo } from "react";

import { useRouter, usePathname } from "@/i18n/routing";
import type { Brand } from "../../lib/api-client";
import { buildCategoryTree, isInSubtree, type CategoryLike } from "../../lib/category-tree";

const SORT_OPTIONS = [
  { value: "newest", labelKey: "sortNewest" },
  { value: "price_asc", labelKey: "sortPriceAsc" },
  { value: "price_desc", labelKey: "sortPriceDesc" },
  { value: "name_asc", labelKey: "sortNameAsc" },
  { value: "name_desc", labelKey: "sortNameDesc" },
] as const;

const AIR_CONDITIONING_SLUG = "aire-acondicionado";

/** Category as the server hands it over: `name` is already the localized label. */
export type CategoryOption = CategoryLike;

type Props = {
  categories: CategoryOption[];
  brands: Brand[];
  currentCategory: string | null;
  currentBrand: string | null;
  currentSort: string;
  currentBtuMin: number | null;
  currentBtuMax: number | null;
  currentIncludePro: boolean;
  labels: {
    filterCategory: string;
    filterBrand: string;
    filterSort: string;
    filterAll: string;
    sortNewest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortNameAsc: string;
    sortNameDesc: string;
    filterBtu: string;
    btuMin: string;
    btuMax: string;
    showPro: string;
  };
};

export function HomeFilters(props: Props) {
  const {
    categories,
    brands,
    currentCategory,
    currentBrand,
    currentSort,
    currentBtuMin,
    currentBtuMax,
    currentIncludePro,
    labels,
  } = props;
  const router = useRouter();
  const pathname = usePathname();
  // BTU makes sense for the whole air-conditioning subtree, not just its root.
  const showBtuFilter = isInSubtree(currentCategory, AIR_CONDITIONING_SLUG, categories);
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  // The selects keep their <h3> as the visible group heading (page outline
  // stays intact) and borrow it as accessible name via aria-labelledby; the
  // BTU fields already have real <label>s, they just weren't associated.
  const categoryLabelId = useId();
  const brandLabelId = useId();
  const sortLabelId = useId();
  const btuMinId = useId();
  const btuMaxId = useId();

  function updateParams(updates: {
    category?: string | null;
    brand?: string | null;
    sort?: string;
    btu_min?: number | null;
    btu_max?: number | null;
    include_pro?: boolean;
  }) {
    const params = new URLSearchParams();
    const cat = updates.category !== undefined ? updates.category : currentCategory;
    const brand = updates.brand !== undefined ? updates.brand : currentBrand;
    const sort = updates.sort !== undefined ? updates.sort : currentSort;
    const btuMin = updates.btu_min !== undefined ? updates.btu_min : currentBtuMin;
    const btuMax = updates.btu_max !== undefined ? updates.btu_max : currentBtuMax;
    const includePro = updates.include_pro !== undefined ? updates.include_pro : currentIncludePro;
    if (cat) params.set("category", cat);
    if (brand) params.set("brand", brand);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (btuMin != null && btuMin > 0) params.set("btu_min", String(btuMin));
    if (btuMax != null && btuMax > 0) params.set("btu_max", String(btuMax));
    if (includePro) params.set("include_pro", "1");
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  }

  const sortLabels: Record<string, string> = {
    sortNewest: labels.sortNewest,
    sortPriceAsc: labels.sortPriceAsc,
    sortPriceDesc: labels.sortPriceDesc,
    sortNameAsc: labels.sortNameAsc,
    sortNameDesc: labels.sortNameDesc,
  };

  return (
    <aside className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur-sm">
        <h3
          id={categoryLabelId}
          className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {labels.filterCategory}
        </h3>
        {/* The tree is small (2 levels), so it stays fully expanded — no toggles. */}
        <nav aria-labelledby={categoryLabelId} className="space-y-0.5">
          <CategoryButton
            label={labels.filterAll}
            active={!currentCategory}
            level="root"
            onSelect={() => updateParams({ category: null })}
          />
          {categoryTree.map((root) => (
            <div key={root.id} className="space-y-0.5">
              <CategoryButton
                label={root.name}
                active={currentCategory === root.slug}
                level="root"
                onSelect={() => updateParams({ category: root.slug })}
              />
              {root.children.length > 0 && (
                <div className="space-y-0.5 pl-4">
                  {root.children.map((child) => (
                    <CategoryButton
                      key={child.id}
                      label={child.name}
                      active={currentCategory === child.slug}
                      level="child"
                      onSelect={() => updateParams({ category: child.slug })}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur-sm">
        <h3
          id={brandLabelId}
          className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {labels.filterBrand}
        </h3>
        <select
          aria-labelledby={brandLabelId}
          value={currentBrand ?? ""}
          onChange={(e) => updateParams({ brand: e.target.value || null })}
          className="w-full rounded-xl border border-input/80 bg-background/80 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">{labels.filterAll}</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {showBtuFilter && (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {labels.filterBtu}
          </h3>
          <div className="space-y-3">
            <div>
              <label htmlFor={btuMinId} className="mb-1 block text-xs text-muted-foreground">
                {labels.btuMin}
              </label>
              <input
                id={btuMinId}
                type="number"
                min={0}
                step={1000}
                placeholder="e.g. 9000"
                value={currentBtuMin ?? ""}
                onChange={(e) => {
                  const v = e.target.value === "" ? null : parseInt(e.target.value, 10);
                  updateParams({ btu_min: Number.isNaN(v) ? null : v });
                }}
                className="w-full rounded-xl border border-input/80 bg-background/80 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor={btuMaxId} className="mb-1 block text-xs text-muted-foreground">
                {labels.btuMax}
              </label>
              <input
                id={btuMaxId}
                type="number"
                min={0}
                step={1000}
                placeholder="e.g. 24000"
                value={currentBtuMax ?? ""}
                onChange={(e) => {
                  const v = e.target.value === "" ? null : parseInt(e.target.value, 10);
                  updateParams({ btu_max: Number.isNaN(v) ? null : v });
                }}
                className="w-full rounded-xl border border-input/80 bg-background/80 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur-sm">
        <h3
          id={sortLabelId}
          className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {labels.filterSort}
        </h3>
        <select
          aria-labelledby={sortLabelId}
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full rounded-xl border border-input/80 bg-background/80 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {sortLabels[opt.labelKey]}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur-sm">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={currentIncludePro}
            onChange={(e) => updateParams({ include_pro: e.target.checked })}
            className="h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-2 focus:ring-primary/20"
          />
          <span>{labels.showPro}</span>
        </label>
      </div>
    </aside>
  );
}

function CategoryButton({
  label,
  active,
  level,
  onSelect,
}: {
  label: string;
  active: boolean;
  level: "root" | "child";
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={[
        "block w-full rounded-lg px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/20",
        level === "root" ? "text-sm font-medium" : "text-xs",
        active ? "bg-primary/10 font-semibold text-primary" : "text-foreground hover:bg-muted",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
