import { CLIENT_SHELL_NAMESPACES, pickMessages } from "@/i18n/client-messages";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

/**
 * Зеркало `(es)/tienda/layout.tsx` для en/ru (грабля №2).
 * Полный неймспейс `tienda` — только внутри магазина; в оболочке остаётся
 * `tienda.cart` для ссылки-корзины в шапке.
 *
 * Вложенный провайдер ЗАМЕЩАЕТ родительский словарь, поэтому список включает и
 * неймспейсы оболочки. Провайдер не добавляет DOM-узлов.
 */
export default async function TiendaLayout({
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
      messages={pickMessages(messages, [...CLIENT_SHELL_NAMESPACES, "tienda"])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
