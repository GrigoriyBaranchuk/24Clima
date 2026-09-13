"use client";

import { useEffect, useState } from "react";
import GoogleAnalytics from "./GoogleAnalytics";
import YandexMetrika from "./YandexMetrika";

/**
 * Общий триггер «пользователь начал взаимодействовать»: scroll / pointerdown /
 * keydown / touchstart (once) ИЛИ 10 с с момента монтирования — что раньше.
 *
 * Раньше здесь был requestIdleCallback с timeout 3 с: браузер считал страницу
 * «свободной» ещё до конца загрузки и запускал третьи стороны прямо в окно
 * измерения (Facebook блокировал главный поток 663 мс, gtag 266, Метрика 182).
 * Теперь третьи стороны стартуют только после реального намерения, а 10 с —
 * страховка для длинных чтений без скролла. Владелец принял потерю части
 * PageView у визитов без единого действия: это отказы, они не конвертируют.
 *
 * Тем же триггером пользуются MetaPixel и GoogleMerchantWidget — общий хук
 * ниже, чтобы условие старта было ровно одно на весь сайт.
 */
const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "scroll",
  "pointerdown",
  "keydown",
  "touchstart",
];

const FALLBACK_MS = 10_000;

/** true, как только пользователь что-то сделал (или прошло 10 с). */
export function useInteractionTrigger(): boolean {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (triggered) return;
    const trigger = () => setTriggered(true);

    INTERACTION_EVENTS.forEach((e) =>
      window.addEventListener(e, trigger, { once: true, passive: true }),
    );
    const timeoutId = window.setTimeout(trigger, FALLBACK_MS);

    return () => {
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, trigger));
      window.clearTimeout(timeoutId);
    };
  }, [triggered]);

  return triggered;
}

export default function LazyAnalytics() {
  const shouldLoad = useInteractionTrigger();

  if (!shouldLoad) return null;
  return (
    <>
      <GoogleAnalytics />
      <YandexMetrika />
    </>
  );
}
