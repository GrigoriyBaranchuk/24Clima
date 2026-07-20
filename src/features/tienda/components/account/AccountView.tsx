"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "../../hooks/useAuth";
import { LoginForm } from "./LoginForm";

export function AccountView() {
  const t = useTranslations("tienda.account");
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <p className="py-8 text-muted-foreground">…</p>;
  }

  if (user) {
    return (
      <div className="mt-6">
        <p className="text-muted-foreground">
          {user.full_name ? (
            <>
              {t("hello")}, {user.full_name}.
            </>
          ) : (
            <>
              {t("hello")}, {user.email}.
            </>
          )}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        <button
          type="button"
          onClick={() => logout()}
          className="mt-6 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          {t("logout")}
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="mt-4 text-muted-foreground">{t("intro")}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{t("signInIntro")}</p>
      <LoginForm />
    </>
  );
}
