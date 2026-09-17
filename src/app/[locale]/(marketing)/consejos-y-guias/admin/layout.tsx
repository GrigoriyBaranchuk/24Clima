import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { CLIENT_SHELL_NAMESPACES, pickMessages } from "@/i18n/client-messages";

// Internal admin tools (articles editor + SEO panel). Never index or follow.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Неймспейс `tipsAdmin` нужен только AdminClient и только здесь, поэтому в
 * корневой провайдер он не попадает.
 *
 * Вложенный провайдер ЗАМЕЩАЕТ родительский словарь, поэтому список включает и
 * неймспейсы оболочки. DOM-узлов провайдер не добавляет.
 *
 * Маркетинговый набор PUBLIC_SITE_CLIENT_NAMESPACES сюда НЕ едет: админка
 * рендерит только AdminClient (`tipsAdmin`) внутри оболочки.
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
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
