"use client";

import { useRouter, usePathname } from "@/i18n/routing";

type Props = {
  currentBtuMin: number | null;
  currentBtuMax: number | null;
  currentIncludePro: boolean;
  showBtu: boolean;
  preserveParams?: { sort?: string; q?: string };
  labels: { filterBtu: string; btuMin: string; btuMax: string; showPro: string };
};

export function CategoryFilters({
  currentBtuMin,
  currentBtuMax,
  currentIncludePro,
  showBtu,
  preserveParams,
  labels,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function updateParams(updates: { btu_min?: number | null; btu_max?: number | null; include_pro?: boolean }) {
    const btuMin = updates.btu_min !== undefined ? updates.btu_min : currentBtuMin;
    const btuMax = updates.btu_max !== undefined ? updates.btu_max : currentBtuMax;
    const includePro = updates.include_pro !== undefined ? updates.include_pro : currentIncludePro;
    const params = new URLSearchParams();
    if (preserveParams?.sort) params.set("sort", preserveParams.sort);
    if (preserveParams?.q) params.set("q", preserveParams.q);
    if (btuMin != null && btuMin > 0) params.set("btu_min", String(btuMin));
    if (btuMax != null && btuMax > 0) params.set("btu_max", String(btuMax));
    if (includePro) params.set("include_pro", "1");
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  }

  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm">
      {showBtu && (
        <>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {labels.filterBtu}
          </h3>
          <div className="flex flex-wrap items-end gap-4">
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
                  updateParams({ btu_min: Number.isNaN(v as number) ? null : v });
                }}
                className="w-28 rounded-xl border border-input/80 bg-background/80 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  updateParams({ btu_max: Number.isNaN(v as number) ? null : v });
                }}
                className="w-28 rounded-xl border border-input/80 bg-background/80 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </>
      )}
      <label className={`flex cursor-pointer items-center gap-3 text-sm text-foreground${showBtu ? " mt-4" : ""}`}>
        <input
          type="checkbox"
          checked={currentIncludePro}
          onChange={(e) => updateParams({ include_pro: e.target.checked })}
          className="h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-2 focus:ring-primary/20"
        />
        <span>{labels.showPro}</span>
      </label>
    </div>
  );
}
