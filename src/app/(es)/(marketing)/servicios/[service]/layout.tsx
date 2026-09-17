import {
  CLIENT_SHELL_NAMESPACES,
  PUBLIC_SITE_CLIENT_NAMESPACES,
  pickMessages,
} from "@/i18n/client-messages";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

/**
 * Неймспейс `services` нужен ровно одному клиентскому компоненту — ServiceFAQ,
 * и рендерится он только на этих страницах. В корневом провайдере его нет,
 * поэтому добавляем вложенный.
 *
 * Вложенный провайдер ЗАМЕЩАЕТ родительский словарь (use-intl:
 * `messages: i === undefined ? parent.messages : i`), значит список обязан
 * включать и неймспейсы оболочки — иначе шапка и нижняя навигация упадут в
 * MISSING_MESSAGE.
 *
 * Провайдер не добавляет DOM-узлов, разметка страницы не меняется.
 *
 * Кроме `services` здесь едет и маркетинговый набор
 * PUBLIC_SITE_CLIENT_NAMESPACES: страницы услуг — часть публичного сайта, и
 * страница чистки рендерит CleaningPackages (`packages`, `whatsappMessages`) и
 * Calculator (`calculator`, `packages`). Без него они упадут в MISSING_MESSAGE.
 */
export default async function ServiceLayout({
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
        ...PUBLIC_SITE_CLIENT_NAMESPACES,
        "services",
      ])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
