import { CLIENT_SHELL_NAMESPACES, pickMessages } from "@/i18n/client-messages";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

/**
 * Словарь магазина: оболочка (Header, BottomNav, DesktopWhatsAppFab) плюс весь
 * неймспейс `tienda` — корзина, аккаунт, чекаут, карточка товара.
 *
 * Вложенный провайдер ЗАМЕЩАЕТ родительский словарь (use-intl:
 * `messages: i === undefined ? parent.messages : i`), поэтому список включает и
 * неймспейсы оболочки — но НЕ PUBLIC_SITE_CLIENT_NAMESPACES. В этом весь смысл:
 * калькулятор, формы и прочий маркетинг на страницах магазина не рендерятся,
 * и везти их тексты в HTML каждой страницы /tienda/** незачем. Если сюда
 * захотелось добавить маркетинговый неймспейс — значит в магазин затащили
 * маркетинговый компонент; `scripts/check-client-i18n.mjs` на это ругается.
 *
 * `tienda.cart` для ссылки-корзины в шапке приезжает отсюда же: TiendaCartLink
 * рендерится только под `showCartLink`, а его передаёт один лишь TiendaShell.
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
