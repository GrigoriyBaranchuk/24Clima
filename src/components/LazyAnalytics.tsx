"use client";

import { useEffect, useState } from "react";
import GoogleAnalytics from "./GoogleAnalytics";
import YandexMetrika from "./YandexMetrika";

/**
 * Defers GA + Yandex Metrika until the first user interaction
 * (click / touch / scroll / keydown) OR 3 seconds of browser idle time —
 * whichever comes first.
 *
 * Meta Pixel is intentionally NOT deferred here — it's our conversion
 * tracker and must be ready when the user clicks the WhatsApp CTA.
 *
 * Why: real user metrics (RUM) show ~80% of a page's TBT on mobile comes
 * from third-party JS execution. By holding analytics back until intent
 * to interact is observed, the initial paint stays snappy.
 *
 * Trade-off: visitors who land + bounce in <3 s without scrolling or
 * touching anything won't be tracked by GA/Yandex. They are bounces
 * regardless and don't convert, so the analytical loss is small.
 */
export default function LazyAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const trigger = () => setShouldLoad(true);

    const events: (keyof WindowEventMap)[] = [
      "click",
      "touchstart",
      "scroll",
      "keydown",
      "pointerdown",
    ];
    events.forEach((e) =>
      window.addEventListener(e, trigger, { once: true, passive: true }),
    );

    let idleId: number | null = null;
    let timeoutId: number | null = null;
    type IdleWin = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWin;
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(trigger, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(trigger, 3000);
    }

    return () => {
      events.forEach((e) => window.removeEventListener(e, trigger));
      if (idleId !== null && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [shouldLoad]);

  if (!shouldLoad) return null;
  return (
    <>
      <GoogleAnalytics />
      <YandexMetrika />
    </>
  );
}
