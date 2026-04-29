"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, Minus, Plus, Check } from "lucide-react";
import {
  type PackageType,
  PRICING,
  BASE_PRICES,
  computeBreakdown,
} from "@/lib/calculator-pricing";

/**
 * Mobile-only price calculator (compact card with Apple-style tariff dropdown).
 * Loaded only on mobile UA via Calculator (server orchestrator).
 */
export default function CalculatorMobile() {
  const t = useTranslations("calculator");
  const tPackages = useTranslations("packages");

  const [quantity, setQuantity] = useState(1);
  const [packageType, setPackageType] = useState<PackageType>("basic");
  const [showTariff, setShowTariff] = useState(false);

  const priceBreakdown = useMemo(
    () => computeBreakdown(packageType, quantity),
    [packageType, quantity],
  );
  const total = useMemo(
    () => priceBreakdown.reduce((s, p) => s + p, 0),
    [priceBreakdown],
  );

  const decrement = () => quantity > 1 && setQuantity(quantity - 1);
  const increment = () => quantity < 99 && setQuantity(quantity + 1);

  return (
    <section
      id="calculadora"
      className="py-1.5 bg-[#0d1b2a]"
    >
      <div className="container mx-auto px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-[#162a3e] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            {/* Title row with chevron — toggles tariff selection */}
            <button
              type="button"
              onClick={() => setShowTariff(!showTariff)}
              className="flex items-center justify-between w-full mb-1 active:opacity-70 transition-opacity"
              aria-expanded={showTariff}
              aria-controls="mobile-tariff-list"
            >
              <div className="flex flex-col items-start">
                <h3 className="text-white font-semibold text-[16px]" style={{ letterSpacing: "-0.2px" }}>
                  {t("mobileTitle")}
                </h3>
                <span className="text-[#7BC043] text-[12px] font-medium mt-0.5">
                  {t(packageType)}{packageType === "recommended" ? " ★" : ""}
                </span>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-white/50 transition-transform duration-200 ${showTariff ? "rotate-90" : ""}`}
              />
            </button>
            <p className="text-white/55 text-[12px] mb-3">{t("mobileSubtitle")}</p>

            {/* Apple-style sheet: tariff selection */}
            {showTariff && (
              <div
                id="mobile-tariff-list"
                className="mb-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200"
                role="listbox"
                aria-label={t("package")}
              >
                {(["basic", "recommended", "premium"] as PackageType[]).map((pkg, i, arr) => {
                  const selected = packageType === pkg;
                  return (
                    <button
                      key={pkg}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => { setPackageType(pkg); setShowTariff(false); }}
                      className={`flex items-center justify-between w-full py-3.5 px-4 text-left active:bg-white/[0.04] transition-colors ${
                        i < arr.length - 1 ? "border-b border-white/[0.06]" : ""
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-white text-[15px] font-medium">
                          {t(pkg)}{pkg === "recommended" ? " ★" : ""}
                        </span>
                        <span className="text-white/50 text-[12px] mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                          ${BASE_PRICES[pkg].toFixed(2)} {tPackages("perUnit")}
                        </span>
                      </div>
                      {selected && (
                        <div className="w-6 h-6 rounded-full bg-[#7BC043] flex items-center justify-center shadow-[0_0_0_3px_rgba(123,192,67,0.18)]">
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quantity + price row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decrement}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold text-[20px] w-7 text-center" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increment}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-white/60 text-[12px] ml-0.5">{t("units")}</span>
              </div>
              <span className="text-[#7BC043] font-bold text-[24px]" style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.5px" }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
