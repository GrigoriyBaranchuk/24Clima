"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator as CalcIcon, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";
import { metaPixelEvent } from "@/components/MetaPixel";

type PackageType = "basic" | "recommended" | "premium";

// Pricing logic: each unit has individual pricing based on position
const PRICING: Record<PackageType, number[]> = {
  basic: [29.99, 27.99, 25.99, 21.99, 21.99],
  recommended: [39.99, 37.99, 34.99, 32.99, 32.99],
  premium: [49.99, 47.99, 42.99, 39.99, 39.99],
};

// Base prices for savings calculation
const BASE_PRICES: Record<PackageType, number> = {
  basic: 29.99,
  recommended: 39.99,
  premium: 49.99,
};

export default function Calculator() {
  const t = useTranslations("calculator");
  const tPackages = useTranslations("packages");
  const [quantity, setQuantity] = useState(1);
  const [packageType, setPackageType] = useState<PackageType>("basic");
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Calculate prices for each unit
  const priceBreakdown = useMemo(() => {
    const prices: number[] = [];
    const pricingArray = PRICING[packageType];

    for (let i = 0; i < quantity; i++) {
      const priceIndex = Math.min(i, pricingArray.length - 1);
      prices.push(pricingArray[priceIndex]);
    }

    return prices;
  }, [quantity, packageType]);

  // Calculate total
  const total = useMemo(() => {
    return priceBreakdown.reduce((sum, price) => sum + price, 0);
  }, [priceBreakdown]);

  // Calculate savings
  const savings = useMemo(() => {
    const fullPrice = quantity * BASE_PRICES[packageType];
    return fullPrice - total;
  }, [quantity, packageType, total]);

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const packageNames: Record<PackageType, string> = {
      basic: tPackages("basic.name"),
      recommended: tPackages("recommended.name"),
      premium: tPackages("premium.name"),
    };

    const message = `Hola, quiero contratar el servicio de limpieza:

📦 Paquete: ${packageNames[packageType]}
🔢 Cantidad: ${quantity} equipo(s)

💰 TOTAL: ${total.toFixed(2)} USD

¿Cuándo pueden venir?`;

    return message;
  };

  const quantityOptions = [1, 2, 3, 4, 5];

  // Handle custom quantity input
  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 99) {
      setQuantity(num);
    } else if (value === "") {
      setQuantity(1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 99) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <section id="calculadora" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1e3a5f] to-[#0d2240]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-[#7BC043]/20 text-[#7BC043] px-4 py-2 rounded-full mb-4">
              <CalcIcon className="w-5 h-5" />
              <span className="font-medium">{t("title")}</span>
            </div>
            <p className="text-white/80">{t("subtitle")}</p>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-5 sm:p-6 lg:p-8">
              {/* Quantity Selection — centered for best UX on mobile and desktop */}
              <div className="mb-6 text-center">
                <label className="block text-white font-medium mb-3">
                  {t("quantity")}
                </label>

                {/* Quick Select Buttons */}
                <div className="flex gap-2 flex-wrap justify-center mb-4">
                  {quantityOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuantity(num)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-lg transition-all ${
                        quantity === num && quantity <= 5
                          ? "bg-[#7BC043] text-white scale-105"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Custom Quantity Input */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-white/80 text-base">{t("orEnter")}:</span>
                  <div className="flex items-center bg-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-14 sm:w-16 h-10 sm:h-12 text-center bg-transparent text-white font-bold text-lg border-x border-white/20 focus:outline-none focus:bg-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Package Selection — vertical on mobile to avoid long names overflowing */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  {t("package")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(["basic", "recommended", "premium"] as PackageType[]).map((pkg) => (
                    <button
                      key={pkg}
                      onClick={() => setPackageType(pkg)}
                      className={`min-w-0 py-3 px-3 sm:px-2 rounded-xl font-medium text-sm text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                        packageType === pkg
                          ? "bg-white text-[#1e3a5f]"
                          : pkg === "recommended"
                            ? "bg-[#7BC043]/25 text-white border-2 border-[#7BC043] hover:bg-[#7BC043]/35"
                            : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <span className="break-words line-clamp-2">{t(pkg)}</span>
                      {pkg === "recommended" && (
                        <span className="text-sm opacity-80 shrink-0">★</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown Toggle */}
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center justify-between w-full text-white/80 hover:text-white py-2 mb-4 border-b border-white/20"
              >
                <span>{t("breakdown")}</span>
                {showBreakdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {/* Price Breakdown */}
              {showBreakdown && (
                <div className="mb-4 space-y-2 animate-in slide-in-from-top-2">
                  {priceBreakdown.map((price, index) => (
                    <div key={index} className="flex justify-between text-white/70">
                      <span>{t("unit")} {index + 1}</span>
                      <span>${price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg font-medium">{t("total")}</span>
                  <span className="text-3xl font-bold text-[#7BC043]">
                    ${total.toFixed(2)}
                  </span>
                </div>
                {savings > 0.01 && (
                  <div className="text-right mt-1">
                    <span className="text-[#7BC043] text-base font-medium">
                      {t("savings")} ${savings.toFixed(2)}!
                    </span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                asChild
                size="lg"
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-lg py-6 whatsapp-pulse"
              >
                <a
                  href={getWhatsAppLink(generateWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => metaPixelEvent("Lead")}
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t("cta")}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
