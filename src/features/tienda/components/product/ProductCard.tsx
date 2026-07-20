import Image from "next/image";
import { LocalizedTiendaLink } from "../LocalizedTiendaLink";
import type { ProductList } from "../../lib/api-client";

type Props = {
  product: ProductList;
  btuLabel: string;
  professionalLabel: string;
  noImageLabel?: string;
};

/** Shared catalog grid card (home, category, /profesional). Shows a "Profesional"
 * badge for pro-only products (is_b2b_only). */
export function ProductCard({ product: p, btuLabel, professionalLabel, noImageLabel = "—" }: Props) {
  return (
    <LocalizedTiendaLink
      href={`/product/${p.slug}`}
      className="group card-hover rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {p.brand && (
          <div className="absolute left-0 top-0 z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full bg-card/90 shadow-sm backdrop-blur-sm">
            {p.brand.logo_url ? (
              <img src={p.brand.logo_url} alt={p.brand.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-card-foreground">{p.brand.name}</span>
            )}
          </div>
        )}
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
      {p.price != null && <p className="mt-1 text-lg font-semibold text-primary">${p.price}</p>}
    </LocalizedTiendaLink>
  );
}
