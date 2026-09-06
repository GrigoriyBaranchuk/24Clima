"use client";

/**
 * Клиентская половина обёртки навигации (см. «зачем» в ./routing.tsx).
 *
 * Живёт отдельным файлом с "use client" по единственной причине: `useRouter`
 * из `next/navigation` нельзя статически импортировать в модуль, до которого
 * дотягивается серверный граф (`routing.tsx` импортируют и RSC-страницы, и
 * middleware) — сборка падает с «This React hook only works in a client
 * component». Реэкспорт из `@/i18n/routing` сохраняет прежний импорт-путь
 * для потребителей.
 */

import { useLocale } from "next-intl";
import { useRouter as useNextRouter } from "next/navigation";
import { useMemo } from "react";
import type { Locale } from "./config";
import { getPathname, type Href } from "./routing";

/** `locale` — как у next-intl (сменить локаль); `scroll` — как у next/navigation. */
type NavigateOptions = { locale?: Locale; scroll?: boolean };

export function useRouter() {
  const router = useNextRouter();
  const cur = useLocale() as Locale;
  return useMemo(() => {
    const resolve = (href: Href, locale?: Locale) =>
      getPathname({ href, locale: locale ?? cur, forcePrefix: locale != null || undefined });
    return {
      ...router,
      push: (href: Href, options?: NavigateOptions) =>
        router.push(resolve(href, options?.locale), { scroll: options?.scroll }),
      replace: (href: Href, options?: NavigateOptions) =>
        router.replace(resolve(href, options?.locale), { scroll: options?.scroll }),
      prefetch: (href: Href, options?: Pick<NavigateOptions, "locale">) =>
        router.prefetch(resolve(href, options?.locale)),
    };
  }, [router, cur]);
}
