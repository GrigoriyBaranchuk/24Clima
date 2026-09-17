/**
 * Тонкая обёртка над навигацией next-intl, добавляющая завершающий слэш.
 *
 * ЗАЧЕМ. Сайт объявляет канонической форму со слэшем (`trailingSlash: true` в
 * next.config.js, 308 в middleware, canonical/hreflang/sitemap — все со слэшем),
 * но родной `Link` next-intl отдаёт href БЕЗ слэша:
 *   1. `getPathname()` вызывает `normalizeTrailingSlash()` только внутри
 *      `compileLocalizedPathname()`, т.е. ТОЛЬКО при заданной карте `pathnames`.
 *      У сайта её нет — href уходит как есть (`/servicios/limpieza`).
 *   2. Даже с `pathnames` корень локали не чинится: `prefixPathname()` специально
 *      срезает `/` (`/` + `en` → `/en`, а не `/en/`).
 * Итог: каждая внутренняя ссылка на проде тянула лишний 308-хоп, а Google заносил
 * такие URL в отчёт «Страница с переадресацией».
 *
 * РЕШЕНИЕ. Нормализуем ВЫХОД next-intl (после навешивания локального префикса),
 * а не вход — иначе корень локали остаётся без слэша. Единственная точка
 * нормализации — `getPathname()` ниже; `Link`, `useRouter` и `redirect` ходят
 * через неё. Импорт `@/i18n/routing` и сигнатуры для ~30 потребителей не меняются.
 *
 * `useRouter` вынесен в ./use-router (там "use client") — см. комментарий в файле.
 */
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { useLocale } from "next-intl";
import NextLink from "next/link";
import { redirect as nextRedirect, type RedirectType } from "next/navigation";
import { forwardRef, type ComponentProps } from "react";
import { locales, defaultLocale, type Locale } from "./config";
import { ensureTrailingSlash } from "@/lib/nav";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});

const intl = createNavigation(routing);

/** Без изменений: путь текущей страницы без локального префикса. */
export const usePathname = intl.usePathname;

export { useRouter } from "./use-router";

/** `string | { pathname, query? }` — тот же тип, что принимает next-intl. */
export type Href = Parameters<typeof intl.getPathname>[0]["href"];

const isLocalizable = (href: Href) => (typeof href === "string" ? href.startsWith("/") : true);

/** Локальный префикс + завершающий слэш. Единственная точка нормализации. */
export function getPathname(args: { href: Href; locale: Locale; forcePrefix?: boolean }): string {
  if (!isLocalizable(args.href)) return args.href as string;
  return ensureTrailingSlash(intl.getPathname(args));
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href" | "locale"> & {
  href: Href;
  locale?: Locale;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, locale, prefetch, ...rest },
  ref
) {
  const cur = useLocale() as Locale;
  const changing = locale != null && locale !== cur;
  const final = getPathname({
    href,
    locale: locale ?? cur,
    forcePrefix: locale != null || undefined,
  });
  return (
    <NextLink
      ref={ref}
      href={final}
      hrefLang={changing ? locale : undefined}
      prefetch={changing ? false : prefetch}
      {...rest}
    />
  );
});

export function redirect(
  args: { href: Href; locale: Locale; forcePrefix?: boolean },
  type?: RedirectType
): never {
  return nextRedirect(getPathname(args), type);
}
