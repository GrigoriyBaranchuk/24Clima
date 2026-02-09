"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { getWhatsAppLink, SOCIAL_LINKS } from "@/lib/constants";
import { metaPixelEvent } from "@/components/MetaPixel";

export default function Hero() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const tWhatsapp = useTranslations("whatsappMessages");

  return (
    <section className="relative min-h-[100vh] flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7BC043] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Trust Badge */}
            <Badge className="bg-white/20 text-white border-white/30 mb-6 py-2 px-4 text-xs sm:text-sm backdrop-blur-sm">
              <Check className="w-4 h-4 mr-2" />
              {t("trustBadge")}
            </Badge>

            {/* Main H1 - SEO Optimized */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {t("title")}{" "}
              <span className="text-[#7BC043]">{t("titleHighlight")}</span>
            </h1>

            {/* Price Highlight */}
            <div className="bg-[#7BC043] inline-block px-6 py-3 rounded-xl mb-4">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {t("subtitle")}
              </p>
            </div>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl">
              {t("tagline")}
            </p>

            {/* Geo Line */}
            <p className="text-sm text-white/70 mb-6">
              {tCommon("geoLine")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 whatsapp-pulse"
              >
                <a
                  href={getWhatsAppLink(tWhatsapp("quote"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => metaPixelEvent("Lead")}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {tCommon("scheduleService")}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1e3a5f] font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-[#7BC043]/20"
              >
                <a href="#calculadora">
                  {tCommon("viewServices")}
                </a>
              </Button>
            </div>

            {/* Social Media Buttons */}
            <div className="flex items-center gap-4 mt-8">
              <span className="text-white/70 text-sm">Follow us:</span>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/uploads/page1-opt.webp"
                alt="Professional air conditioning technician"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/50 to-transparent" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 border-t border-white/20">
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#7BC043]">{t("stat1Value")}</p>
            <p className="text-white/80 text-xs sm:text-sm">{t("stat1Label")}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#7BC043]">{t("stat2Value")}</p>
            <p className="text-white/80 text-xs sm:text-sm">{t("stat2Label")}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#7BC043]">{t("stat3Value")}</p>
            <p className="text-white/80 text-xs sm:text-sm">{t("stat3Label")}</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-2 h-3 bg-white/80 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
