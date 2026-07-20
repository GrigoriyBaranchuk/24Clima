"use client";

import { useSearchParams } from "next/navigation";

import { useRouter, usePathname } from "@/i18n/routing";

type Props = {
  btuMin: number | null;
  btuMax: number | null;
  sort: string;
  sortLabel: string;
  labels: {
    filterBtu: string;
    filterSort: string;
    clearFilter: string;
  };
  preserveParams?: { sort?: string; q?: string };
};

export function CategoryActiveFiltersBar(props: Props) {
  const { btuMin, btuMax, sort, sortLabel, labels, preserveParams } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildParams(updates: { btu_min?: number | null; btu_max?: number | null; sort?: string }) {
    const params = new URLSearchParams();
    if (preserveParams?.sort && updates.sort === undefined) params.set("sort", preserveParams.sort);
    else if (updates.sort !== undefined && updates.sort !== "newest") params.set("sort", updates.sort);
    if (preserveParams?.q) params.set("q", preserveParams.q);
    const bMin = updates.btu_min !== undefined ? updates.btu_min : btuMin;
    const bMax = updates.btu_max !== undefined ? updates.btu_max : btuMax;
    if (bMin != null && bMin > 0) params.set("btu_min", String(bMin));
    if (bMax != null && bMax > 0) params.set("btu_max", String(bMax));
    if (searchParams.get("include_pro")) params.set("include_pro", "1");
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  }

  const hasBtu = (btuMin != null && btuMin > 0) || (btuMax != null && btuMax > 0);
  const btuText =
    btuMin != null && btuMax != null && btuMin > 0 && btuMax > 0
      ? `${btuMin.toLocaleString()} – ${btuMax.toLocaleString()}`
      : btuMin != null && btuMin > 0
        ? `≥ ${btuMin.toLocaleString()}`
        : btuMax != null && btuMax > 0
          ? `≤ ${btuMax.toLocaleString()}`
          : "";
  const hasSort = sort && sort !== "newest";
  const hasAny = hasBtu || hasSort;
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
    <div className="mt-4 flex flex-wrap items-center gap-2">
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
