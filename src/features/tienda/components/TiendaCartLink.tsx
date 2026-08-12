"use client";

import { Link } from "@/i18n/routing";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CART_UPDATED_EVENT, readCartCount } from "../lib/cart-count";

type Props = {
  variant: "desktop" | "mobile";
  /** Mobile only: follows the header's scrolled foreground treatment. */
  isScrolled?: boolean;
};

/**
 * Header cart icon with an item-count badge, shown on /tienda pages only
 * (Header renders it when TiendaShell passes showCartLink).
 *
 * Count comes from the localStorage mirror (see lib/cart-count.ts) — no API
 * calls here, on purpose. The icon box is fixed-size and the badge is
 * absolutely positioned, so its post-hydration appearance causes no CLS.
 */
export default function TiendaCartLink({ variant, isScrolled = false }: Props) {
  const t = useTranslations("tienda.cart");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readCartCount());
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("auth-changed", sync);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("auth-changed", sync);
    };
  }, []);

  const badge = count > 0 ? (count > 99 ? "99+" : String(count)) : null;
  const label = badge ? `${t("title")} (${count})` : t("title");

  const badgeNode = badge && (
    <span
      aria-hidden="true"
      className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-green px-1 text-[10px] font-bold leading-none text-white"
    >
      {badge}
    </span>
  );

  if (variant === "mobile") {
    return (
      <Link
        href="/tienda/cart"
        scroll={false}
        aria-label={label}
        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isScrolled ? "bg-gray-100 text-gray-600" : "bg-white/10 text-white/70"
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        {badgeNode}
      </Link>
    );
  }

  return (
    <Link
      href="/tienda/cart"
      scroll={false}
      aria-label={label}
      className="relative flex h-8 w-8 items-center justify-center text-gray-700 transition-colors hover:text-brand-green-dark"
    >
      <ShoppingCart className="w-5 h-5" />
      {badgeNode}
    </Link>
  );
}
