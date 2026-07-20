"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import type { Category, Brand } from "../../lib/api-client";

const SORT_OPTIONS = [
  { value: "newest", labelKey: "sortNewest" },
  { value: "price_asc", labelKey: "sortPriceAsc" },
  { value: "price_desc", labelKey: "sortPriceDesc" },
  { value: "name_asc", labelKey: "sortNameAsc" },
  { value: "name_desc", labelKey: "sortNameDesc" },
] as const;

const AIR_CONDITIONING_SLUG = "aire-acondicionado";

type Props = {
  categories: Category[];
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
  const showBtuFilter = currentCategory === AIR_CONDITIONING_SLUG;

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
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {labels.filterCategory}
        </h3>
        <select
          value={currentCategory ?? ""}
          onChange={(e) => updateParams({ category: e.target.value || null })}
          className="w-full rounded-xl border border-input/80 bg-background/80 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">{labels.filterAll}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {labels.filterBrand}
        </h3>
        <select
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
              <label className="mb-1 block text-xs text-muted-foreground">{labels.btuMin}</label>
              <input
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
              <label className="mb-1 block text-xs text-muted-foreground">{labels.btuMax}</label>
              <input
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
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {labels.filterSort}
        </h3>
        <select
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
