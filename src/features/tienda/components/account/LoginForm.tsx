"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LocalizedTiendaLink } from "../LocalizedTiendaLink";
import { api } from "../../lib/api-client";
import { setShopToken, notifyAuthChanged } from "../../lib/shop-auth";

export function LoginForm() {
  const t = useTranslations("tienda.account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.login(email, password);
      setShopToken(data.access_token);
      notifyAuthChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 max-w-md space-y-4">
      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      )}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-foreground">
          {t("email")} *
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
          {t("password")} *
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "…" : t("signIn")}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        <LocalizedTiendaLink href="/account/register" className="text-primary hover:underline">
          {t("registerSubmit")}
        </LocalizedTiendaLink>
      </p>
    </form>
  );
}
