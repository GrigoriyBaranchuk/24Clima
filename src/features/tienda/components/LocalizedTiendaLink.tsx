"use client";

import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/routing";

/**
 * Internal shop link. Takes a tienda-relative `href` (WITHOUT the /tienda prefix,
 * e.g. "/product/x", "/cart", or { pathname: "/cart", query: { add } }) and renders
 * the site's next-intl <Link> with the /tienda prefix baked in.
 *
 * Locale prefixing (as-needed: es→"", en→"/en", ru→"/ru") and trailing slash are
 * handled by the site's routing Link + trailingSlash config — do NOT add them here.
 */

type TiendaHref =
  | string
  | { pathname: string; query?: Record<string, string | number | boolean | undefined> };

function withTiendaPrefix(href: TiendaHref): TiendaHref {
  if (typeof href === "string") {
    return `/tienda${href === "/" ? "" : href}`;
  }
  return { ...href, pathname: `/tienda${href.pathname === "/" ? "" : href.pathname}` };
}

type LinkProps = ComponentProps<typeof Link>;

type Props = Omit<LinkProps, "href"> & {
  href: TiendaHref;
  children: ReactNode;
};

export function LocalizedTiendaLink({ href, children, ...rest }: Props) {
  // Cast: next-intl's Link href type is a strict union; the /tienda-prefixed value
  // is structurally identical, so this is safe.
  const prefixed = withTiendaPrefix(href) as LinkProps["href"];
  return (
    <Link href={prefixed} {...rest}>
      {children}
    </Link>
  );
}
