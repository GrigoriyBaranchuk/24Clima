import {
  CLIENT_SHELL_NAMESPACES,
  PUBLIC_SITE_CLIENT_NAMESPACES,
  pickMessages,
} from "@/i18n/client-messages";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

/**
 * Зеркало `(es)/servicios/[service]/layout.tsx` для en/ru (грабля №2).
 * Неймспейс `services` нужен только ServiceFAQ на этих страницах.
 *
 * Вложенный провайдер ЗАМЕЩАЕТ родительский словарь, поэтому список включает и
 * неймспейсы оболочки. Провайдер не добавляет DOM-узлов.
 *
 * Кроме `services` здесь едет и маркетинговый набор
 * PUBLIC_SITE_CLIENT_NAMESPACES: страницы услуг — часть публичного сайта, и
 * страница чистки рендерит CleaningPackages (`packages`, `whatsappMessages`) и
 * Calculator (`calculator`, `packages`). Без него они упадут в MISSING_MESSAGE.
 */
export default async function ServiceLayout({
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
        ...PUBLIC_SITE_CLIENT_NAMESPACES,
        "services",
      ])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
