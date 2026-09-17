"use client";

import { Link } from "@/i18n/routing";
import { type ComponentProps, useEffect, useState } from "react";

/**
 * `Link`, который начинает префетчить не сразу после гидратации, а когда
 * страница освободилась.
 *
 * ЗАЧЕМ. На мобильной главной в вьюпорте сразу 8 внутренних ссылок, и
 * next/link по умолчанию («auto») тянет их RSC-payload (~180 КБ) сразу же,
 * конкурируя за канал с картинками и шрифтами первого экрана. Это НЕ
 * отключение префетча — карточки по-прежнему будут предзагружены, просто
 * после `load` + простоя.
 *
 * КАК. `prefetch={false}` до готовности, дальше `undefined` (дефолт «auto»).
 * next/link пересоздаёт свой IntersectionObserver при смене `prefetch` — его
 * callback-ref зависит от `prefetchEnabled`
 * (node_modules/next/dist/client/app-dir/link.js), поэтому видимые ссылки
 * подхватываются без дополнительных телодвижений.
 *
 * Применяется ТОЧЕЧНО — только к спискам сервисных карточек (Services.tsx,
 * ServicesGrid.tsx). Нижняя навигация, кнопка hero и шапка остаются на
 * дефолтном префетче: это основные пути ухода со страницы.
 */
export default function LazyPrefetchLink(props: ComponentProps<typeof Link>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const enable = () => {
      if (!cancelled) setReady(true);
    };

    const scheduleIdle = () => {
      if (cancelled) return;
      // requestIdleCallback появился в Safari только в 18.x — держим fallback.
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(enable, { timeout: 3000 });
      } else {
        timeoutHandle = setTimeout(enable, 1500);
      }
    };

    if (document.readyState === "complete") {
      scheduleIdle();
    } else {
      window.addEventListener("load", scheduleIdle, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleIdle);
      if (
        idleHandle !== undefined &&
        typeof window.cancelIdleCallback === "function"
      ) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
    };
  }, []);

  // `undefined` — дефолт next/link («auto»), а не «всегда префетчить».
  return <Link {...props} prefetch={ready ? undefined : false} />;
}
