"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { api, type CheckoutPreview } from "../../lib/api-client";

export function CheckoutForm() {
  const t = useTranslations("tienda.checkout");
  const router = useRouter();
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.checkoutPreview().then(setPreview).catch(() => setPreview(null)).finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const shipping = {
      guest_email: (form.elements.namedItem("email") as HTMLInputElement)?.value || undefined,
      guest_phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value || undefined,
      guest_name: (form.elements.namedItem("name") as HTMLInputElement)?.value || undefined,
      shipping_address: (form.elements.namedItem("address") as HTMLInputElement)?.value,
      shipping_region: (form.elements.namedItem("region") as HTMLInputElement)?.value || undefined,
      shipping_notes: (form.elements.namedItem("notes") as HTMLInputElement)?.value || undefined,
      payment_method: (form.elements.namedItem("payment_method") as HTMLSelectElement)?.value || "cash_on_delivery",
    };
    try {
      const res = await api.createOrder(shipping, undefined, undefined, undefined);
      router.push(`/tienda/order/${res.order_number}?token=${res.public_token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="py-8 text-muted-foreground">…</p>;
  if (!preview || preview.item_count === 0) {
    return <p className="py-8 text-muted-foreground">{t("emptyCart")}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-6">
      {error && <p className="rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {preview.errors.length > 0 && (
        <ul className="rounded bg-amber-50 p-3 text-sm text-amber-800">
          {preview.errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">{t("name")}</label>
        <input id="name" name="name" type="text" className="mt-1 w-full rounded border border-input bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">{t("email")}</label>
        <input id="email" name="email" type="email" className="mt-1 w-full rounded border border-input bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">{t("phone")}</label>
        <input id="phone" name="phone" type="tel" className="mt-1 w-full rounded border border-input bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-foreground">{t("shippingAddress")} *</label>
        <textarea id="address" name="address" required rows={3} className="mt-1 w-full rounded border border-input bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="region" className="block text-sm font-medium text-foreground">{t("region")}</label>
        <input id="region" name="region" type="text" className="mt-1 w-full rounded border border-input bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground">{t("notes")}</label>
        <textarea id="notes" name="notes" rows={2} className="mt-1 w-full rounded border border-input bg-background px-3 py-2" />
      </div>
      <div>
        <label htmlFor="payment_method" className="block text-sm font-medium text-foreground">{t("paymentMethod")}</label>
        <select id="payment_method" name="payment_method" className="mt-1 w-full rounded border border-input bg-background px-3 py-2">
          <option value="cash_on_delivery">{t("cashOnDelivery")}</option>
          <option value="bank_transfer">{t("bankTransfer")}</option>
        </select>
      </div>
      <div className="rounded-lg border border-border bg-muted p-4">
        <p className="font-medium text-foreground">{t("total")}: ${preview.total} {preview.currency}</p>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? t("processing") : t("confirmOrder")}
      </button>
    </form>
  );
}
