"use client";

import { useEffect } from "react";

const SCRIPT_ID = "merchantWidgetScript";
const SCRIPT_SRC =
  "https://www.gstatic.com/shopping/merchant/merchantwidget.js";

/**
 * Отступ снизу на мобильных. Внизу экрана висит BottomNav (fixed, ~96px, под неё
 * у main стоит pb-24), а правила Google требуют не перекрывать виджет контентом.
 */
const MOBILE_BOTTOM_MARGIN = 104;

type MerchantWidgetWindow = Window & {
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
 * Ставим слева внизу: справа внизу уже висит WhatsApp-кнопка (fixed bottom-6 right-6).
 */
export function GoogleMerchantWidget() {
  useEffect(() => {
    const w = window as MerchantWidgetWindow;

    const start = () => {
      w.merchantwidget?.start({
        position: "LEFT_BOTTOM",
        mobileBottomMargin: MOBILE_BOTTOM_MARGIN,
      });
    };

    // Переход между страницами магазина: скрипт уже загружен, load не повторится.
    if (document.getElementById(SCRIPT_ID)) {
      if (w.merchantwidget) start();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.defer = true;
    script.addEventListener("load", start);
    document.head.appendChild(script);
  }, []);

  return null;
}
