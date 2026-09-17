import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import {
  CLIENT_SHELL_NAMESPACES,
  PUBLIC_SITE_CLIENT_NAMESPACES,
  pickMessages,
} from "@/i18n/client-messages";

/**
 * Зеркало `(es)/(marketing)/layout.tsx` для en/ru (грабля №2: два дерева
 * роутов). Клиентские неймспейсы маркетингового сайта живут здесь, а не в
 * корневом layout: иначе они уезжают в RSC-payload и на /tienda/**, где
 * калькулятор, формы и пакеты чистки не рендерятся.
 *
 * `(marketing)` — группа в скобках, на URL не влияет. DOM-узлов провайдер не
 * добавляет. Вложенный провайдер ЗАМЕЩАЕТ родительский словарь, поэтому список
 * включает и неймспейсы оболочки.
 */
export default async function MarketingLayout({
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
      ])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
