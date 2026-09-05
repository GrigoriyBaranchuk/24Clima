import Image from "next/image";
import { LocalizedTiendaLink } from "../LocalizedTiendaLink";
import type { ProductList, ProductVariant } from "../../lib/api-client";
import { pickDefaultVariant, sortVariants } from "../../lib/variants";

type Props = {
  product: ProductList;
  btuLabel: string;
  professionalLabel: string;
  noImageLabel?: string;
  /** "Ver presentaciones" — shown instead of the per-variant rows when there are many. */
  seePresentationsLabel?: string;
};

/** Numeric value of a variant price string ("130.00"); NaN-safe for sorting. */
function priceValue(v: ProductVariant): number {
  const n = Number.parseFloat(v.price);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Grid price block. Up to 3 presentations are listed in full (the owner wants both
 * prices visible, never "desde $65"); beyond that a min–max range plus a hint. The
 * grid never switches variants — that happens on the product page.
 */
function VariantPrices({
  variants,
  seePresentationsLabel,
}: {
  variants: ProductVariant[];
  seePresentationsLabel?: string;
}) {
  if (variants.length > 3) {
    const sortedByPrice = [...variants].sort((a, b) => priceValue(a) - priceValue(b));
    const min = sortedByPrice[0];
    const max = sortedByPrice[sortedByPrice.length - 1];
    return (
      <div className="mt-1">
        <p className="text-lg font-semibold text-primary">
          ${min.price} – ${max.price}
        </p>
        {seePresentationsLabel && (
          <p className="text-xs text-muted-foreground">{seePresentationsLabel}</p>
        )}
      </div>
    );
  }
  const def = pickDefaultVariant(variants);
  const ordered = def ? [def, ...variants.filter((v) => v.id !== def.id)] : variants;
  return (
    <div className="mt-1 space-y-0.5">
      {ordered.map((v, i) => (
        <div key={v.id} className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xs text-muted-foreground">{v.label_es}</span>
          <span className={`font-semibold text-primary ${i === 0 ? "text-lg" : "text-base"}`}>
            ${v.price}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Shared catalog grid card (home, category, /profesional). Shows a "Profesional"
 * badge for pro-only products (is_b2b_only). */
export function ProductCard({
  product: p,
  btuLabel,
  professionalLabel,
  noImageLabel = "—",
  seePresentationsLabel,
}: Props) {
  const variants = sortVariants(p.variants);
  return (
    <LocalizedTiendaLink
      href={`/product/${p.slug}`}
      className="group card-hover rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {p.is_b2b_only && (
          <span className="absolute right-2 top-2 z-10 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            {professionalLabel}
          </span>
        )}
        {p.image_url ? (
          <Image
            src={p.image_url}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">{noImageLabel}</div>
        )}
      </div>
      <h3 className="mt-3 font-medium text-card-foreground line-clamp-2">{p.name}</h3>
      {p.btu != null && (
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {btuLabel}: {p.btu.toLocaleString()}
        </p>
      )}
      {variants.length > 0 ? (
        <VariantPrices variants={variants} seePresentationsLabel={seePresentationsLabel} />
      ) : (
        p.price != null && <p className="mt-1 text-lg font-semibold text-primary">${p.price}</p>
      )}
    </LocalizedTiendaLink>
  );
}
