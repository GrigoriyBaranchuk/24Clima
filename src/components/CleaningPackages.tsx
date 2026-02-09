"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, Shield } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";
import { metaPixelEvent } from "@/components/MetaPixel";

export default function CleaningPackages() {
  const t = useTranslations("packages");
  const tWhatsapp = useTranslations("whatsappMessages");

  const packages = [
    {
      key: "basic",
      name: t("basic.name"),
      price: t("basic.price"),
      description: t("basic.description"),
      feature: t("basic.feature1"),
      label: t("basic.label"),
      cta: t("basic.cta"),
      icon: Check,
      highlight: false,
      bgClass: "bg-white",
      borderClass: "border-gray-200",
    },
    {
      key: "recommended",
      name: t("recommended.name"),
      price: t("recommended.price"),
      description: t("recommended.description"),
      feature: t("recommended.feature1"),
      label: t("recommended.label"),
      cta: t("recommended.cta"),
      icon: Star,
      highlight: true,
      bgClass: "bg-gradient-to-br from-[#7BC043]/10 to-[#0F9D58]/10",
      borderClass: "border-[#7BC043] border-2",
    },
    {
      key: "premium",
      name: t("premium.name"),
      price: t("premium.price"),
      description: t("premium.description"),
      feature: t("premium.feature1"),
      label: t("premium.label"),
      cta: t("premium.cta"),
      icon: Shield,
      highlight: false,
      bgClass: "bg-white",
      borderClass: "border-gray-200",
    },
  ];

  return (
    <section id="paquetes" className="py-16 lg:py-20 section-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">
            {t("title")}
          </h2>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <Card
              key={pkg.key}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${pkg.bgClass} ${pkg.borderClass} ${
                pkg.highlight ? "md:-translate-y-2 shadow-lg" : ""
              }`}
            >
              {/* Highlight Badge */}
              {pkg.highlight && (
                <div className="absolute top-0 right-0 bg-[#7BC043] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  <Star className="w-3 h-3 inline mr-1" />
                  {pkg.label}
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                  pkg.highlight ? "bg-[#7BC043]" : "bg-gray-100"
                }`}>
                  <pkg.icon className={`w-6 h-6 ${pkg.highlight ? "text-white" : "text-[#1e3a5f]"}`} />
                </div>
                <CardTitle className="text-lg text-[#1e3a5f]">{pkg.name}</CardTitle>
              </CardHeader>

              <CardContent className="text-center">
                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-[#1e3a5f]">${pkg.price}</span>
                  <span className="text-gray-500 text-sm ml-1">USD</span>
                  <p className="text-gray-500 text-xs mt-1">{t("perUnit")}</p>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>

                {/* Feature */}
                <div className="flex items-center justify-center gap-2 text-sm text-[#0F9D58] mb-4">
                  <Check className="w-4 h-4" />
                  <span>{pkg.feature}</span>
                </div>

                {/* Label for non-highlighted */}
                {!pkg.highlight && (
                  <Badge variant="outline" className="mb-4 text-xs">
                    {pkg.label}
                  </Badge>
                )}

                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full ${
                    pkg.highlight
                      ? "bg-[#25D366] hover:bg-[#20BD5A] text-white"
                      : "bg-[#1e3a5f] hover:bg-[#0d2240] text-white"
                  }`}
                >
                  <a
                    href={getWhatsAppLink(`Hola, quiero el ${pkg.name} para limpieza de aire acondicionado`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => metaPixelEvent("Lead")}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {pkg.cta}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scroll to Calculator */}
        <div className="text-center mt-8">
          <a
            href="#calculadora"
            className="inline-flex items-center gap-2 text-[#0F9D58] hover:text-[#7BC043] font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {t("whatsappOrder")} →
          </a>
        </div>
      </div>
    </section>
  );
}
