import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { CLIENT_SHELL_NAMESPACES, pickMessages } from "@/i18n/client-messages";

// Internal admin tools (articles editor + SEO panel) in the default-locale (es)
// route group. Mirrors [locale]/consejos-y-guias/admin/layout.tsx so the Spanish
// admin URLs are noindexed too — without this, /consejos-y-guias/admin renders
// <meta robots="index, follow"> on prod. Never index or follow.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Неймспейс `tipsAdmin` (~большой словарь редактора) нужен только AdminClient
 * и только здесь, поэтому в корневой провайдер он не попадает.
 *
 * Вложенный провайдер ЗАМЕЩАЕТ родительский словарь (use-intl:
 * `messages: i === undefined ? parent.messages : i`), поэтому список включает и
 * неймспейсы оболочки. DOM-узлов провайдер не добавляет.
 *
 * Маркетинговый набор PUBLIC_SITE_CLIENT_NAMESPACES сюда НЕ едет: админка
 * рендерит только AdminClient (`tipsAdmin`) внутри оболочки.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("es");
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      messages={pickMessages(messages, [
        ...CLIENT_SHELL_NAMESPACES,
        "tipsAdmin",
      ])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
