"use client";

import { useEffect } from "react";
import {
  GCR_DELIVERY_COUNTRY,
  GCR_MERCHANT_ID,
  readOptInHandoff,
} from "../lib/gcr";

const SCRIPT_ID = "gcr-platform";
const SCRIPT_SRC = "https://apis.google.com/js/platform.js?onload=renderOptIn";

type GcrWindow = Window & {
  renderOptIn?: () => void;
  gapi?: {
    load: (module: string, cb: () => void) => void;
    surveyoptin?: { render: (opts: Record<string, unknown>) => void };
  };
};

/**
 * Модуль запроса согласия на опрос «Google Отзывы клиентов».
 *
 * Скрипт грузится вручную, а не через next/script: platform.js вызывает
 * window.renderOptIn по своему onload, поэтому колбэк обязан существовать до
 * вставки тега. Порядок выполнения нескольких next/script не гарантирован,
 * useEffect же даёт его явно.
 *
 * Ничего не рендерит сам — Google вставляет оверлей поверх страницы.
 */
export function GoogleCustomerReviewsOptIn({ orderId }: { orderId: string }) {
  useEffect(() => {
    const handoff = readOptInHandoff(orderId);
    // Без email отправлять нечего: покупатель пришёл на страницу заказа по прямой
    // ссылке или из другой вкладки, а не сразу после оформления.
    if (!handoff) return;

    const w = window as GcrWindow;
    w.renderOptIn = () => {
      w.gapi?.load("surveyoptin", () => {
        w.gapi?.surveyoptin?.render({
          merchant_id: GCR_MERCHANT_ID,
          order_id: orderId,
          email: handoff.email,
          delivery_country: GCR_DELIVERY_COUNTRY,
          estimated_delivery_date: handoff.estimatedDeliveryDate,
        });
      });
    };

    // Повторный заход на ту же страницу: скрипт уже в DOM, onload больше не будет.
    if (document.getElementById(SCRIPT_ID)) {
      w.renderOptIn();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [orderId]);

  return null;
}
