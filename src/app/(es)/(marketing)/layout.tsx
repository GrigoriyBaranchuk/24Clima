import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import {
  CLIENT_SHELL_NAMESPACES,
  PUBLIC_SITE_CLIENT_NAMESPACES,
  pickMessages,
} from "@/i18n/client-messages";

/**
 * Группа роутов публичного маркетингового сайта: главная, услуги, контакты,
 * проблемы, блог, статические страницы — всё, кроме магазина.
 *
 * Зачем группа. Корневой layout — родитель ВСЕХ роутов, и его `messages`
 * уезжают в RSC-payload на каждой странице, включая /tienda/**, даже если
 * вложенный провайдер магазина этот словарь замещает для потомков. Пока
 * маркетинговые неймспейсы лежали в корне, ~6,8 КБ текстов калькулятора, форм
 * и пакетов чистки ехали в HTML магазина, где ничего этого не рендерится.
 * Поэтому маркетинговые роуты собраны в группу со своим провайдером, а в корне
 * осталась одна оболочка.
 *
 * `(marketing)` — группа в скобках: на URL она не влияет, пути остались
 * прежними. DOM-узлов провайдер не добавляет, вёрстка не меняется.
 *
 * Вложенный провайдер ЗАМЕЩАЕТ родительский словарь (use-intl:
 * `messages: i === undefined ? parent.messages : i`), поэтому список включает и
 * неймспейсы оболочки.
 */
export default async function MarketingLayout({
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
      ])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
