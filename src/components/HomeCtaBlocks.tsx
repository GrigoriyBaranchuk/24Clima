"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomeCtaBlocks() {
  const t = useTranslations("homeCta");

  return (
    <section className="py-8 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0d2240] rounded-2xl p-5 lg:p-10 text-white">
            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3">
              {t("nosotrosTitle")}
            </h3>
            <p className="text-white/80 text-[13px] lg:text-base mb-4 lg:mb-6">
              {t("nosotrosText")}
            </p>
            <Button
              asChild
              variant="secondary"
              className="group bg-white text-[#1e3a5f] hover:bg-white/90"
            >
              <Link href="/nosotros">
                {t("nosotrosLink")}
                <ArrowRight className="w-4 h-4 ml-2 lg:group-hover:translate-x-1 transition-transform motion-reduce:transform-none" />
              </Link>
            </Button>
          </div>
          <div className="bg-gradient-to-br from-[#0F9D58] to-[#128C7E] rounded-2xl p-5 lg:p-10 text-white">
            <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-3">
              {t("contactoTitle")}
            </h3>
            <p className="text-white/90 text-[13px] lg:text-base mb-4 lg:mb-6">
              {t("contactoText")}
            </p>
            <Button
              asChild
              variant="secondary"
              className="bg-white text-[#0F9D58] hover:bg-white/90"
            >
              <Link href="/contacto">
                <MessageCircle className="w-4 h-4 mr-2" />
                {t("contactoLink")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
