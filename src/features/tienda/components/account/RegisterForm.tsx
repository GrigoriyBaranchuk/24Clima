"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LocalizedTiendaLink } from "../LocalizedTiendaLink";
import { api } from "../../lib/api-client";
import { setShopToken, notifyAuthChanged } from "../../lib/shop-auth";

export function RegisterForm() {
  const t = useTranslations("tienda.account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.register({
        email,
        password,
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      const tokens = await api.login(email, password);
      setShopToken(tokens.access_token);
      notifyAuthChanged();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-medium">{t("registerSuccess")}</p>
        <p className="mt-1 text-sm">{t("signedIn")}</p>
        <LocalizedTiendaLink href="/account" className="mt-4 inline-block text-green-700 underline">
          {t("goToAccount")}
        </LocalizedTiendaLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          {t("email")} *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          {t("password")} *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
        />
        <p className="mt-1 text-xs text-muted-foreground">{t("passwordHint")}</p>
      </div>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
          {t("fullName")}
        </label>
        <input
          id="fullName"
          name="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          {t("phone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? t("registering") : t("registerSubmit")}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        <LocalizedTiendaLink href="/account" className="text-primary hover:underline">
          {t("backToAccount")}
        </LocalizedTiendaLink>
      </p>
    </form>
  );
}
