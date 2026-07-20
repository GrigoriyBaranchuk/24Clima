"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { LocalizedTiendaLink } from "../LocalizedTiendaLink";
import { api, type Cart, type CartItem } from "../../lib/api-client";
import { useAuth } from "../../hooks/useAuth";
import { WhatsAppCta } from "@24clima/design/components";

const WHATSAPP_NUMBER = "50768282120";

function buildWhatsAppCartMessage(cart: Cart): string {
  const lines = cart.items.map(
    (i) => `• ${i.product_name} (${i.product_sku}) × ${i.quantity} — $${i.line_total}`
  );
  return [
    "Hi, I'd like to inquire about these items from my cart:",
    "",
    ...lines,
    "",
    `Total: $${cart.total}`,
  ].join("\n");
}

type Props = { addProductId?: string };

export function CartSummary({ addProductId }: Props) {
  const t = useTranslations("tienda.cart");
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const addDoneRef = useRef(false);

  const refetchCart = (cartId?: string | null) =>
    api.getCart(cartId ?? undefined, undefined).then(setCart).catch(() => setCart(null));

  const notifyCart = () => {
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  useEffect(() => {
    const onAuthChanged = () => refetchCart().then(notifyCart);
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (addProductId && !addDoneRef.current) {
      addDoneRef.current = true;
      setAdding(true);
      api
        .addCartItem(addProductId, 1)
        .then((res) => refetchCart(res.cart_id))
        .then(notifyCart)
        .then(() => router.replace("/tienda/cart", { scroll: false }))
        .catch(() => !cancelled && setCart(null))
        .finally(() => {
          if (!cancelled) setAdding(false);
          setLoading(false);
        });
    } else if (!addProductId) {
      refetchCart()
        .then(notifyCart)
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [addProductId]);

  async function updateQuantity(item: CartItem, newQty: number) {
    if (newQty < 1) {
      await removeItem(item);
      return;
    }
    setUpdatingId(item.id);
    try {
      await api.updateCartItem(item.id, newQty);
      await refetchCart();
      notifyCart();
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeItem(item: CartItem) {
    setUpdatingId(item.id);
    try {
      await api.updateCartItem(item.id, 0);
      await refetchCart();
      notifyCart();
    } finally {
      setUpdatingId(null);
    }
  }

  if (addProductId && adding) return <p className="py-8 text-muted-foreground">…</p>;
  if (loading && !addProductId) return <p className="py-8 text-muted-foreground">…</p>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{t("empty")}</p>
        <LocalizedTiendaLink href="/category/aire-acondicionado" className="mt-4 inline-block text-primary hover:underline">
          {t("viewCatalog")}
        </LocalizedTiendaLink>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppCartMessage(cart))}`;
  const isGuest = !user;

  return (
    <div className="mt-6">
      <div className="mb-4">
        <LocalizedTiendaLink
          href="/category/aire-acondicionado"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← {t("continueShopping")}
        </LocalizedTiendaLink>
      </div>
      <ul className="space-y-4">
        {cart.items.map((item) => (
          <li key={item.id} className="flex flex-wrap gap-4 rounded-lg border border-border bg-card p-4">
            {item.image_url && (
              <img src={item.image_url} alt={item.product_name} className="h-20 w-20 rounded object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <LocalizedTiendaLink
                href={`/product/${item.product_slug}`}
                className="font-medium text-card-foreground hover:text-primary"
              >
                {item.product_name}
              </LocalizedTiendaLink>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("quantity")}:</span>
                <span className="inline-flex items-center rounded border border-input bg-muted/50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    disabled={updatingId === item.id || item.quantity <= 1}
                    className="h-8 w-8 rounded-l text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                    aria-label="-"
                  >
                    −
                  </button>
                  <span className="flex h-8 min-w-[2rem] items-center justify-center px-2 text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    disabled={updatingId === item.id}
                    className="h-8 w-8 rounded-r text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                    aria-label="+"
                  >
                    +
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  disabled={updatingId === item.id}
                  className="text-sm text-destructive hover:underline disabled:opacity-50"
                >
                  {t("remove")}
                </button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                ${item.unit_price} each → ${item.line_total}
              </p>
              {item.errors.length > 0 && (
                <p className="mt-1 text-sm text-amber-600">{item.errors.join(" ")}</p>
              )}
            </div>
            <p className="font-medium text-foreground self-start">${item.line_total}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 border-t border-border pt-6 space-y-4">
        <p className="text-lg font-semibold text-foreground">{t("total")}: ${cart.total}</p>
        {isGuest && (
          <p className="text-sm text-muted-foreground">{t("guestCta")}</p>
        )}
        <div className="flex flex-wrap gap-3">
          {isGuest && (
            <>
              <LocalizedTiendaLink
                href="/account/register"
                className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
              >
                {t("registerToCheckout")}
              </LocalizedTiendaLink>
              <WhatsAppCta href={whatsappUrl}>
                {t("whatsappCart")}
              </WhatsAppCta>
            </>
          )}
          <LocalizedTiendaLink
            href="/checkout"
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
          >
            {t("checkout")}
          </LocalizedTiendaLink>
          <LocalizedTiendaLink
            href="/category/aire-acondicionado"
            className="rounded-lg border border-border px-6 py-3 font-medium text-foreground hover:bg-muted"
          >
            {t("continueShopping")}
          </LocalizedTiendaLink>
        </div>
      </div>
    </div>
  );
}
