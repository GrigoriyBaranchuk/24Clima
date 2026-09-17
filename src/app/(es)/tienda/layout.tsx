import { CLIENT_SHELL_NAMESPACES, pickMessages } from "@/i18n/client-messages";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

/**
 * Весь неймспейс `tienda` (корзина, аккаунт, чекаут, карточка товара) нужен
 * только магазину, поэтому в корневом провайдере его нет — там лежит лишь
 * `tienda.cart` для ссылки-корзины в шапке.
 *
 * Вложенный провайдер ЗАМЕЩАЕТ родительский словарь (use-intl:
 * `messages: i === undefined ? parent.messages : i`), поэтому список включает и
 * неймспейсы оболочки. `"tienda"` идёт после `"tienda.cart"` и перекрывает его
 * полным объектом — корзина в шапке продолжает работать.
 *
 * Провайдер не добавляет DOM-узлов, разметка магазина не меняется.
 */
export default async function TiendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("es");
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      messages={pickMessages(messages, [...CLIENT_SHELL_NAMESPACES, "tienda"])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
