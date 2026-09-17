"use client";

import Script from "next/script";
import { useInteractionTrigger } from "./LazyAnalytics";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * Стандартный сниппет Meta разбит на две части:
 *
 * 1. Заглушка `window.fbq` с очередью (`fbq.queue`) — ставится сразу, инлайном,
 *    без единого сетевого запроса. Init и PageView попадают в очередь.
 * 2. `fbevents.js` — грузится только после первого взаимодействия (общий триггер
 *    LazyAnalytics). Загрузившись, библиотека сама разбирает очередь, поэтому ни
 *    PageView, ни конверсии из `metaPixelEvent` не теряются.
 *
 * Раньше обе части ехали одним `lazyOnload`-скриптом: Facebook блокировал
 * главный поток ~663 мс на /tienda и `metaPixelEvent` молча терял событие, если
 * пользователь успевал нажать WhatsApp до загрузки библиотеки.
 */
export default function MetaPixel() {
  const shouldLoadLibrary = useInteractionTrigger();

  if (!META_PIXEL_ID || (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_META_PIXEL_ID)) {
    return null;
  }

  return (
    <>
      <Script id="meta-pixel-stub" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[]}(window, document,'script');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      {shouldLoadLibrary && (
        <Script
          id="meta-pixel-lib"
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
        />
      )}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

/**
 * Отправить событие в Meta Pixel (конверсии, кастомные события).
 * `window.fbq` — заглушка с очередью, поставленная выше, поэтому вызов до
 * загрузки `fbevents.js` не теряется: событие уйдёт, когда библиотека приедет.
 */
export function metaPixelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
}
