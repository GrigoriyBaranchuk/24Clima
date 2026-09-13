"use client";

import { useEffect } from "react";
import { useInteractionTrigger } from "@/components/LazyAnalytics";

const SCRIPT_ID = "merchantWidgetScript";
const SCRIPT_SRC =
  "https://www.gstatic.com/shopping/merchant/merchantwidget.js";

/**
 * Отступы снизу. Правила Google требуют не перекрывать виджет контентом, а слева
 * внизу уже заняты обе позиции:
 * - на десктопе `GoogleReviewsBadge` (рейтинг Google Business Profile) стоит
 *   `bottom-6 left-6` и занимает ~68px по высоте вместе с отступом;
 * - на мобильных вместо него внизу висит BottomNav (~96px, под неё у main стоит pb-24).
 */
const BOTTOM_MARGIN = 96;
const MOBILE_BOTTOM_MARGIN = 104;

type MerchantWidgetWindow = Window & {
  /** Виджет уже запущен на этой вкладке — второй start() не нужен. */
  __merchantWidgetLoaded?: boolean;
  merchantwidget?: {
    start: (opts: {
      position?: "RIGHT_BOTTOM" | "LEFT_BOTTOM";
      sideMargin?: number;
      bottomMargin?: number;
      mobileSideMargin?: number;
      mobileBottomMargin?: number;
    }) => void;
  };
};

/**
 * Витринный виджет Google (бывший «бейдж Google Отзывы клиентов») — показывает
 * рейтинг магазина по собранным отзывам. Пришёл на смену старому gapi.ratingbadge
 * и merchant_id не принимает: привязка идёт по проверенному в Merchant Center
 * домену, поэтому на localhost и превью-доменах он не отрисуется.
 *
 * Ставим слева внизу: справа внизу висит WhatsApp-кнопка (fixed bottom-6 right-6).
 * Слева виджет встаёт над бейджем Google Business Profile — см. отступы выше.
 *
 * Грузится не сразу, а по общему триггеру «пользователь начал взаимодействовать»
 * (см. useInteractionTrigger в LazyAnalytics): виджет — украшение, ради него
 * незачем занимать главный поток в первые секунды загрузки /tienda.
 */
export function GoogleMerchantWidget() {
  const shouldLoad = useInteractionTrigger();

  useEffect(() => {
    if (!shouldLoad) return;
    const w = window as MerchantWidgetWindow;
    let cancelled = false;

    const start = () => {
      // Идемпотентность: переход между страницами магазина монтирует компонент
      // заново, а виджет на вкладке должен стартовать ровно один раз.
      if (cancelled || w.__merchantWidgetLoaded) return;
      w.__merchantWidgetLoaded = true;
      w.merchantwidget?.start({
        position: "LEFT_BOTTOM",
        bottomMargin: BOTTOM_MARGIN,
        mobileBottomMargin: MOBILE_BOTTOM_MARGIN,
      });
    };

    // Скрипт уже в документе (переход между страницами магазина): либо стартуем
    // сразу, либо ждём его load — событие для уже загруженного не повторится.
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      if (w.merchantwidget) start();
      else existing.addEventListener("load", start);
      return () => {
        cancelled = true;
        existing.removeEventListener("load", start);
      };
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.defer = true;
    script.addEventListener("load", start);
    document.head.appendChild(script);

    // Сам виджет остаётся на странице (Google не даёт его снять) — снимаем
    // только свой обработчик, чтобы start() не выстрелил после размонтирования.
    return () => {
      cancelled = true;
      script.removeEventListener("load", start);
    };
  }, [shouldLoad]);

  return null;
}
