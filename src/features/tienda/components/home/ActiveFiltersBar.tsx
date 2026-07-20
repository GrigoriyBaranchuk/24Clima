"use client";

import { useSearchParams } from "next/navigation";

import { useRouter, usePathname } from "@/i18n/routing";

type Props = {
  categorySlug: string | null;
  categoryName: string | null;
  brandSlug: string | null;
  brandName: string | null;
  sort: string;
  sortLabel: string;
  btuMin: number | null;
  btuMax: number | null;
  labels: {
    filterCategory: string;
    filterBrand: string;
    filterSort: string;
    filterBtu: string;
    clearFilter: string;
  };
};

export function ActiveFiltersBar(props: Props) {
  const {
    categorySlug,
    categoryName,
    brandSlug,
    brandName,
    sort,
    sortLabel,
    btuMin,
    btuMax,
    labels,
  } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildParams(updates: {
    category?: string | null;
    brand?: string | null;
    sort?: string;
    btu_min?: number | null;
    btu_max?: number | null;
  }) {
    const params = new URLSearchParams();
    const cat = updates.category !== undefined ? updates.category : categorySlug;
    const brand = updates.brand !== undefined ? updates.brand : brandSlug;
    const s = updates.sort !== undefined ? updates.sort : sort;
    const bMin = updates.btu_min !== undefined ? updates.btu_min : btuMin;
    const bMax = updates.btu_max !== undefined ? updates.btu_max : btuMax;
    if (cat) params.set("category", cat);
    if (brand) params.set("brand", brand);
    if (s && s !== "newest") params.set("sort", s);
    if (bMin != null && bMin > 0) params.set("btu_min", String(bMin));
    if (bMax != null && bMax > 0) params.set("btu_max", String(bMax));
    if (searchParams.get("include_pro")) params.set("include_pro", "1");
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  }

  const hasCategory = categorySlug && categoryName;
  const hasBrand = brandSlug && brandName;
  const hasSort = sort && sort !== "newest";
  const hasBtu = (btuMin != null && btuMin > 0) || (btuMax != null && btuMax > 0);
  const btuText =
    btuMin != null && btuMax != null && btuMin > 0 && btuMax > 0
      ? `${btuMin.toLocaleString()} – ${btuMax.toLocaleString()}`
      : btuMin != null && btuMin > 0
        ? `≥ ${btuMin.toLocaleString()}`
        : btuMax != null && btuMax > 0
          ? `≤ ${btuMax.toLocaleString()}`
          : "";

  const hasAny = hasCategory || hasBrand || hasSort || hasBtu;
  if (!hasAny) return null;

  function Chip({
    label,
    value,
    onClear,
  }: {
    label: string;
    value: string;
    onClear: () => void;
  }) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/80 px-3 py-1.5 text-sm">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium text-foreground">{value}</span>
        <button
          type="button"
          onClick={onClear}
          aria-label={labels.clearFilter}
          className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </span>
    );
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {hasCategory && (
        <Chip
          label={labels.filterCategory}
          value={categoryName!}
          onClear={() => buildParams({ category: null })}
        />
      )}
      {hasBrand && (
        <Chip
          label={labels.filterBrand}
          value={brandName!}
          onClear={() => buildParams({ brand: null })}
        />
      )}
      {hasBtu && btuText && (
        <Chip
          label={labels.filterBtu}
          value={btuText}
          onClear={() => buildParams({ btu_min: null, btu_max: null })}
        />
      )}
      {hasSort && (
        <Chip
          label={labels.filterSort}
          value={sortLabel}
          onClear={() => buildParams({ sort: "newest" })}
        />
      )}
    </div>
  );
}
